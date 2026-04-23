import type { Metadata } from "next";
import { SectionStack } from "@/components/dev/SectionStack";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  locale: "ru",
  path: "/services/website-design",
  title: "Дизайн сайтов — FIRFAROV",
});

const sections = [
  "Hero",
  "Positioning",
  "Who it’s for",
  "What’s included",
  "Process",
  "Case studies",
  "Deliverables & outcomes",
  "Tech stack",
  "Related services",
  "FAQ",
  "Final CTA",
] as const;

export default function Page() {
  return <SectionStack sections={sections} />;
}
