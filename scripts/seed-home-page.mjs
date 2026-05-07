// Idempotent seed for the `homePage` singleton — populates the AI-first homepage copy.
//
// Why a transaction with `createIfNotExists` + `patch.set` (instead of `createOrReplace`):
// the singleton may eventually carry editor-managed fields the seed doesn't touch (SEO
// overrides, future fields). `createOrReplace` would wipe those. `patch.set` only writes
// the fields we name and leaves everything else alone. `createIfNotExists` makes the
// patch safe on the first run when the document doesn't exist yet.
//
// `selectedWork` is intentionally NOT seeded — there are no real case studies yet, and
// HomeSelectedWork already returns `null` on an empty array. Same for `seo` (falls back
// to globalSettings) and `founderMomentHeading` / `founderMomentText` (the founder beat
// is no longer in the homepage composition; the field stays in the schema for `/about`).
//
// Run from project root:
//   node scripts/seed-home-page.mjs

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

// Tiny constructors to keep the content block below readable.
const lt = (en, ru) => ({ _type: "localizedText", en, ru });
const cta = (labelEn, labelRu, href, variant = "primary") => ({
  _type: "ctaBlock",
  label: lt(labelEn, labelRu),
  href,
  variant,
});
const ref = (id) => ({ _type: "reference", _ref: id });

// ─── Content ───────────────────────────────────────────────────────────────
// All copy here reflects the AI implementation studio positioning. Edit in
// place and re-run the script — `patch.set` rewrites these fields without
// disturbing anything else on the document.

