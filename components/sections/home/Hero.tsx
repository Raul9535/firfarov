import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { Locale } from "@/lib/i18n/config";
import { pickLocalized } from "@/lib/i18n/localize";
import { resolveCtaHref } from "@/lib/i18n/routing";
import { sanityFetch } from "@/lib/sanity/fetch";
import { homePageQuery } from "@/lib/sanity/queries";
import { HeroBackgroundVideo } from "./HeroBackgroundVideo";

type HomeHeroProps = {
  locale: Locale;
};

/**
 * Local file in `public/`. If the file is missing the hero renders
 * fine — `HeroBackgroundVideo` errors out cleanly and removes both the
 * video element and the scrim, and the section stays solid `bg-ink`
 * so light text stays readable. To enable the bg video, drop the file
 * at `public/hero-ai-loop.mp4`; nothing else needs to change.
 */
const HERO_VIDEO_SRC = "/hero-ai-loop.mp4";

/**
 * Home hero — entrance to the page. Dark hero treatment: solid `bg-ink`
 * base + optional looping bg video + dark scrim, light display text on
 * top. Modeled on contemporary AI-product landings (Anthropic, OpenAI,
 * Cursor) — cinematic but restrained, not a brochure cover.
 *
 * Stacking: the section creates a fresh stacking context via
 * `relative isolate`. `HeroBackgroundVideo` renders the <video> + the
 * dark scrim at `-z-10` (clipped by `overflow-hidden`). The Container
 * is forced to `relative z-10` so heading / lead / CTA always sit
 * above the video.
 *
 * Type scale stepped down one tier from the previous draft:
 *   - Heading: text-4xl → text-6xl (was 5xl → 7xl). max-w-4xl. Smaller
 *     display reads more "premium AI", less "billboard".
 *   - Lead: text-base → text-lg (was lg → xl). Tighter mt-5/6 below
 *     the heading.
 *   - CTA: inline `<Link>` styled as a cream pill on dark — Button
 *     primary variant would have been bg-ink on a darkened video,
 *     which loses the affordance. Hero presentation layer only;
 *     Button.tsx stays untouched.
 *
 * Section padding kept at `py-24 md:py-32 lg:py-40` so the hero still
 * owns the first screen — empty space is part of the dark cinematic
 * feel.
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
      className="relative isolate overflow-hidden border-b border-rule bg-ink"
    >
      <HeroBackgroundVideo src={HERO_VIDEO_SRC} />

      <Container className="relative z-10 py-24 md:py-32 lg:py-40">
        {heading ? (
          <h1
            id="home-hero-heading"
            className="max-w-4xl text-balance font-serif text-4xl leading-[1.1] tracking-tight text-canvas md:text-5xl lg:text-6xl"
          >
            {heading}
          </h1>
        ) : null}

        {lead ? (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-canvas/75 md:mt-6 md:text-lg">
            {lead}
          </p>
        ) : null}

        {showCta && cta ? (
          <div className="mt-8 md:mt-10">
            <Link
              href={resolveCtaHref(cta.href, locale)}
              className="inline-flex items-center gap-2 bg-canvas px-7 py-4 text-base font-medium text-ink transition-colors duration-[var(--duration-fast)] hover:bg-accent hover:text-canvas"
            >
              {ctaLabel}
            </Link>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
