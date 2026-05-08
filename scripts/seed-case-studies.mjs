// Seed two AI implementation case studies + wire them into homePage.selectedWork.
//
// The cases are realistic but anonymized composites — they exist so /work and
// /work/[slug] (and HomeSelectedWork on the home page) have real proof-driven
// content to render before the first real engagement is published. Replace the
// content blocks in this file when real cases are ready, or unpublish these
// docs in Studio and write the real ones from scratch.
//
// What this script does:
//   1. Creates / replaces two caseStudy docs by stable `_id` (`createOrReplace`).
//   2. Patches `homePage.selectedWork` to reference both — non-destructive
//      patch.set so SEO and other home-page fields are preserved.
//
// heroImage is intentionally left empty on the seed. Sanity image assets need a
// raster upload (next/image with SVG would require dangerouslyAllowSVG); upload
// the actual case-study imagery via Studio when ready. Pages handle the missing
// image gracefully — cards render text-only.
//
// Idempotent — re-running produces the same dataset state.
//
// Run from project root:
//   node scripts/seed-case-studies.mjs

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

const lt = (en, ru) => ({ _type: "localizedText", en, ru });
const ltKey = (key, en, ru) => ({ _type: "localizedText", _key: key, en, ru });
const cta = (labelEn, labelRu, href, variant = "primary") => ({
  _type: "ctaBlock",
  label: lt(labelEn, labelRu),
  href,
  variant,
});
const ref = (id) => ({ _type: "reference", _ref: id });

// Orphan / experiment IDs to clean out before seeding. These are caseStudy docs
// that satisfied schema validation (title + slugs filled with garbage values)
// but pollute /work and HomeSelectedWork. Keep this list short and explicit;
// don't bulk-delete by query.
const ORPHAN_CASE_STUDY_IDS = ["b1d48b3d-7973-49f8-bc45-658582c0e3e1"];

// `atAGlance` items are objects with required label + value, both LocalizedText.
const glance = (key, labelEn, labelRu, valueEn, valueRu) => ({
  _key: key,
  label: lt(labelEn, labelRu),
  value: lt(valueEn, valueRu),
});

// `outcomes` items: required metric + optional description, both LocalizedText.
const outcome = (key, metricEn, metricRu, descEn, descRu) => ({
  _key: key,
  metric: lt(metricEn, metricRu),
  description: lt(descEn, descRu),
});

// ─── Content ──────────────────────────────────────────────────────────────

