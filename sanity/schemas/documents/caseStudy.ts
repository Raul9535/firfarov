import { defineField, defineType } from "sanity";
import { portableTextConfig } from "../portableText";

/**
 * A single case study published at /work/[slug].
 * Narrative sections (context, approach, the work, …) collapse into one Portable Text body
 * per locale — Portable Text handles heading hierarchy, so editors don't need a field per section.
 * `atAGlance`, `keyDecisions`, and `outcomes` remain structured because they render as
 * non-body UI blocks on the frontend.
 *
 * **MVP publish floor**: `title`, `slugEn`, `slugRu`, `publishedAt`. Everything else is optional
 * so an editor can stand up a stub case study (for the Work index grid or for `selectedWork`
 * references) and fill in the narrative over time. The frontend treats every downstream field
 * as optional and skips empty sections.
 *
 * Inner array items (atAGlance, keyDecisions, outcomes) still require their constituent fields —
 * an approach item with no heading, or an outcome with no metric, is just noise. Those rules
 * only fire when an item is added, so they don't block publish of a case study that has no
 * extras filled in yet.
 */
export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case study",
  type: "document",
  groups: [
    { name: "meta", title: "Meta", default: true },
    { name: "hero", title: "Hero & summary" },
    { name: "body", title: "Body" },
    { name: "highlights", title: "Highlights" },
    { name: "related", title: "Related" },
    { name: "cta", title: "Final CTA" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Project title",
      type: "localizedText",
      group: "meta",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "client",
      title: "Client name",
      type: "localizedText",
      group: "meta",
      description: "Use 'Confidential' (in both locales) when the client is NDA'd.",
    }),
    defineField({
      name: "slugEn",
      title: "Slug (English)",
      type: "slug",
      group: "meta",
      options: { source: "title.en", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slugRu",
      title: "Slug (Russian)",
      type: "slug",
      group: "meta",
      options: { source: "title.ru", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      group: "meta",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "services",
      title: "Services",
      type: "array",
      group: "meta",
      of: [{ type: "reference", to: [{ type: "service" }] }],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "mediaAsset",
      group: "hero",
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "localizedText",
      group: "hero",
      description:
        "Short paragraph used in listings and as the case study's opening narrative.",
    }),
    defineField({
      name: "atAGlance",
      title: "At a glance",
      type: "array",
      group: "highlights",
      description:
        "Short label/value pairs shown in the 'At a glance' strip (e.g. 'Role' → 'Lead Designer').",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "label",
              title: "Label",
              type: "localizedText",
              validation: (rule) => rule.required(),
            },
            {
              name: "value",
              title: "Value",
              type: "localizedText",
              validation: (rule) => rule.required(),
            },
          ],
          preview: { select: { title: "label.en", subtitle: "value.en" } },
        },
      ],
      validation: (rule) => rule.max(8),
    }),
    defineField({
      name: "bodyEn",
      title: "Body (English)",
      type: "array",
      group: "body",
      description:
        "Context, approach, the work, and key narrative. Use H2/H3 headings to structure sections.",
      of: portableTextConfig,
    }),
    defineField({
      name: "bodyRu",
      title: "Body (Russian)",
      type: "array",
      group: "body",
      of: portableTextConfig,
    }),
    defineField({
      name: "keyDecisions",
      title: "Key decisions",
      type: "array",
      group: "highlights",
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
              name: "rationale",
              title: "Rationale",
              type: "localizedText",
              validation: (rule) => rule.required(),
            },
          ],
          preview: { select: { title: "heading.en", subtitle: "heading.ru" } },
        },
      ],
    }),
    defineField({
      name: "outcomes",
      title: "Outcomes",
      type: "array",
      group: "highlights",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "metric",
              title: "Metric or headline",
              type: "localizedText",
              description: "e.g. '3× faster checkout' or '40% fewer support tickets'.",
              validation: (rule) => rule.required(),
            },
            {
              name: "description",
              title: "Description",
              type: "localizedText",
            },
          ],
          preview: { select: { title: "metric.en", subtitle: "description.en" } },
        },
      ],
    }),
    defineField({
      name: "founderNote",
      title: "Founder note",
      type: "localizedText",
      group: "highlights",
      description: "Optional short reflection from the founder, shown near the end.",
    }),
    defineField({
      name: "relatedServices",
      title: "Related services",
      type: "array",
      group: "related",
      of: [{ type: "reference", to: [{ type: "service" }] }],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "nextCaseStudy",
      title: "Next case study",
      type: "reference",
      group: "related",
      to: [{ type: "caseStudy" }],
      description:
        "Optional manual override for the 'Next case' slot. If empty, the frontend falls back to publishedAt order.",
    }),
    defineField({
      name: "finalCta",
      title: "Final CTA",
      type: "ctaBlock",
      group: "cta",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seoMetadata",
      group: "seo",
      description: "Overrides the defaults from globalSettings when present.",
    }),
  ],
  orderings: [
    {
      title: "Published, newest first",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title.en",
      client: "client.en",
      media: "heroImage.image",
      date: "publishedAt",
    },
    prepare: ({ title, client, media, date }) => ({
      title: title ?? "Untitled",
      subtitle: [client, date ? new Date(date).toLocaleDateString() : null]
        .filter(Boolean)
        .join(" · "),
      media,
    }),
  },
});
