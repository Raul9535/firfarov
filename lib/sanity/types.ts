/**
 * Typed surface of the Sanity content model.
 *
 * Everything in this file is sourced from the typegen output at `sanity/sanity.types.ts`.
 * Regenerate with `npm run sanity:types` after any schema or query change.
 *
 * The re-exports below are curated — we expose document and object types that the
 * frontend will import by name, plus all query result types. If you need something that
 * isn't re-exported here, import it directly from `@/sanity/sanity.types`.
 */

// Document types
export type {
  AboutPage,
  Author,
  BlogCategory,
  BlogIndexPage,
  BlogPost,
  CaseStudy,
  ContactPage,
  FaqItem,
  GlobalSettings,
  HomePage,
  LegalPage,
  Service,
  ThankYouPage,
  WorkIndexPage,
} from "../../sanity/sanity.types";

// Reusable object types
export type {
  CtaBlock,
  LocalizedText,
  MediaAsset,
  SeoMetadata,
} from "../../sanity/sanity.types";

// Query result types — one per `defineQuery(...)` in `./queries.ts`
export type {
  AboutPageQueryResult,
  AllBlogCategorySlugsQueryResult,
  AllBlogPostSlugsQueryResult,
  AllCaseStudySlugsQueryResult,
  AllServicesQueryResult,
  BlogCategoryBySlugQueryResult,
  BlogIndexPageQueryResult,
  BlogPostBySlugQueryResult,
  BlogPostsByCategoryQueryResult,
  CaseStudyBySlugQueryResult,
  ContactPageQueryResult,
  GlobalSettingsQueryResult,
  HomePageQueryResult,
  LatestBlogPostsQueryResult,
  LatestCaseStudiesQueryResult,
  LegalPageBySlugQueryResult,
  ServiceBySlugQueryResult,
  ThankYouPageQueryResult,
  WorkIndexPageQueryResult,
} from "../../sanity/sanity.types";
