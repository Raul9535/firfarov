import { Container } from "@/components/ui/Container";
import type { Locale } from "@/lib/i18n/config";
import { pickLocalized } from "@/lib/i18n/localize";
import { sanityFetch } from "@/lib/sanity/fetch";
import { homePageQuery } from "@/lib/sanity/queries";

type HomePositioningProps = {
  locale: Locale;
};

/**
 * Second real home section. Reads the `positioningStatement` field off the same `homePage`
 * document HomeHero uses — React's request-level cache dedupes the `sanityFetch(homePageQuery)`
 * call, so no duplicate HTTP request is made within a single render.
 *
 * The statement is rendered as a calm editorial block: serif type, generous vertical rhythm,
 * no decorative chrome. If the field is empty, the whole section is skipped (returns null)
 * rather than showing a placeholder — matches the brand's "calm, not flashy" direction.
 */
export async function HomePositioning({ locale }: HomePositioningProps) {
  const home = await sanityFetch(homePageQuery, { tags: ["homePage"] });
  const statement = pickLocalized(home?.positioningStatement, locale);

  if (!statement) return null;

  return (
    <section aria-labelledby="home-positioning-heading" className="border-b border-rule">
      <Container className="py-24 md:py-40">
        <h2
          id="home-positioning-heading"
          className="max-w-4xl font-serif text-3xl leading-[1.15] text-ink md:text-5xl md:leading-[1.1]"
        >
          {statement}
        </h2>
      </Container>
    </section>
  );
}
