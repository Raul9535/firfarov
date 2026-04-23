# FIRFAROV

A premium bilingual personal brand and content platform for FIRFAROV — design, AI, and business automation.

## Stack

- **Framework**: Next.js 15 (App Router) + TypeScript, Server Components by default
- **Styling**: Tailwind CSS 4 (CSS-first config) + design tokens in `/styles/tokens.css`
- **CMS**: Sanity (`next-sanity`) — GROQ lives only in `/lib/sanity/queries.ts`
- **i18n**: Field-level bilingual (EN/RU). EN at `/`, RU mirror at `/ru`
- **Forms**: Next.js API route → Resend (email) + Supabase (persistence)
- **Analytics**: Plausible (script loaded when `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set)
- **Monitoring**: Sentry (installed; wiring into `next.config.mjs` is TODO)
- **Motion**: CSS + IntersectionObserver by default (`<Reveal />`); Framer Motion only for signature moments
- **Hosting**: Vercel

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in real values
npm run dev
```

## Structure

```
app/
  layout.tsx    Root layout — <html>/<body> + locale detection only. No chrome.
  (site)/       Route group for all public pages. Owns SiteHeader, SiteFooter, Plausible.
    layout.tsx, page.tsx, about/, services/, work/, blog/, contact/, ru/, …
  studio/       Embedded Sanity Studio (sibling to (site) — no site chrome inherited).
  api/contact/  Contact form endpoint (Zod → Resend + Supabase)
components/
  ui/           Design-system primitives (Container, Button)
  layout/       SiteHeader, SiteFooter
  sections/     Page sections, organized by page type
  motion/       Motion wrappers (Reveal, …)
  dev/          Scaffold-only placeholders (SectionPlaceholder, SectionStack)
config/         Site metadata, navigation, service registry
lib/
  sanity/       Sanity client + all GROQ queries (no inline GROQ in pages)
  i18n/         Locale config, routing helpers, dictionaries
  seo/          Metadata builder + JSON-LD helpers
  forms/        Zod schema, Resend email, Supabase persistence
  analytics/    Plausible helper
  utils/        Small, zero-dep helpers
sanity/
  schemas/      Sanity schema definitions (documents + reusable objects + Portable Text)
styles/
  tokens.css    Design tokens — single source of truth
  fonts.css     @font-face declarations (placeholder)
public/         Static assets
middleware.ts   Forwards x-pathname on the *request* headers so Server Components derive locale
```

## Routing & i18n

- EN is the default locale and lives at the root (`/about`, `/services/...`).
- RU mirrors the same tree under `/ru`.
- All public pages live inside the `app/(site)/` route group. The group owns the `SiteHeader` / `SiteFooter` / Plausible chrome in `(site)/layout.tsx`. `/studio` is a sibling route outside the group, so it physically cannot inherit any of it.
- `middleware.ts` forwards `x-pathname` on the **request** headers (via `NextResponse.next({ request: { headers } })`, not on the response headers — that distinction matters, see "Why /studio isolation is a route group, not a pathname check" below). Both the root layout and `(site)/layout.tsx` read it via `headers().get("x-pathname")`.
- Never hard-code locale-prefixed hrefs. Always route via `localizePath(path, locale)` from `lib/i18n/routing.ts`.
- `buildMetadata()` in `lib/seo/metadata.ts` emits canonical + `<link rel="alternate" hreflang="…">` automatically.

### Why /studio isolation is a route group, not a pathname check

The first cut at isolating Studio branched inside `app/layout.tsx` on `pathname.startsWith("/studio")`. That check never fired because the middleware was setting `x-pathname` on the outgoing **response** headers, while `headers()` in Server Components reads **request** headers — so the chrome always rendered around Studio. Even with the middleware bug fixed, keeping chrome in the root layout meant one line of defence between Studio and the site. Route groups are the proper App Router primitive for this: the root layout owns only `<html>` / `<body>`, the `(site)` group owns chrome, and `/studio` as a sibling segment can't see either.

## Architecture principles (enforced)

- Server-first. `"use client"` only where actually needed (motion, interactive forms).
- GROQ never inlined in pages — it all lives in `lib/sanity/queries.ts`.
- i18n never inlined in pages — it goes through `lib/i18n`.
- SEO never inlined in pages — it goes through `lib/seo/metadata.ts`.
- Forms never inlined in pages — validation, email, persistence live in `lib/forms`.
- Design tokens are the single source of truth for color, type, spacing, radii, motion.

## Scripts

| Command             | Purpose                               |
| ------------------- | ------------------------------------- |
| `npm run dev`       | Start the dev server                  |
| `npm run build`     | Production build                      |
| `npm run start`     | Run the production server             |
| `npm run sanity:extract` | Extract `sanity/schema.json` from schemas (needs a `sanity.cli.ts`) |
| `npm run sanity:typegen` | Generate TypeScript types from extracted schema + GROQ |
| `npm run typecheck` | TypeScript without emit               |
| `npm run lint`      | Next.js ESLint config                 |
| `npm run format`    | Prettier (with Tailwind class sort)   |

## Sanity content model

Schemas live in `sanity/schemas/`:

- **Reusable objects** (`objects/`): `localizedText`, `seoMetadata`, `mediaAsset`, `ctaBlock`.
- **Singleton documents**: `globalSettings`, `homePage`, `aboutPage`, `contactPage`, `workIndexPage`, `blogIndexPage`, `thankYouPage`. Enforce single-instance via Studio deskStructure.
- **Collection documents**: `service`, `caseStudy`, `blogPost`, `blogCategory`, `faqItem`, `author`, `legalPage`.
- **Portable Text**: shared config in `portableText.ts`, used by `bodyEn` / `bodyRu` pairs on `aboutPage`, `blogPost`, `caseStudy`, `legalPage`.

Bilingual pattern: one document per entity; every translatable field uses `localizedText` (EN + RU strings inline). Long-form body content uses parallel `bodyEn` / `bodyRu` Portable Text arrays. URL slugs are stored as `slugEn` + `slugRu` (except `legalPage`, which has a fixed enum slug shared across locales).

Required on every page-level document: `seo: seoMetadata` with required `title` + `description`.

## Sanity Studio

Studio is embedded in the same Next.js app at `/studio/*`:

- `sanity.config.ts` — Studio config. Loads `schemaTypes` from `sanity/schemas`, plugs in `structureTool` (with `sanity/structure.ts`) and `visionTool`, and enforces singletons by filtering `templates` and `document.actions`.
- `sanity.cli.ts` — consumed by the `sanity` CLI for `schema extract` / `typegen` / `deploy`. Reads the same env vars as the Studio config.
- `sanity/structure.ts` — deskStructure that pins singleton documents at the top of the sidebar and lists collections underneath.
- `sanity/env.ts` — single source of truth for `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET` / `NEXT_PUBLIC_SANITY_API_VERSION`. Falls back to placeholders so `next build` never fails on missing env.
- `app/studio/[[...tool]]/page.tsx` + `Studio.tsx` — mounts `<NextStudio />` inside a client-boundary component. Re-exports `metadata` / `viewport` from `next-sanity/studio`.
- Studio is isolated from the public site via App Router route groups: public routes live under `app/(site)/` with their own `(site)/layout.tsx` (SiteHeader + SiteFooter + Plausible). The Studio route is a sibling segment at `app/studio/...`, so none of that chrome can reach it. The root `app/layout.tsx` owns only `<html>`/`<body>` + locale detection.

### Studio env vars

Set these in `.env.local` before running Studio or the Sanity CLI:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=...   # from sanity.io/manage
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
SANITY_API_READ_TOKEN=...           # optional, only for draft previews
```

### Verifying Studio works

1. Install dependencies: `npm install` (brings in `sanity`, `@sanity/vision`, `styled-components`).
2. Create a Sanity project at [sanity.io/manage](https://www.sanity.io/manage) and grab `projectId` + `dataset`.
3. In that project's CORS origins, allow `http://localhost:3000` (credentials enabled).
4. Copy `.env.example` → `.env.local` and fill in the `NEXT_PUBLIC_SANITY_*` vars.
5. `npm run dev`, then open [http://localhost:3000/studio](http://localhost:3000/studio). Log in with Google/GitHub/email.
6. You should see "Pages" (with the seven pinned singletons) and the collections below — service, case study, blog post, blog category, FAQ item, author, legal page. Try creating a blog post and confirm slugs + localized fields behave as expected.

### Typed data layer

GROQ queries live in `lib/sanity/queries.ts`, each wrapped in `defineQuery()` from `next-sanity`. Typegen reads these and emits:

- Document + object types (`HomePage`, `CaseStudy`, `LocalizedText`, …)
- One `${QueryName}Result` type per `defineQuery` (`HomePageQueryResult`, `ServiceBySlugQueryResult`, …)
- A module augmentation on `@sanity/client`'s `SanityQueries` map that ties each query string literal to its result type

`lib/sanity/types.ts` re-exports everything the frontend needs; don't import from `sanity/sanity.types` directly.

Fetch through the typed wrapper — the query's literal type is preserved via `const Q extends string`, so the return is inferred automatically:

```ts
import { sanityFetch } from "@/lib/sanity/fetch";
import { homePageQuery, serviceBySlugQuery } from "@/lib/sanity/queries";

const home = await sanityFetch(homePageQuery);
// ↑ HomePageQueryResult

const service = await sanityFetch(serviceBySlugQuery, {
  params: { locale: "en", slug: "ui-ux-design" },
  tags: ["service:ui-ux-design"],
});
// ↑ ServiceBySlugQueryResult
```

Cache model: pass `tags` for on-demand revalidation (`revalidateTag()`), or `revalidate` for time-based ISR (default 60s). Tags take precedence — Next.js requires one or the other, not both.

### Regenerating types

After any schema or query change:

```bash
npm run sanity:types     # chains extract + typegen
```

Equivalent to:

```bash
npm run sanity:extract   # writes sanity/schema.json
npm run sanity:typegen   # writes sanity/sanity.types.ts
```

`npm run build` runs `sanity:types` automatically via the `prebuild` script, so CI stays in sync without a manual step. Both commands are offline — they don't need a connected Sanity project or network access, they just read local schemas + GROQ.

### Seeding the minimum content

The schema has strong validation (required SEO, required CTAs, min-length constraints on a few arrays). To publish a homepage end-to-end, documents must be created in this order:

1. **Global settings** (singleton) — `brandName`, `tagline` (EN + RU), `primaryEmail`, `defaultSeo` (title + description, both locales).
2. **Author** — one record for the founder. `name` (single string), `role` (EN + RU), `bio` (EN + RU), `photo`.
3. **At least one Service** — required by every Case Study's `services` ref.
   - `title` (EN + RU), `slugEn`, `slugRu`, `tagline`, `positioning`, `whoItsFor` (≥ 1 item), `whatsIncluded` (≥ 1 item), `processSteps` (≥ 1 item), `finalCta`, `seo`.
4. **One Case Study** — needed for the homepage's `selectedWork` (min 2) and for `/work` to render.
   - `title`, `client`, `slugEn`, `slugRu`, `publishedAt`, `services` (≥ 1 ref), `heroImage`, `summary`, `atAGlance` (≥ 1), `bodyEn`, `bodyRu`, `finalCta`, `seo`. Add a second case study if you want the homepage's `selectedWork` to satisfy its min-2 constraint on publish.
5. **Home page** (singleton) — required for HomeHero to render.
   - **For HomeHero specifically**, fill `heroHeading` (EN + RU), `heroLead` (EN + RU), and optionally `heroCta` (label + href like `/contact` + variant).
   - The rest of the homePage document (`positioningStatement`, `selectedWork`, `finalCta`, `seo`) is required by the schema on publish, even though only hero fields are rendered right now. Fill them minimally to get a published document.
6. **About / Contact / Work index / Blog index / Thank you page** (singletons) — each requires at least the hero text + `seo`. None of these render real sections yet, so you can leave them as drafts until their sections are built.

Tip: on first load of `/studio`, each pinned singleton sidebar entry is an empty shell — clicking it opens the blank document editor. Publish is gated by validation, but saving as draft works without it.

## What is still placeholder

- **Studio not yet connected to a project** — the wiring is done; a real Sanity projectId + dataset still has to be created and set in `.env.local`.
- **Seed content** — no singleton instances exist yet. On first Studio load each pinned sidebar entry will be an empty document waiting to be created.
- **Real page sections** — non-home pages currently render `<SectionPlaceholder />` stacks. On the home page, `HomeHero` and `HomePositioning` are real (both fetch `homePage` via `sanityFetch`, React dedupes to one call). The other six home sections are still placeholders.
- **Brand fonts** — `styles/fonts.css` is empty; wire `Inter` / `Fraunces` / `JetBrains Mono` (or final brand choice) via `next/font` when finalized.
- **Sentry wrapping** — `@sentry/nextjs` installed but `next.config.mjs` not yet wrapped; no `sentry.client.config.ts` / `sentry.server.config.ts`.
- **Plausible** — script tag conditionally rendered; no custom events wired.
- **Contact form UI** — API route (`/api/contact`) ready; form UI component not built.
- **Supabase table** — `contact_submissions` table needs to be created.

## What to build next

1. **Connect a real Sanity project** — create project at sanity.io/manage, whitelist localhost in CORS, populate `.env.local`, verify `/studio` loads.
2. **Seed content** — follow the order in "Seeding the minimum content" above.
3. **Home sections (continued)** — `HomeHero` + `HomePositioning` are real. Next: `HomeSelectedWork` (needs a new query with `->` deref of `selectedWork` → case studies), then `HomeServicesOverview` (queries the services collection). Each follows the same pattern.
4. **Other page sections** — as each page is designed, lift its placeholders into real section components under `components/sections/<page>/`, fetching the matching document.
5. **Brand fonts** — wire through `styles/fonts.css` or `next/font`; update tokens in `styles/tokens.css`.
6. **Sentry** — add `sentry.{client,server,edge}.config.ts`, wrap `next.config.mjs` with `withSentryConfig`, capture from `app/error.tsx`.
7. **Contact form UI** — client component with the Zod schema from `lib/forms/schema.ts`, posting to `/api/contact`, redirecting to `/thank-you`.
8. **Supabase migration** — create `contact_submissions` table and RLS policies.
9. **Dynamic sitemap** — extend `app/sitemap.ts` with case studies, blog posts, blog categories from Sanity.
10. **Future v2** — AI-assisted blog workflow, Telegram distribution, expanded FAQ JSON-LD.
