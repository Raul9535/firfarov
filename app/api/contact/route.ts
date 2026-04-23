import { NextResponse } from "next/server";
import { persistContactSubmission } from "@/lib/forms/contact";
import { sendContactEmail } from "@/lib/forms/email";
import { contactFormSchema } from "@/lib/forms/schema";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = contactFormSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    await Promise.all([
      persistContactSubmission(parsed.data),
      sendContactEmail(parsed.data),
    ]);
  } catch (error) {
    console.error("[contact] submission failed", error);
    return NextResponse.json({ error: "submission_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
