import { defineField, defineType } from "sanity";

/**
 * The atom of FIRFAROV's field-level bilingual model.
 * One entity holds both EN and RU values inline — we never duplicate documents per language.
 *
 * Used for: titles, headlines, short paragraphs, labels, alt text, meta description.
 * For long-form body content, use parallel `bodyEn` / `bodyRu` Portable Text fields instead.
 *
 * **MVP-relaxed validation:** neither `en` nor `ru` is required at this level. Editors can ship
 * EN first and fill RU later (or vice versa). The frontend's `pickLocalized()` helper falls
 * back to the other locale when the primary one is empty, so partial translations render fine.
 * Fields that the app absolutely cannot function without stay required at the *document* level.
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
      validation: (rule) => rule.max(500),
    }),
    defineField({
      name: "ru",
      title: "Russian",
      type: "string",
      validation: (rule) => rule.max(500),
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
