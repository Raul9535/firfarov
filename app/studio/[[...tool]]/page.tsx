import { Studio } from "./Studio";

/**
 * Mounts the Sanity Studio at /studio/* — the catch-all segment lets the Studio handle
 * its own client-side routing (document IDs, tool names, vision query strings).
 *
 * `force-static` keeps the shell on the edge/CDN; all data loading happens client-side
 * via Sanity's own APIs after hydration.
 */
export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <Studio />;
}
