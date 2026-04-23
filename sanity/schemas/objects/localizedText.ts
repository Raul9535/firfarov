import { defineField, defineType } from "sanity";

/**
 * The atom of FIRFAROV's field-level bilingual model.
 * One entity holds both EN and RU values inline — we never duplicate documents per language.
 *
 * Used for: titles, headlines, short paragraphs, labels, alt text, meta description.
 * For long-form body content, use parallel `bodyEn` / `bodyRu` Portable Text fields instead.
 */
export const localizedText = defineType({
  name: "localizedText",
  title: "Localized text",
  type: "object",
  fields: [
    defineField({
      name: "en",
      title: "English",
      type: "string",
      validation: (rule) => rule.required().min(1).max(500),
    }),
    defineField({
      name: "ru",
      title: "Russian",
      type: "string",
      validation: (rule) => rule.required().min(1).max(500),
    }),
  ],
  options: {
    columns: 2,
  },
  preview: {
    select: { en: "en", ru: "ru" },
    prepare: ({ en, ru }) => ({
      title: en ?? ru ?? "Empty",
      subtitle: ru ? `RU: ${ru}` : undefined,
    }),
  },
});
