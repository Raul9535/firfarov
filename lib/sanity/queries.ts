import { defineQuery } from "next-sanity";

/**
 * All GROQ queries live here. Pages must never inline GROQ — they import from this module
 * and execute through `sanityFetch()` from `./fetch`.
 *
 * Every query is wrapped in `defineQuery()` so Sanity typegen can pick it up and generate
 * a matching `${QueryName}Result` type. After any schema or query change, run:
 *
 *     npm run sanity:types
 *
 * which chains `sanity schema extract` + `sanity typegen generate` and refreshes the types
 * in `sanity/sanity.types.ts`.
 *
 * Slug convention: content documents with URLs carry `slugEn` and `slugRu` (separate slug
 * objects per locale). By-slug queries accept a `$locale` param and match the right field.
 * `legalPage` is the exception — its `slug` is a fixed enum string, matched directly.
 */

// ─── Global ─────────────────────────────────────────────────────
export const globalSettingsQuery = defineQuery(`*[_type == "globalSettings"][0]`);

// ─── Singleton pages ────────────────────────────────────────────
export const homePageQuery = defineQuery(`*[_type == "homePage"][0]`);
export const aboutPageQuery = defineQuery(`*[_type == "aboutPage"][0]`);
export const contactPageQuery = defineQuery(`*[_type == "contactPage"][0]`);
export const workIndexPageQuery = defineQuery(`*[_type == "workIndexPage"][0]`);
export const blogIndexPageQuery = defineQuery(`*[_type == "blogIndexPage"][0]`);
export const thankYouPageQuery = defineQuery(`*[_type == "thankYouPage"][0]`);

// ─── Services ──────────────────────────────────────────────────
export const serviceBySlugQuery = defineQuery(`
  *[_type == "service" && (
    ($locale == "en" && slugEn.current == $slug) ||
    ($locale == "ru" && slugRu.current == $slug)
  )][0]
`);

export const allServicesQuery = defineQuery(`
  *[_type == "service"] | order(order asc) {
    _id,
    "slugEn": slugEn.current,
    "slugRu": slugRu.current,
    title,
    order
  }
`);

// ─── Case studies ──────────────────────────────────────────────
export const caseStudyBySlugQuery = defineQuery(`
  *[_type == "caseStudy" && (
    ($locale == "en" && slugEn.current == $slug) ||
    ($locale == "ru" && slugRu.current == $slug)
  )][0]
`);

export const allCaseStudySlugsQuery = defineQuery(`
  *[_type == "caseStudy" && defined(slugEn.current) && defined(slugRu.current)] {
    "slugEn": slugEn.current,
    "slugRu": slugRu.current
  }
`);

export const latestCaseStudiesQuery = defineQuery(`
  *[_type == "caseStudy"] | order(publishedAt desc) [0...$limit]
`);

// ─── Blog ──────────────────────────────────────────────────────
export const blogPostBySlugQuery = defineQuery(`
  *[_type == "blogPost" && (
    ($locale == "en" && slugEn.current == $slug) ||
    ($locale == "ru" && slugRu.current == $slug)
  )][0]
`);

export const allBlogPostSlugsQuery = defineQuery(`
  *[_type == "blogPost" && defined(slugEn.current) && defined(slugRu.current)] {
    "slugEn": slugEn.current,
    "slugRu": slugRu.current
  }
`);

export const latestBlogPostsQuery = defineQuery(`
  *[_type == "blogPost"] | order(publishedAt desc) [0...$limit]
`);

export const blogPostsByCategoryQuery = defineQuery(`
  *[_type == "blogPost" && $categoryId in categories[]._ref] | order(publishedAt desc)
`);

export const allBlogCategorySlugsQuery = defineQuery(`
  *[_type == "blogCategory" && defined(slugEn.current) && defined(slugRu.current)] {
    "slugEn": slugEn.current,
    "slugRu": slugRu.current
  }
`);

export const blogCategoryBySlugQuery = defineQuery(`
  *[_type == "blogCategory" && (
    ($locale == "en" && slugEn.current == $slug) ||
    ($locale == "ru" && slugRu.current == $slug)
  )][0]
`);

// ─── Legal ─────────────────────────────────────────────────────
export const legalPageBySlugQuery = defineQuery(`
  *[_type == "legalPage" && slug == $slug][0]
`);
