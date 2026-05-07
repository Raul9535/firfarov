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
 * Layout: same 4|8 editorial spine the rest of the page uses. Mono section label sits
 * in the left column (col-span-4); heading + body sit in the right column (col-span-8).
 * On mobile the grid collapses and label stacks above content.
 *
 * Returns `null` when both fields are empty so an unfilled homePage doesn't bleed an
 * empty bordered shell into the layout.
 */
export async function HomeFounderMoment({ locale }: HomeFounderMomentProps) {
  const home = await sanityFetch(homePageQuery);

  const heading = pickLocalized(home?.founderMomentHeading, locale);
  const text = pickLocalized(home?.founderMomentText, locale);

  if (!heading && !text) return null;

  const sectionLabel = locale === "ru" ? "Основатель" : "Founder";

  return (
    <section
      aria-labelledby={heading ? "home-founder-moment-heading" : undefined}
      className="border-b border-rule"
    >
      <Container className="py-24 md:py-32">
        <div className="md:grid md:grid-cols-12 md:items-baseline md:gap-8">
          <p className="font-mono text-xs uppercase tracking-widest text-ink-muted md:col-span-4 md:pt-3">
            {sectionLabel}
          </p>
          <div className="mt-4 md:col-span-8 md:mt-0">
            {heading ? (
              <h2
                id="home-founder-moment-heading"
                className="font-serif text-2xl tracking-tight text-ink md:text-3xl lg:text-4xl"
              >
                {heading}
              </h2>
            ) : null}
            {text ? (
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted md:mt-8 md:text-xl">
                {text}
              </p>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
