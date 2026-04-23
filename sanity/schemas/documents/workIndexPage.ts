import { defineField, defineType } from "sanity";

/**
 * Singleton. Header/intro copy for /work. The case-study grid itself is populated from caseStudy documents.
 */
export const workIndexPage = defineType({
  name: "workIndexPage",
  title: "Work index page",
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
      name: "featuredCaseStudies",
      title: "Featured case studies",
      type: "array",
      description:
        "Optional override of the default ordering. If empty, the frontend falls back to publishedAt desc.",
      of: [{ type: "reference", to: [{ type: "caseStudy" }] }],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seoMetadata",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Work index page" }),
  },
});
