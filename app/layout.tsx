import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { headers } from "next/headers";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo/metadata";
import { resolveLocaleFromPath } from "@/lib/i18n/routing";

import "./globals.css";

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
      <body className="min-h-screen bg-canvas text-ink antialiased">
        <SiteHeader locale={locale} />
        <main>{children}</main>
        <SiteFooter locale={locale} />
        {siteConfig.plausibleDomain ? (
          <Script
            defer
            data-domain={siteConfig.plausibleDomain}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  );
}
