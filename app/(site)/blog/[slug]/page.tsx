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
  // TODO: load real metadata from Sanity via blogPostBySlugQuery.
  return buildMetadata({
    locale: "en",
    path: `/blog/${slug}`,
    title: `${slug} — FIRFAROV`,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  return (
    <Container className="py-24">
      <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">Blog post</p>
      <h1 className="mt-4 font-serif text-4xl text-ink md:text-5xl">{slug}</h1>
      <p className="mt-6 max-w-prose text-ink-muted">
        Blog post rendering will read Portable Text from Sanity (
        <code className="font-mono text-xs">blogPostBySlugQuery</code>) and render via a typed
        PortableText component.
      </p>
    </Container>
  );
}
