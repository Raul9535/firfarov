import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { resolveLocaleFromPath } from "@/lib/i18n/routing";
import { buildMetadata } from "@/lib/seo/metadata";

import "./globals.css";

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
    <html lang={locale}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
