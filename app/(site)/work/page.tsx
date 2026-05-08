import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { Locale } from "@/lib/i18n/config";
import { pickLocalized } from "@/lib/i18n/localize";
import { localizePath } from "@/lib/i18n/routing";
import { sanityFetch } from "@/lib/sanity/fetch";
import { urlForImage } from "@/lib/sanity/image";
import { workIndexQuery } from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/seo/metadata";

const locale: Locale = "en";

export const metadata: Metadata = buildMetadata({
  locale,
  path: "/work",
  title: "Work — FIRFAROV",
});

/**
 * EN /work index. Reads all linkable case studies (both EN and RU slugs filled)
 * via `workIndexQuery`, ordered newest first. Each card mirrors the home page's
 * `HomeSelectedWork` shape: optional hero image → mono client label → serif
 * title → muted summary, the whole thing wrapped in a Link to /work/[slug].
 */
export default async function WorkIndexPage() {
  const items = await sanityFetch(workIndexQuery);

  return (
    <article>
      <section className="border-b border-rule">
        <Container className="py-24 md:py-32 lg:py-40">
          <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">
            Work
          </p>
          <h1 className="mt-4 max-w-5xl text-balance font-serif text-5xl leading-[1.05] tracking-tight text-ink md:text-6xl lg:text-7xl">
            Real AI implementations with measurable outcomes.
          </h1>
        </Container>
      </section>

      <section>
        <Container className="py-16 md:py-24">
          {items && items.length > 0 ? (
            <ul className="grid gap-12 md:grid-cols-2 md:gap-x-10 md:gap-y-20">
              {items.map((item) => {
                const slug = item.slugEn;
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

                      <div className={imageSrc ? "mt-6" : ""}>
                        {client ? (
                          <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">
                            {client}
                          </p>
                        ) : null}
                        {title ? (
                          <h2 className="mt-2 font-serif text-2xl text-ink transition-colors duration-[var(--duration-fast)] group-hover:text-accent md:text-3xl">
                            {title}
                          </h2>
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
          ) : (
            <p className="text-base text-ink-muted">
              No case studies have been published yet.
            </p>
          )}
        </Container>
      </section>
    </article>
  );
}
