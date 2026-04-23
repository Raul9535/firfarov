export const siteConfig = {
  name: "FIRFAROV",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://firfarov.com",
  plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
  defaultTitle: {
    en: "FIRFAROV — Design, AI, and Business Automation",
    ru: "FIRFAROV — Дизайн, ИИ и автоматизация бизнеса",
  },
  defaultDescription: {
    en: "A premium studio at the intersection of UI/UX, product design, and AI-driven business automation.",
    ru: "Премиальная студия на стыке UI/UX, продуктового дизайна и бизнес-автоматизации с ИИ.",
  },
} as const;
