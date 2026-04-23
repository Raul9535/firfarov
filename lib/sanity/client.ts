import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";

const baseConfig = {
  projectId: projectId ?? "placeholder",
  dataset: dataset ?? "production",
  apiVersion,
  useCdn: true,
  perspective: "published",
} as const;

export const sanityClient = createClient(baseConfig);

export const sanityPreviewClient = createClient({
  ...baseConfig,
  useCdn: false,
  perspective: "previewDrafts",
  token: process.env.SANITY_API_READ_TOKEN,
});
