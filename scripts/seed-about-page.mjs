// Seed the /about page content + the founder author it references.
//
// What this script does in one atomic transaction:
//   1. createIfNotExists author doc (`author-vlad-firfarov`).
//   2. createIfNotExists aboutPage singleton.
//   3. patch.set author fields (name, role, bio).
//   4. patch.set aboutPage fields (heroStatement, founder ref, principles[],
//      expertiseAreas[], finalCta).
//
// Non-destructive on every step — patch.set only writes the fields named
// here. Anything the editor adds via Studio outside this list (e.g., SEO,
// teamSummary, Portable Text bodies in whatItIsEn / howWeWorkRu, etc.) is
// preserved across re-runs.
//
// Founder photo is intentionally left empty in the seed — Sanity image
// upload via API would require either a raster encoder or
// dangerouslyAllowSVG. Pages handle missing photo gracefully (text-only
// founder block). Upload via Studio when ready.
//
// Idempotent. Run from project root:
//   node scripts/seed-about-page.mjs

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
const cta = (labelEn, labelRu, href, variant = "primary") => ({
  _type: "ctaBlock",
  label: lt(labelEn, labelRu),
  href,
  variant,
});

// ─── Author content ───────────────────────────────────────────────────────
//
// `name` is a placeholder — edit in Studio (or here + re-run) to match the
// real founder's preferred display name. Bio is first-pass; tighten before
// real launch.

const AUTHOR_ID = "author-vlad-firfarov";

const authorFields = {
  name: "Vlad Firfarov",
  role: lt("Founder", "Основатель"),
  bio: lt(
    "Vlad has spent the last decade shipping product, content, and infrastructure for small and mid-sized businesses that needed leverage faster than a typical agency would deliver. FIRFAROV is the studio that emerged from that work — focused now on the AI systems that actually move SMB businesses forward.",
    "Влад провёл последнее десятилетие, запуская продукты, контент и инфраструктуру для малого и среднего бизнеса, которому нужен был результат быстрее, чем готова дать типичная агентство. FIRFAROV — студия, выросшая из этой работы, сфокусированная сейчас на AI-системах, которые реально двигают SMB-бизнес вперёд.",
  ),
};

// ─── About page content ──────────────────────────────────────────────────
//
// Sections rendered by the AI-first /about MVP:
//   Hero (heroStatement) → Founder (founder ref) → How we work (principles[])
//   → Expertise (expertiseAreas[]) → Final CTA (finalCta)
//
// Portable Text bodies (whatItIsEn/Ru, howWeWorkEn/Ru) intentionally not
// seeded — the page doesn't render them yet (no Portable Text renderer wired)
// and their narrative role is covered for MVP by heroStatement + principles.

