import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { Locale } from "@/lib/i18n/config";
import { pickLocalized } from "@/lib/i18n/localize";
import { localizePath } from "@/lib/i18n/routing";
import { sanityFetch } from "@/lib/sanity/fetch";
import { homeUseCasesQuery } from "@/lib/sanity/queries";
import { cn } from "@/lib/utils/cn";

type HomeUseCasesProps = {
  locale: Locale;
};

/**
 * "Where AI actually fits" section. Reads `homePage.useCases[]` via the dedicated
 * `homeUseCasesQuery` which derefs the optional `service` reference in-query — each
 * card receives `slugEn` / `slugRu` directly, no second round-trip.
 *
 * Layout: 4|8 spine for the section header (mono "Use cases" / "Сценарии" eyebrow LEFT,
 * serif h2 RIGHT), then a 2-column card grid below at full width. Cards with a linked
 * service render as Links with hover states + trailing arrow; cards without render as
 * plain divs (no arrow, no hover).
 *
 * Returns `null` when `useCases` is empty or absent — section is invisible until content
 * exists in Sanity.
 */
export async function HomeUseCases({ locale }: HomeUseCasesProps) {
  const items = await sanityFetch(homeUseCasesQuery);
  if (!items || items.length === 0) return null;

  const sectionLabel = locale === "ru" ? "Сценарии" : "Use cases";
  const sectionHeading =
    locale === "ru" ? "Где AI реально работает" : "Where AI actually fits";

  return (
    <section
      aria-labelledby="home-use-cases-heading"
      className="border-b border-rule"
    >
      <Container className="py-24 md:py-32">
        <div className="md:grid md:grid-cols-12 md:items-baseline md:gap-8">
          <p className="font-mono text-xs uppercase tracking-widest text-ink-muted md:col-span-4 md:pt-3">
            {sectionLabel}
          </p>
          <h2
            id="home-use-cases-heading"
            className="mt-4 font-serif text-3xl tracking-tight text-ink md:col-span-8 md:mt-0 md:text-4xl lg:text-5xl"
          >
            {sectionHeading}
          </h2>
        </div>

        <ul className="mt-16 grid gap-x-8 gap-y-12 md:mt-24 md:grid-cols-2 md:gap-y-16">
          {items.map((item) => {
            const heading = pickLocalized(item.heading, locale);
            const description = pickLocalized(item.description, locale);
            if (!heading && !description) return null;

            const slug = locale === "ru" ? item.service?.slugRu : item.service?.slugEn;
            const href = slug ? localizePath(`/services/${slug}`, locale) : null;

            const card = (
              <>
                {heading ? (
                  <h3
                    className={cn(
                      "font-serif text-2xl tracking-tight text-ink md:text-3xl",
                      href &&
                        "transition-colors duration-[var(--duration-fast)] group-hover:text-accent",
                    )}
                  >
                    {heading}
                  </h3>
                ) : null}
                {description ? (
                  <p className="mt-3 max-w-prose text-base leading-relaxed text-ink-muted md:mt-4 md:text-lg">
                    {description}
                  </p>
                ) : null}
                {href ? (
                  <span
                    aria-hidden
                    className="mt-6 inline-block font-mono text-sm text-ink-muted transition-transform duration-[var(--duration-fast)] group-hover:translate-x-1 group-hover:text-ink md:mt-8"
                  >
                    →
                  </span>
                ) : null}
              </>
            );

            return (
              <li key={item._key}>
                {href ? (
                  <Link href={href} className="group block">
                    {card}
                  </Link>
                ) : (
                  <div>{card}</div>
                )}
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
