import { DEFAULT_LOCALE, type Locale } from "./config";

/**
 * Derive the active locale from the request pathname.
 * EN is the default and lives at the root; RU mirrors at /ru.
 */
export function resolveLocaleFromPath(pathname: string): Locale {
  if (pathname === "/ru" || pathname.startsWith("/ru/")) return "ru";
  return DEFAULT_LOCALE;
}

/**
 * Take a locale-agnostic semantic path (e.g. "/services/ui-ux-design")
 * and return the URL for the given locale.
 */
export function localizePath(path: string, locale: Locale): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (locale === "en") return normalized;
  if (normalized === "/") return "/ru";
  return `/ru${normalized}`;
}

/**
 * Strip the locale prefix back to a locale-agnostic path.
 * Useful for "switch language" links on a current page.
 */
export function stripLocalePrefix(pathname: string): string {
  if (pathname === "/ru") return "/";
  if (pathname.startsWith("/ru/")) return pathname.replace(/^\/ru/, "") || "/";
  return pathname;
}

export function alternateLocale(locale: Locale): Locale {
  return locale === "en" ? "ru" : "en";
}
