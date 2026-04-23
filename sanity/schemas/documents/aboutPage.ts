import { defineField, defineType } from "sanity";
import { portableTextConfig } from "../portableText";

/**
 * Singleton. About page content.
 * Most of the body is free-form Portable Text; principles and expertise are light structured lists.
 */
export const aboutPage = defineType({
  name: "aboutPage",
  title: "About page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "body", title: "Body" },
    { name: "structure", title: "Structured lists" },
    { name: "cta", title: "Final CTA" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "heroStatement",
      title: "Hero statement",
      type: "localizedText",
      group: "hero",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "founder",
      title: "Founder",
      type: "reference",
      group: "body",
      to: [{ type: "author" }],
      description: "Reference to the author record used in the Founder section.",
    }),
    defineField({
      name: "whatItIsEn",
      title: "What FIRFAROV is (English)",
      type: "array",
      group: "body",
      of: portableTextConfig,
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "whatItIsRu",
      title: "What FIRFAROV is (Russian)",
      type: "array",
      group: "body",
      of: portableTextConfig,
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "howWeWorkEn",
      title: "How we work (English)",
      type: "array",
      group: "body",
      of: portableTextConfig,
    }),
    defineField({
      name: "howWeWorkRu",
      title: "How we work (Russian)",
      type: "array",
      group: "body",
      of: portableTextConfig,
    }),
    defineField({
      name: "principles",
      title: "Principles",
      type: "array",
      group: "structure",
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
    }),
    defineField({
      name: "expertiseAreas",
      title: "Expertise areas",
      type: "array",
      group: "structure",
      of: [{ type: "localizedText" }],
    }),
    defineField({
      name: "teamSummary",
      title: "Team summary",
      type: "localizedText",
      group: "structure",
      description: "Short paragraph about the team. Optional.",
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
  preview: {
    prepare: () => ({ title: "About page" }),
  },
});
