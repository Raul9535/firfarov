import type { Metadata } from "next";
import { SectionStack } from "@/components/dev/SectionStack";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  locale: "en",
  path: "/about",
  title: "About — FIRFAROV",
});

const sections = [
  "Hero statement",
  "What FIRFAROV is",
  "Founder",
  "How we work",
  "Team summary",
  "Principles",
  "Expertise & focus",
  "Who we work with",
  "Studio in context",
  "Final CTA",
] as const;

export default function AboutPage() {
  return <SectionStack sections={sections} />;
}
