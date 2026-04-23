import { Studio } from "./Studio";

/**
 * Mounts the Sanity Studio at /studio/* — the catch-all segment lets the Studio handle
 * its own client-side routing (document IDs, tool names, vision query strings).
 *
 * This route lives at the app root, deliberately *outside* the `app/(site)` route group,
 * so the public site's layout chrome (header, footer, Plausible, `bg-canvas` body class)
 * cannot reach it. The shell here is whatever `app/layout.tsx` provides: bare `<html>` + `<body>`.
 */
export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <Studio />;
}
