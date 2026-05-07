import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { Locale } from "@/lib/i18n/config";
import { pickLocalized } from "@/lib/i18n/localize";
import { resolveCtaHref } from "@/lib/i18n/routing";
import { sanityFetch } from "@/lib/sanity/fetch";
import { urlForImage } from "@/lib/sanity/image";
import { caseStudyBySlugQuery } from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/seo/metadata";

const locale: Locale = "en";

type Params = { slug: string };

/**
 * EN case-study detail. Looks the doc up by `slugEn.current == $slug` via
 * `caseStudyBySlugQuery` ($locale-aware).
 *
 * MVP composition (each section returns null when its source field is empty):
 *   1. Hero — client + title + summary + optional hero image at 16:9.
 *   2. At a glance — 2-column dl of label/value pairs (4|8 spine).
 *   3. Outcomes — hairline-separated list of metric + description rows.
 *   4. Final CTA — closing button.
 *
 * The richer narrative fields (bodyEn, keyDecisions, founderNote, related
 * services, next case) are not rendered yet — that comes once Portable Text
 * authoring is in real use.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = await sanityFetch(caseStudyBySlugQuery, {
    params: { slug, locale },
  });
  const title = pickLocalized(cs?.title, locale);
  const description = pickLocalized(cs?.summary, locale);
  return buildMetadata({
    locale,
    path: `/work/${slug}`,
    title: title ? `${title} — FIRFAROV` : `${slug} — FIRFAROV`,
    description: description || undefined,
  });
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const cs = await sanityFetch(caseStudyBySlugQuery, {
    params: { slug, locale },
  });
  if (!cs) notFound();

  const title = pickLocalized(cs.title, locale);
  const client = pickLocalized(cs.client, locale);
  const summary = pickLocalized(cs.summary, locale);
  const altText = pickLocalized(cs.heroImage?.alt, locale) || title;
  const imageSrc = cs.heroImage?.image
    ? urlForImage(cs.heroImage.image).url()
    : null;
  const atAGlance = cs.atAGlance;
  const outcomes = cs.outcomes;
  const cta = cs.finalCta;
  const ctaLabel = pickLocalized(cta?.label, locale);
  const showCta = Boolean(cta?.href && ctaLabel);

  return (
    <article>
      {/* Hero */}
      <section
        aria-labelledby="case-study-heading"
        className="border-b border-rule"
      >
        <Container className="py-24 md:py-32 lg:py-40">
          {client ? (
            <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">
              {client}
            </p>
          ) : null}
          {title ? (
            <h1
              id="case-study-heading"
              className="mt-4 max-w-5xl text-balance font-serif text-4xl leading-[1.1] tracking-tight text-ink md:text-5xl lg:text-6xl"
            >
              {title}
            </h1>
          ) : null}
          {summary ? (
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink-muted md:mt-8 md:text-xl">
              {summary}
            </p>
          ) : null}
          {imageSrc ? (
            <div className="relative mt-12 aspect-[16/9] overflow-hidden bg-rule md:mt-16">
              <Image
                src={imageSrc}
                alt={altText || ""}
                fill
                sizes="(min-width: 1280px) 1232px, 100vw"
                className="object-cover"
                priority
              />
            </div>
          ) : null}
        </Container>
      </section>

      {/* At a glance */}
      {atAGlance && atAGlance.length > 0 ? (
        <section className="border-b border-rule">
          <Container className="py-24 md:py-32">
            <div className="md:grid md:grid-cols-12 md:gap-8">
              <p className="font-mono text-xs uppercase tracking-widest text-ink-muted md:col-span-4 md:pt-3">
                At a glance
              </p>
              <dl className="mt-8 grid gap-x-8 gap-y-8 md:col-span-8 md:mt-0 md:grid-cols-2 md:gap-y-10">
                {atAGlance.map((item) => {
                  const label = pickLocalized(item.label, locale);
                  const value = pickLocalized(item.value, locale);
                  if (!label && !value) return null;
                  return (
                    <div key={item._key}>
                      {label ? (
                        <dt className="font-mono text-xs uppercase tracking-widest text-ink-muted">
                          {label}
                        </dt>
                      ) : null}
                      {value ? (
                        <dd className="mt-2 font-serif text-xl text-ink md:text-2xl">
                          {value}
                        </dd>
                      ) : null}
                    </div>
                  );
                })}
              </dl>
            </div>
          </Container>
        </section>
      ) : null}

      {/* Outcomes */}
      {outcomes && outcomes.length > 0 ? (
        <section className="border-b border-rule">
          <Container className="py-24 md:py-32">
            <div className="md:grid md:grid-cols-12 md:gap-8">
              <p className="font-mono text-xs uppercase tracking-widest text-ink-muted md:col-span-4 md:pt-3">
                Outcomes
              </p>
              <ul className="mt-6 border-t border-rule md:col-span-8 md:mt-0">
                {outcomes.map((outcome) => {
                  const metric = pickLocalized(outcome.metric, locale);
                  const description = pickLocalized(outcome.description, locale);
                  if (!metric) return null;
                  return (
                    <li
                      key={outcome._key}
                      className="border-b border-rule py-8 md:py-10"
                    >
                      <p className="font-serif text-3xl tracking-tight text-ink md:text-4xl lg:text-5xl">
                        {metric}
                      </p>
                      {description ? (
                        <p className="mt-3 max-w-prose text-base leading-relaxed text-ink-muted md:mt-4 md:text-lg">
                          {description}
                        </p>
                      ) : null}
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
          aria-labelledby="case-study-cta"
          className="border-b border-rule"
        >
          <Container className="py-24 md:py-32">
            <div className="md:grid md:grid-cols-12 md:items-baseline md:gap-8">
              <p
                id="case-study-cta"
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
