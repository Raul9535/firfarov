import { defineField, defineType } from "sanity";

/**
 * A single media asset with bilingual alt text and an optional caption.
 * Use this for hero images, case-study covers, blog cover images, OG images.
 */
export const mediaAsset = defineType({
  name: "mediaAsset",
  title: "Media asset",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alt text",
      type: "localizedText",
      description:
        "Describes the image for screen readers and fallback contexts. Required for accessibility and SEO.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "localizedText",
      description: "Optional. Rendered below the image where layouts allow it.",
    }),
  ],
  preview: {
    select: { media: "image", title: "alt.en", subtitle: "alt.ru" },
  },
});
