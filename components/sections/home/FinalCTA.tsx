import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { Locale } from "@/lib/i18n/config";
import { pickLocalized } from "@/lib/i18n/localize";
import { resolveCtaHref } from "@/lib/i18n/routing";
import { sanityFetch } from "@/lib/sanity/fetch";
import { homePageQuery } from "@/lib/sanity/queries";

type HomeFinalCTAProps = {
  locale: Locale;
};

/**
 * Closing CTA on the homepage. Reads `homePage.finalCta` (CtaBlock = label + href +
 * variant) off the same homePageQuery the rest of the page fetches — React's request-level
 * cache dedupes, no additional HTTP call.
 *
 * Layout uses the home's 4|8 editorial spine. The CtaBlock only carries the button itself,
 * so the section eyebrow and the closing serif statement are inline locale-switched copy
 * (same precedent as ServicesOverview "What we do" / Approach "How we work"). Big button at
 * `size="lg"` sits below the heading inside col-span-8.
 *
 * Returns `null` when the CtaBlock is missing label or href — the section can't render
 * meaningfully without a real button, and a heading without a destination would be misleading.
 */
export async function HomeFinalCTA({ locale }: HomeFinalCTAProps) {
  const home = await sanityFetch(homePageQuery);
  const cta = home?.finalCta;
  const ctaLabel = pickLocalized(cta?.label, locale);
  if (!cta?.href || !ctaLabel) return null;

  const sectionLabel = locale === "ru" ? "Связаться" : "Get in touch";
  const sectionHeading =
    locale === "ru" ? "Расскажите о проекте." : "Let's start a project.";

  return (
    <section
      aria-labelledby="home-final-cta-heading"
      className="border-b border-rule"
    >
      <Container className="py-24 md:py-32">
        <div className="md:grid md:grid-cols-12 md:items-baseline md:gap-8">
          <p className="font-mono text-xs uppercase tracking-widest text-ink-muted md:col-span-4 md:pt-3">
            {sectionLabel}
          </p>
          <div className="mt-4 md:col-span-8 md:mt-0">
            <h2
              id="home-final-cta-heading"
              className="max-w-3xl text-balance font-serif text-3xl tracking-tight text-ink md:text-4xl lg:text-5xl"
            >
              {sectionHeading}
            </h2>
            <div className="mt-10 md:mt-12">
              <Button
                href={resolveCtaHref(cta.href, locale)}
                variant={cta.variant ?? "primary"}
                size="lg"
              >
                {ctaLabel}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
