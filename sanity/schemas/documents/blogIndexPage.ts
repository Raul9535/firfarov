import { defineField, defineType } from "sanity";

/**
 * Singleton. Header/intro copy for /blog. Post listings are populated from blogPost documents.
 */
export const blogIndexPage = defineType({
  name: "blogIndexPage",
  title: "Blog index page",
  type: "document",
  fields: [
    defineField({
      name: "heroHeading",
      title: "Hero heading",
      type: "localizedText",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroLead",
      title: "Hero lead",
      type: "localizedText",
    }),
    defineField({
      name: "featuredPost",
      title: "Featured post",
      type: "reference",
      to: [{ type: "blogPost" }],
      description: "Pinned to the top of the listing. Optional.",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seoMetadata",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Blog index page" }),
  },
});
