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
app/            Routes. EN at root, RU under /ru. Server Components by default.
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
middleware.ts   Exposes x-pathname so the root layout can derive locale
```

## Routing & i18n

- EN is the default locale and lives at the root (`/about`, `/services/...`).
- RU mirrors the same tree under `/ru`.
- `middleware.ts` writes an `x-pathname` header so `app/layout.tsx` can set `<html lang>` without hitting client code.
- Never hard-code locale-prefixed hrefs. Always route via `localizePath(path, locale)` from `lib/i18n/routing.ts`.
- `buildMetadata()` in `lib/seo/metadata.ts` emits canonical + `<link rel="alternate" hreflang="…">` automatically.

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
- `app/layout.tsx` branches on `pathname.startsWith("/studio")` so the Studio renders inside a bare `<html>` shell with no site header/footer/Plausible — middleware still runs harmlessly, it only sets `x-pathname`.

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

### Typegen

Once the Studio is connected:

```bash
npm run sanity:extract   # reads schemas via sanity.cli.ts → writes sanity/schema.json
npm run sanity:typegen   # reads schema.json + GROQ queries → writes sanity/sanity.types.ts
```

Config lives in `sanity-typegen.json`. Typegen scans the whole tree for GROQ (it detects `/* groq */` template literals), so queries in `lib/sanity/queries.ts` get typed automatically. Once generated, replace the hand-written stand-ins in `lib/sanity/types.ts` with imports from `sanity/sanity.types.ts` and add a typed `sanityFetch()` wrapper.

## What is still placeholder

- **Studio not yet connected to a project** — the wiring is done; a real Sanity projectId + dataset still has to be created and set in `.env.local`.
- **Generated types** — `lib/sanity/types.ts` still holds hand-written placeholders. Run `npm run sanity:extract && npm run sanity:typegen` once the project is connected, then swap to the generated output.
- **Typed fetch helpers** — `lib/sanity/queries.ts` exports GROQ strings; there's no `sanityFetch()` wrapper yet that binds queries to generated types.
- **Seed content** — no singleton instances exist yet. On first Studio load each pinned sidebar entry will be an empty document waiting to be created.
- **Real page sections** — non-home pages currently render `<SectionPlaceholder />` stacks. Home sections exist as thin component files wrapping the placeholder.
- **Brand fonts** — `styles/fonts.css` is empty; wire `Inter` / `Fraunces` / `JetBrains Mono` (or final brand choice) via `next/font` when finalized.
- **Sentry wrapping** — `@sentry/nextjs` installed but `next.config.mjs` not yet wrapped; no `sentry.client.config.ts` / `sentry.server.config.ts`.
- **Plausible** — script tag conditionally rendered; no custom events wired.
- **Contact form UI** — API route (`/api/contact`) ready; form UI component not built.
- **Supabase table** — `contact_submissions` table needs to be created.

## What to build next

1. **Connect a real Sanity project** — create project at sanity.io/manage, whitelist localhost in CORS, populate `.env.local`, verify `/studio` loads.
2. **Typegen** — run `npm run sanity:extract && npm run sanity:typegen`, replace `lib/sanity/types.ts` stand-ins with generated types, add a typed `sanityFetch()` helper in `lib/sanity/`.
3. **Seed content** — author one record per singleton, plus 1–2 services, a case study, and a blog post, to drive real rendering.
4. **Home sections** — replace the eight `SectionPlaceholder` stubs in `components/sections/home/` with real implementations that read from `homePage`.
5. **Other page sections** — as each page is designed, lift its placeholders into real section components under `components/sections/<page>/`.
6. **Brand fonts** — wire through `styles/fonts.css` or `next/font`; update tokens in `styles/tokens.css`.
7. **Sentry** — add `sentry.{client,server,edge}.config.ts`, wrap `next.config.mjs` with `withSentryConfig`, capture from `app/error.tsx`.
8. **Contact form UI** — client component with the Zod schema from `lib/forms/schema.ts`, posting to `/api/contact`, redirecting to `/thank-you`.
9. **Supabase migration** — create `contact_submissions` table and RLS policies.
10. **Dynamic sitemap** — extend `app/sitemap.ts` with case studies, blog posts, blog categories from Sanity.
11. **Future v2** — AI-assisted blog workflow, Telegram distribution, expanded FAQ JSON-LD.
