import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  locale: "en",
  path: "/insights",
  title: "Insights — FIRFAROV",
});

export default function InsightsIndexPage() {
  return (
    <Container className="py-24">
      <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">Insights</p>
      <h1 className="mt-4 font-serif text-4xl text-ink md:text-5xl">Writing</h1>
      <p className="mt-6 max-w-prose text-ink-muted">
        Posts will be rendered from Sanity. Use{" "}
        <code className="font-mono text-xs">latestBlogPostsQuery</code> from{" "}
        <code className="font-mono text-xs">lib/sanity/queries</code>.
      </p>
    </Container>
  );
}
