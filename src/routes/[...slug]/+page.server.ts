import { STORYBLOK_ACCESS_TOKEN } from "$env/static/private";
import { init } from "$lib/storyblok";
import type { EntryGenerator } from "./$types";

export const entries: EntryGenerator = async function entries() {
  const storyblokClient = await init(STORYBLOK_ACCESS_TOKEN);
  const stories = await storyblokClient.getStories({
    content_type: "Page",
    version: "published",
    per_page: 100,
  });

  return stories.data.stories.map((story) => ({
    slug: (story.path ?? story.full_slug ?? story.slug).replace(/^\/|\/$/g, ""),
  }));
};

/*
export const actions: Actions = {
  async default({ request, url, params }: RequestEvent) {
    const formData = await request.formData();
    const formId = formData.get("_form_id") as string | undefined;

    if (!formId) {
      return fail(400, {
        ...Object.fromEntries(formData.entries()),
        missing: ["_form_id"],
      });
    }

    let form: FormStoryblok;

    try {
      form = await loadForm(params.slug, formId, STORYBLOK_ACCESS_TOKEN);
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
      };
    }

    const fieldValues: Record<string, FormDataEntryValue> = {};

    for (const field of form.fields) {
      const value = formData.get(field.name);

      if (field.required && !value) {
        return fail(400, {
          ...Object.fromEntries(formData.entries()),
          missing: [field.name],
        });
      }

      if (
        typeof value === "string" && (
          (field.pattern && !new RegExp(field.pattern).test(value)) ||
          (field.minLength && value.length < field.minLength) ||
          (field.maxLength && value.length > field.maxLength)
        )) {
        return fail(400, {
          ...Object.fromEntries(formData.entries()),
          invalid: [field.name],
        });
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
        from: {
          email: `website@${domain}`,
          name: "name" in fieldValues ? fieldValues.name as string : form.name,
        },
        reply_to: {
          name: "name" in fieldValues ? fieldValues.name as string : form.name,
          email: "email" in fieldValues ? fieldValues.email as string : `website@${domain}`,
        },
        content: [
          {
            type: "text/plain",
            value: renderTemplate(form.notificationPlain, context),
          },
          {
            type: "text/html",
            value: renderHtmlText(form.notificationHtml, context),
          },
        ],
        headers: {},
        subject: form.notificationSubject,
        personalizations: [
          {
            to: [
              {
                name: form.notificationRecipientName,
                email: form.notificationRecipientEmail,
              },
            ],
          },
        ],
      });

      if (isFailure(result)) {
        return {
          success: false,
          error: result.errors.join(", "),
        };
      }
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
      };
    }

    return {
      success: true,
    };
  },
};
*/
