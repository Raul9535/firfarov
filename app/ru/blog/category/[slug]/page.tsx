import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { buildMetadata } from "@/lib/seo/metadata";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  return buildMetadata({
    locale: "ru",
    path: `/blog/category/${slug}`,
    title: `${slug} — Блог — FIRFAROV`,
  });
}

export default async function BlogCategoryPageRu({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  return (
    <Container className="py-24">
      <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">Категория</p>
      <h1 className="mt-4 font-serif text-4xl text-ink md:text-5xl">{slug}</h1>
      <p className="mt-6 max-w-prose text-ink-muted">
        Используйте <code className="font-mono text-xs">blogPostsByCategoryQuery</code>.
      </p>
    </Container>
  );
}
