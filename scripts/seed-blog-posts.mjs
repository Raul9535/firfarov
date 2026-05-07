// One-shot seed for two MVP blog posts so HomeLatestThinking has something to render.
// Mirrors scripts/seed-services.mjs — same env loading, same write-token resolution,
// same idempotent createOrReplace pattern with stable _ids.
//
// Run from project root:
//   node scripts/seed-blog-posts.mjs
//
// Reads SANITY_API_WRITE_TOKEN (preferred) or falls back to SANITY_API_READ_TOKEN.
// The chosen token must have Editor-or-higher role to create documents.

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

// Stable IDs publish directly (no `drafts.` prefix). Slugs picked to match
// what /blog/[slug] would resolve under each locale. publishedAt drives
// the order returned by latestBlogPostsQuery.
const posts = [
  {
    _id: "blog-calm-products-loud-market",
    _type: "blogPost",
    title: {
      _type: "localizedText",
      en: "Building calm products in a loud market",
      ru: "Спокойные продукты в шумном рынке",
    },
    slugEn: { _type: "slug", current: "calm-products-loud-market" },
    slugRu: { _type: "slug", current: "spokoynye-produkty-shumnyy-rynok" },
    publishedAt: "2026-04-15T10:00:00.000Z",
    excerpt: {
      _type: "localizedText",
      en: "Why restraint reads as confidence in product design — and how we apply it across UI, AI, and business automation.",
      ru: "Почему сдержанность читается как уверенность в продуктовом дизайне — и как мы применяем это в UI, ИИ и автоматизации.",
    },
  },
  {
    _id: "blog-ai-as-craft",
    _type: "blogPost",
    title: {
      _type: "localizedText",
      en: "AI as craft, not feature",
      ru: "ИИ как ремесло, не фича",
    },
    slugEn: { _type: "slug", current: "ai-as-craft" },
    slugRu: { _type: "slug", current: "ii-kak-remeslo" },
    publishedAt: "2026-04-22T10:00:00.000Z",
    excerpt: {
      _type: "localizedText",
      en: "The difference between bolting an AI label onto a button and actually changing how the work gets done.",
      ru: "Разница между тем, чтобы пометить кнопку лейблом «ИИ», и тем, чтобы реально изменить, как делается работа.",
    },
  },
];

console.log(`→ project: ${projectId} · dataset: ${dataset} · apiVersion: ${apiVersion}`);
console.log(`→ token from: ${tokenSource}`);
console.log(`→ seeding ${posts.length} blog post(s)...\n`);

for (const doc of posts) {
  try {
    const result = await client.createOrReplace(doc);
    console.log(`✓ ${doc._id}`);
    console.log(`  _id:  ${result._id}`);
    console.log(`  _rev: ${result._rev}`);
    console.log(`  title.en: ${result.title?.en}`);
    console.log(`  publishedAt: ${result.publishedAt}\n`);
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
