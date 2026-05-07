import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { Locale } from "@/lib/i18n/config";
import { pickLocalized } from "@/lib/i18n/localize";
import { localizePath } from "@/lib/i18n/routing";
import { sanityFetch } from "@/lib/sanity/fetch";
import { allServicesQuery, homePageQuery } from "@/lib/sanity/queries";

type HomeServicesOverviewProps = {
  locale: Locale;
};

/**
 * Services overview on the homepage. Reads from two sources in parallel:
 *   - `homePageQuery` for the optional `servicesOverviewIntro` paragraph (cached/dedupe with
 *     sibling sections that already fetch the same query — no extra HTTP call).
 *   - `allServicesQuery` for the services list itself, ordered by `order` field.
 *
 * Layout: editorial contents-page rhythm.
 *   - Header sits in the home's 4|8 spine: small mono section label LEFT, h2 + intro RIGHT.
 *   - List rows use a 3-zone flex layout — title (~1/3 width), tagline (flexible middle),
 *     trailing arrow — so each row reads as a confident contents-list line, not a cramped
 *     two-column block on the left of the page.
 *
 * Returns `null` when no services exist.
 */
export async function HomeServicesOverview({ locale }: HomeServicesOverviewProps) {
  const [home, services] = await Promise.all([
    sanityFetch(homePageQuery),
    sanityFetch(allServicesQuery),
  ]);

  if (!services || services.length === 0) return null;

  const sectionLabel = locale === "ru" ? "Услуги" : "Services";
  const sectionHeading = locale === "ru" ? "Что мы делаем" : "What we do";
  const intro = pickLocalized(home?.servicesOverviewIntro, locale);

  return (
    <section
      aria-labelledby="home-services-overview-heading"
      className="border-b border-rule"
    >
      <Container className="py-24 md:py-32">
        <div className="md:grid md:grid-cols-12 md:items-baseline md:gap-8">
          <p className="font-mono text-xs uppercase tracking-widest text-ink-muted md:col-span-4 md:pt-3">
            {sectionLabel}
          </p>
          <div className="mt-4 md:col-span-8 md:mt-0">
            <h2
              id="home-services-overview-heading"
              className="font-serif text-3xl tracking-tight text-ink md:text-4xl lg:text-5xl"
            >
              {sectionHeading}
            </h2>
            {intro ? (
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted md:mt-8 md:text-lg">
                {intro}
              </p>
            ) : null}
          </div>
        </div>

        <ul className="mt-16 border-t border-rule md:mt-24">
          {services.map((service) => {
            const slug = locale === "ru" ? service.slugRu : service.slugEn;
            if (!slug) return null;

            const title = pickLocalized(service.title, locale);
            const tagline = pickLocalized(service.tagline, locale);
            if (!title) return null;

            return (
              <li key={service._id} className="border-b border-rule">
                <Link
                  href={localizePath(`/services/${slug}`, locale)}
                  className="group flex flex-col gap-2 py-6 md:flex-row md:items-baseline md:gap-10 md:py-8"
                >
                  <p className="font-serif text-2xl text-ink transition-colors duration-[var(--duration-fast)] group-hover:text-accent md:basis-1/3 md:flex-shrink-0 md:text-3xl">
                    {title}
                  </p>
                  {tagline ? (
                    <p className="text-base text-ink-muted md:flex-1 md:text-lg">
                      {tagline}
                    </p>
                  ) : (
                    <span aria-hidden className="hidden md:block md:flex-1" />
                  )}
                  <span
                    aria-hidden
                    className="font-mono text-sm text-ink-muted transition-transform duration-[var(--duration-fast)] group-hover:translate-x-1 group-hover:text-ink md:flex-shrink-0"
                  >
                    →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
