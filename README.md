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

## What is still placeholder

- **Sanity Studio wiring** — schemas exist but no `sanity.config.ts` / `sanity.cli.ts`, no Studio route (`app/studio/[[...tool]]/page.tsx`), no `deskStructure` singleton enforcement. The schemas are ready to be imported as soon as those are added.
- **Generated types** — `lib/sanity/types.ts` still holds hand-written placeholders. Once the Studio is wired, run `npm run sanity:extract && npm run sanity:typegen` and swap to the generated output.
- **Typed fetch helpers** — `lib/sanity/queries.ts` exports GROQ strings but there's no `sanityFetch()` wrapper yet that ties queries to generated types.
- **Real page sections** — non-home pages currently render `<SectionPlaceholder />` stacks that list the approved section order for each page type. Home sections exist as thin component files wrapping the same placeholder.
- **Brand fonts** — `styles/fonts.css` is empty; wire `Inter` / `Fraunces` / `JetBrains Mono` (or the final brand choice) via `next/font` when finalized.
- **Sentry wrapping** — `@sentry/nextjs` installed but `next.config.mjs` is not yet wrapped; no `sentry.client.config.ts` / `sentry.server.config.ts` files exist.
- **Plausible** — script tag conditionally rendered in `app/layout.tsx`; no custom events wired yet.
- **Contact form UI** — API route (`/api/contact`) is ready; the actual form UI component is not yet built.
- **Supabase table** — `contact_submissions` table needs to be created with columns matching `ContactFormInput`.

## What to build next

1. **Sanity Studio wiring** — create a Sanity project, add `sanity.config.ts` importing `schemaTypes` from `sanity/schemas`, add `sanity.cli.ts`, mount the Studio at `/studio`, and author a deskStructure that pins the singleton types listed in `sanity/schemas/index.ts`.
2. **Typegen** — run `npm run sanity:extract && npm run sanity:typegen`, then replace the hand-written types in `lib/sanity/types.ts` with the generated ones. Wrap GROQ queries in a typed `sanityFetch()` helper in `lib/sanity/`.
3. **Seed content** — create one record per singleton (global settings, home page, about page, contact page, work index, blog index, thank you) plus a few services, a case study, and a blog post to drive real rendering.
4. **Home sections** — replace the eight `SectionPlaceholder` stubs in `components/sections/home/` with real implementations that read from `homePage`.
5. **Other page sections** — as each page is designed, lift its placeholders into real section components under `components/sections/<page>/`, pulling from the corresponding document.
6. **Brand fonts** — wire through `styles/fonts.css` or `next/font`, update tokens in `styles/tokens.css`.
7. **Sentry** — add `sentry.{client,server,edge}.config.ts`, wrap `next.config.mjs` with `withSentryConfig`, capture from `app/error.tsx`.
8. **Contact form UI** — client component with Zod schema imported from `lib/forms/schema.ts`, posting to `/api/contact`, redirecting to `/thank-you`.
9. **Supabase migration** — create `contact_submissions` table and RLS policies.
10. **Dynamic sitemap** — extend `app/sitemap.ts` to include case studies, blog posts, and blog categories from Sanity.
11. **Future v2** — AI-assisted blog workflow, Telegram distribution, FAQ schema expansion.
