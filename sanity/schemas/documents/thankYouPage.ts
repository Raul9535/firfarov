import { defineField, defineType } from "sanity";

/**
 * Singleton. Shown after a successful contact submission at /thank-you.
 *
 * **MVP publish floor**: only `heading`.
 */
export const thankYouPage = defineType({
  name: "thankYouPage",
  title: "Thank you page",
  type: "document",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "localizedText",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "localizedText",
    }),
    defineField({
      name: "nextSteps",
      title: "What's next",
      type: "array",
      description: "Light list of follow-up suggestions (e.g. 'read the blog', 'follow on Telegram').",
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
              name: "href",
              title: "URL or path",
              type: "string",
              validation: (rule) => rule.required(),
            },
          ],
          preview: { select: { title: "label.en", subtitle: "href" } },
        },
      ],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seoMetadata",
      description: "Overrides the defaults from globalSettings when present.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Thank you page" }),
  },
});
