import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import type { Locale } from "@/lib/i18n/config";
import { pickLocalized } from "@/lib/i18n/localize";
import { sanityFetch } from "@/lib/sanity/fetch";
import { serviceBySlugQuery } from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/seo/metadata";

const locale: Locale = "ru";

type Params = { slug: string };

/**
 * RU mirror of /services/[slug]. Same data path as the EN page but matches against
 * `slugRu.current == $slug` via the `$locale = "ru"` branch of `serviceBySlugQuery`.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await sanityFetch(serviceBySlugQuery, {
    params: { slug, locale },
  });
  const title = pickLocalized(service?.title, locale);
  const description = pickLocalized(service?.tagline, locale);
  return buildMetadata({
    locale,
    path: `/services/${slug}`,
    title: title ? `${title} — FIRFAROV` : `${slug} — FIRFAROV`,
    description: description || undefined,
  });
}

export default async function ServiceDetailPageRu({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const service = await sanityFetch(serviceBySlugQuery, {
    params: { slug, locale },
  });
  if (!service) notFound();

  const title = pickLocalized(service.title, locale);
  const tagline = pickLocalized(service.tagline, locale);
  const positioning = pickLocalized(service.positioning, locale);

  return (
    <article>
      <section
        aria-labelledby="service-detail-heading"
        className="border-b border-rule"
      >
        <Container className="py-24 md:py-32 lg:py-40">
          {title ? (
            <h1
              id="service-detail-heading"
              className="max-w-5xl text-balance font-serif text-5xl leading-[1.05] tracking-tight text-ink md:text-6xl lg:text-7xl"
            >
              {title}
            </h1>
          ) : null}
          {tagline ? (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted md:mt-8 md:text-xl">
              {tagline}
            </p>
          ) : null}
        </Container>
      </section>

      {positioning ? (
        <section className="border-b border-rule">
          <Container className="py-24 md:py-32">
            <div className="md:grid md:grid-cols-12 md:items-baseline md:gap-8">
              <p className="font-mono text-xs uppercase tracking-widest text-ink-muted md:col-span-4 md:pt-3">
                Позиционирование
              </p>
              <p className="mt-6 max-w-3xl text-balance font-serif text-2xl leading-[1.15] tracking-tight text-ink md:col-span-8 md:mt-0 md:text-3xl lg:text-4xl">
                {positioning}
              </p>
            </div>
          </Container>
        </section>
      ) : null}
    </article>
  );
}
