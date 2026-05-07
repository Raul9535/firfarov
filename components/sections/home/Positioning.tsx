import { Container } from "@/components/ui/Container";
import type { Locale } from "@/lib/i18n/config";
import { pickLocalized } from "@/lib/i18n/localize";
import { sanityFetch } from "@/lib/sanity/fetch";
import { homePageQuery } from "@/lib/sanity/queries";

type HomePositioningProps = {
  locale: Locale;
};

/**
 * Positioning statement on the homepage. Establishes the 4|8 editorial grid that the rest
 * of the post-hero sections follow:
 *   - Mono section label sits in the left column (col-span-4) — small, uppercase, muted.
 *   - The statement sits in the right column (col-span-8) at display-serif scale.
 *
 * On mobile the grid collapses; label stacks above statement.
 *
 * Reads `homePage.positioningStatement` off the same homePageQuery the other sections use —
 * React's request-level cache dedupes, no additional HTTP call.
 */
export async function HomePositioning({ locale }: HomePositioningProps) {
  const home = await sanityFetch(homePageQuery, { tags: ["homePage"] });
  const statement = pickLocalized(home?.positioningStatement, locale);

  if (!statement) return null;

  const label = locale === "ru" ? "Позиционирование" : "Positioning";

  return (
    <section aria-labelledby="home-positioning-heading" className="border-b border-rule">
      <Container className="py-24 md:py-32">
        <div className="md:grid md:grid-cols-12 md:items-baseline md:gap-8">
          <p className="font-mono text-xs uppercase tracking-widest text-ink-muted md:col-span-4 md:pt-3">
            {label}
          </p>
          <h2
            id="home-positioning-heading"
            className="mt-6 max-w-3xl text-balance font-serif text-3xl leading-[1.1] tracking-tight text-ink md:col-span-8 md:mt-0 md:text-4xl lg:text-5xl"
          >
            {statement}
          </h2>
        </div>
      </Container>
    </section>
  );
}
