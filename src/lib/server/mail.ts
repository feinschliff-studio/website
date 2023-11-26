import { dev, version } from "$app/environment";
import { init } from "$lib/storyblok";
import type { FieldGroupStoryblok, FormStoryblok } from "$storyblok/components";
import { sendEmail } from "@cloudflare/pages-plugin-mailchannels/api";
import { renderRichText } from "@storyblok/js";
import type { ISbRichtext, ISbStory } from "@storyblok/svelte";
import type { ISbComponentType } from "storyblok-js-client";

export async function dispatch(payload: MailSendBody): Promise<Failure | Success> {
  if (dev) {
    console.log("\n\nWould send email:\n", payload, "\n");

    return { success: true };
  }

  return sendEmail(payload);
}

export async function loadForm(pageId: string, formId: string, accessToken: string) {
  const storyblokClient = await init(accessToken);
  let response: ISbStory;

  try {
    response = await storyblokClient.getStory(pageId, {
      version: dev || version === "preview" ? "draft" : "published",
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

  return `
<!DOCTYPE html>
<html lang="de">
    <head>
        <title>Neue Nachricht</title>
        <style type="text/css">
            body {
                font-family: sans-serif;
                color:#333;
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

export interface TemplateContext {
  name: string;
  message: string;
  phone?: string;
  email?: string;
  date: string;
}

interface EmailAddress {
  email: string;
  name?: string;
}

interface Personalization {
  to: [EmailAddress, ...EmailAddress[]];
  from?: EmailAddress;
  dkim_domain?: string;
  dkim_private_key?: string;
  dkim_selector?: string;
  reply_to?: EmailAddress;
  cc?: EmailAddress[];
  bcc?: EmailAddress[];
  subject?: string;
  headers?: Record<string, string>;
}

interface ContentItem {
  type: string;
  value: string;
}

interface MailSendBody {
  personalizations: [Personalization, ...Personalization[]];
  from: EmailAddress;
  reply_to?: EmailAddress;
  subject: string;
  content: [ContentItem, ...ContentItem[]];
  headers?: Record<string, string>;
}

interface Success {
  success: true;
}

interface Failure {
  success: false;
  errors: string[];
}
