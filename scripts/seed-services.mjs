// One-shot seed for the MVP services collection.
// Reads Sanity creds from .env.local, then publishes (createOrReplace) two service documents
// directly. Idempotent — running it twice produces the same dataset state.
//
// Run from project root:
//   node scripts/seed-services.mjs
//
// Reads SANITY_API_WRITE_TOKEN (preferred) or falls back to SANITY_API_READ_TOKEN.
// The chosen token must have Editor-or-higher role to create documents.
// If only Viewer permission is granted, the script prints a permission error with a link to
// the tokens page so a new Editor token can be generated.

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@sanity/client";

function loadDotEnv(path) {
  const text = readFileSync(path, "utf8");
  const env = {};
  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

const env = loadDotEnv(resolve(process.cwd(), ".env.local"));

const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";
const token = env.SANITY_API_WRITE_TOKEN ?? env.SANITY_API_READ_TOKEN;
const tokenSource = env.SANITY_API_WRITE_TOKEN
  ? "SANITY_API_WRITE_TOKEN"
  : "SANITY_API_READ_TOKEN";

if (!projectId || !dataset) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET in .env.local");
  process.exit(1);
}
if (!token) {
  console.error("Missing SANITY_API_WRITE_TOKEN (or SANITY_API_READ_TOKEN) in .env.local");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

// Stable, predictable IDs — using `_id` without a `drafts.` prefix publishes directly.
// Slugs match what the frontend's localizePath('/services/<slug>', locale) expects.
const services = [
  {
    _id: "service-ui-ux-design",
    _type: "service",
    title: {
      _type: "localizedText",
      en: "UI/UX Design",
      ru: "UI/UX Дизайн",
    },
    slugEn: { _type: "slug", current: "ui-ux-design" },
    slugRu: { _type: "slug", current: "ui-ux-dizayn" },
    tagline: {
      _type: "localizedText",
      en: "Interfaces users actually understand.",
      ru: "Интерфейсы, в которых пользователь не теряется.",
    },
    order: 10,
  },
  {
    _id: "service-ai-for-business",
    _type: "service",
    title: {
      _type: "localizedText",
      en: "AI for Business",
      ru: "ИИ для бизнеса",
    },
    slugEn: { _type: "slug", current: "ai-for-business" },
    slugRu: { _type: "slug", current: "ii-dlya-biznesa" },
    tagline: {
      _type: "localizedText",
      en: "AI embedded where it actually matters.",
      ru: "ИИ, встроенный туда, где он реально приносит пользу.",
    },
    order: 20,
  },
];

console.log(`→ project: ${projectId} · dataset: ${dataset} · apiVersion: ${apiVersion}`);
console.log(`→ token from: ${tokenSource}`);
console.log(`→ seeding ${services.length} service document(s)...\n`);

for (const doc of services) {
  try {
    const result = await client.createOrReplace(doc);
    console.log(`✓ ${doc._id}`);
    console.log(`  _id:  ${result._id}`);
    console.log(`  _rev: ${result._rev}`);
    console.log(`  title.en: ${result.title?.en}\n`);
  } catch (err) {
    console.error(`✗ ${doc._id} failed:`);
    console.error(`  ${err?.message ?? err}`);
    if (err?.statusCode === 401 || err?.statusCode === 403) {
      console.error(`\nToken (${tokenSource}) does not have write permission.`);
      console.error(
        `Create a new token with Editor role at https://www.sanity.io/manage/personal/project/${projectId}/api → Tokens,`,
      );
      console.error("then add it to .env.local as:");
      console.error("  SANITY_API_WRITE_TOKEN=sk...");
    }
    process.exit(1);
  }
}

console.log("done.");
