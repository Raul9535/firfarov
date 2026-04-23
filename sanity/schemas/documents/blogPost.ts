import { defineField, defineType } from "sanity";
import { portableTextConfig } from "../portableText";

/**
 * Long-form writing published at /blog/[slug]. Body is Portable Text in parallel EN/RU fields.
 * Keep category references optional — a post can live uncategorized.
 *
 * **MVP publish floor**: `title`, `slugEn`, `slugRu`, `publishedAt`. Author, excerpt, bodies, and
 * SEO are strongly recommended but not blocking — editors can stub a post and fill content later.
 */
export const blogPost = defineType({
  name: "blogPost",
  title: "Blog post",
  type: "document",
  groups: [
    { name: "meta", title: "Meta", default: true },
    { name: "content", title: "Content" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localizedText",
      group: "meta",
      validation: (rule) => rule.required(),
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
      name: "author",
      title: "Author",
      type: "reference",
      group: "meta",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      group: "meta",
      of: [{ type: "reference", to: [{ type: "blogCategory" }] }],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "mediaAsset",
      group: "content",
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "localizedText",
      group: "content",
      description:
        "Shown in listings and as OG fallback when seo.description is empty. 140–180 chars.",
    }),
    defineField({
      name: "bodyEn",
      title: "Body (English)",
      type: "array",
      group: "content",
      of: portableTextConfig,
    }),
    defineField({
      name: "bodyRu",
      title: "Body (Russian)",
      type: "array",
      group: "content",
      of: portableTextConfig,
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
      subtitle: "publishedAt",
      media: "coverImage.image",
    },
    prepare: ({ title, subtitle, media }) => ({
      title: title ?? "Untitled",
      subtitle: subtitle ? new Date(subtitle).toLocaleDateString() : undefined,
      media,
    }),
  },
});
