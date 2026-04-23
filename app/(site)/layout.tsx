import { headers } from "next/headers";
import Script from "next/script";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { siteConfig } from "@/config/site";
import { resolveLocaleFromPath } from "@/lib/i18n/routing";

/**
 * Wraps every public route ("/", "/about", "/services/...", "/ru/...", "/contact", legal pages, …).
 * `/studio` is a sibling route outside this group, so none of this chrome or analytics reaches it.
 * The route group is URL-invisible — parentheses in the folder name never appear in URLs.
 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") ?? "/";
  const locale = resolveLocaleFromPath(pathname);

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <SiteHeader locale={locale} />
      <main className="flex-1">{children}</main>
      <SiteFooter locale={locale} />
      {siteConfig.plausibleDomain ? (
        <Script
          defer
          data-domain={siteConfig.plausibleDomain}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      ) : null}
    </div>
  );
}
