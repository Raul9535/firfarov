"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/Container";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // TODO: Sentry.captureException(error) once @sentry/nextjs is wired up.
    console.error(error);
  }, [error]);

  return (
    <Container className="py-32">
      <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">Error</p>
      <h1 className="mt-4 font-serif text-4xl text-ink">Something went wrong.</h1>
      <button
        type="button"
        onClick={reset}
        className="mt-8 inline-block border-b border-ink pb-0.5 text-ink"
      >
        Try again
      </button>
    </Container>
  );
}
