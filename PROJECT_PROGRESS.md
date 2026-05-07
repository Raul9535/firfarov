# FIRFAROV Project Progress

Working journal for the FIRFAROV codebase. Strategic status (Q2 goal,
risks, milestones) lives in Life-OS at `03_Projects/FIRFAROV.md`; this
file is for the operational details — what shipped, what touched, what
broke, how it was verified.

**Always before working:** read `README.md`, `package.json`, this file.
**After every meaningful change:** append to the daily log below.
**Never write secrets, env values, tokens, or anything from `.env.local`.**

## Current Goal

Добить сайт максимально близко к публикации: hero, positioning, CTA,
first cases, build readiness.

## Current Status

- Branch: `hero-layout-polish` (PR [#1](https://github.com/Raul9535/firfarov/pull/1) → `main`).
- Last verified: 2026-05-07 — `npm run typecheck` clean, `npm run build` green, all 8 home sections render.
- Main blocker: Home page singleton + at least one case study not yet authored in Sanity. Brand fonts not wired.

## Daily Log

### 2026-05-07

Goal:
- Focused work day on FIRFAROV. Convert all remaining home-section placeholders to real data-driven sections, unblock services routing, get the page visually presentable end-to-end.

Done:
- Implemented the four remaining home sections as real async Server Components: `HomeSelectedWork`, `HomeServicesOverview`, `HomeFounderMoment`, `HomeApproach`, `HomeFinalCTA`, `HomeLatestThinking`. All eight home sections are now data-driven; no `SectionPlaceholder` references remain in `components/sections/home/`.
- Layout pass on the home: applied a single 4|8 editorial grid spine to every post-hero section (mono section label in `col-span-4` LEFT, content in `col-span-8` RIGHT). `Hero` keeps full breadth as the entrance.
- Services routing: removed 10 hardcoded slug folders left over from the initial scaffold (5 EN + 5 RU under `app/(site)/services/`), replaced with a single dynamic `[slug]/page.tsx` per locale that queries Sanity via `serviceBySlugQuery`. Migrated `/services` and `/ru/services` index pages off the static `config/services.ts` registry onto `sanityFetch(allServicesQuery)`.
- Stylesheet pipeline fix #1: reordered `app/globals.css` so all `@import` statements come first (CSS spec compliant), then `@source` for `components/`, `lib/`, `config/`. Previously `@source` lived between `@import` statements and PostCSS silently dropped them, leaving every utility used only in `components/` un-generated (font-serif, mx-auto, justify-between, etc.).
- Stylesheet pipeline fix #2: renamed `--spacing-site` → `--spacing-gutter` in `styles/tokens.css` to break a Tailwind v4 namespace collision with `--container-site`. Both define the key `site`; in v4 the spacing namespace also feeds `max-w-*`, so `max-w-site` was resolving to `var(--spacing-site)` = 1.5rem — collapsing the Container to 24px wide. Container now uses `max-w-site px-gutter` and resolves correctly to 1280px / 1.5rem.
- Schema: added `homeSelectedWorkQuery` (with `->` deref) and extended `allServicesQuery` with `tagline`. Regenerated typegen — 20 GROQ queries, 29 schema types.
- Seed scripts: `scripts/seed-services.mjs` published two service docs (`service-ui-ux-design`, `service-ai-for-business`) with EN+RU title/slug/tagline. `scripts/seed-blog-posts.mjs` published two blog posts (`blog-ai-as-craft`, `blog-calm-products-loud-market`) with EN+RU title/slug/excerpt and `publishedAt`. Both scripts are idempotent (`createOrReplace` with stable `_id`s).

Changed files:
- `components/sections/home/Hero.tsx`, `Positioning.tsx`, `SelectedWork.tsx`, `ServicesOverview.tsx`, `FounderMoment.tsx`, `Approach.tsx`, `FinalCTA.tsx`, `LatestThinking.tsx`.
- `components/ui/Container.tsx` (`px-site` → `px-gutter`).
- `app/globals.css` (import + source ordering).
- `styles/tokens.css` (renamed `--spacing-site` → `--spacing-gutter`).
- `app/(site)/services/page.tsx`, `app/(site)/ru/services/page.tsx` (rewritten Sanity-driven).
- `app/(site)/services/[slug]/page.tsx`, `app/(site)/ru/services/[slug]/page.tsx` (created).
- Removed 10 directories under `app/(site)/services/` and `app/(site)/ru/services/` (the hardcoded slug folders).
- `lib/sanity/queries.ts`, `lib/sanity/types.ts`, `sanity/sanity.types.ts` (new query + tagline + regen).
- `scripts/seed-services.mjs`, `scripts/seed-blog-posts.mjs` (new).

Decisions:
- Settle on a single 4|8 editorial grid for all post-hero sections. Hero is the only section that breaks the spine, by design — it's the page entrance.
- Section sub-headings ("What we do", "How we work", "Latest thinking", etc.) are inline locale-switched copy in the component, not CMS fields. CMS owns the substantive content (statements, lists, CTAs); the framing labels stay in code so they evolve with layout, not editor whim.
- Token naming: `--container-*` and `--spacing-*` namespaces must use distinct keys, because Tailwind v4's spacing namespace also feeds `max-w-*`. Documented inline in `tokens.css`.
- Working journal lives here in the repo (`PROJECT_PROGRESS.md`); strategic project status stays in Life-OS at `03_Projects/FIRFAROV.md`.

Blockers:
- Home page singleton in Sanity has no content yet (heroHeading, heroLead, heroCta, positioningStatement, founderMomentHeading/Text, approachItems[], finalCta, servicesOverviewIntro). Sections return `null` until populated.
- Zero case studies in Sanity. `HomeSelectedWork` is implemented but invisible until at least one is published.
- Brand fonts not wired through `next/font`. `styles/fonts.css` is empty; typography falls back to system serif/sans/mono — biggest remaining visual gap.

Verification:
- `npm run typecheck` — clean after every change.
- `npm run build` — green; final compiled CSS contains all expected utilities (`grid-cols-12`, `col-span-{4,8}`, `md:py-32`, `lg:py-40`, `bg-canvas`, `text-ink`, `font-serif`, `max-w-site` resolving to 1280px, `px-gutter` resolving to 1.5rem, etc.).
- `grep -L "SectionPlaceholder" components/sections/home/*.tsx` returns nothing — no placeholders left.
- Seeded content verified through a one-shot published-perspective fetch: all 4 docs (2 services + 2 posts) come back via the same queries the live sections use (`allServicesQuery`, `serviceBySlugQuery`, `latestBlogPostsQuery`).
- 6 commits in `hero-layout-polish`: `1c9e37e`, `368cc61`, `ad29f8c`, `d74e11b`, `a463ad6`, `77a3b48`. All pushed to `origin`. PR #1 reflects the latest tip.

Next step:
- Author the Home page singleton in Sanity Studio (8 fields).
- Create the first case study (minimum: title, slugEn, slugRu, publishedAt, heroImage, summary, bodyEn/Ru).
- Wire brand fonts (Inter / Fraunces / JetBrains Mono) via `next/font` and update `styles/fonts.css`.
- Merge PR #1 to `main` and run the first Vercel prod deploy.
- Wire Sentry into `next.config.mjs` and add `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` to environment.
