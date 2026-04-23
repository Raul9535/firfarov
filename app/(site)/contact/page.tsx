import type { Metadata } from "next";
import { SectionStack } from "@/components/dev/SectionStack";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  locale: "en",
  path: "/contact",
  title: "Contact — FIRFAROV",
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

export default function ContactPage() {
  return <SectionStack sections={sections} />;
}
