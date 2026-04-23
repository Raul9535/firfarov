import { defineField, defineType } from "sanity";

/**
 * People who appear in bylines, founder notes, and the About page.
 * `name` is a single string — FIRFAROV's founder name isn't translated.
 */
export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "localizedText",
      description: "e.g. 'Founder & Designer'.",
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "localizedText",
      description: "Short paragraph used on the About page and blog bylines.",
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "mediaAsset",
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", title: "Label", type: "string", validation: (rule) => rule.required() },
            { name: "url", title: "URL", type: "url", validation: (rule) => rule.required() },
          ],
          preview: { select: { title: "label", subtitle: "url" } },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "role.en", media: "photo.image" },
  },
});
