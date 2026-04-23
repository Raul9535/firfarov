import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { primaryNavItems } from "@/config/navigation";
import { type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { alternateLocale, localizePath } from "@/lib/i18n/routing";

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const other = alternateLocale(locale);

  return (
    <header className="border-b border-rule">
      <Container className="flex items-center justify-between py-6">
        <Link
          href={localizePath("/", locale)}
          className="font-serif text-lg tracking-tight text-ink"
          aria-label={t.footer.copyright}
        >
          FIRFAROV
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {primaryNavItems.map((item) => (
            <Link
              key={item.href}
              href={localizePath(item.href, locale)}
              className="text-sm text-ink-muted transition-colors duration-[var(--duration-fast)] hover:text-ink"
            >
              {t.nav[item.key]}
            </Link>
          ))}
        </nav>

        <Link
          href={localizePath("/", other)}
          className="font-mono text-xs uppercase tracking-widest text-ink-muted hover:text-ink"
          aria-label={`Switch to ${other.toUpperCase()}`}
        >
          {t.languageSwitch[other]}
        </Link>
      </Container>
    </header>
  );
}
