import { Resend } from "resend";
import type { ContactFormInput } from "./schema";

let client: Resend | null = null;

function getClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured");
  if (!client) client = new Resend(apiKey);
  return client;
}

export async function sendContactEmail(input: ContactFormInput) {
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!to || !from) throw new Error("CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL are not configured");

  const resend = getClient();
  return resend.emails.send({
    from,
    to,
    replyTo: input.email,
    subject: `New enquiry from ${input.name} (${input.locale.toUpperCase()})`,
    text: [
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      input.company ? `Company: ${input.company}` : null,
      input.budget ? `Budget: ${input.budget}` : null,
      "",
      input.message,
    ]
      .filter(Boolean)
      .join("\n"),
  });
}
