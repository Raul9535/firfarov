import { defineField, defineType } from "sanity";

/**
 * Pairs with lib/seo/metadata.ts — `title` becomes the <title>, `description` becomes the meta
 * description, `ogImage` becomes the OG/Twitter card image. `noIndex` flips robots to `noindex`.
 *
 * **MVP-relaxed**: inner fields are no longer individually required. The whole `seo` object is
 * optional at each page-level document, and when present any subset of fields can be filled.
 * The frontend's `buildMetadata()` falls back to `globalSettings.defaultSeo`, then to hard-coded
 * site defaults, so nothing downstream breaks when fields are missing.
 */
export const seoMetadata = defineType({
  name: "seoMetadata",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Meta title",
      type: "localizedText",
      description:
        "Shown in browser tabs, search results, and social cards. Aim for 50–60 characters.",
    }),
    defineField({
      name: "description",
      title: "Meta description",
      type: "localizedText",
      description:
        "Shown in search results and social cards. Aim for 140–160 characters.",
    }),
    defineField({
      name: "ogImage",
      title: "Social share image",
      type: "mediaAsset",
      description: "Rendered on Open Graph / Twitter cards. Recommended size: 1200×630.",
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      description: "Marks this page with `noindex, nofollow`. Use sparingly.",
      initialValue: false,
    }),
  ],
  options: { collapsible: true, collapsed: true },
});
