// Plausible is loaded via <Script /> in the root layout when NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set.
// This module exposes a typed `track` helper for custom events from client components.

declare global {
  interface Window {
    plausible?: (
      event: string,
      options?: { props?: Record<string, string | number | boolean> },
    ) => void;
  }
}

export function track(event: string, props?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined" || !window.plausible) return;
  window.plausible(event, props ? { props } : undefined);
}
