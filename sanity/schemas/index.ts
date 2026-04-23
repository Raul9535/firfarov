import type { SchemaTypeDefinition } from "sanity";

// ─── Reusable object types ──────────────────────────────────────
import { ctaBlock } from "./objects/ctaBlock";
import { localizedText } from "./objects/localizedText";
import { mediaAsset } from "./objects/mediaAsset";
import { seoMetadata } from "./objects/seoMetadata";

// ─── Singleton documents ────────────────────────────────────────
import { aboutPage } from "./documents/aboutPage";
import { blogIndexPage } from "./documents/blogIndexPage";
import { contactPage } from "./documents/contactPage";
import { globalSettings } from "./documents/globalSettings";
import { homePage } from "./documents/homePage";
import { thankYouPage } from "./documents/thankYouPage";
import { workIndexPage } from "./documents/workIndexPage";

// ─── Collection documents ───────────────────────────────────────
import { author } from "./documents/author";
import { blogCategory } from "./documents/blogCategory";
import { blogPost } from "./documents/blogPost";
import { caseStudy } from "./documents/caseStudy";
import { faqItem } from "./documents/faqItem";
import { legalPage } from "./documents/legalPage";
import { service } from "./documents/service";

/**
 * Document types whose URL or content represents a singleton instance (exactly one per site).
 * Studio wiring step: use these ids in deskStructure to render them as single-item "Settings"-style
 * entries rather than as collections.
 */
export const singletonDocumentTypes = [
  "globalSettings",
  "homePage",
  "aboutPage",
  "contactPage",
  "workIndexPage",
  "blogIndexPage",
  "thankYouPage",
] as const;

export type SingletonDocumentType = (typeof singletonDocumentTypes)[number];

/**
 * All schema types registered with the Studio. Order matters only for the default "New document"
 * menu — the grouping below reflects how we think about the content model, not runtime behavior.
 */
export const schemaTypes: SchemaTypeDefinition[] = [
  // Reusable objects
  localizedText,
  seoMetadata,
  mediaAsset,
  ctaBlock,

  // Singleton documents
  globalSettings,
  homePage,
  aboutPage,
  contactPage,
  workIndexPage,
  blogIndexPage,
  thankYouPage,

  // Collection documents
  service,
  caseStudy,
  blogPost,
  blogCategory,
  faqItem,
  author,
  legalPage,
];
