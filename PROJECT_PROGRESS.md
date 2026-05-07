# FIRFAROV Project Progress

Working journal for the FIRFAROV codebase. Strategic status (Q2 goal,
risks, milestones) lives in Life-OS at `03_Projects/FIRFAROV.md`; this
file is for the operational details — what shipped, what touched, what
broke, how it was verified.

**Always before working:** read `README.md`, `package.json`, this file.
**After every meaningful change:** append to the daily log below.
**Never write secrets, env values, tokens, or anything from `.env.local`.**

## Current Goal

Перестроить сайт под AI implementation studio for SMB. Обновлённый MVP
sitemap: `/`, `/about`, `/services` + 4 AI-сервиса (`ai-audit`,
`ai-agents`, `ai-content-engine`, `company-ai-brain`), `/work` + `/work/[slug]`,
`/insights` + `/insights/[slug]` (вместо `/blog`), `/contact`, `/thank-you`,
legal, `/ru/...` mirror. Технический стек и Sanity schema-каркас остаются;
меняется content + одна home-секция (HomeUseCases вместо HomeFounderMoment).

## Current Status

- Branch: `hero-layout-polish` (PR [#1](https://github.com/Raul9535/firfarov/pull/1) → `main`).
- Last verified: 2026-05-07 — `homePage` singleton наполнен AI-first контентом (heroHeading, heroLead, heroCta, positioningStatement, servicesOverviewIntro, 4 approachItems, 4 useCases, finalCta). selectedWork сброшен к `[]` (нет реальных кейсов). 7 из 8 home-секций теперь рендерят реальный AI-first контент; HomeSelectedWork корректно скрывается до появления кейсов.
- Main blocker: `/blog → /insights` route migration ещё впереди; brand fonts не подключены; case studies в Sanity не созданы.

## Daily Log

### 2026-05-07 — Home page seeded with AI-first content

Goal:
- Populate the `homePage` singleton with AI-implementation-studio copy via an idempotent seed script. After this, the homepage should render real content end-to-end without anyone touching Sanity Studio by hand.

Done:
- Created `scripts/seed-home-page.mjs`. Pattern: `client.transaction().createIfNotExists({_id: "homePage", _type: "homePage"}).patch("homePage", p => p.set({...})).commit()`. This is non-destructive — only fields named in `set` are written; SEO and any future editor-managed fields stay untouched. `createIfNotExists` makes the patch safe on first run.
- Tiny inline constructors (`lt(en, ru)`, `cta(...)`, `ref(id)`) keep the content block readable. Stable `_key` strings (`audit-first`, `tool-agnostic`, `sales`, `operations`, etc.) so re-runs don't fight Studio edits.
- Seeded fields:
  - `heroHeading` — "We build the AI that runs your sales, support, and ops." / RU equivalent.
  - `heroLead` — full positioning paragraph (EN+RU): "FIRFAROV is an AI implementation studio for SMB. We design and ship the agents, automations, content systems, and internal helpers …".
  - `heroCta` — `{ label: "Book an AI audit" / "Заказать AI-аудит", href: "/contact", variant: "primary" }`.
  - `positioningStatement` — "We build the AI systems that help small and mid-sized companies run faster, sell better, and stop drowning in manual work." / RU.
  - `servicesOverviewIntro` — "Four offerings, one through-line — replace manual repetition with AI that runs by itself." / RU.
  - `approachItems` — 4 principles: Audit before build · Tool-stack agnostic · Operator-friendly handover · Weeks, not quarters. Each EN+RU heading + description.
  - `useCases` — 4 cards each with `heading` + `description` + `service` reference: Sales → service-ai-agents · Operations → service-ai-agents · Marketing → service-ai-content-engine · Knowledge → service-company-ai-brain.
  - `finalCta` — "Start with a 30-min AI audit" / "Начните с 30-минутного AI-аудита", `/contact`, primary.
  - `selectedWork: []` — explicitly cleared. A leftover broken ref from earlier experiments was producing `selectedWork.length === 1` with deref→null, which would render an empty card grid under the section header; HomeSelectedWork now correctly returns null.
- Ran the script. First pass also wrote selectedWork = []. Verified.

Changed files:
- `scripts/seed-home-page.mjs` — new.
- `PROJECT_PROGRESS.md` — current status updated; this entry appended.

Decisions:
- `createIfNotExists` + `patch.set` over `createOrReplace`. Non-destructive — preserves any field the editor adds via Studio that the seed doesn't name (already paid off: `seo` was present from a prior session and survived the seed).
- `selectedWork: []` in the seed. Leftover stale refs from experiments needed clearing; the user's explicit instruction was to keep it empty until real cases exist. When real case studies are created, replace this line with refs (or remove it — both work).
- `approachItems` and `useCases` `_key`s are semantic (`audit-first`, `sales`, `marketing`, …) rather than random. Stable across re-runs; if an editor reorders or edits in Studio, re-running the seed still targets the same items by key.
- Russian copy uses Latin "AI" prefix (matches the title convention chosen for services). "Leverage" rendered as "результат / рычаг" depending on context — pragmatic, not literal.

Blockers:
- None on the homepage layer. All visible sections except SelectedWork now have real content.
- HomeSelectedWork still hidden until at least one case study is published. That's a separate seed (or hand-authored content) effort.

Verification:
- Independent verify-fetch through `published` perspective: 9 fields confirmed (`heroHeading`, `heroLead`, `heroCta`, `positioningStatement`, `servicesOverviewIntro`, 4-item `approachItems`, 4-item `useCases`, `finalCta`, `selectedWork: []`). `seo` left intact.
- `homeUseCasesQuery` deref'd correctly: each use case card has `service.slugEn` set ("ai-agents", "ai-content-engine", "company-ai-brain"), matching what HomeUseCases expects to build the link.

Next step:
- `/blog → /insights` route migration. Rename `app/(site)/blog/` and `app/(site)/ru/blog/` to `insights/`, drop the unused `category/[slug]` folder, update the link target inside `HomeLatestThinking` from `/blog/${slug}` to `/insights/${slug}`. Optionally rename the component to `HomeInsights` for symmetry with the URL — it's a polish, not a block. After that the new sitemap is fully reflected in the routes.

### 2026-05-07 — HomeUseCases live, homepage composition updated

Goal:
- Wire the new `HomeUseCases` section end-to-end. Drop `HomeFounderMoment` from the homepage composition (file kept, will move to `/about` later). Page composition shifts from "design-studio with founder note" to "AI-first with concrete use cases".

Done:
- Added `homeUseCasesQuery` to `lib/sanity/queries.ts`. Projects each `useCases[]` item with the optional `service` reference dereffed inline (`service->{ _id, slugEn.current, slugRu.current }`). Same pattern as `homeSelectedWorkQuery` — section gets ready-to-use slugs without a second roundtrip. Returns `Array<{...}> | null`.
- Regenerated typegen (29 schema types + **21** GROQ queries). New `HomeUseCasesQueryResult` re-exported from `lib/sanity/types.ts`.
- Created `components/sections/home/UseCases.tsx`. Async Server Component, follows the established 4|8 spine pattern (mono "Use cases" / "Сценарии" eyebrow LEFT, serif h2 "Where AI actually fits" / "Где AI реально работает" RIGHT). Cards in a 2-column grid below at full width. Cards with `service` reference render as `<Link>` to `/services/[slug]` with hover states + trailing arrow; cards without render as plain `<div>` (no arrow, no hover).
- Updated `app/(site)/page.tsx` and `app/(site)/ru/page.tsx`:
  - Removed `HomeFounderMoment` import + JSX usage.
  - Added `HomeUseCases` import + JSX usage right after `HomeServicesOverview`.
  - File `components/sections/home/FounderMoment.tsx` kept untouched — will migrate to `/about` page later.
- Section count on home stays at 8: Hero / Positioning / SelectedWork / ServicesOverview / **UseCases** / Approach / LatestThinking / FinalCTA.

Changed files:
- `lib/sanity/queries.ts` — new `homeUseCasesQuery`.
- `lib/sanity/types.ts` — re-export `HomeUseCasesQueryResult`.
- `sanity/sanity.types.ts` — regenerated.
- `components/sections/home/UseCases.tsx` — new section component.
- `app/(site)/page.tsx`, `app/(site)/ru/page.tsx` — composition update (FounderMoment out, UseCases in).

Decisions:
- Optional service link in each use-case card: schema makes the reference optional, so cards mix linked and unlinked. Differentiation is subtle — only the linked variants get the trailing arrow + heading hover. Avoided forcing every card to link.
- Dedicated `homeUseCasesQuery` instead of expanding `homePageQuery` with a useCases projection. Same architectural choice as `homeSelectedWorkQuery` — per-section deref queries keep section logic isolated; React still dedups identical queries across sibling sections.
- `HomeFounderMoment` file kept rather than deleted. The component stays available for the `/about` page to reuse later, and removing the file would have been destructive without payoff.

Blockers:
- `homePage.useCases[]` is empty in Sanity. Section returns `null` until at least one item is authored.
- Same prior blockers: rest of `homePage` singleton fields, no case studies, no brand fonts, `/blog → /insights` migration pending.

Verification:
- `npm run sanity:types` clean — `HomeUseCasesQueryResult` shape correct (`Array<{ _key, heading, description, service? } | null>`).
- `npm run typecheck` — clean across all changes.
- Grep confirms no `HomeFounderMoment` references remain in either home page; the file at `components/sections/home/FounderMoment.tsx` is intact.

Next step:
- Author 4 use-case items in `homePage.useCases[]` via Sanity Studio (or via a dedicated `seed-home-page.mjs` script if more efficient). Suggested 4 cards: Sales (→ AI Agents), Operations (→ AI Agents or AI Audit), Marketing (→ AI Content Engine), Knowledge (→ Company AI Brain). Each with heading + description + service reference.
- After that the next code step is `/blog → /insights` route migration: rename `app/(site)/blog/` and `app/(site)/ru/blog/` to `insights/`, update `HomeLatestThinking` link target (and optionally rename the component to `HomeInsights` for consistency with the URL).

### 2026-05-07 — AI-first pivot, services reset

Goal:
- Replace the old design-studio service lineup with the new AI-implementation offering. Reset `service` documents in Sanity to the four canonical AI services. No code changes elsewhere yet — strategic content shift first, frontend follows.

Done:
- Rewrote `scripts/seed-services.mjs`. Now first deletes the legacy design-era docs (`service-ui-ux-design`, `service-ai-for-business`), then creates four AI services via `createOrReplace` with stable `_id`s. Idempotent on both delete (404 / "doesn't exist" treated as desired absent state) and replace.
- Ran the script. Both legacy services removed. Four new services published:
  - `service-ai-audit` — slug `ai-audit` (EN+RU), order 10
  - `service-ai-agents` — slug `ai-agents` (EN+RU), order 20
  - `service-ai-content-engine` — slug `ai-content-engine` (EN+RU), order 30
  - `service-company-ai-brain` — slug `company-ai-brain` (EN+RU), order 40
- Slug strategy: identical Latin slug for both EN and RU — these are international tech terms; same path simplifies sharing, SEO, recall. Schema still permits divergence later if a different RU slug is ever desired.
- First-pass taglines (EN + RU) drafted for each service; flagged in the script as defaults to refine in Studio once final positioning copy lands.
- Verified via published-perspective fetch on the same query `HomeServicesOverview` and `/services` index use (`allServicesQuery` shape): all four come back in correct order, with title + tagline in both locales.

Changed files:
- `scripts/seed-services.mjs` — full rewrite for the new AI lineup.
- `PROJECT_PROGRESS.md` — current goal updated to AI implementation studio framing; current status updated; this entry appended.

Decisions:
- New positioning is `AI implementation studio for SMB`. Sitemap: 4 services (not 5 as originally planned), `/insights` instead of `/blog`, no founder-moment on home, new `HomeUseCases` section to be added.
- Slug naming convention for AI services: same Latin slug across EN and RU. Old design services used different RU transliterations (`ui-ux-dizayn`, `ii-dlya-biznesa`); for AI/tech vocabulary the international form is cleaner.
- Service `_id`s stable per service slug (`service-<slug>`). Re-running the script is safe — `createOrReplace` overwrites in place.
- RU title convention: Latin "AI" prefix, not Cyrillic "ИИ". The new positioning uses "AI" everywhere; matches international tech vocabulary read in Latin form by Russian audiences.

Blockers:
- `homePage` singleton still empty in Sanity. Hero / positioning / approach / final CTA on `/` will stay empty until populated.
- `homePage.useCases[]` schema field doesn't exist yet — needed before `HomeUseCases` component can render anything.
- Frontend still routes `/blog`, not `/insights` — sitemap migration not yet started.

Verification:
- `node scripts/seed-services.mjs` clean: 2 legacy deletes succeed, 4 new createOrReplace succeed.
- Independent verify-fetch through `published` perspective returns all 4 services with `tagline` + `title` in EN+RU and correct `order` (10/20/30/40).
- No unmerged old service IDs left — checked grep on the dataset via the same query.

Next step:
- Add `useCases[]` array field to `homePage` schema in `sanity/schemas/documents/homePage.ts`. Same shape as `approachItems[]` (object array with `heading: localizedText`, `description: localizedText`, plus optional `service: reference` to link a use case to a profile). Max 6 items. Inner required only on heading + description.
- Regenerate types (`npm run sanity:types`).
- Re-export `HomePageQueryResult` is unchanged at the type-level (it's still derived from the same `homePageQuery`), but the new `useCases` field will appear in the generated type automatically.
- Then implement `components/sections/home/UseCases.tsx` and wire into `app/(site)/page.tsx` + `/ru/page.tsx` after `HomeServicesOverview`, removing `HomeFounderMoment` from the page composition (keep the file — it'll move to `/about` later).

### 2026-05-07 — All 8 home sections shipped + Tailwind/token bug fixes

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
