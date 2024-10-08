import { STORYBLOK_ACCESS_TOKEN, DKIM_DOMAIN } from "$env/static/private";
import { dispatch, isFailure, loadForm, renderHtmlText, renderTemplate } from "$lib/server/mail";
import type { FieldGroupStoryblok, FormStoryblok, PageStoryblok } from "$storyblok/components";
import type { ISbStoryData } from "@storyblok/svelte";
import { error, redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { init } from "$lib/storyblok";

export const POST: RequestHandler = async function POST({ request, url, fetch }) {
  const formData = await request.formData();
  const pageId = formData.get("_page") as string | undefined;

  if (!pageId) {
    throw error(400, "Missing page identifier");
  }

  const formId = formData.get("_form") as string | undefined;

  if (!formId) {
    throw error(400, "Missing form identifier");
  }

  let form: FormStoryblok;
  let fields: Exclude<FormStoryblok["fields"], FieldGroupStoryblok>;
  let story: ISbStoryData<PageStoryblok>;

  try {
    const storyblokClient = await init(STORYBLOK_ACCESS_TOKEN, fetch);
    const response = await loadForm(pageId, formId, storyblokClient);
    form = response.form;
    fields = response.fields;
    story = response.story;
  } catch (err) {
    throw error(400, (err as Error).message);
  }

  const storyUrl = new URL(story.path ?? story.full_slug ?? story.slug, url.origin);
  const fieldValues: Record<string, FormDataEntryValue> = {};

  for (const field of fields) {
    const value = formData.get(field.name);

    if (field.required && !value) {
      storyUrl.searchParams.set("state", "error");
      storyUrl.searchParams.set("missing", field.name);

      throw redirect(303, storyUrl);
    }

    if (
      typeof value === "string" && (
        (field.pattern && !new RegExp(field.pattern).test(value)) ||
        (field.minLength && value.length < field.minLength) ||
        (field.maxLength && value.length > field.maxLength)
      )) {
      storyUrl.searchParams.set("state", "error");
      storyUrl.searchParams.set("invalid", field.name);

      throw redirect(303, storyUrl);
    }

    fieldValues[field.name] = value ?? form.fallbackValue;
  }

  const domain = url.hostname;
  const date = new Date().toLocaleString("de");
  const context = {
    domain,
    subject: form.notificationSubject,
    date,
    formName: form.name,
    recipientName: form.notificationRecipientName,
    recipientEmail: form.notificationRecipientEmail,
    ...fieldValues,
  };

  try {
    const result = await dispatch({
      from: `${form.name} <website@${DKIM_DOMAIN}>`,
      to: form.notificationRecipientEmail,
      replyTo: "email" in fieldValues ? fieldValues.email as string : `website@${DKIM_DOMAIN}`,
      html: renderTemplate(form.notificationPlain, context),
      text: renderHtmlText(form.notificationHtml, context),
      subject: form.notificationSubject,
      tags: [
        { name: "story_id", value: story.id.toString() },
      ],
    });

    if (isFailure(result)) {
      throw new Error(result.errors.join(", "));
    }
  } catch (error) {
    storyUrl.searchParams.set("state", "error");
    storyUrl.searchParams.set("error", (error as Error).message ?? "Unknown error");

    console.error(`Failed to dispatch form submission: ${error}`, {error});

    throw redirect(303, storyUrl);
  }

  storyUrl.searchParams.set("state", "success");

  throw redirect(303, storyUrl);
};

