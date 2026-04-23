import type { Metadata } from "next";
import { SectionStack } from "@/components/dev/SectionStack";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  locale: "ru",
  path: "/contact",
  title: "Контакты — FIRFAROV",
});

const sections = [
  "Hero",
  "Contact methods",
  "Brief form",
  "What happens next",
  "Founder trust signal",
  "Light FAQ",
  "Footer fallback",
] as const;

export default function ContactPageRu() {
  return <SectionStack sections={sections} />;
}
