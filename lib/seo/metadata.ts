import type { Metadata } from "next";
import { type Locale } from "@/lib/i18n/config";
import { siteConfig } from "@/config/site";

type BuildMetadataInput = {
  locale: Locale;
  /** Locale-agnostic semantic path, e.g. "/", "/about", "/services/ui-ux-design". */
  path: string;
  title?: string;
  description?: string;
  image?: string;
};

/**
 * Single entry point for page metadata.
 * Emits canonical + hreflang alternates for EN ↔ RU automatically.
 */
export function buildMetadata(input: BuildMetadataInput): Metadata {
  const { locale, path, title, description, image } = input;
  const baseUrl = siteConfig.url;

  const basePath = path === "/" ? "" : path;
  const enUrl = basePath || "/";
  const ruUrl = `/ru${basePath}`;

  const canonicalPath = locale === "en" ? enUrl : ruUrl;

  const resolvedTitle = title ?? siteConfig.defaultTitle[locale];
  const resolvedDescription = description ?? siteConfig.defaultDescription[locale];

  return {
    metadataBase: new URL(baseUrl),
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: {
      canonical: canonicalPath,
      languages: {
        en: enUrl,
        ru: ruUrl,
      },
    },
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url: `${baseUrl}${canonicalPath}`,
      siteName: siteConfig.name,
      locale: locale === "en" ? "en_US" : "ru_RU",
      type: "website",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      images: image ? [image] : undefined,
    },
  };
}
