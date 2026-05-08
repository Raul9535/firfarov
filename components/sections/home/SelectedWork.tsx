import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { Locale } from "@/lib/i18n/config";
import { pickLocalized } from "@/lib/i18n/localize";
import { localizePath } from "@/lib/i18n/routing";
import { sanityFetch } from "@/lib/sanity/fetch";
import { urlForImage } from "@/lib/sanity/image";
import { homeSelectedWorkQuery } from "@/lib/sanity/queries";

type HomeSelectedWorkProps = {
  locale: Locale;
};

/**
 * Featured case studies on the homepage. Layout follows the home's 4|8 editorial spine for
 * the section header, then breaks out to a full-width 2-column card grid for the work itself
 * — cards need real width to read as work, not as a narrow column of thumbnails.
 *
 * The query derefs each `selectedWork[]` reference in-place so the section receives typed
 * case-study fields directly, no second roundtrip per card.
 *
 * Cards: hero image (aspect 4:3) → mono client label → serif title → muted summary, the
 * whole card is a single Link to /work/[slug] in the right locale. Items without a slug
 * for the current locale are skipped. Section returns null when selectedWork is empty.
 */
export async function HomeSelectedWork({ locale }: HomeSelectedWorkProps) {
  const items = await sanityFetch(homeSelectedWorkQuery);
  if (!items || items.length === 0) return null;

  const sectionLabel = locale === "ru" ? "Кейсы" : "Work";
  const sectionHeading = locale === "ru" ? "Избранные кейсы" : "Selected work";

  return (
    <section
      aria-labelledby="home-selected-work-heading"
      className="border-b border-rule"
    >
      <Container className="py-24 md:py-32">
        <div className="md:grid md:grid-cols-12 md:items-baseline md:gap-8">
          <p className="font-mono text-xs uppercase tracking-widest text-ink-muted md:col-span-4 md:pt-3">
            {sectionLabel}
          </p>
          <h2
            id="home-selected-work-heading"
            className="mt-4 font-serif text-3xl tracking-tight text-ink md:col-span-8 md:mt-0 md:text-4xl lg:text-5xl"
          >
            {sectionHeading}
          </h2>
        </div>

        <ul className="mt-16 grid gap-12 md:mt-24 md:grid-cols-2 md:gap-x-10 md:gap-y-20">
          {items.map((item) => {
            const slug = locale === "ru" ? item.slugRu : item.slugEn;
            if (!slug) return null;

            const title = pickLocalized(item.title, locale);
            const client = pickLocalized(item.client, locale);
            const summary = pickLocalized(item.summary, locale);
            const altText = pickLocalized(item.heroImage?.alt, locale) || title;
            const imageSrc = item.heroImage?.image
              ? urlForImage(item.heroImage.image).url()
              : null;

            return (
              <li key={item._id}>
                <Link
                  href={localizePath(`/work/${slug}`, locale)}
                  className="group block"
                >
                  {imageSrc ? (
                    <div className="relative aspect-[4/3] overflow-hidden bg-rule">
                      <Image
                        src={imageSrc}
                        alt={altText || ""}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out-soft)] group-hover:scale-[1.02]"
                      />
                    </div>
                  ) : null}

                  <div className="mt-6">
                    {client ? (
                      <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">
                        {client}
                      </p>
                    ) : null}
                    {title ? (
                      <h3 className="mt-2 font-serif text-2xl text-ink transition-colors duration-[var(--duration-fast)] group-hover:text-accent md:text-3xl">
                        {title}
                      </h3>
                    ) : null}
                    {summary ? (
                      <p className="mt-3 max-w-prose text-base text-ink-muted">
                        {summary}
                      </p>
                    ) : null}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
