import { defineField, defineType } from "sanity";
import { portableTextConfig } from "../portableText";

/**
 * Legal pages (/privacy, /terms, /cookies). The slug is a fixed enum — URLs are shared
 * across locales for these pages, so there's no slugEn/slugRu split.
 */
export const legalPage = defineType({
  name: "legalPage",
  title: "Legal page",
  type: "document",
  fields: [
    defineField({
      name: "slug",
      title: "Page",
      type: "string",
      description: "Which legal page this document represents.",
      options: {
        list: [
          { title: "Privacy", value: "privacy" },
          { title: "Terms", value: "terms" },
          { title: "Cookies", value: "cookies" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "localizedText",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "lastUpdated",
      title: "Last updated",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "bodyEn",
      title: "Body (English)",
      type: "array",
      of: portableTextConfig,
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "bodyRu",
      title: "Body (Russian)",
      type: "array",
      of: portableTextConfig,
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seoMetadata",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "title.en", subtitle: "slug" },
  },
});
