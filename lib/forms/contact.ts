import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { ContactFormInput } from "./schema";

let supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not configured");
  if (!supabase) {
    supabase = createClient(url, key, { auth: { persistSession: false } });
  }
  return supabase;
}

/**
 * Persists a validated contact submission to the `contact_submissions` table.
 * The table schema is expected to exist in Supabase (matching ContactFormInput fields).
 */
export async function persistContactSubmission(input: ContactFormInput) {
  const client = getSupabase();
  const { error } = await client.from("contact_submissions").insert({
    name: input.name,
    email: input.email,
    company: input.company ?? null,
    budget: input.budget ?? null,
    message: input.message,
    locale: input.locale,
  });
  if (error) throw error;
}
