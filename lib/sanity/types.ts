// Placeholder domain types. These will be replaced by generated types from Sanity schemas
// (run `sanity typegen generate` once schemas are defined).
//
// Shape mirrors the approved content model:
//   - field-level bilingual localization via LocalizedText
//   - reusable groups: LocalizedText, SEOMetadata, MediaAsset, CTABlock, RichContentBlock

import type { Locale } from "@/lib/i18n/config";

export type LocalizedText = Record<Locale, string>;

export type MediaAsset = {
  url: string;
  alt: LocalizedText;
  width?: number;
  height?: number;
};

export type SEOMetadata = {
  title: LocalizedText;
  description: LocalizedText;
  ogImage?: MediaAsset;
};

export type CTABlock = {
  label: LocalizedText;
  href: string;
};

// Portable Text payloads are typed once Sanity schemas are generated.
export type RichContentBlock = unknown;
