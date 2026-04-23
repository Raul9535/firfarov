import { defineField, defineType } from "sanity";

/**
 * Singleton. Content for /contact.
 * The brief form itself is rendered by the frontend; this document holds the copy around it.
 *
 * **MVP publish floor**: only `heroHeading`. `seo` falls back to globalSettings when empty.
 */
export const contactPage = defineType({
  name: "contactPage",
  title: "Contact page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "body", title: "Body" },
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
    }),
    defineField({
      name: "contactMethods",
      title: "Contact methods",
      type: "array",
      group: "body",
      description: "Direct channels besides the form — email, Telegram, etc.",
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
              title: "Value (email / handle / phone)",
              type: "string",
              validation: (rule) => rule.required(),
            },
            {
              name: "href",
              title: "URL",
              type: "string",
              description: 'e.g. "mailto:hello@…", "https://t.me/…", "tel:…".',
              validation: (rule) => rule.required(),
            },
          ],
          preview: { select: { title: "label.en", subtitle: "value" } },
        },
      ],
    }),
    defineField({
      name: "whatHappensNext",
      title: "What happens next",
      type: "array",
      group: "body",
      description: "Ordered steps shown after the form.",
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
            },
          ],
          preview: { select: { title: "heading.en", subtitle: "heading.ru" } },
        },
      ],
    }),
    defineField({
      name: "founderTrustSignal",
      title: "Founder trust signal",
      type: "localizedText",
      group: "body",
      description: "Short reassurance line near the form.",
    }),
    defineField({
      name: "faq",
      title: "Light FAQ",
      type: "array",
      group: "body",
      of: [{ type: "reference", to: [{ type: "faqItem" }] }],
      validation: (rule) => rule.max(6).unique(),
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seoMetadata",
      group: "seo",
      description: "Overrides the defaults from globalSettings when present.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Contact page" }),
  },
});
