import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizePath } from "@/lib/i18n/routing";

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-32 border-t border-rule">
      <Container className="flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">
          © {year} {t.footer.copyright}
        </p>
        <nav className="flex items-center gap-6 text-sm text-ink-muted">
          <Link href={localizePath("/privacy", locale)} className="hover:text-ink">
            {t.footer.privacy}
          </Link>
          <Link href={localizePath("/terms", locale)} className="hover:text-ink">
            {t.footer.terms}
          </Link>
          <Link href={localizePath("/cookies", locale)} className="hover:text-ink">
            {t.footer.cookies}
          </Link>
        </nav>
      </Container>
    </footer>
  );
}
