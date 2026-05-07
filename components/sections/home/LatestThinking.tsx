import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { Locale } from "@/lib/i18n/config";
import { pickLocalized } from "@/lib/i18n/localize";
import { localizePath } from "@/lib/i18n/routing";
import { sanityFetch } from "@/lib/sanity/fetch";
import { latestBlogPostsQuery } from "@/lib/sanity/queries";

type HomeLatestThinkingProps = {
  locale: Locale;
};

function formatPublishedAt(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}

/**
 * Eighth (and final) real home section. Reads the latest 3 blog posts via
 * `latestBlogPostsQuery` (params `{ limit: 3 }`). Returns `null` when no posts
 * exist, so the section is invisible until blog content is seeded.
 *
 * Layout follows the home's 4|8 editorial spine:
 *   - Header: mono "Writing" / "Блог" eyebrow LEFT, serif h2 RIGHT.
 *   - Items: hairline-separated rows. Each row is itself a 4|8(+1) grid with
 *     post title in col-span-4, date + excerpt in col-span-7, trailing arrow
 *     in col-span-1. Title aligns under the section eyebrow, excerpt under
 *     the section h2 — same double-spine rhythm as Approach.
 *
 * Slug + locale: each post's slug comes from the locale-matching field
 * (`slugRu.current` for RU, `slugEn.current` otherwise). Posts without a
 * slug for the active locale are skipped (can't be linked).
 */
export async function HomeLatestThinking({ locale }: HomeLatestThinkingProps) {
  const posts = await sanityFetch(latestBlogPostsQuery, {
    params: { limit: 3 },
  });
  if (!posts || posts.length === 0) return null;

  const sectionLabel = locale === "ru" ? "Блог" : "Writing";
  const sectionHeading = locale === "ru" ? "Свежие мысли" : "Latest thinking";

  return (
    <section
      aria-labelledby="home-latest-thinking-heading"
      className="border-b border-rule"
    >
      <Container className="py-24 md:py-32">
        <div className="md:grid md:grid-cols-12 md:items-baseline md:gap-8">
          <p className="font-mono text-xs uppercase tracking-widest text-ink-muted md:col-span-4 md:pt-3">
            {sectionLabel}
          </p>
          <h2
            id="home-latest-thinking-heading"
            className="mt-4 font-serif text-3xl tracking-tight text-ink md:col-span-8 md:mt-0 md:text-4xl lg:text-5xl"
          >
            {sectionHeading}
          </h2>
        </div>

        <ul className="mt-16 border-t border-rule md:mt-24">
          {posts.map((post) => {
            const slug = locale === "ru" ? post.slugRu?.current : post.slugEn?.current;
            if (!slug) return null;

            const title = pickLocalized(post.title, locale);
            const excerpt = pickLocalized(post.excerpt, locale);
            const date = post.publishedAt
              ? formatPublishedAt(post.publishedAt, locale)
              : null;

            return (
              <li key={post._id} className="border-b border-rule">
                <Link
                  href={localizePath(`/blog/${slug}`, locale)}
                  className="group block py-8 md:py-10"
                >
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-baseline md:gap-8">
                    <div className="md:col-span-4">
                      {title ? (
                        <h3 className="font-serif text-2xl tracking-tight text-ink transition-colors duration-[var(--duration-fast)] group-hover:text-accent md:text-3xl">
                          {title}
                        </h3>
                      ) : null}
                    </div>
                    <div className="md:col-span-7">
                      {date ? (
                        <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">
                          {date}
                        </p>
                      ) : null}
                      {excerpt ? (
                        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg">
                          {excerpt}
                        </p>
                      ) : null}
                    </div>
                    <span
                      aria-hidden
                      className="hidden font-mono text-sm text-ink-muted transition-transform duration-[var(--duration-fast)] group-hover:translate-x-1 group-hover:text-ink md:col-span-1 md:block md:justify-self-end"
                    >
                      →
                    </span>
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
