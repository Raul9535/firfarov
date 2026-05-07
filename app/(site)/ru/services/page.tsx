import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { Locale } from "@/lib/i18n/config";
import { pickLocalized } from "@/lib/i18n/localize";
import { localizePath } from "@/lib/i18n/routing";
import { sanityFetch } from "@/lib/sanity/fetch";
import { allServicesQuery } from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/seo/metadata";

const locale: Locale = "ru";

export const metadata: Metadata = buildMetadata({
  locale,
  path: "/services",
  title: "Услуги — FIRFAROV",
});

/**
 * RU mirror of the services index. Same data path as EN but links via `slugRu` so each
 * row points at /ru/services/[slugRu] — matches what the RU dynamic service-detail route
 * looks up.
 */
export default async function ServicesIndexPageRu() {
  const services = await sanityFetch(allServicesQuery);

  return (
    <article>
      <section className="border-b border-rule">
        <Container className="py-24 md:py-32 lg:py-40">
          <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">
            Услуги
          </p>
          <h1 className="mt-4 max-w-5xl text-balance font-serif text-5xl leading-[1.05] tracking-tight text-ink md:text-6xl lg:text-7xl">
            Что мы делаем
          </h1>
        </Container>
      </section>

      <section>
        <Container className="py-16 md:py-24">
          {services && services.length > 0 ? (
            <ul className="border-t border-rule">
              {services.map((service) => {
                const slug = service.slugRu;
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
          ) : (
            <p className="text-base text-ink-muted">
              Список услуг пока пуст.
            </p>
          )}
        </Container>
      </section>
    </article>
  );
}
