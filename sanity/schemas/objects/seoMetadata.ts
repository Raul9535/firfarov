import { defineField, defineType } from "sanity";

/**
 * Required on every page-level document.
 * Pairs with lib/seo/metadata.ts — `title` becomes the <title>, `description` becomes the meta
 * description, `ogImage` becomes the OG/Twitter card image. `noIndex` flips robots to `noindex`.
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
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Meta description",
      type: "localizedText",
      description:
        "Shown in search results and social cards. Aim for 140–160 characters.",
      validation: (rule) => rule.required(),
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
