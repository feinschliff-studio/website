import { dev, version } from "$app/environment";
import type { FieldGroupStoryblok, FormStoryblok } from "$storyblok/components";
import { type CreateEmailOptions, type CreateEmailRequestOptions, Resend } from "resend";
import { renderRichText } from "@storyblok/js";
import type { ISbRichtext, ISbStory, StoryblokClient } from "@storyblok/svelte";
import type { ISbComponentType } from "storyblok-js-client";
import { RESEND_API_KEY } from "$env/static/private";

export async function dispatch(payload: CreateEmailOptions, options?: CreateEmailRequestOptions): Promise<Failure | Success> {
  if (dev) {
    console.log("\n\nWould send email:\n", payload, "\n");

    return { success: true };
  }

  const resend = new Resend(RESEND_API_KEY);
  const response = await resend.emails.send(payload, options);

  if (response.error) {
    const { name, message } = response.error;
    const error = `${name}: ${message}`;

    return { success: false, errors: [error] };
  }

  return { success: true };
}

export async function loadForm(pageId: string, formId: string, client: StoryblokClient) {
  let response: ISbStory;

  try {
    response = await client.getStory(pageId, {
      version: dev || version.startsWith("preview") ? "draft" : "published",
      resolve_links: "url",
      find_by: "uuid",
    });
  } catch (errorJson) {
    throw typeof errorJson === "string"
      ? JSON.parse(errorJson)
      : errorJson as Error;
  }

  const components = response.data.story.content.body as ISbComponentType<string>[];
  const form: FormStoryblok | undefined = components.find(
    (item) => item.component === "Form" && item._uid === formId,
  ) as FormStoryblok | undefined;

  if (!form) {
    throw new Error("Form reference not found");
  }

  const fields: Exclude<FormStoryblok["fields"], FieldGroupStoryblok> = form.fields.flatMap(
    (field) => "fields" in field ? field.fields : field,
  );

  return {
    story: response.data.story,
    form,
    fields,
  };
}

export function renderHtmlText(template: ISbRichtext, context: Record<string, FormDataEntryValue>): string {
  const renderedContent = renderTemplate(renderRichText(template), context);

  // noinspection HtmlDeprecatedAttribute
  return `
<!DOCTYPE html>
<html lang="de">
    <head>
        <title>Neue Nachricht</title>
        <style type="text/css">
            body {
                font-family: sans-serif;
                color: #333;
                line-height: 1.4;
                padding: 32px;
            }
        </style>
    </head>
    <body>${renderedContent}</body>
</html>
`.trim();
}

export function renderTemplate(template: string, context: Record<string, FormDataEntryValue>): string {
  return Object
    .entries(context)
    .reduce((acc, [key, value]) => acc.replace(
      new RegExp(`\\{\\s*${key}\\s*\\}`, "g"),
      typeof value === "string" ? value : "<<invalid>>",
    ), template)
    .trim();
}

export function isFailure(r: Success | Failure): r is Failure {
  return !r.success;
}

interface Success {
  success: true;
}

interface Failure {
  success: false;
  errors: string[];
}
