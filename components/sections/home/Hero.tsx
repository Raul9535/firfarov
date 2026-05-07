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
 * Home hero — entrance to the page. Unlike the other home sections, hero doesn't sit in
 * the 4|8 grid spine — it gets full breadth so the heading owns the first screen.
 *
 *   - Heading: serif 48 → 72px, `max-w-5xl` so short copy doesn't crowd left, `text-balance`
 *     evens out wraps, `tracking-tight` tightens display tracking.
 *   - Lead: `max-w-2xl` (~65ch reading width) — narrower than heading, clear hierarchy.
 *   - CTA: size="lg" for real presence next to display type.
 *
 * Padding scales `py-24 → py-32 → py-40` so the hero gains weight on wider viewports
 * without floating on a 100vh canvas.
 */
export async function HomeHero({ locale }: HomeHeroProps) {
  const home = await sanityFetch(homePageQuery);

  const heading = pickLocalized(home?.heroHeading, locale);
  const lead = pickLocalized(home?.heroLead, locale);
  const cta = home?.heroCta;
  const ctaLabel = pickLocalized(cta?.label, locale);
  const showCta = Boolean(cta?.href && ctaLabel);

  return (
    <section
      aria-labelledby="home-hero-heading"
      className="border-b border-rule"
    >
      <Container className="py-24 md:py-32 lg:py-40">
        {heading ? (
          <h1
            id="home-hero-heading"
            className="max-w-5xl text-balance font-serif text-5xl leading-[1.05] tracking-tight text-ink md:text-6xl lg:text-7xl"
          >
            {heading}
          </h1>
        ) : null}

        {lead ? (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted md:mt-8 md:text-xl">
            {lead}
          </p>
        ) : null}

        {showCta && cta ? (
          <div className="mt-10 md:mt-12">
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
