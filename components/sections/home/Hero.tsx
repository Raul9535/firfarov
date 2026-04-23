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
 * Layout composition:
 *   - Full-viewport section (min-h-[88vh]) with content bottom-anchored via `mt-auto`.
 *     That creates a deliberate void above the heading — the most distinctive editorial move,
 *     signalling "this is the entrance to the site" before anything is read.
 *   - A short accent-colored rule marks where the content column begins. Single brand color,
 *     minimal geometry, no invented copy.
 *   - Heading uses `clamp(4rem, 9vw, 9rem)` — 64 → 144px smoothly, no breakpoint jumps.
 *     Tight leading (0.98) and tight tracking (-0.02em) for display-serif weight.
 *   - Lead held at `max-w-xl` (narrower than heading) to preserve editorial hierarchy.
 *   - CTA is `size="lg"` with a trailing arrow for decisive forward motion.
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
    <section
      aria-labelledby="home-hero-heading"
      className="flex min-h-[88vh] flex-col border-b border-rule"
    >
      <Container className="mt-auto pb-20 pt-12 md:pb-28 md:pt-16">
        {/* Accent rule — print-editorial anchor in the single brand accent color. */}
        <span
          aria-hidden
          className="inline-block h-[2px] w-16 bg-accent md:w-24"
        />

        <div className="mt-16 md:mt-24">
          {heading ? (
            <h1
              id="home-hero-heading"
              className="max-w-[70rem] text-balance font-serif text-[clamp(4rem,9vw,9rem)] leading-[0.98] tracking-[-0.02em] text-ink"
            >
              {heading}
            </h1>
          ) : null}

          {lead ? (
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-muted md:mt-10 md:text-xl">
              {lead}
            </p>
          ) : null}

          {showCta && cta ? (
            <div className="mt-12 md:mt-16">
              <Button
                href={resolveCtaHref(cta.href, locale)}
                variant={cta.variant ?? "primary"}
                size="lg"
              >
                {ctaLabel}
                <span aria-hidden>→</span>
              </Button>
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
