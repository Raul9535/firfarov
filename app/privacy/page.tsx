import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  locale: "en",
  path: "/privacy",
  title: "Privacy — FIRFAROV",
});

export default function PrivacyPage() {
  return (
    <Container className="py-24">
      <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">Legal</p>
      <h1 className="mt-4 font-serif text-4xl text-ink md:text-5xl">Privacy</h1>
      <p className="mt-6 max-w-prose text-ink-muted">
        Legal copy will be rendered from Sanity (<code className="font-mono text-xs">legalPageBySlugQuery</code>,
        slug <code className="font-mono text-xs">privacy</code>).
      </p>
    </Container>
  );
}
