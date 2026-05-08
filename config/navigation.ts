import type { Dictionary } from "@/lib/i18n/dictionaries";

type NavKey = keyof Dictionary["nav"];

export const primaryNavItems: ReadonlyArray<{ href: string; key: NavKey }> = [
  { href: "/about", key: "about" },
  { href: "/services", key: "services" },
  { href: "/work", key: "work" },
  { href: "/insights", key: "insights" },
  { href: "/contact", key: "contact" },
];
