import { defineField, defineType } from "sanity";

/**
 * A single question + answer, referenced from services, contact page, and anywhere else
 * a light FAQ appears. Keeping these as first-class documents lets us reuse answers across pages.
 */
export const faqItem = defineType({
  name: "faqItem",
  title: "FAQ item",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "localizedText",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "localizedText",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "group",
      title: "Group",
      type: "string",
      description:
        "Optional tag to bucket questions (e.g. 'pricing', 'process'). Frontend-side only.",
    }),
  ],
  preview: {
    select: { title: "question.en", subtitle: "question.ru" },
  },
});
