import { defineField, defineType } from "sanity";

/**
 * Taxonomy for blog posts. Each category gets its own listing at /blog/category/[slug].
 * Localized slugs so URLs work natively in both EN and RU.
 */
export const blogCategory = defineType({
  name: "blogCategory",
  title: "Blog category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localizedText",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slugEn",
      title: "Slug (English)",
      type: "slug",
      options: { source: "title.en", maxLength: 80 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slugRu",
      title: "Slug (Russian)",
      type: "slug",
      options: { source: "title.ru", maxLength: 80 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "localizedText",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seoMetadata",
      description:
        "Optional. If left empty, the category listing inherits from blogIndexPage SEO.",
    }),
  ],
  preview: {
    select: { title: "title.en", subtitle: "slugEn.current" },
  },
});
