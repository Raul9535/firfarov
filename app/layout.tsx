import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { resolveLocaleFromPath } from "@/lib/i18n/routing";
import { buildMetadata } from "@/lib/seo/metadata";

import "./globals.css";

/**
 * Brand fonts loaded via next/font/google. Each font assigns its loaded
 * family to a CSS variable; `styles/tokens.css` then wraps each variable
 * in a fallback stack (e.g. `--font-sans: var(--font-inter), ui-sans-serif, …`).
 *
 * Roles:
 *   - Inter           → --font-sans  (body / UI default; latin + cyrillic)
 *   - Fraunces        → --font-serif (display headings; latin only — cyrillic
 *                       glyphs fall back to Georgia in tokens, since Fraunces
 *                       does not ship a cyrillic subset on Google Fonts)
 *   - JetBrains Mono  → --font-mono  (eyebrows, dates, meta; latin + cyrillic)
 *
 * `display: "swap"` keeps text visible during the brief font-load window —
 * acceptable since the fallback stack already roughly matches metrics.
 * Variables are attached to <html> below so every descendant inherits them.
 */
const fontSans = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
});

const fontSerif = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

/**
 * Root layout. Deliberately minimal — it owns `<html>` and `<body>` plus locale detection,
 * nothing else.
 *
 * Public site chrome (header, footer, analytics, `bg-canvas`) lives in `app/(site)/layout.tsx`
 * so the embedded Studio at `/studio` — which is a sibling route outside the `(site)` group —
 * cannot inherit any of it.
 */

export const metadata: Metadata = buildMetadata({ locale: "en", path: "/" });

export const viewport: Viewport = {
  themeColor: "#fbfaf6",
  colorScheme: "light",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") ?? "/";
  const locale = resolveLocaleFromPath(pathname);

  return (
    <html
      lang={locale}
      className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable}`}
    >
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
