import { Container } from "@/components/ui/Container";
import type { Locale } from "@/lib/i18n/config";
import { pickLocalized } from "@/lib/i18n/localize";
import { sanityFetch } from "@/lib/sanity/fetch";
import { homePageQuery } from "@/lib/sanity/queries";

type HomeApproachProps = {
  locale: Locale;
};

/**
 * Studio principles / pillars from `homePage.approachItems`. Reads the same homePageQuery
 * the other sections fetch — React's request-level cache dedupes, no additional HTTP call.
 *
 * Layout: standard 4|8 spine for the header (mono section label LEFT, serif h2 RIGHT).
 * Items below are a hairline-separated list where each row reuses the same 4|8 split —
 * principle heading aligns under the section label, description aligns under the section
 * h2. That gives a strong two-column editorial rhythm down the section.
 *
 * Returns `null` when no items exist; per-item rows are skipped when both heading and
 * description are empty.
 */
export async function HomeApproach({ locale }: HomeApproachProps) {
  const home = await sanityFetch(homePageQuery);
  const items = home?.approachItems;
  if (!items || items.length === 0) return null;

  const sectionLabel = locale === "ru" ? "Подход" : "Approach";
  const sectionHeading = locale === "ru" ? "Как мы работаем" : "How we work";

  return (
    <section
      aria-labelledby="home-approach-heading"
      className="border-b border-rule"
    >
      <Container className="py-24 md:py-32">
        <div className="md:grid md:grid-cols-12 md:items-baseline md:gap-8">
          <p className="font-mono text-xs uppercase tracking-widest text-ink-muted md:col-span-4 md:pt-3">
            {sectionLabel}
          </p>
          <h2
            id="home-approach-heading"
            className="mt-4 font-serif text-3xl tracking-tight text-ink md:col-span-8 md:mt-0 md:text-4xl lg:text-5xl"
          >
            {sectionHeading}
          </h2>
        </div>

        <ul className="mt-16 border-t border-rule md:mt-24">
          {items.map((item) => {
            const heading = pickLocalized(item.heading, locale);
            const description = pickLocalized(item.description, locale);
            if (!heading && !description) return null;

            return (
              <li key={item._key} className="border-b border-rule">
                <div className="grid grid-cols-1 gap-3 py-8 md:grid-cols-12 md:gap-8 md:py-10">
                  {heading ? (
                    <h3 className="font-serif text-2xl tracking-tight text-ink md:col-span-4 md:text-3xl">
                      {heading}
                    </h3>
                  ) : null}
                  {description ? (
                    <p className="max-w-2xl text-base leading-relaxed text-ink-muted md:col-span-8 md:text-lg">
                      {description}
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
