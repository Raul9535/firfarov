// AI-first services seed.
//
// Reflects the new positioning: FIRFAROV is an AI implementation studio for SMBs.
// Four offerings — AI Audit, AI Agents, AI Content Engine, Company AI Brain —
// replace the prior design-studio service set.
//
// What this script does, in order:
//   1. Deletes the legacy design-era service docs (`service-ui-ux-design`,
//      `service-ai-for-business`) so they no longer surface anywhere.
//   2. Creates / replaces four AI service docs by stable `_id`. No `drafts.`
//      prefix — they are published immediately.
//
// Idempotent on both sides — re-running produces the same dataset state. Safe
// to run after editing taglines / order / titles in this file.
//
// Run from project root:
//   node scripts/seed-services.mjs
//
// Reads SANITY_API_WRITE_TOKEN (preferred) or falls back to SANITY_API_READ_TOKEN.
// The chosen token must have Editor-or-higher role to create / delete documents.

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

// Legacy IDs from the design-era seed. Removed before seeding the AI lineup.
const LEGACY_SERVICE_IDS = [
  "service-ui-ux-design",
  "service-ai-for-business",
];

// New AI services. Slugs are intentionally identical across EN and RU — the
// terms ("ai-audit", "ai-agents", etc.) are international tech vocabulary;
// keeping a single slug simplifies sharing, SEO, and recall. The bilingual
// schema still allows them to diverge later if a different RU slug is desired.
//
// Taglines below are first-pass defaults: each is a one-line outcome promise.
// Edit in Studio (or here + re-run) once final positioning copy lands.
const services = [
  {
    _id: "service-ai-audit",
    _type: "service",
    title: {
      _type: "localizedText",
      en: "AI Audit",
      ru: "AI-аудит",
    },
    slugEn: { _type: "slug", current: "ai-audit" },
    slugRu: { _type: "slug", current: "ai-audit" },
    tagline: {
      _type: "localizedText",
      en: "Map where AI actually fits — before you build anything.",
      ru: "Карта, где AI реально работает в вашем бизнесе — до любого внедрения.",
    },
    order: 10,
  },
  {
    _id: "service-ai-agents",
    _type: "service",
    title: {
      _type: "localizedText",
      en: "AI Agents",
      ru: "AI-агенты",
    },
    slugEn: { _type: "slug", current: "ai-agents" },
    slugRu: { _type: "slug", current: "ai-agents" },
    tagline: {
      _type: "localizedText",
      en: "Custom agents that close tickets, qualify leads, and run workflows.",
      ru: "Кастомные агенты, которые закрывают тикеты, квалифицируют лиды и ведут процессы.",
    },
    order: 20,
  },
  {
    _id: "service-ai-content-engine",
    _type: "service",
    title: {
      _type: "localizedText",
      en: "AI Content Engine",
      ru: "AI-движок контента",
    },
    slugEn: { _type: "slug", current: "ai-content-engine" },
    slugRu: { _type: "slug", current: "ai-content-engine" },
    tagline: {
      _type: "localizedText",
      en: "Content systems that ship daily output without scaling the team.",
      ru: "Контент-системы, которые ежедневно работают без расширения команды.",
    },
    order: 30,
  },
  {
    _id: "service-company-ai-brain",
    _type: "service",
    title: {
      _type: "localizedText",
      en: "Company AI Brain",
      ru: "AI-мозг компании",
    },
    slugEn: { _type: "slug", current: "company-ai-brain" },
    slugRu: { _type: "slug", current: "company-ai-brain" },
    tagline: {
      _type: "localizedText",
      en: "An internal assistant that knows your docs, Slack, CRM, and stack.",
      ru: "Внутренний AI-помощник, который знает ваши документы, Slack, CRM и стек.",
    },
    order: 40,
  },
];

console.log(`→ project: ${projectId} · dataset: ${dataset} · apiVersion: ${apiVersion}`);
console.log(`→ token from: ${tokenSource}\n`);

console.log(`→ removing ${LEGACY_SERVICE_IDS.length} legacy service doc(s)...`);
for (const id of LEGACY_SERVICE_IDS) {
  try {
    await client.delete(id);
    console.log(`✓ deleted ${id}`);
  } catch (err) {
    const msg = err?.message ?? String(err);
    // Sanity returns 404 / "doesn't exist" when the doc is already gone — that
    // is the desired idempotent state, not an error.
    if (
      err?.statusCode === 404 ||
      msg.includes("not found") ||
      msg.includes("does not exist")
    ) {
      console.log(`· ${id} already absent`);
      continue;
    }
    console.error(`✗ ${id} delete failed: ${msg}`);
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

console.log(`\n→ seeding ${services.length} AI service document(s)...\n`);
for (const doc of services) {
  try {
    const result = await client.createOrReplace(doc);
    console.log(`✓ ${doc._id}`);
    console.log(`  _id:  ${result._id}`);
    console.log(`  _rev: ${result._rev}`);
    console.log(`  title.en: ${result.title?.en}`);
    console.log(`  slugEn:   ${result.slugEn?.current}\n`);
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
