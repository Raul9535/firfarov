import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { Locale } from "@/lib/i18n/config";
import { pickLocalized } from "@/lib/i18n/localize";
import { resolveCtaHref } from "@/lib/i18n/routing";
import { sanityFetch } from "@/lib/sanity/fetch";
import { serviceBySlugQuery } from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/seo/metadata";

const locale: Locale = "en";

type Params = { slug: string };

/**
 * EN service detail page. Looks the doc up by `slugEn.current == $slug` via
 * `serviceBySlugQuery` (which takes a `$locale` param and matches the right slug field).
 *
 * MVP composition (any section returns null when its source field is empty):
 *   1. Hero — title + tagline at page-hero scale.
 *   2. Positioning — single-statement section in 4|8 spine.
 *   3. Who it's for — bullet list of audience markers.
 *   4. What's included — bullet list of deliverables.
 *   5. Final CTA — closing button.
 *
 * Other approved sections (process, deliverables array, tech stack, related services,
 * FAQ, case studies) come later as content + design demand them.
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

export default async function ServiceDetailPage({
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
  const whoItsFor = service.whoItsFor;
  const whatsIncluded = service.whatsIncluded;
  const cta = service.finalCta;
  const ctaLabel = pickLocalized(cta?.label, locale);
  const showCta = Boolean(cta?.href && ctaLabel);

  return (
    <article>
      {/* Hero */}
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

      {/* Positioning */}
      {positioning ? (
        <section className="border-b border-rule">
          <Container className="py-24 md:py-32">
            <div className="md:grid md:grid-cols-12 md:items-baseline md:gap-8">
              <p className="font-mono text-xs uppercase tracking-widest text-ink-muted md:col-span-4 md:pt-3">
                Positioning
              </p>
              <p className="mt-6 max-w-3xl text-balance font-serif text-2xl leading-[1.15] tracking-tight text-ink md:col-span-8 md:mt-0 md:text-3xl lg:text-4xl">
                {positioning}
              </p>
            </div>
          </Container>
        </section>
      ) : null}

      {/* Who it's for */}
      {whoItsFor && whoItsFor.length > 0 ? (
        <section className="border-b border-rule">
          <Container className="py-24 md:py-32">
            <div className="md:grid md:grid-cols-12 md:gap-8">
              <p className="font-mono text-xs uppercase tracking-widest text-ink-muted md:col-span-4 md:pt-3">
                Who it’s for
              </p>
              <ul className="mt-6 border-t border-rule md:col-span-8 md:mt-0">
                {whoItsFor.map((item) => {
                  const text = pickLocalized(item, locale);
                  if (!text) return null;
                  return (
                    <li key={item._key} className="border-b border-rule py-5 md:py-6">
                      <p className="max-w-3xl text-base text-ink md:text-lg">{text}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Container>
        </section>
      ) : null}

      {/* What’s included */}
      {whatsIncluded && whatsIncluded.length > 0 ? (
        <section className="border-b border-rule">
          <Container className="py-24 md:py-32">
            <div className="md:grid md:grid-cols-12 md:gap-8">
              <p className="font-mono text-xs uppercase tracking-widest text-ink-muted md:col-span-4 md:pt-3">
                What’s included
              </p>
              <ul className="mt-6 border-t border-rule md:col-span-8 md:mt-0">
                {whatsIncluded.map((item) => {
                  const text = pickLocalized(item, locale);
                  if (!text) return null;
                  return (
                    <li key={item._key} className="border-b border-rule py-5 md:py-6">
                      <p className="max-w-3xl text-base text-ink md:text-lg">{text}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Container>
        </section>
      ) : null}

      {/* Final CTA */}
      {showCta && cta ? (
        <section
          aria-labelledby="service-detail-cta"
          className="border-b border-rule"
        >
          <Container className="py-24 md:py-32">
            <div className="md:grid md:grid-cols-12 md:items-baseline md:gap-8">
              <p
                id="service-detail-cta"
                className="font-mono text-xs uppercase tracking-widest text-ink-muted md:col-span-4 md:pt-3"
              >
                Get started
              </p>
              <div className="mt-4 md:col-span-8 md:mt-0">
                <Button
                  href={resolveCtaHref(cta.href, locale)}
                  variant={cta.variant ?? "primary"}
                  size="lg"
                >
                  {ctaLabel}
                </Button>
              </div>
            </div>
          </Container>
        </section>
      ) : null}
    </article>
  );
}
