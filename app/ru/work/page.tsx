import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  locale: "ru",
  path: "/work",
  title: "Кейсы — FIRFAROV",
});

export default function WorkIndexPageRu() {
  return (
    <Container className="py-24">
      <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">Кейсы</p>
      <h1 className="mt-4 font-serif text-4xl text-ink md:text-5xl">Избранные проекты</h1>
      <p className="mt-6 max-w-prose text-ink-muted">
        Кейсы будут загружаться из Sanity через{" "}
        <code className="font-mono text-xs">latestCaseStudiesQuery</code>.
      </p>
    </Container>
  );
}
