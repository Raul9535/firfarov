import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { Locale } from "@/lib/i18n/config";
import { pickLocalized } from "@/lib/i18n/localize";
import { resolveCtaHref } from "@/lib/i18n/routing";
import { sanityFetch } from "@/lib/sanity/fetch";
import { urlForImage } from "@/lib/sanity/image";
import { aboutPageQuery } from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/seo/metadata";

const locale: Locale = "ru";

export const metadata: Metadata = buildMetadata({
  locale,
  path: "/about",
  title: "О студии — FIRFAROV",
});

/**
 * RU mirror of /about. Same data path as EN — `aboutPageQuery` derefs the
 * `founder` reference inline. Section eyebrows localized to RU.
 */
export default async function AboutPageRu() {
  const about = await sanityFetch(aboutPageQuery);

  const heroStatement = pickLocalized(about?.heroStatement, locale);
  const founder = about?.founder;
  const founderName = founder?.name;
  const founderRole = pickLocalized(founder?.role, locale);
  const founderBio = pickLocalized(founder?.bio, locale);
  const founderPhotoSrc = founder?.photo?.image
    ? urlForImage(founder.photo.image).url()
    : null;
  const founderPhotoAlt =
    pickLocalized(founder?.photo?.alt, locale) || founderName || "";
  const principles = about?.principles;
  const expertiseAreas = about?.expertiseAreas;
  const cta = about?.finalCta;
  const ctaLabel = pickLocalized(cta?.label, locale);
  const showCta = Boolean(cta?.href && ctaLabel);

  return (
    <article>
      {/* Hero */}
      {heroStatement ? (
        <section
          aria-labelledby="about-hero-heading"
          className="border-b border-rule"
        >
          <Container className="py-24 md:py-32 lg:py-40">
            <h1
              id="about-hero-heading"
              className="max-w-5xl text-balance font-serif text-4xl leading-[1.1] tracking-tight text-ink md:text-5xl lg:text-6xl"
            >
              {heroStatement}
            </h1>
          </Container>
        </section>
      ) : null}

      {/* Основатель */}
      {founder && (founderName || founderBio) ? (
        <section
          aria-labelledby="about-founder-heading"
          className="border-b border-rule"
        >
          <Container className="py-24 md:py-32">
            <div className="md:grid md:grid-cols-12 md:gap-8">
              <p className="font-mono text-xs uppercase tracking-widest text-ink-muted md:col-span-4 md:pt-3">
                Основатель
              </p>
              <div className="mt-6 md:col-span-8 md:mt-0">
                {founderPhotoSrc ? (
                  <div className="relative mb-8 aspect-[4/5] w-full max-w-sm overflow-hidden bg-rule md:mb-10">
                    <Image
                      src={founderPhotoSrc}
                      alt={founderPhotoAlt}
                      fill
                      sizes="(min-width: 768px) 384px, 100vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}
                {founderName ? (
                  <h2
                    id="about-founder-heading"
                    className="font-serif text-3xl tracking-tight text-ink md:text-4xl lg:text-5xl"
                  >
                    {founderName}
                  </h2>
                ) : null}
                {founderRole ? (
                  <p className="mt-2 font-mono text-xs uppercase tracking-widest text-ink-muted">
                    {founderRole}
                  </p>
                ) : null}
                {founderBio ? (
                  <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted md:mt-8 md:text-xl">
                    {founderBio}
                  </p>
                ) : null}
              </div>
            </div>
          </Container>
        </section>
      ) : null}

      {/* Как мы работаем */}
      {principles && principles.length > 0 ? (
        <section
          aria-labelledby="about-principles-heading"
          className="border-b border-rule"
        >
          <Container className="py-24 md:py-32">
            <div className="md:grid md:grid-cols-12 md:gap-8">
              <p
                id="about-principles-heading"
                className="font-mono text-xs uppercase tracking-widest text-ink-muted md:col-span-4 md:pt-3"
              >
                Как мы работаем
              </p>
              <ul className="mt-6 border-t border-rule md:col-span-8 md:mt-0">
                {principles.map((item) => {
                  const heading = pickLocalized(item.heading, locale);
                  const description = pickLocalized(item.description, locale);
                  if (!heading && !description) return null;
                  return (
                    <li
                      key={item._key}
                      className="border-b border-rule py-8 md:py-10"
                    >
                      {heading ? (
                        <h3 className="font-serif text-2xl tracking-tight text-ink md:text-3xl">
                          {heading}
                        </h3>
                      ) : null}
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

      {/* Экспертиза */}
      {expertiseAreas && expertiseAreas.length > 0 ? (
        <section
          aria-labelledby="about-expertise-heading"
          className="border-b border-rule"
        >
          <Container className="py-24 md:py-32">
            <div className="md:grid md:grid-cols-12 md:gap-8">
              <p
                id="about-expertise-heading"
                className="font-mono text-xs uppercase tracking-widest text-ink-muted md:col-span-4 md:pt-3"
              >
                Экспертиза
              </p>
              <ul className="mt-6 grid gap-x-8 gap-y-4 md:col-span-8 md:mt-0 md:grid-cols-2 md:gap-y-6">
                {expertiseAreas.map((item) => {
                  const text = pickLocalized(item, locale);
                  if (!text) return null;
                  return (
                    <li
                      key={item._key}
                      className="font-serif text-lg text-ink md:text-xl"
                    >
                      {text}
                    </li>
                  );
                })}
              </ul>
            </div>
          </Container>
        </section>
      ) : null}

      {/* Начать */}
      {showCta && cta ? (
        <section aria-labelledby="about-cta" className="border-b border-rule">
          <Container className="py-24 md:py-32">
            <div className="md:grid md:grid-cols-12 md:items-baseline md:gap-8">
              <p
                id="about-cta"
                className="font-mono text-xs uppercase tracking-widest text-ink-muted md:col-span-4 md:pt-3"
              >
                Начать
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
