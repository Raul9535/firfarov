import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  locale: "ru",
  path: "/thank-you",
  title: "Спасибо — FIRFAROV",
});

export default function ThankYouPageRu() {
  return (
    <Container className="py-32">
      <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">Получено</p>
      <h1 className="mt-4 font-serif text-4xl text-ink md:text-5xl">Спасибо.</h1>
      <p className="mt-6 max-w-prose text-ink-muted">
        Ваше сообщение получено. Мы ответим в течение двух рабочих дней.
      </p>
      <Link href="/ru" className="mt-10 inline-block border-b border-ink pb-0.5 text-ink">
        На главную
      </Link>
    </Container>
  );
}
