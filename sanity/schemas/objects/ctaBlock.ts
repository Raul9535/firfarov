import { defineField, defineType } from "sanity";

/**
 * Reusable call-to-action primitive. Renders through components/ui/Button.
 * `href` is stored as a locale-agnostic path — the frontend's `localizePath()` helper
 * applies the `/ru` prefix when rendering the Russian locale.
 */
export const ctaBlock = defineType({
  name: "ctaBlock",
  title: "CTA",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "localizedText",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "href",
      title: "URL or path",
      type: "string",
      description:
        'Locale-agnostic path ("/contact") or an absolute URL ("https://…"). Do not include the /ru prefix.',
      validation: (rule) =>
        rule
          .required()
          .custom((value) => {
            if (!value) return true;
            if (value.startsWith("/")) return true;
            if (/^https?:\/\//.test(value)) return true;
            if (value.startsWith("mailto:") || value.startsWith("tel:")) return true;
            return 'Must start with "/", "http(s)://", "mailto:", or "tel:".';
          }),
    }),
    defineField({
      name: "variant",
      title: "Variant",
      type: "string",
      options: {
        list: [
          { title: "Primary", value: "primary" },
          { title: "Ghost", value: "ghost" },
        ],
        layout: "radio",
      },
      initialValue: "primary",
    }),
  ],
  preview: {
    select: { label: "label.en", href: "href", variant: "variant" },
    prepare: ({ label, href, variant }) => ({
      title: label ?? "Unnamed CTA",
      subtitle: [variant, href].filter(Boolean).join(" · "),
    }),
  },
});