const fields = {
  // ─── Hero ─────────────────────────────────────────────────────────────
  heroHeading: lt(
    "We build the AI that runs your sales, support, and ops.",
    "Мы строим AI, который ведёт ваши продажи, поддержку и операции.",
  ),
  heroLead: lt(
    "FIRFAROV is an AI implementation studio for small and mid-sized businesses. We design and ship the agents, automations, content systems, and internal helpers that turn manual work into compounding leverage.",
    "FIRFAROV — студия AI-внедрений для малого и среднего бизнеса. Мы проектируем и запускаем агентов, автоматизации, контент-системы и внутренних AI-помощников, которые освобождают команду от рутины и ускоряют рост.",
  ),
  heroCta: cta("Book an AI audit", "Заказать AI-аудит", "/contact", "primary"),

  // ─── Positioning ──────────────────────────────────────────────────────
  positioningStatement: lt(
    "We build the AI systems that help small and mid-sized companies run faster, sell better, and stop drowning in manual work.",
    "Мы строим AI-системы, которые помогают малому и среднему бизнесу работать быстрее, лучше продавать и меньше тонуть в ручной работе.",
  ),

  // ─── Services overview intro (above the 4 service rows) ───────────────
  servicesOverviewIntro: lt(
    "Four offerings, one through-line — replace manual repetition with AI that runs by itself.",
    "Четыре направления, один принцип — заменить ручную работу AI-системой, которая работает сама.",
  ),

  // ─── Approach ─────────────────────────────────────────────────────────
  // 4 principles. _key values are stable across runs so editor edits in
  // Studio don't fight the seed if it's re-run.
  approachItems: [
    {
      _key: "audit-first",
      heading: lt("Audit before build.", "Аудит до внедрения."),
      description: lt(
        "We map where AI actually gives leverage in your specific business before we ship a single line of code or workflow.",
        "Мы выясняем, где AI реально даёт результат в вашем бизнесе, до того как пишем хотя бы строчку кода или автоматизации.",
      ),
    },
    {
      _key: "tool-agnostic",
      heading: lt("Tool-stack agnostic.", "Без привязки к стеку."),
      description: lt(
        "We pick the right model and tooling for the job — OpenAI, Claude, n8n, Make, custom code — not whatever vendor we resell.",
        "Мы выбираем правильную модель и инструменты под задачу — OpenAI, Claude, n8n, Make, кастомный код — а не то, что перепродаём.",
      ),
    },
    {
      _key: "operator-friendly",
      heading: lt("Operator-friendly handover.", "Передача под оператора."),
      description: lt(
        "After we ship, your team owns and runs the system. Documented, monitorable, easy to adjust without us in the loop.",
        "После запуска система остаётся у вашей команды. С документацией, мониторингом и возможностью править без нашего участия.",
      ),
    },
    {
      _key: "weeks-not-quarters",
      heading: lt("Weeks, not quarters.", "Недели, а не кварталы."),
      description: lt(
        "Production-ready AI in 2–6 weeks per project. Real systems running in your business, not pilots that never go live.",
        "Production-ready AI за 2–6 недель на проект. Реальные системы в работе, а не пилоты, которые так и не запускаются.",
      ),
    },
  ],

  // ─── Use cases ────────────────────────────────────────────────────────
  // Each card optionally links to a service detail page via `service`
  // reference. The four services were seeded earlier by seed-services.mjs;
  // refs here line up with those _id's.
  useCases: [
    {
      _key: "sales",
      heading: lt("Sales", "Продажи"),
      description: lt(
        "AI agents qualify leads, draft follow-ups, and route hot prospects to your reps in seconds.",
        "AI-агенты квалифицируют лиды, готовят follow-up'ы и передают горячих клиентов вашим менеджерам за секунды.",
      ),
      service: ref("service-ai-agents"),
    },
    {
      _key: "operations",
      heading: lt("Operations", "Операции"),
      description: lt(
        "Ticket triage, document retrieval, first-line support — handled before a human gets pulled in.",
        "Триаж тикетов, поиск по документам, первая линия поддержки — закрываются до того, как подключается человек.",
      ),
      service: ref("service-ai-agents"),
    },
    {
      _key: "marketing",
      heading: lt("Marketing", "Маркетинг"),
      description: lt(
        "A content system that ships daily output across formats and channels without three humans behind it.",
        "Контент-система, которая ежедневно выдаёт результат в нескольких форматах и каналах без трёх человек за ней.",
      ),
      service: ref("service-ai-content-engine"),
    },
    {
      _key: "knowledge",
      heading: lt("Knowledge", "База знаний"),
      description: lt(
        "Your team asks; AI answers — across your docs, Slack, CRM, and the rest of your stack.",
        "Команда спрашивает — AI отвечает по документам, Slack, CRM и остальному стеку.",
      ),
      service: ref("service-company-ai-brain"),
    },
  ],

  // ─── Final CTA ────────────────────────────────────────────────────────
  finalCta: cta(
    "Start with a 30-min AI audit",
    "Начните с 30-минутного AI-аудита",
    "/contact",
    "primary",
  ),

  // ─── Selected work ────────────────────────────────────────────────────
  // Explicitly empty — there are no real case studies yet, and any leftover
  // refs from earlier experiments would render an empty card grid under the
  // section header. HomeSelectedWork returns null on `[]`, so the whole
  // section disappears. Replace with real refs once case studies exist.
  selectedWork: [],
};

// ─── Mutate ───────────────────────────────────────────────────────────────

console.log(`→ project: ${projectId} · dataset: ${dataset} · apiVersion: ${apiVersion}`);
console.log(`→ token from: ${tokenSource}`);
console.log(`→ seeding homePage singleton...\n`);

try {
  const result = await client
    .transaction()
    .createIfNotExists({ _id: "homePage", _type: "homePage" })
    .patch("homePage", (patch) => patch.set(fields))
    .commit({ visibility: "async" });

  console.log("✓ homePage updated");
  console.log(`  transactionId: ${result.transactionId}`);
  console.log(
    `  fields written: ${Object.keys(fields).length} (${Object.keys(fields).join(", ")})`,
  );
  console.log(`  approachItems: ${fields.approachItems.length}`);
  console.log(`  useCases:      ${fields.useCases.length}`);
  console.log(`  selectedWork:  reset to [] (no real cases yet)`);
  console.log(`  seo:           not touched (falls back to globalSettings)`);
  console.log("\ndone.");
} catch (err) {
  console.error("✗ homePage seed failed:");
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
