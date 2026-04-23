import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  locale: "ru",
  path: "/blog",
  title: "Блог — FIRFAROV",
});

export default function BlogIndexPageRu() {
  return (
    <Container className="py-24">
      <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">Блог</p>
      <h1 className="mt-4 font-serif text-4xl text-ink md:text-5xl">Статьи</h1>
      <p className="mt-6 max-w-prose text-ink-muted">
        Посты будут загружаться из Sanity через{" "}
        <code className="font-mono text-xs">latestBlogPostsQuery</code>.
      </p>
    </Container>
  );
}
