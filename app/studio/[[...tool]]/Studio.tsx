"use client";

import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

/**
 * Client boundary for the embedded Sanity Studio.
 * Kept separate from `page.tsx` so the page can remain a Server Component that exports
 * metadata + viewport from `next-sanity/studio`.
 */
export function Studio() {
  return <NextStudio config={config} />;
}
