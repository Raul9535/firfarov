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
| `npm run typecheck` | TypeScript without emit               |
| `npm run lint`      | Next.js ESLint config                 |
| `npm run format`    | Prettier (with Tailwind class sort)   |

## What is still placeholder

- **Sanity schemas** — not yet modeled. The approved entities (Home Page, About Page, Contact Page, Work Index, Blog Index, Thank You, Global Settings, Service, Case Study, Blog Post, Blog Category, FAQ Item, Author, Legal Page) and reusable groups (LocalizedText, SEOMetadata, MediaAsset, CTABlock, RichContentBlock) still need to be authored in a Sanity Studio project.
- **Real page sections** — non-home pages currently render `<SectionPlaceholder />` stacks that list the approved section order for each page type. Home sections exist as thin component files wrapping the same placeholder.
- **Brand fonts** — `styles/fonts.css` is empty; wire `Inter` / `Fraunces` / `JetBrains Mono` (or the final brand choice) via `next/font` when finalized.
- **Sentry wrapping** — `@sentry/nextjs` is installed but `next.config.mjs` is not yet wrapped; no `sentry.client.config.ts` / `sentry.server.config.ts` files exist.
- **Plausible** — script tag conditionally rendered in `app/layout.tsx`; no custom events wired yet.
- **Contact form UI** — API route (`/api/contact`) is ready; the actual form UI component is not yet built.
- **Supabase table** — `contact_submissions` table needs to be created with columns matching `ContactFormInput`.

## What to build next

1. **Sanity Studio** — spin up a Sanity project, model the entities and reusable groups above, and generate typed clients. Replace `lib/sanity/types.ts` placeholders with generated types.
2. **Home sections** — replace the eight `SectionPlaceholder` stubs in `components/sections/home/` with real implementations. Start with Hero, Positioning, Selected work.
3. **Extract other page sections** — as each page is designed, lift its placeholders into real section components under `components/sections/<page>/`.
4. **Brand fonts** — wire through `styles/fonts.css` or `next/font`, update the tokens in `styles/tokens.css`.
5. **Sentry** — add `sentry.{client,server,edge}.config.ts`, wrap `next.config.mjs` with `withSentryConfig`, capture from `app/error.tsx`.
6. **Contact form UI** — client component with Zod schema imported from `lib/forms/schema.ts`, posting to `/api/contact`, redirecting to `/thank-you`.
7. **Supabase migration** — create `contact_submissions` table and RLS policies.
8. **Dynamic sitemap** — extend `app/sitemap.ts` to include case studies, blog posts, and blog categories from Sanity.
9. **Future v2** — AI-assisted blog workflow, Telegram distribution, FAQ schema expansion.