const caseStudies = [
  {
    _id: "case-ai-lead-triage-saas",
    _type: "caseStudy",
    title: lt(
      "AI lead triage cut sales follow-up time 6× at a 30-person B2B SaaS",
      "AI-триаж лидов сократил время на follow-up в 6× в B2B SaaS на 30 человек",
    ),
    client: lt("Confidential B2B SaaS", "Confidential B2B-SaaS"),
    slugEn: { _type: "slug", current: "ai-lead-triage-saas" },
    slugRu: { _type: "slug", current: "ai-triazh-lidov-saas" },
    publishedAt: "2026-04-10T10:00:00.000Z",
    services: [
      { _type: "reference", _key: "svc-ref-1", _ref: "service-ai-agents" },
      { _type: "reference", _key: "svc-ref-2", _ref: "service-ai-audit" },
    ],
    summary: lt(
      "A B2B SaaS was losing inbound leads because their 4-person sales team couldn't reach prospects within the 2-hour window. We built an AI triage agent that scores, qualifies, and drafts personalized first-touch messages within 30 seconds of submission.",
      "B2B SaaS терял входящие лиды, потому что отдел продаж из 4 человек не успевал отвечать в окно 2 часов. Мы построили AI-агента, который скоринг, квалифицирует и пишет персонализированные первые сообщения за 30 секунд после заявки.",
    ),
    atAGlance: [
      glance(
        "client",
        "Client",
        "Клиент",
        "Confidential B2B SaaS",
        "Confidential B2B-SaaS",
      ),
      glance(
        "industry",
        "Industry",
        "Индустрия",
        "SaaS · Marketing tech",
        "SaaS · Marketing-tech",
      ),
      glance(
        "stack",
        "Stack",
        "Стек",
        "OpenAI · n8n · Slack · Salesforce",
        "OpenAI · n8n · Slack · Salesforce",
      ),
      glance(
        "timeline",
        "Timeline",
        "Сроки",
        "4 weeks · 1 founder + 2 engineers",
        "4 недели · 1 фаундер + 2 инженера",
      ),
      glance(
        "outcome",
        "Headline outcome",
        "Главный результат",
        "6× faster lead-qualification",
        "6× быстрее квалификация лидов",
      ),
    ],
    outcomes: [
      outcome(
        "outcome-time",
        "12 min → 30 sec",
        "С 12 минут до 30 секунд",
        "Average time from lead submission to a qualified, personalized first-touch message.",
        "Среднее время от заявки до квалифицированного персонализированного первого сообщения.",
      ),
      outcome(
        "outcome-conversion",
        "+22%",
        "+22%",
        "Qualified-lead-to-meeting conversion in the first month after deployment.",
        "Конверсия квалифицированный лид → встреча в первый месяц после запуска.",
      ),
      outcome(
        "outcome-coverage",
        "0 missed leads",
        "0 потерянных лидов",
        "Inbound submissions outside business hours now get a same-shift response — no more weekend leakage.",
        "Входящие заявки вне рабочих часов получают ответ в ту же смену — больше нет потерь на выходных.",
      ),
    ],
    finalCta: cta("Start your project", "Начать проект", "/contact", "primary"),
  },

  {
    _id: "case-company-ai-brain-agency",
    _type: "caseStudy",
    title: lt(
      "Slack-native AI brain replaced 30 weekly knowledge questions at a 20-person agency",
      "Slack-нативный AI-мозг заменил 30 еженедельных вопросов в агентстве на 20 человек",
    ),
    client: lt(
      "Confidential creative agency",
      "Confidential креативное агентство",
    ),
    slugEn: { _type: "slug", current: "company-ai-brain-agency" },
    slugRu: { _type: "slug", current: "ai-mozg-agentstva" },
    publishedAt: "2026-03-22T10:00:00.000Z",
    services: [
      { _type: "reference", _key: "svc-ref-1", _ref: "service-company-ai-brain" },
    ],
    summary: lt(
      "A creative agency past 20 people was drowning in 'where do I find X' questions in Slack. We connected their Notion, Google Drive, and pinned Slack channels into a single AI assistant that answers in-thread, with citations.",
      "Креативное агентство за 20 человек тонуло в вопросах «где найти X» в Slack. Мы соединили их Notion, Google Drive и pin'нутые Slack-каналы в единого AI-помощника, который отвечает в треде с цитатами.",
    ),
    atAGlance: [
      glance(
        "client",
        "Client",
        "Клиент",
        "Confidential creative agency",
        "Confidential креативное агентство",
      ),
      glance(
        "industry",
        "Industry",
        "Индустрия",
        "Creative · Brand strategy",
        "Креатив · Brand-стратегия",
      ),
      glance(
        "stack",
        "Stack",
        "Стек",
        "Anthropic Claude · Pinecone · Slack · Notion API",
        "Anthropic Claude · Pinecone · Slack · Notion API",
      ),
      glance(
        "timeline",
        "Timeline",
        "Сроки",
        "3 weeks · 1 engineer",
        "3 недели · 1 инженер",
      ),
      glance(
        "outcome",
        "Headline outcome",
        "Главный результат",
        "30+ questions/week answered automatically",
        "30+ вопросов/неделю отвечает автоматически",
      ),
    ],
    outcomes: [
      outcome(
        "outcome-questions",
        "30+ → 0",
        "С 30+ до 0",
        "Recurring 'where do I find X' questions per week, redirected from human leads to the assistant.",
        "Повторяющихся вопросов «где найти X» в неделю, перенесено с людей на помощника.",
      ),
      outcome(
        "outcome-response",
        "<2 sec",
        "<2 сек",
        "Median response time for cited answers, including the source link in the original tool.",
        "Медианное время ответа с цитатами, включая ссылку на источник в исходном инструменте.",
      ),
      outcome(
        "outcome-onboarding",
        "5 days → 1 day",
        "С 5 дней до 1 дня",
        "Onboarding time for new hires to find the first 80% of information they need.",
        "Время онбординга новых сотрудников, чтобы найти первые 80% нужной информации.",
      ),
    ],
    finalCta: cta("Start your project", "Начать проект", "/contact", "primary"),
  },
];

