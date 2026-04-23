import { defineField, defineType } from "sanity";

/**
 * A single service offering published at /services/[slug]. Slugs are locale-specific.
 * Field shape mirrors the approved service-page sections, kept flat for MVP.
 */
export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  groups: [
    { name: "meta", title: "Meta", default: true },
    { name: "positioning", title: "Positioning" },
    { name: "offering", title: "Offering" },
    { name: "process", title: "Process & deliverables" },
    { name: "related", title: "Related" },
    { name: "cta", title: "Final CTA" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localizedText",
      group: "meta",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slugEn",
      title: "Slug (English)",
      type: "slug",
      group: "meta",
      options: { source: "title.en", maxLength: 80 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slugRu",
      title: "Slug (Russian)",
      type: "slug",
      group: "meta",
      options: { source: "title.ru", maxLength: 80 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      group: "meta",
      description: "Lower numbers appear first on the services index.",
      initialValue: 100,
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "localizedText",
      group: "positioning",
      description: "One line that sits directly under the service title.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "positioning",
      title: "Positioning statement",
      type: "localizedText",
      group: "positioning",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "whoItsFor",
      title: "Who it's for",
      type: "array",
      group: "offering",
      of: [{ type: "localizedText" }],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "whatsIncluded",
      title: "What's included",
      type: "array",
      group: "offering",
      of: [{ type: "localizedText" }],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "processSteps",
      title: "Process steps",
      type: "array",
      group: "process",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "heading",
              title: "Heading",
              type: "localizedText",
              validation: (rule) => rule.required(),
            },
            {
              name: "description",
              title: "Description",
              type: "localizedText",
              validation: (rule) => rule.required(),
            },
          ],
          preview: { select: { title: "heading.en", subtitle: "heading.ru" } },
        },
      ],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "deliverables",
      title: "Deliverables & outcomes",
      type: "array",
      group: "process",
      of: [{ type: "localizedText" }],
    }),
    defineField({
      name: "techStack",
      title: "Tech stack",
      type: "array",
      group: "process",
      description: "Plain labels (e.g. 'Next.js', 'Sanity'). Not translated.",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "caseStudies",
      title: "Featured case studies",
      type: "array",
      group: "related",
      of: [{ type: "reference", to: [{ type: "caseStudy" }] }],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "relatedServices",
      title: "Related services",
      type: "array",
      group: "related",
      of: [{ type: "reference", to: [{ type: "service" }] }],
      validation: (rule) => rule.unique().max(4),
    }),
    defineField({
      name: "faq",
      title: "FAQ",
      type: "array",
      group: "related",
      of: [{ type: "reference", to: [{ type: "faqItem" }] }],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "finalCta",
      title: "Final CTA",
      type: "ctaBlock",
      group: "cta",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seoMetadata",
      group: "seo",
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title.en", subtitle: "slugEn.current" },
  },
});
