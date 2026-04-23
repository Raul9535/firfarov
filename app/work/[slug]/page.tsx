import type { Metadata } from "next";
import { SectionStack } from "@/components/dev/SectionStack";
import { buildMetadata } from "@/lib/seo/metadata";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  // TODO: load title/description from Sanity via caseStudyBySlugQuery.
  return buildMetadata({
    locale: "en",
    path: `/work/${slug}`,
    title: `${slug} — FIRFAROV`,
  });
}

const sections = [
  "Header / hero",
  "At a glance",
  "Opening narrative",
  "Context",
  "Approach",
  "The work",
  "Key decisions",
  "Outcomes",
  "Related services",
  "Founder note",
  "Final CTA",
  "Next case",
] as const;

export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  await params; // TODO: fetch case study by slug from Sanity.
  return <SectionStack sections={sections} />;
}
