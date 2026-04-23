import type { Locale } from "@/lib/i18n/config";

export type ServiceRegistryEntry = {
  slug: string;
  name: Record<Locale, string>;
};

// The canonical list of services. Matches the approved sitemap.
// Content (descriptions, process, deliverables, …) comes from Sanity;
// this registry just anchors slugs and display names for navigation and routing.
export const services: ReadonlyArray<ServiceRegistryEntry> = [
  { slug: "ui-ux-design", name: { en: "UI/UX Design", ru: "UI/UX дизайн" } },
  { slug: "product-design", name: { en: "Product Design", ru: "Продуктовый дизайн" } },
  { slug: "website-design", name: { en: "Website Design", ru: "Дизайн сайтов" } },
  { slug: "ai-for-business", name: { en: "AI for Business", ru: "ИИ для бизнеса" } },
  { slug: "business-automation", name: { en: "Business Automation", ru: "Автоматизация бизнеса" } },
];

export type ServiceSlug = (typeof services)[number]["slug"];
