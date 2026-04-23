import { defineArrayMember } from "sanity";

/**
 * Shared Portable Text config used by `bodyEn` / `bodyRu` fields on blog posts,
 * case studies, legal pages, and anywhere else long-form body content lives.
 *
 * Kept deliberately minimal for MVP: a standard block with link + image. Expand carefully —
 * every custom mark/type here has to be handled by the PortableText renderer on the frontend.
 */
export const portableTextConfig = [
  defineArrayMember({
    type: "block",
    styles: [
      { title: "Normal", value: "normal" },
      { title: "H2", value: "h2" },
      { title: "H3", value: "h3" },
      { title: "H4", value: "h4" },
      { title: "Quote", value: "blockquote" },
    ],
    lists: [
      { title: "Bulleted", value: "bullet" },
      { title: "Numbered", value: "number" },
    ],
    marks: {
      decorators: [
        { title: "Strong", value: "strong" },
        { title: "Emphasis", value: "em" },
        { title: "Code", value: "code" },
      ],
      annotations: [
        {
          name: "link",
          type: "object",
          title: "Link",
          fields: [
            {
              name: "href",
              type: "url",
              title: "URL",
              validation: (rule) => rule.required(),
            },
          ],
        },
      ],
    },
  }),
  defineArrayMember({
    type: "image",
    options: { hotspot: true },
    fields: [
      {
        name: "alt",
        title: "Alt text",
        type: "localizedText",
      },
      {
        name: "caption",
        title: "Caption",
        type: "localizedText",
      },
    ],
  }),
];
