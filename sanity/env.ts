/**
 * Centralized env lookup for Sanity Studio + CLI.
 * Used by `sanity.config.ts` (bundled into the browser for the Studio) and `sanity.cli.ts`
 * (Node-evaluated when running the Sanity CLI) so both target the same project/dataset.
 *
 * We fall back to placeholder values instead of throwing at module load — that lets
 * `next build` succeed even before the project is wired up. At runtime the Studio will
 * surface a clear "invalid projectId" error, which is the right signal for the editor.
 */

const rawProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const rawDataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

if (!rawProjectId || !rawDataset) {
  // eslint-disable-next-line no-console
  console.warn(
    "[sanity] NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET is not set. " +
      "Studio will not authenticate until both are configured in .env.local.",
  );
}

export const projectId = rawProjectId ?? "placeholder-project-id";
export const dataset = rawDataset ?? "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";

/** Studio is mounted at this path inside the Next.js app. */
export const studioBasePath = "/studio";