// ─── Mutate ───────────────────────────────────────────────────────────────

console.log(`→ project: ${projectId} · dataset: ${dataset} · apiVersion: ${apiVersion}`);
console.log(`→ token from: ${tokenSource}\n`);

if (ORPHAN_CASE_STUDY_IDS.length > 0) {
  console.log(`→ removing ${ORPHAN_CASE_STUDY_IDS.length} orphan case-study doc(s)...`);
  for (const id of ORPHAN_CASE_STUDY_IDS) {
    try {
      await client.delete(id);
      console.log(`✓ deleted ${id}`);
    } catch (err) {
      const msg = err?.message ?? String(err);
      if (
        err?.statusCode === 404 ||
        msg.includes("not found") ||
        msg.includes("does not exist")
      ) {
        console.log(`· ${id} already absent`);
        continue;
      }
      console.error(`✗ ${id} delete failed: ${msg}`);
      process.exit(1);
    }
  }
  console.log();
}

console.log(`→ seeding ${caseStudies.length} case study document(s)...\n`);
for (const doc of caseStudies) {
  try {
    const result = await client.createOrReplace(doc);
    console.log(`✓ ${doc._id}`);
    console.log(`  _id:           ${result._id}`);
    console.log(`  _rev:          ${result._rev}`);
    console.log(`  title.en:      ${result.title?.en?.slice(0, 70)}…`);
    console.log(`  slugEn:        ${result.slugEn?.current}`);
    console.log(`  slugRu:        ${result.slugRu?.current}`);
    console.log(`  publishedAt:   ${result.publishedAt}`);
    console.log(`  atAGlance:     ${doc.atAGlance.length} items`);
    console.log(`  outcomes:      ${doc.outcomes.length} items`);
    console.log(`  finalCta:      ${doc.finalCta.label.en} → ${doc.finalCta.href}\n`);
  } catch (err) {
    console.error(`✗ ${doc._id} failed:`);
    console.error(`  ${err?.message ?? err}`);
    if (err?.statusCode === 401 || err?.statusCode === 403) {
      console.error(`\nToken (${tokenSource}) does not have write permission.`);
    }
    process.exit(1);
  }
}

// Patch homePage.selectedWork to reference the seeded case studies. Uses the
// non-destructive patch.set pattern so other homePage fields stay intact.
console.log("→ wiring case studies into homePage.selectedWork...");
const selectedWorkRefs = caseStudies.map((cs, i) => ({
  _key: `selected-${i + 1}`,
  _type: "reference",
  _ref: cs._id,
}));

try {
  const result = await client
    .transaction()
    .createIfNotExists({ _id: "homePage", _type: "homePage" })
    .patch("homePage", (patch) => patch.set({ selectedWork: selectedWorkRefs }))
    .commit({ visibility: "async" });
  console.log(`✓ homePage.selectedWork → ${selectedWorkRefs.length} refs`);
  console.log(`  transactionId: ${result.transactionId}`);
  for (const r of selectedWorkRefs) {
    console.log(`  · ${r._ref}`);
  }
} catch (err) {
  console.error("✗ homePage.selectedWork patch failed:");
  console.error(`  ${err?.message ?? err}`);
  process.exit(1);
}

console.log("\ndone.");
