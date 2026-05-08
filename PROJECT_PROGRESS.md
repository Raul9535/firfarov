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
- Last verified: 2026-05-08 — `npm run typecheck` clean, `npm run build` green. Главная: все 8 секций реальные. Service detail (EN+RU): 5 MVP-секций × 4 сервиса. Work pages (EN+RU): index + detail data-driven (2 cases). About (EN+RU): 5 MVP-секций data-driven (Hero / Founder / How we work / Expertise / Final CTA), author seeded. **`/blog → /insights` migration done** — `/insights` + `/ru/insights` + `[slug]` для обоих локалей зарегистрированы; старые `/blog/*` папки удалены вместе с `category/[slug]`.
- Main blocker: launch-polish pass впереди — brand fonts не подключены; реальные изображения (heroImage на cases, photo на author) не загружены; финальный copy pass + SEO/meta cleanup; merge в main.

## Daily Log

### 2026-05-08 — /blog → /insights route migration

Goal:
- Bring routing in line with the AI-first sitemap. Move `/blog` and `/ru/blog` to `/insights` and `/ru/insights`. Drop the unused `category/[slug]` route — out of MVP scope. Update every internal link that pointed at `/blog/...`. Stay routing + links only — no schema changes, no data refactor.

Done:
- Created `app/(site)/insights/page.tsx`, `app/(site)/insights/[slug]/page.tsx`, `app/(site)/ru/insights/page.tsx`, `app/(site)/ru/insights/[slug]/page.tsx`. Same placeholder shape as the previous `/blog` files (Container + eyebrow + h1 + lead paragraph), but with corrected `path` for `buildMetadata`, EN titles "Insights — FIRFAROV", RU title "Заметки — FIRFAROV", and locale-appropriate eyebrow/heading copy ("Insights" / "Заметки", "Insight" / "Заметка" on detail). When the Portable Text renderer arrives the index + detail pages get the real Sanity-driven content layer; for now they keep the placeholder posture so the migration ships independently of body rendering.
- `git rm -r app/(site)/blog app/(site)/ru/blog` — removed all six old files (index + [slug] + category/[slug] for both locales).
- `components/sections/home/LatestThinking.tsx`:
  - Link target `localizePath(\`/blog/${slug}\`, locale)` → `localizePath(\`/insights/${slug}\`, locale)`.
  - Section eyebrow EN "Writing" → "Insights"; RU "Блог" → "Заметки". Section h2 ("Latest thinking" / "Свежие мысли") unchanged — that's section copy, not URL framing.
