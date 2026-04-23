import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  locale: "en",
  path: "/thank-you",
  title: "Thank you — FIRFAROV",
});

export default function ThankYouPage() {
  return (
    <Container className="py-32">
      <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">Received</p>
      <h1 className="mt-4 font-serif text-4xl text-ink md:text-5xl">Thank you.</h1>
      <p className="mt-6 max-w-prose text-ink-muted">
        Your message is in. You’ll hear back within two business days.
      </p>
      <Link href="/" className="mt-10 inline-block border-b border-ink pb-0.5 text-ink">
        Back to home
      </Link>
    </Container>
  );
}
