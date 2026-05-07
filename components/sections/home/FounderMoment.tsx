import { Container } from "@/components/ui/Container";
import type { Locale } from "@/lib/i18n/config";
import { pickLocalized } from "@/lib/i18n/localize";
import { sanityFetch } from "@/lib/sanity/fetch";
import { homePageQuery } from "@/lib/sanity/queries";

type HomeFounderMomentProps = {
  locale: Locale;
};

/**
 * Personal beat from the founder. Reads `founderMomentHeading` + `founderMomentText`
 * off the same homePage document Hero / Positioning / ServicesOverview already fetch —
 * React's request-level cache dedupes, no additional HTTP call.
 *
 * Layout: single column. Modest serif heading sits above a comfortable body paragraph.
 * Heading is intentionally smaller than the hero / positioning displays — this is a beat
 * inside the page, not a brand statement.
 *
 * Returns `null` if both fields are empty so an unfilled homePage doesn't bleed an empty
 * bordered shell into the layout.
 */
export async function HomeFounderMoment({ locale }: HomeFounderMomentProps) {
  const home = await sanityFetch(homePageQuery);

  const heading = pickLocalized(home?.founderMomentHeading, locale);
  const text = pickLocalized(home?.founderMomentText, locale);

  if (!heading && !text) return null;

  return (
    <section
      aria-labelledby={heading ? "home-founder-moment-heading" : undefined}
      className="border-b border-rule"
    >
      <Container className="py-20 md:py-28">
        {heading ? (
          <h2
            id="home-founder-moment-heading"
            className="max-w-3xl font-serif text-2xl text-ink md:text-3xl lg:text-4xl"
          >
            {heading}
          </h2>
        ) : null}
        {text ? (
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink-muted md:mt-8 md:text-xl">
            {text}
          </p>
        ) : null}
      </Container>
    </section>
  );
}
