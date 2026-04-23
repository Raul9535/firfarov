// JSON-LD helpers. Pages render results via <script type="application/ld+json">.
// Keep each helper returning a plain object — easy to extend, easy to test.

import { siteConfig } from "@/config/site";
import type { Locale } from "@/lib/i18n/config";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
  } as const;
}

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "FIRFAROV",
    url: siteConfig.url,
  } as const;
}

export function breadcrumbSchema(items: ReadonlyArray<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function inLanguageTag(locale: Locale) {
  return locale === "en" ? "en-US" : "ru-RU";
}