- `config/navigation.ts`:
  - Header nav item `{ href: "/blog", key: "blog" }` → `{ href: "/insights", key: "insights" }`. Header + footer pull from `primaryNavItems`, so this single change cascades to both via `SiteHeader.tsx` (the only consumer; `SiteFooter` doesn't import the array).
- Dictionaries `lib/i18n/dictionaries/{en,ru}.ts`:
  - Renamed nav key `blog` → `insights`. EN label "Blog" → "Insights"; RU "Блог" → "Заметки". `Dictionary` type is derived from `en` (`typeof en`) — both locales now agree on the new key without an explicit type rename.
- `app/sitemap.ts`:
  - `staticPaths` entry "/blog" → "/insights". Updated trailing TODO to reference `/insights/[slug]` and note categories are out of MVP scope.
- `scripts/seed-blog-posts.mjs`:
  - Comment-only update — slug intent now reads "what /insights/[slug] would resolve under each locale" with a note that the document type stays `blogPost`. No script behaviour change.
- Sanity schemas (`blogPost`, `blogIndexPage`, `blogCategory`) intentionally left untouched — per scope: routing + links only, document types are data-model identifiers, not URLs.

Changed files:
- `app/(site)/insights/page.tsx` — new (EN index).
- `app/(site)/insights/[slug]/page.tsx` — new (EN detail placeholder).
- `app/(site)/ru/insights/page.tsx` — new (RU index).
- `app/(site)/ru/insights/[slug]/page.tsx` — new (RU detail placeholder).
- `app/(site)/blog/**` — removed (3 files).
- `app/(site)/ru/blog/**` — removed (3 files).
- `components/sections/home/LatestThinking.tsx` — link + eyebrow updates.
- `config/navigation.ts` — nav item href + key.
- `lib/i18n/dictionaries/en.ts` — `nav.blog` → `nav.insights` + label.
- `lib/i18n/dictionaries/ru.ts` — `nav.blog` → `nav.insights` + label.
- `app/sitemap.ts` — staticPaths entry + TODO comment.
- `scripts/seed-blog-posts.mjs` — comment update only.
- `PROJECT_PROGRESS.md` — current status updated; this entry appended.

Decisions:
- Routing scope only. Sanity document types (`blogPost`, `blogIndexPage`, `blogCategory`) keep their names — they're data-model identifiers, not URLs. Renaming would force a typegen regen + every existing seeded `blogPost` doc to migrate. Not in scope, not necessary for the URL change.
- Renamed dictionary key `blog` → `insights`. The key is a structural i18n identifier; pairing it with a route called `insights` keeps lookups self-documenting (`dict.nav.insights` for the link to `/insights`). Touched 3 files (navigation + en/ru), no Dictionary type rebuild needed since `Dictionary = typeof en`.
- Placeholder pages, not Sanity-driven detail. `/insights` and `/insights/[slug]` keep the same placeholder posture as the old `/blog` files until the Portable Text renderer is wired. That's a separate (deferred) effort and would have bloated this migration. Comment in the EN detail page still references `blogPostBySlugQuery` so the wiring path is clear when the renderer lands.
- `category/[slug]` dropped, not stubbed. The category route was placeholder-only (no taxonomy navigation rendered anywhere) and AI-first content strategy doesn't lean on category browsing. The `blogCategory` schema stays — if categories return as a feature, they're cheap to re-introduce.
- `LatestThinking` section h2 ("Latest thinking" / "Свежие мысли") kept. The section's purpose ("recently published thinking") doesn't change with the URL; only the URL-adjacent eyebrow ("Writing" / "Блог") was reframed to match the new label vocabulary.
- Comment polish in the seed script but no schema-comment polish (`blogPost.ts` etc. still mention `/blog/[slug]` in their doc strings). Documentation drift inside Sanity schemas is low-priority and changing those would invite "while we're here" temptation; leave for a deliberate sweep.

Blockers:
- None on the routing layer. AI-first sitemap is now fully reflected in the routes (`/`, `/about`, `/services` + 4 services, `/work` + `/work/[slug]`, `/insights` + `/insights/[slug]`, `/contact`, `/thank-you`, legal, `/ru/...` mirror).
- Launch-polish queue (after this migration): brand fonts, founder photo upload, real heroImage uploads on case studies, final copy pass, SEO/meta cleanup, sitemap dynamic-slug enrichment, merge PR #1 to main.

Verification:
- `npm run typecheck` clean (after `rm -rf .next` to drop stale generated route types from before the rename).
- `npm run build` green. Route table now includes:
  - `/insights`, `/insights/[slug]`, `/ru/insights`, `/ru/insights/[slug]` ✓
  - `/blog` and any `/blog/*` no longer present ✓
  - All other existing routes preserved (work, services, about, etc.).
- Grep: `grep -rn "/blog\b" --include="*.ts" --include="*.tsx"` excluding worktrees + node_modules returns nothing in active route/component files. Remaining matches are doc comments inside Sanity schemas (`blogPost.ts`, `blogIndexPage.ts`, `blogCategory.ts`) — left alone per "no schema refactor".
- `HomeLatestThinking` href confirmed via grep: `localizePath(\`/insights/${slug}\`, locale)`.
- Header nav rendered through `primaryNavItems` from `config/navigation.ts`; the single nav entry now points at `/insights`.

Next step:
- Launch-polish pass — architecture-stable, no more sitemap shifts. Suggested order:
  1. Brand fonts via `next/font` (Inter / Fraunces / JetBrains Mono); update `styles/fonts.css`. Biggest visual lift remaining.
  2. Founder photo upload via Studio; tighten founder bio copy.
  3. Case-study heroImage uploads (both seeded cases).
  4. Final copy pass — pick a quiet hour, read every section out loud, ship the diff in one commit.
  5. SEO / meta cleanup — confirm `globalSettings.defaultSeo` covers fallbacks; sweep page-level `buildMetadata` calls.
  6. Sitemap dynamic-slug enrichment — extend `app/sitemap.ts` with `/work/[slug]` + `/insights/[slug]` from `allCaseStudySlugsQuery` + `allBlogPostSlugsQuery`.
  7. Merge PR #1 → `main`, run first Vercel prod deploy.

### 2026-05-08 — About page: AI-first MVP

Goal:
- Move /about and /ru/about from the SectionStack placeholder to a real, AI-first About surface. Seed the founder author + the aboutPage singleton so the page lights up immediately. Stay inside the existing Sanity data model — no schema changes, no extra refactor, no Portable Text renderer dependency.

Done:
- Extended `aboutPageQuery` in `lib/sanity/queries.ts` with an inline deref on the `founder` reference (`founder->{ _id, name, role, bio, photo }`). The spread `...` keeps every other aboutPage field intact, so future fields (SEO, teamSummary, the Portable Text bodies) flow through unchanged. Regenerated typegen — 29 schema types + 22 GROQ queries; `AboutPageQueryResult.founder` is now a typed object instead of a bare reference.
- Rewrote `app/(site)/about/page.tsx` (EN) and `app/(site)/ru/about/page.tsx` (RU mirror) from a SectionStack placeholder into a 5-section AI-first MVP:
  1. Hero — `heroStatement` rendered at page-hero scale (`max-w-5xl`, `text-4xl → text-6xl` serif, balanced).
  2. Founder — 4|8 spine (mono "Founder" / "Основатель" eyebrow LEFT, content RIGHT). Optional photo (4:5, `max-w-sm`) above name (display serif h2) + role (mono uppercase) + bio (lead muted).
  3. How we work — 4|8 spine, eyebrow "How we work" / "Как мы работаем" LEFT; `principles[]` as a hairline-separated list in `col-span-8` — heading (display serif h3) + description (muted lead).
  4. Expertise — 4|8 spine, eyebrow "Expertise" / "Экспертиза" LEFT; `expertiseAreas[]` as a 2-column serif grid in `col-span-8`.
  5. Final CTA — 4|8 spine, eyebrow "Get started" / "Начать" LEFT; size="lg" Button driven by `aboutPage.finalCta` RIGHT.
  Each section returns null when its source field is empty, so a half-filled aboutPage still renders cleanly.
- Created `scripts/seed-about-page.mjs`. One atomic transaction:
  - `createIfNotExists` on the author doc (`author-vlad-firfarov`, `_type: "author"`, `name`).
  - `createIfNotExists` on the aboutPage singleton.
  - `patch.set` on the author with `name`, `role`, `bio` (EN+RU).
  - `patch.set` on aboutPage with `heroStatement`, `founder` reference, 4 `principles[]`, 6 `expertiseAreas[]`, `finalCta`.
  Non-destructive: `patch.set` only writes the named fields; SEO, teamSummary, Portable Text bodies, anything else the editor adds via Studio survives a re-run. Stable `_key`s on every array item (`beyond-prompting`, `outcome-over-output`, `author-led`, `honest-scope`, `exp-1`…`exp-6`).
- Seeded content:
  - `heroStatement` — "FIRFAROV is an author-led AI implementation studio — built for the small and mid-sized businesses that need real systems, not pilots." / RU mirror.
  - 4 principles: We build systems, not prompts · Outcome over output · Author-led, not relay-race · Honest scope. Each EN+RU heading + description.
  - 6 expertiseAreas: Sales agents and lead-qualification flows · Support automation and ticket triage · Content production systems · Internal AI knowledge bases (RAG, semantic search) · Operations workflow automation (n8n, Make, custom) · AI audit and roadmap design.
  - `finalCta` — "Book an AI audit" / "Заказать AI-аудит", `/contact`, primary.
  - Founder: name "Vlad Firfarov", role "Founder" / "Основатель", bio paragraph (EN+RU) — placeholder copy flagged for refinement.
- Founder photo intentionally not seeded. Sanity image upload via API would need either `dangerouslyAllowSVG` on the schema or a raster encoder dependency. Page handles the missing photo gracefully (text-only founder block); upload via Studio when ready.

Changed files:
- `lib/sanity/queries.ts` — `aboutPageQuery` extended with inline founder deref.
- `sanity/sanity.types.ts` — regenerated; `AboutPageQueryResult.founder` typed.
- `scripts/seed-about-page.mjs` — new (author + aboutPage in one transaction).
- `app/(site)/about/page.tsx` — full rewrite from SectionStack placeholder to 5-section MVP.
- `app/(site)/ru/about/page.tsx` — RU mirror with localized eyebrows.
- `PROJECT_PROGRESS.md` — current status updated; this entry appended.

Decisions:
- Stay inside the current schema. The aboutPage singleton already has heroStatement, founder ref, principles[], expertiseAreas[], finalCta — exactly the shape the AI-first MVP needs. No schema migration, no new fields. Portable Text bodies (`whatItIsEn/Ru`, `howWeWorkEn/Ru`) and `teamSummary` deferred — heroStatement + principles cover the same conceptual ground for now.
- Patch.set + `createIfNotExists` over `createOrReplace` for the seed. Same posture as `seed-home-page.mjs` (non-destructive). Author + aboutPage both go through this pattern; editor edits in Studio outside the seeded fields survive future re-runs.
- Single transaction wrapping both upserts + both patches. Either both succeed or neither does — avoids the half-state of "author exists but aboutPage missing the reference".
- Section eyebrows ("Founder", "How we work", "Expertise", "Get started" + RU equivalents) live in code, not the schema. Same convention as homepage and service-detail eyebrows — framing labels evolve with layout, not editor whim.
- Same data path on EN and RU pages. `aboutPageQuery` is locale-agnostic; only the picked text differs (`pickLocalized(field, locale)` per page). Cuts the second roundtrip and keeps the two mirrors in lockstep.
- Founder photo handling: skip in seed, render conditionally. The schema makes `photo` optional and the page checks `founder.photo?.image` before invoking `urlForImage`. No null-pointer noise on the published page.

Blockers:
- /about now data-driven, no blockers on this page.
- Founder photo is missing — text-only founder block until uploaded via Studio.
- `/blog → /insights` route migration still pending — last big AI-first sitemap structural change before launch.
- Brand fonts still on system fallbacks; real heroImage on case studies still missing.

Verification:
- `npm run typecheck` clean after page rewrites + typegen regen.
- `node scripts/seed-about-page.mjs` ran clean — transaction committed.
- Independent verify-fetch through `published` perspective on `aboutPageQuery`:
  - `heroStatement` present (EN+RU).
  - `founder` deref'd inline → `{ name: "Vlad Firfarov", role.en: "Founder", bio: <paragraph>, photo: absent }`.
  - `principles.length === 4`, all with EN+RU heading + description, stable `_key`s.
  - `expertiseAreas.length === 6`, all localized, stable `_key`s.
  - `finalCta`: label "Book an AI audit" / "Заказать AI-аудит", href `/contact`, variant `primary`.
- Pages will resolve at `/about` and `/ru/about` with all 5 sections populated except the founder photo.

Next step:
- `/blog → /insights` route migration. Rename `app/(site)/blog/` and `app/(site)/ru/blog/` to `insights/`, drop the unused `category/[slug]` folder, update the link target inside `HomeLatestThinking` from `/blog/${slug}` to `/insights/${slug}`. Optionally rename `HomeLatestThinking` → `HomeInsights` for symmetry. After that the AI-first sitemap is fully reflected in the routes.
- Adjacent polish: upload founder photo via Studio; tighten the founder bio copy with real launch positioning; add Portable Text renderer (e.g. `@portabletext/react`) if /about, blog detail, or case-study detail need long-form narrative.

### 2026-05-07 — Case studies / work: AI-first MVP

Goal:
- Move /work and /work/[slug] from approved-section placeholder lists to real proof-driven case-study rendering. Seed two anonymized AI implementation cases so both pages — and HomeSelectedWork on the homepage — light up immediately.

Done:
- Added `workIndexQuery` to `lib/sanity/queries.ts` — selects all case studies with both EN and RU slugs filled, ordered newest first, projected to the same shape `homeSelectedWorkQuery` uses (id, title, client, summary, slugEn/Ru, publishedAt, heroImage). Re-exported `WorkIndexQueryResult` from `lib/sanity/types.ts`. Typegen regenerated to 22 GROQ queries.
- Rewrote `app/(site)/work/page.tsx` and the RU mirror. Hero (page-level h1 + eyebrow) + 2-column card grid. Each card mirrors `HomeSelectedWork` exactly so home and index render through the same visual language. Empty state: "No case studies have been published yet." / "Кейсы пока не опубликованы."
- Rewrote `app/(site)/work/[slug]/page.tsx` and the RU mirror. 4-section detail composition, all in the project's 4|8 spine:
  1. Hero — client (mono) + title (display serif) + summary (lead) + optional heroImage (16:9, full container width).
  2. At a glance — `<dl>` of 5 label/value pairs in a 2-column sub-grid (4|8 spine, eyebrow "At a glance" / "В двух словах" LEFT, dl in col-span-8).
  3. Outcomes — hairline-separated list of metric (display serif, text-3xl→text-5xl) + description (muted) rows.
  4. Final CTA — eyebrow "Get started" / "Начать" + size="lg" Button driven by `caseStudy.finalCta`.
  Each section returns null when its source field is empty. Richer Portable Text body fields (bodyEn, keyDecisions, founderNote, related services, next case) deferred — kept off the MVP surface until Portable Text rendering is in real use.
- Created `scripts/seed-case-studies.mjs`. Two anonymized composite cases with full MVP shape:
  - `case-ai-lead-triage-saas` — "AI lead triage cut sales follow-up time 6× at a 30-person B2B SaaS" / RU. atAGlance × 5 (Client, Industry, Stack, Timeline, Headline outcome), outcomes × 3 (12 min → 30 sec; +22% conversion; 0 missed leads), Final CTA "Start your project". Linked to services: ai-agents, ai-audit.
  - `case-company-ai-brain-agency` — "Slack-native AI brain replaced 30 weekly knowledge questions at a 20-person agency" / RU. atAGlance × 5, outcomes × 3 (30+ → 0; <2 sec response; 5d → 1d onboarding), Final CTA. Linked to service: company-ai-brain.
  Stable `_key`s on every array item so re-running the seed updates items in place.
- Cleanup: discovered an orphan caseStudy doc (`b1d48b3d-...`, title "1", slugs "1"/"1") from earlier experiments that was satisfying schema validation and would have appeared as a third broken card on /work. Added an explicit `ORPHAN_CASE_STUDY_IDS` cleanup list to the seed (mirrors the pattern in seed-services.mjs). Ran the seed; orphan deleted.
- Wired both case studies into `homePage.selectedWork` directly from the same script via `transaction().createIfNotExists("homePage").patch("homePage", p => p.set({ selectedWork: [refs] }))`. Non-destructive — only the `selectedWork` field is replaced; everything else on homePage is preserved.
- heroImage left empty in seed across both cases. Sanity image upload via API would need either SVG (requires Next `dangerouslyAllowSVG`) or a raster encoder dependency. Pages handle missing image gracefully; cards render text-only. User uploads real case-study imagery via Studio when ready. Documented in seed script.

Changed files:
- `lib/sanity/queries.ts` — new workIndexQuery.
- `lib/sanity/types.ts` — re-export WorkIndexQueryResult.
- `sanity/sanity.types.ts` — regenerated.
- `app/(site)/work/page.tsx`, `app/(site)/ru/work/page.tsx` — rewrite from placeholder to Sanity-driven index.
- `app/(site)/work/[slug]/page.tsx`, `app/(site)/ru/work/[slug]/page.tsx` — rewrite from SectionStack to real 4-section detail.
- `scripts/seed-case-studies.mjs` — new (also patches homePage.selectedWork).
- `PROJECT_PROGRESS.md` — current status updated; this entry appended.

Decisions:
- Same projection shape for `workIndexQuery` and `homeSelectedWorkQuery` (deref'd or selected fields are identical). The two render through `HomeSelectedWork` and `/work` cards, which use the same field reads. Trade-off: small duplication in queries; benefit: each section explicit about its data needs, no shared-cache surprise.
- Two anonymized composite cases instead of one. Two cards in a 2-col grid look intentional; one looks unfinished. The cases are clearly composite and will be replaced when a real engagement is ready to publish.
- Case-study detail MVP stops at 4 sections (Hero, At a glance, Outcomes, Final CTA). The schema has more (bodyEn/Ru Portable Text, keyDecisions, founderNote, relatedServices, nextCaseStudy) but rendering Portable Text needs a renderer dependency we haven't wired. Adding now would be premature; defer until a real case demands the longer-form narrative.
- Orphan cleanup pattern: explicit ID list, never bulk-delete by query. Bulk-delete-by-query in a seed script is too easy to misuse; named IDs make the script auditable.
- The seed script is the source of truth for these two cases. `createOrReplace` overwrites Studio edits on re-run — same posture as `seed-services.mjs`. If editor edits start to accumulate, switch to the patch.set pattern from `seed-home-page.mjs`.

Blockers:
- /about still a placeholder.
- /blog → /insights route migration still pending.
- Real heroImage uploads pending — text-only cards work but visual richness is missing.

Verification:
- `npm run typecheck` clean after all four page rewrites.
- Independent verify-fetch through `published` perspective on three queries:
  - `workIndexQuery` returns 2 case studies (orphan removed).
  - `homeSelectedWorkQuery` returns 2 case studies, both with client + summary populated. **HomeSelectedWork on the homepage no longer hidden.**
  - `caseStudyBySlugQuery` resolves all 4 slug × locale combinations: en/ai-lead-triage-saas, ru/ai-triazh-lidov-saas, en/company-ai-brain-agency, ru/ai-mozg-agentstva. Each returns full doc with atAGlance × 5, outcomes × 3, finalCta filled.

Next step:
- /about MVP. The schema's aboutPage singleton has hero, founder ref, what-it-is body PT, how-we-work body PT, principles[], expertiseAreas[], teamSummary, finalCta. For AI-first MVP a 5-section page is enough: Hero (heroStatement) → What FIRFAROV is (could fold into hero or use principles[] as the next section) → Founder (move HomeFounderMoment-style block here, fed by aboutPage.founder ref → author doc) → Principles → Final CTA. Likely needs an `author` seed too if we want a real founder card.
- After /about, `/blog → /insights` route migration becomes the last big structural change before launch.

### 2026-05-07 — Service detail pages: AI-first MVP

Goal:
- Move /services/[slug] from "title + tagline + optional positioning" to a presentable 5-section MVP, then seed all four AI services with that content surface so the pages are immediately client-showable.

Done:
- Rewrote `app/(site)/services/[slug]/page.tsx` (EN) and `app/(site)/ru/services/[slug]/page.tsx` (RU mirror). Composition:
  1. Hero — title + tagline at page-hero scale (max-w-5xl, text-5xl → text-7xl serif).
  2. Positioning — single statement in 4|8 spine ("Positioning" / "Позиционирование" eyebrow LEFT, serif statement RIGHT).
  3. Who it's for — bullet list of audience markers, hairline-separated, in 4|8 spine ("Who it's for" / "Для кого" eyebrow LEFT, list RIGHT).
  4. What's included — same shape as Who it's for, eyebrow "What's included" / "Что входит".
  5. Final CTA — 4|8 spine, eyebrow "Get started" / "Начать", Button at size="lg".
- Every section returns null when its source field is empty, so a half-filled service still renders cleanly (no empty rails or section-headers without bodies).
- Slug + locale routing, generateMetadata, notFound() — all unchanged from prior MVP.
- Extended `scripts/seed-services.mjs`. Each of the four services now ships with positioning, whoItsFor[] (3–4 items), whatsIncluded[] (5 items), and finalCta. Stable `_key`s on every array item ("audience-1", "included-1", etc.) so editor edits in Studio survive a re-run rather than getting overwritten by name. Tiny `lt` / `ltKey` / `cta` constructors keep the content block readable.
- Ran the script. Legacy docs already gone; four AI services replaced with the full MVP surface. Verified through a published-perspective fetch — every service has positioning, the right whoItsFor / whatsIncluded counts, and a finalCta with label + href + variant.

Changed files:
- `app/(site)/services/[slug]/page.tsx` — 3 new sections + Final CTA wired (was 2-section MVP).
- `app/(site)/ru/services/[slug]/page.tsx` — RU mirror with localized eyebrows.
- `scripts/seed-services.mjs` — content for positioning + whoItsFor + whatsIncluded + finalCta per service; small `lt`/`ltKey`/`cta` helpers.
- `PROJECT_PROGRESS.md` — current status updated; this entry appended.

Decisions:
- 4|8 editorial spine kept on every section. Hero is the only break (full breadth, page entrance) — same convention as the homepage.
- Hairline-separated rows for whoItsFor / whatsIncluded rather than a bulleted list or grid. Each row gets `py-5 md:py-6` and a bottom hairline; reads as an editorial contents list without competing with the tagline.
- `createOrReplace` kept for services seed (not `createIfNotExists + patch.set` like homePage). Services were never hand-edited in Studio and the seed remains the source of truth; if that changes, switch patterns. Documented inline.
- Section eyebrows ("Positioning", "Who it's for", "What's included", "Get started" + RU equivalents) live in code rather than the schema. They're framing labels, not content; they evolve with layout, not editor whim. Same precedent as the homepage section eyebrows.
- "Get started" eyebrow is invented copy; the actual button label and href come from `service.finalCta`. Eyebrow is the framing wrapper, not the action.

Blockers:
- None on /services/[slug]. Pages render real content for all four AI services in both locales.
- Adjacent: case studies still missing — `/work` and `/work/[slug]` placeholders still show approved-section list rather than real content. That's the next likely target.

Verification:
- `npm run typecheck` clean after page rewrites.
- Independent `published`-perspective fetch confirmed each service has: positioning (en+ru), 3–4 whoItsFor items, 5 whatsIncluded items, finalCta with label + href + primary variant.
- The pages will resolve at: /services/ai-audit, /services/ai-agents, /services/ai-content-engine, /services/company-ai-brain (and the same paths under /ru/).

Next step:
- /work + /work/[slug] are the next obvious gap. Currently rendering a SectionStack of approved section labels (placeholder list), not real data. Two avenues, depending on priority:
  a. Author 1–2 case studies in Sanity (via a new seed-case-studies.mjs or by hand) and rewrite the case-study pages to render them. Unlocks HomeSelectedWork on the home page.
  b. Skip case studies for now and ship the rest of the static pages (/about especially) with real AI-first copy.
- /blog → /insights route migration still pending after either of the above.

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
