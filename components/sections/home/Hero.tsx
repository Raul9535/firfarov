import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { Locale } from "@/lib/i18n/config";
import { pickLocalized } from "@/lib/i18n/localize";
import { resolveCtaHref } from "@/lib/i18n/routing";
import { sanityFetch } from "@/lib/sanity/fetch";
import { homePageQuery } from "@/lib/sanity/queries";

type HomeHeroProps = {
  locale: Locale;
};

/**
 * First real home section. Fetches the homePage document directly — React's request-level
 * cache dedupes when sibling sections query the same document. Cache uses the wrapper's
 * default 60s ISR window for now; switch to tag-based revalidation once the Sanity webhook
 * route exists.
 *
 * Layout:
 *   - Heading: display serif, max-w-5xl so short copy doesn't crowd to the left.
 *     `text-balance` evens out line breaks; `tracking-tight` fixes the airy default for Fraunces.
 *   - Lead: max-w-2xl (~65ch at text-xl) — the comfortable reading width, deliberately narrower
 *     than the heading for editorial hierarchy.
 *   - CTA: size="lg" so it has real presence next to the display type.
 *
 * Missing fields are skipped (empty heading → no <h1>, etc.) so a half-filled homePage
 * document still renders cleanly instead of bleeding empty nodes into the layout.
 */
export async function HomeHero({ locale }: HomeHeroProps) {
  const home = await sanityFetch(homePageQuery);

  const heading = pickLocalized(home?.heroHeading, locale);
  const lead = pickLocalized(home?.heroLead, locale);
  const cta = home?.heroCta;
  const ctaLabel = pickLocalized(cta?.label, locale);
  const showCta = Boolean(cta?.href && ctaLabel);

  return (
    <section aria-labelledby="home-hero-heading" className="border-b border-rule">
      <Container className="py-24 md:py-36 lg:py-48">
        {heading ? (
          <h1
            id="home-hero-heading"
            className="max-w-6xl text-balance font-serif text-6xl leading-[1.02] tracking-tight text-ink md:text-[5.5rem] lg:text-[6.5rem] xl:text-[7.5rem]"
          >
            {heading}
          </h1>
        ) : null}
        {lead ? (
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-muted md:mt-10 md:text-xl">
            {lead}
          </p>
        ) : null}
        {showCta && cta ? (
          <div className="mt-12 md:mt-14">
            <Button
              href={resolveCtaHref(cta.href, locale)}
              variant={cta.variant ?? "primary"}
              size="lg"
            >
              {ctaLabel}
            </Button>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
