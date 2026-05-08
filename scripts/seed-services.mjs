// AI-first services seed.
//
// Reflects the new positioning: FIRFAROV is an AI implementation studio for SMBs.
// Four offerings — AI Audit, AI Agents, AI Content Engine, Company AI Brain.
//
// What this script does, in order:
//   1. Deletes the legacy design-era service docs (`service-ui-ux-design`,
//      `service-ai-for-business`) so they no longer surface anywhere.
//   2. Creates / replaces four AI service docs by stable `_id`. No `drafts.`
//      prefix — they are published immediately.
//
// Each service is seeded with the MVP service-detail surface:
//   title · slugEn · slugRu · tagline · order · positioning · whoItsFor[]
//   · whatsIncluded[] · finalCta
//
// Idempotent — re-running produces the same dataset state. Safe to run after
// editing copy in this file.
//
// Note: `createOrReplace` is destructive of editor-managed fields not named
// here (processSteps, deliverables, techStack, caseStudies, faq, seo). Today
// none of those carry hand-edits — services were originally seeded by this
// same script and not touched in Studio. If that changes, switch to the
// `createIfNotExists + patch.set` pattern from seed-home-page.mjs.
//
// Run from project root:
//   node scripts/seed-services.mjs

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

// Tiny constructors for readability.
const lt = (en, ru) => ({ _type: "localizedText", en, ru });
const ltKey = (key, en, ru) => ({ _type: "localizedText", _key: key, en, ru });
const cta = (labelEn, labelRu, href, variant = "primary") => ({
  _type: "ctaBlock",
  label: lt(labelEn, labelRu),
  href,
  variant,
});

// Legacy IDs from the design-era seed. Removed before seeding the AI lineup.
const LEGACY_SERVICE_IDS = ["service-ui-ux-design", "service-ai-for-business"];

// ─── Service definitions ──────────────────────────────────────────────────
// Slugs are intentionally identical across EN and RU — the terms are
// international tech vocabulary; a single slug simplifies sharing, SEO, and
// recall. The bilingual schema still allows divergence later.
//
// _key values for array items are stable strings ("audience-1", "included-1")
// so re-running the seed updates items in place rather than producing
// duplicates if anyone touched the document in Studio.

