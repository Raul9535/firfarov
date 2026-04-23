import type { LocalizedText } from "@/lib/sanity/types";
import type { Locale } from "./config";

/**
 * Pick a string from a Sanity `localizedText` object for the current locale.
 * Falls back to the other locale when the primary one isn't filled in yet — that's
 * deliberate, so a half-translated document still renders something useful during
 * content authoring. Returns `""` only when both locales are empty.
 */
export function pickLocalized(
  text: LocalizedText | null | undefined,
  locale: Locale,
): string {
  if (!text) return "";
  const primary = text[locale];
  if (primary) return primary;
  const fallback = locale === "en" ? "ru" : "en";
  return text[fallback] ?? "";
}