const aboutFields = {
  heroStatement: lt(
    "FIRFAROV is an author-led AI implementation studio — built for the small and mid-sized businesses that need real systems, not pilots.",
    "FIRFAROV — author-led студия AI-внедрений, построенная для малого и среднего бизнеса, которому нужны реальные системы, а не пилоты.",
  ),

  founder: { _type: "reference", _ref: AUTHOR_ID },

  principles: [
    {
      _key: "beyond-prompting",
      heading: lt("We build systems, not prompts.", "Мы строим системы, а не промпты."),
      description: lt(
        "ChatGPT solves a single prompt for a single user. We design AI that runs inside your business — with tools, context, monitoring, and operator oversight.",
        "ChatGPT решает один запрос для одного пользователя. Мы проектируем AI, который работает внутри бизнеса — с инструментами, контекстом, мониторингом и оператором.",
      ),
    },
    {
      _key: "outcome-over-output",
      heading: lt("Outcome over output.", "Результат важнее объёма."),
      description: lt(
        "Success is measured in business metrics — leads handled, tickets resolved, hours saved — not in features shipped or model accuracy.",
        "Успех мы измеряем бизнес-метриками — обработанные лиды, закрытые тикеты, сохранённые часы — а не количеством фич или точностью модели.",
      ),
    },
    {
      _key: "author-led",
      heading: lt("Author-led, not relay-race.", "Author-led, не эстафета."),
      description: lt(
        "Strategy, design, code, and ship come from the same hand. No four-vendor handoffs that drop signal at every step.",
        "Стратегия, дизайн, код и запуск — из одних рук. Никаких четырёх вендоров, которые теряют контекст на каждом шаге.",
      ),
    },
    {
      _key: "honest-scope",
      heading: lt("Honest scope.", "Честный scope."),
      description: lt(
        "If the audit shows AI doesn't fit the problem, we say so. We'd rather not build than build the wrong thing.",
        "Если аудит показал, что AI не подходит к задаче, мы так и говорим. Лучше не строить, чем строить не то.",
      ),
    },
  ],

  expertiseAreas: [
    { _key: "exp-1", _type: "localizedText", en: "Sales agents and lead-qualification flows", ru: "Sales-агенты и flows квалификации лидов" },
    { _key: "exp-2", _type: "localizedText", en: "Support automation and ticket triage", ru: "Автоматизация поддержки и триаж тикетов" },
    { _key: "exp-3", _type: "localizedText", en: "Content production systems", ru: "Системы производства контента" },
    { _key: "exp-4", _type: "localizedText", en: "Internal AI knowledge bases (RAG, semantic search)", ru: "Внутренние AI-базы знаний (RAG, семантический поиск)" },
    { _key: "exp-5", _type: "localizedText", en: "Operations workflow automation (n8n, Make, custom)", ru: "Автоматизация операционных процессов (n8n, Make, кастом)" },
    { _key: "exp-6", _type: "localizedText", en: "AI audit and roadmap design", ru: "AI-аудит и проектирование roadmap'а" },
  ],

  finalCta: cta("Book an AI audit", "Заказать AI-аудит", "/contact", "primary"),
};

// ─── Mutate ───────────────────────────────────────────────────────────────

console.log(`→ project: ${projectId} · dataset: ${dataset} · apiVersion: ${apiVersion}`);
console.log(`→ token from: ${tokenSource}`);
console.log(`→ seeding author + aboutPage in one transaction...\n`);

try {
  const result = await client
    .transaction()
    .createIfNotExists({ _id: AUTHOR_ID, _type: "author", name: authorFields.name })
    .createIfNotExists({ _id: "aboutPage", _type: "aboutPage" })
    .patch(AUTHOR_ID, (p) => p.set(authorFields))
    .patch("aboutPage", (p) => p.set(aboutFields))
    .commit({ visibility: "async" });

  console.log("✓ author + aboutPage updated");
  console.log(`  transactionId: ${result.transactionId}`);
  console.log();
  console.log("author fields written:");
  console.log(`  _id:        ${AUTHOR_ID}`);
  console.log(`  name:       ${authorFields.name}`);
  console.log(`  role.en:    ${authorFields.role.en}`);
  console.log(`  bio:        ${authorFields.bio.en.slice(0, 60)}…`);
  console.log(`  photo:      not touched (upload via Studio)`);
  console.log();
  console.log("aboutPage fields written:");
  console.log(`  heroStatement:  ${aboutFields.heroStatement.en.slice(0, 60)}…`);
  console.log(`  founder ref:    ${aboutFields.founder._ref}`);
  console.log(`  principles:     ${aboutFields.principles.length}`);
  console.log(`  expertiseAreas: ${aboutFields.expertiseAreas.length}`);
  console.log(`  finalCta:       ${aboutFields.finalCta.label.en} → ${aboutFields.finalCta.href}`);
  console.log(`  whatItIsEn/Ru:  not touched (Portable Text body, deferred)`);
  console.log(`  howWeWorkEn/Ru: not touched (Portable Text body, deferred)`);
  console.log(`  teamSummary:    not touched`);
  console.log(`  seo:            not touched (falls back to globalSettings)`);
  console.log("\ndone.");
} catch (err) {
  console.error("✗ about-page seed failed:");
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
