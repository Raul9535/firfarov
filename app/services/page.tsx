import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { services } from "@/config/services";
import { type Locale } from "@/lib/i18n/config";
import { localizePath } from "@/lib/i18n/routing";
import { buildMetadata } from "@/lib/seo/metadata";

const locale: Locale = "en";

export const metadata: Metadata = buildMetadata({
  locale,
  path: "/services",
  title: "Services — FIRFAROV",
});

export default function ServicesIndexPage() {
  return (
    <Container className="py-24">
      <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">Services</p>
      <h1 className="mt-4 font-serif text-4xl text-ink md:text-5xl">What we do</h1>
      <ul className="mt-12 divide-y divide-rule border-y border-rule">
        {services.map((service) => (
          <li key={service.slug}>
            <Link
              href={localizePath(`/services/${service.slug}`, locale)}
              className="flex items-baseline justify-between py-6 text-ink transition-colors hover:text-accent"
            >
              <span className="font-serif text-2xl">{service.name[locale]}</span>
              <span className="font-mono text-xs uppercase tracking-widest text-ink-muted">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
