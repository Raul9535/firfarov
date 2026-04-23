import { defineField, defineType } from "sanity";

/**
 * Singleton. Site-wide data that isn't owned by any single page:
 * brand name, tagline, primary contact email, socials, and default SEO fallbacks.
 *
 * Studio wiring note: enforce a single document via deskStructure once the Studio is mounted.
 */
export const globalSettings = defineType({
  name: "globalSettings",
  title: "Global settings",
  type: "document",
  groups: [
    { name: "brand", title: "Brand", default: true },
    { name: "contact", title: "Contact" },
    { name: "seo", title: "Default SEO" },
  ],
  fields: [
    defineField({
      name: "brandName",
      title: "Brand name",
      type: "string",
      group: "brand",
      initialValue: "FIRFAROV",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "localizedText",
      group: "brand",
      description: "One-line positioning shown in header, footer, and OG defaults.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "primaryEmail",
      title: "Primary email",
      type: "string",
      group: "contact",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      group: "contact",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required(),
            },
            {
              name: "url",
              title: "URL",
              type: "url",
              validation: (rule) => rule.required(),
            },
          ],
          preview: { select: { title: "label", subtitle: "url" } },
        },
      ],
    }),
    defineField({
      name: "defaultSeo",
      title: "Default SEO",
      type: "seoMetadata",
      group: "seo",
      description:
        "Used as a fallback anywhere a page doesn't define its own SEO metadata.",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Global settings" }),
  },
});
