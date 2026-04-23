import { defineField, defineType } from "sanity";

/**
 * Singleton. Home page content.
 * Each field maps roughly to one approved home section, but we intentionally keep field shapes
 * flat (localizedText, arrays of simple items) rather than modeling deep section structure — the
 * layout lives on the frontend, not in the CMS.
 */
export const homePage = defineType({
  name: "homePage",
  title: "Home page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "body", title: "Body" },
    { name: "cta", title: "Final CTA" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "heroHeading",
      title: "Hero heading",
      type: "localizedText",
      group: "hero",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroLead",
      title: "Hero lead",
      type: "localizedText",
      group: "hero",
      description: "Supporting line under the hero heading.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroCta",
      title: "Hero CTA",
      type: "ctaBlock",
      group: "hero",
    }),
    defineField({
      name: "positioningStatement",
      title: "Positioning statement",
      type: "localizedText",
      group: "body",
      description: "Short, sharp statement of what FIRFAROV is and who it's for.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "selectedWork",
      title: "Selected work",
      type: "array",
      group: "body",
      description: "Featured case studies, displayed in order. 2–6 items.",
      of: [{ type: "reference", to: [{ type: "caseStudy" }] }],
      validation: (rule) => rule.required().min(2).max(6).unique(),
    }),
    defineField({
      name: "servicesOverviewIntro",
      title: "Services overview intro",
      type: "localizedText",
      group: "body",
      description: "Short intro above the services grid. The grid itself is derived from the services collection.",
    }),
    defineField({
      name: "founderMomentHeading",
      title: "Founder moment heading",
      type: "localizedText",
      group: "body",
    }),
    defineField({
      name: "founderMomentText",
      title: "Founder moment text",
      type: "localizedText",
      group: "body",
    }),
    defineField({
      name: "approachItems",
      title: "Approach items",
      type: "array",
      group: "body",
      description: "Principles or pillars shown in the Approach section.",
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
      validation: (rule) => rule.max(6),
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
    prepare: () => ({ title: "Home page" }),
  },
});
