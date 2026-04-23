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
      <Container className="py-20 md:py-28">
        {heading ? (
          <h1
            id="home-hero-heading"
            className="max-w-4xl font-serif text-5xl leading-[1.1] text-ink md:text-6xl lg:text-7xl"
          >
            {heading}
          </h1>
        ) : null}

        {lead ? (
          <p className="mt-6 max-w-2xl text-lg text-ink-muted md:mt-8 md:text-xl">
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