const services = [
  {
    _id: "service-ai-audit",
    _type: "service",
    title: lt("AI Audit", "AI-аудит"),
    slugEn: { _type: "slug", current: "ai-audit" },
    slugRu: { _type: "slug", current: "ai-audit" },
    order: 10,
    tagline: lt(
      "Map where AI actually fits — before you build anything.",
      "Карта, где AI реально работает в вашем бизнесе — до любого внедрения.",
    ),
    positioning: lt(
      "Before any build, get a clear map of where AI gives leverage in your specific business — and where it doesn't. The audit ends with a prioritized roadmap, not a slide deck.",
      "До любого внедрения — чёткая карта того, где AI даст результат именно в вашем бизнесе, а где нет. Аудит заканчивается приоритизированным roadmap'ом, а не презентацией.",
    ),
    whoItsFor: [
      ltKey(
        "audience-1",
        "SMB founders and operators evaluating AI but unsure where it actually fits.",
        "Основателям и операторам SMB, которые присматриваются к AI, но не понимают, где он реально нужен.",
      ),
      ltKey(
        "audience-2",
        "Teams already burning hours on manual work that suspect AI could help, but want a clear next step.",
        "Командам, которые уже жгут часы на ручной работе и подозревают, что AI помог бы, но не знают первого шага.",
      ),
      ltKey(
        "audience-3",
        "Companies that tried AI tools ad-hoc and ended up with disconnected experiments.",
        "Компаниям, которые пробовали AI-инструменты ad-hoc и получили набор разрозненных экспериментов.",
      ),
    ],
    whatsIncluded: [
      ltKey(
        "included-1",
        "30-min discovery call to understand the business, current ops, and goals.",
        "30-минутный discovery-звонок — понять бизнес, текущие операции и цели.",
      ),
      ltKey(
        "included-2",
        "1–2 weeks of audit work — interviews with team, review of current tools and workflows, opportunity mapping.",
        "1–2 недели работы аудита — интервью с командой, разбор текущих инструментов и процессов, картирование возможностей.",
      ),
      ltKey(
        "included-3",
        "Written audit report: where AI fits, where it doesn't, and why.",
        "Письменный отчёт: где AI подходит, где нет, и почему.",
      ),
      ltKey(
        "included-4",
        "Prioritized 6-month roadmap with concrete next-step projects.",
        "Приоритизированный roadmap на 6 месяцев с конкретными следующими шагами.",
      ),
      ltKey(
        "included-5",
        "1-hour walkthrough of findings with the founder and Q&A.",
        "Часовая презентация результатов с основателем и Q&A.",
      ),
    ],
    finalCta: cta("Book an audit", "Заказать аудит", "/contact", "primary"),
  },

  {
    _id: "service-ai-agents",
    _type: "service",
    title: lt("AI Agents", "AI-агенты"),
    slugEn: { _type: "slug", current: "ai-agents" },
    slugRu: { _type: "slug", current: "ai-agents" },
    order: 20,
    tagline: lt(
      "Custom agents that close tickets, qualify leads, and run workflows.",
      "Кастомные агенты, которые закрывают тикеты, квалифицируют лиды и ведут процессы.",
    ),
    positioning: lt(
      "Custom AI agents built for the work your team is doing manually right now — not generic chatbots. Each agent ships with monitoring, observable behavior, and a clean handover to your team.",
      "Кастомные AI-агенты под работу, которую ваша команда сейчас делает руками, — не generic-чатботы. Каждый агент идёт с мониторингом, observable-поведением и чистой передачей вашей команде.",
    ),
    whoItsFor: [
      ltKey(
        "audience-1",
        "Sales teams drowning in lead qualification and follow-ups.",
        "Отделам продаж, тонущим в квалификации лидов и follow-up'ах.",
      ),
      ltKey(
        "audience-2",
        "Support orgs where 60%+ of tickets are repetitive and well-documented.",
        "Поддержке, где 60%+ тикетов повторяющиеся и хорошо задокументированы.",
      ),
      ltKey(
        "audience-3",
        "Operations leads who need to scale process without scaling headcount.",
        "Operations-лидам, которым нужно масштабировать процесс без расширения штата.",
      ),
      ltKey(
        "audience-4",
        "Companies that already mapped where an agent fits (often via an AI Audit) and are ready to ship.",
        "Компаниям, которые уже выяснили, где нужен агент (часто после AI-аудита), и готовы к запуску.",
      ),
    ],
    whatsIncluded: [
      ltKey(
        "included-1",
        "Agent architecture and tool selection — model, framework, integrations.",
        "Архитектура агента и выбор инструментов — модель, фреймворк, интеграции.",
      ),
      ltKey(
        "included-2",
        "Build of one production-grade agent end-to-end (typically 2–4 weeks).",
        "Сборка одного production-grade агента end-to-end (обычно 2–4 недели).",
      ),
      ltKey(
        "included-3",
        "Integration with your existing stack — CRM, helpdesk, Slack, internal docs, whatever's required.",
        "Интеграция с вашим стеком — CRM, helpdesk, Slack, внутренние документы, что нужно.",
      ),
      ltKey(
        "included-4",
        "Monitoring, logging, and a fail-safe — not a black box.",
        "Мониторинг, логирование, fail-safe — не чёрный ящик.",
      ),
      ltKey(
        "included-5",
        "Operator handover: your team owns and runs the agent after the engagement.",
        "Передача оператору: после проекта ваша команда владеет агентом и эксплуатирует его сама.",
      ),
    ],
    finalCta: cta("Start a project", "Начать проект", "/contact", "primary"),
  },

  {
    _id: "service-ai-content-engine",
    _type: "service",
    title: lt("AI Content Engine", "AI-движок контента"),
    slugEn: { _type: "slug", current: "ai-content-engine" },
    slugRu: { _type: "slug", current: "ai-content-engine" },
    order: 30,
    tagline: lt(
      "Content systems that ship daily output without scaling the team.",
      "Контент-системы, которые ежедневно работают без расширения команды.",
    ),
    positioning: lt(
      "A content production system that runs daily without three humans behind it. Inputs in (positioning, source material, voice), outputs out (posts, articles, video scripts, repurposed assets) — automated where possible, edited where it matters.",
      "Контент-система, которая работает каждый день без трёх человек за ней. На входе — позиционирование, источники, голос; на выходе — посты, статьи, сценарии видео, repurposed-ассеты. Автоматизировано там, где можно, отредактировано там, где важно.",
    ),
    whoItsFor: [
      ltKey(
        "audience-1",
        "Founders building a personal or company brand who can't keep up with daily output.",
        "Основателям, которые строят личный или корпоративный бренд и не успевают с ежедневным контентом.",
      ),
      ltKey(
        "audience-2",
        "Marketing teams of 1–3 expected to ship across 5+ channels.",
        "Маркетинг-командам из 1–3 человек, от которых ждут публикации в 5+ каналах.",
      ),
      ltKey(
        "audience-3",
        "Companies whose content quality drops every time the senior writer is busy.",
        "Компаниям, у которых качество контента падает каждый раз, когда senior-копирайтер занят.",
      ),
    ],
    whatsIncluded: [
      ltKey(
        "included-1",
        "Voice + positioning capture: a structured profile of how you sound.",
        "Захват голоса и позиционирования: структурированный профиль того, как вы звучите.",
      ),
      ltKey(
        "included-2",
        "Source-to-content pipeline: transcripts, briefs, raw notes → drafts.",
        "Pipeline source→content: транскрипты, брифы, заметки → черновики.",
      ),
      ltKey(
        "included-3",
        "Multi-format adaptation: one source → posts + article + video script + emails.",
        "Multi-format адаптация: один источник → посты + статья + видео-сценарий + письма.",
      ),
      ltKey(
        "included-4",
        "Quality gate: AI drafts, a human edits the 20% that matters.",
        "Quality gate: AI пишет черновики, человек редактирует те 20%, что важны.",
      ),
      ltKey(
        "included-5",
        "Daily/weekly cadence wired into Notion, Slack, or whatever your team uses.",
        "Дневная или недельная каденция, встроенная в Notion, Slack или то, чем пользуется команда.",
      ),
    ],
    finalCta: cta("Start a project", "Начать проект", "/contact", "primary"),
  },

  {
    _id: "service-company-ai-brain",
    _type: "service",
    title: lt("Company AI Brain", "AI-мозг компании"),
    slugEn: { _type: "slug", current: "company-ai-brain" },
    slugRu: { _type: "slug", current: "company-ai-brain" },
    order: 40,
    tagline: lt(
      "An internal assistant that knows your docs, Slack, CRM, and stack.",
      "Внутренний AI-помощник, который знает ваши документы, Slack, CRM и стек.",
    ),
    positioning: lt(
      "An internal AI assistant that knows your docs, Slack, CRM, code, and processes — and answers your team's questions instantly. The kind of search and Q&A you wish your tools already had.",
      "Внутренний AI-помощник, который знает ваши документы, Slack, CRM, код и процессы — и отвечает команде мгновенно. Тот самый поиск и Q&A, которого должно быть достаточно от ваших инструментов.",
    ),
    whoItsFor: [
      ltKey(
        "audience-1",
        "Companies past 10–15 people where institutional knowledge starts living in heads and Slack threads.",
        "Компаниям после 10–15 человек, где институциональные знания начинают жить в головах и Slack-тредах.",
      ),
      ltKey(
        "audience-2",
        "Teams onboarding new hires that drown in 'where do I find X' questions.",
        "Командам, нанимающим людей, которые тонут в вопросах «а где найти X».",
      ),
      ltKey(
        "audience-3",
        "Operations leads who answer the same questions every week.",
        "Operations-лидам, отвечающим на одни и те же вопросы каждую неделю.",
      ),
    ],
    whatsIncluded: [
      ltKey(
        "included-1",
        "Connector setup: Notion, Google Drive, Slack, Confluence, GitHub, your CRM — whichever sources matter.",
        "Настройка коннекторов: Notion, Google Drive, Slack, Confluence, GitHub, CRM — те источники, которые важны.",
      ),
      ltKey(
        "included-2",
        "Indexing and embedding pipeline that updates as content changes.",
        "Pipeline индексации и эмбеддингов, обновляющийся по мере изменений.",
      ),
      ltKey(
        "included-3",
        "Web UI and/or Slack bot — your team asks where they already work.",
        "Веб-UI и/или Slack-бот — команда спрашивает там, где уже работает.",
      ),
      ltKey(
        "included-4",
        "Permission model: respects who can see what.",
        "Permission-модель: уважает, кто что может видеть.",
      ),
      ltKey(
        "included-5",
        "Quality dashboard: which questions get answered, which don't, where the gaps are.",
        "Quality dashboard: какие вопросы получают ответы, какие нет, где пробелы.",
      ),
    ],
    finalCta: cta("Start a project", "Начать проект", "/contact", "primary"),
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
    console.log(`  _id:      ${result._id}`);
    console.log(`  _rev:     ${result._rev}`);
    console.log(`  title.en: ${result.title?.en}`);
    console.log(`  slugEn:   ${result.slugEn?.current}`);
    console.log(`  whoItsFor / whatsIncluded: ${doc.whoItsFor.length} / ${doc.whatsIncluded.length} items`);
    console.log(`  finalCta: ${doc.finalCta.label.en} → ${doc.finalCta.href}\n`);
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
