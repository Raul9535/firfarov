import Link from "next/link";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="py-32">
      <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">404</p>
      <h1 className="mt-4 font-serif text-4xl text-ink">Page not found</h1>
      <p className="mt-4 max-w-prose text-ink-muted">
        The page you’re looking for doesn’t exist or has moved.
      </p>
      <Link href="/" className="mt-8 inline-block border-b border-ink pb-0.5 text-ink">
        Return home
      </Link>
    </Container>
  );
}
