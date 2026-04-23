import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  locale: "en",
  path: "/work",
  title: "Work — FIRFAROV",
});

export default function WorkIndexPage() {
  return (
    <Container className="py-24">
      <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">Work</p>
      <h1 className="mt-4 font-serif text-4xl text-ink md:text-5xl">Selected case studies</h1>
      <p className="mt-6 max-w-prose text-ink-muted">
        Case studies will be rendered from Sanity. Use{" "}
        <code className="font-mono text-xs">latestCaseStudiesQuery</code> from{" "}
        <code className="font-mono text-xs">lib/sanity/queries</code>.
      </p>
    </Container>
  );
}
