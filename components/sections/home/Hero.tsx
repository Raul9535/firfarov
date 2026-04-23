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
 * cache dedupes when sibling sections query the same document. Revalidates on-demand via
 * the `homePage` tag (webhook hook is TODO).
 *
 * Renders only what's filled in. Missing heading / lead / CTA are skipped rather than replaced
 * with placeholders, so an empty document yields a minimal (not broken) section.
 */
export async function HomeHero({ locale }: HomeHeroProps) {
  const home = await sanityFetch(homePageQuery, { tags: ["homePage"] });

  const heading = pickLocalized(home?.heroHeading, locale);
  const lead = pickLocalized(home?.heroLead, locale);
  const cta = home?.heroCta;
  const ctaLabel = pickLocalized(cta?.label, locale);
  const showCta = Boolean(cta?.href && ctaLabel);

  return (
    <section aria-labelledby="home-hero-heading" className="border-b border-rule">
      <Container className="py-32 md:py-48">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">
          FIRFAROV
        </p>
        {heading ? (
          <h1
            id="home-hero-heading"
            className="mt-8 max-w-4xl font-serif text-5xl leading-[1.05] text-ink md:text-7xl"
          >
            {heading}
          </h1>
        ) : null}
        {lead ? (
          <p className="mt-8 max-w-2xl text-lg text-ink-muted md:text-xl">{lead}</p>
        ) : null}
        {showCta && cta ? (
          <Button
            href={resolveCtaHref(cta.href, locale)}
            variant={cta.variant ?? "primary"}
            className="mt-12"
          >
            {ctaLabel}
          </Button>
        ) : null}
      </Container>
    </section>
  );
}
