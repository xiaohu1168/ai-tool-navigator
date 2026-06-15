/**
 * Seed script: Generates realistic analytics data for the admin dashboard.
 * Run with: npx tsx scripts/seed-analytics.ts
 */
import { randomInt, randomUUID } from "crypto";

const PATHS = [
  "/", "/tools/cursor", "/tools/vscode", "/tools/github-copilot",
  "/tools/chatgpt", "/tools/cline", "/tools/continue", "/tools/windsurf",
  "/tools/amp", "/tools/amplitude", "/category/coding", "/category/writing",
  "/search?q=best+ai+editor", "/best/coding", "/blog/top-10-ai-tools",
  "/tools/cursor", "/tools/windsurf", "/tools/claude", "/tools/gpt",
  "/tools/notion-ai", "/tools/jasper", "/tools/surf", "/tools/replit",
  "/tools/trae", "/tools/roov", "/tools/bolt", "/tools/cursor-pro",
  "/tools/pezzo", "/tools/llamaindex", "/tools/langchain",
];

const REFERRERS = [
  null, null, null,
  "https://www.google.com/",
  "https://www.google.com/",
  "https://www.bing.com/",
  "https://twitter.com/",
  "https://www.producthunt.com/",
  "https://news.ycombinator.com/",
  "https://www.reddit.com/",
];

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
];

const SEARCH_QUERIES = [
  "best ai coding assistant", "cursor vs windsurf", "free ai editor",
  "best chatgpt alternative", "ai code completion", "vscode ai extension",
  "best llm for coding", "claude vs gpt", "ai tool for beginners",
  "open source ai editor", "github copilot alternative", "ai pair programmer",
  "best prompt engineering tool", "ai writing assistant", "neovim ai plugin",
  "cursor ai review", "windsurf ide", "continue vs copilot",
  "best open source LLM", "ai code review tool", "autonomous coding agent",
];

const TOOLS_SLUGS = [
  "cursor", "windsurf", "vscode", "github-copilot", "cline", "continue",
  "claude", "chatgpt", "replit", "bolt", "amp", "aider", "trae", "roov",
  "amplitude", "tabnine", "codeium", "copilot-chat", "zed", "junie",
];

const SUBMISSION_NAMES = [
  { name: "CodePilot AI", category: "coding" },
  { name: "WriteBoost", category: "writing" },
  { name: "DesignFlow", category: "design" },
  { name: "SEO Wizard", category: "seo" },
  { name: "DeployEase", category: "devops" },
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  const { prisma } = await import("@/lib/db");
  const dayMs = 24 * 60 * 60 * 1000;
  const now = Date.now();
  const thirtyDaysAgo = now - 30 * dayMs;

  // --- 1. Generate PageViews ---
  console.log("Generating PageViews...");
  for (let day = 0; day < 30; day++) {
    const dayMsOffset = day * dayMs;
    const numViews = randomBetween(15, 45);
    for (let i = 0; i < numViews; i++) {
      const hour = randomBetween(0, 23);
      const minute = randomBetween(0, 59);
      const second = randomBetween(0, 59);
      const timestamp = new Date(thirtyDaysAgo + dayMsOffset + hour * 3600000 + minute * 60000 + second * 1000);
      const path = pick(PATHS);
      const referrer = pick(REFERRERS);

      await prisma.pageView.create({
        data: {
          id: randomUUID(),
          path,
          referrer: referrer || null,
          ip: `${randomBetween(1, 255)}.${randomBetween(0, 255)}.${randomBetween(0, 255)}.${randomBetween(1, 255)}`,
          user_agent: pick(USER_AGENTS),
          timestamp,
        },
      });
    }
  }
  const totalViews = await prisma.pageView.count();
  console.log(`  Created ${totalViews} page views`);

  // --- 2. Generate SearchQueries ---
  console.log("Generating SearchQueries...");
  for (let i = 0; i < 120; i++) {
    const baseQuery = pick(SEARCH_QUERIES);
    const variation = Math.random() > 0.7
      ? `${pick(["best", "top", "free", "open-source"])} ${baseQuery}`
      : baseQuery;
    await prisma.searchQuery.create({
      data: {
        id: randomUUID(),
        query: variation,
        results: randomBetween(1, 50),
        timestamp: new Date(thirtyDaysAgo + randomBetween(0, 30 * dayMs)),
      },
    });
  }

  const queryCounts = await prisma.searchQuery.groupBy({
    by: ["query"],
    _count: { query: true },
    orderBy: { _count: { query: "desc" } },
    take: 50,
  });
  console.log(`  Created ${queryCounts.length} unique queries`);

  // --- 3. Generate ToolClicks (power-law distribution) ---
  console.log("Generating ToolClicks...");
  const shuffled = [...TOOLS_SLUGS].sort(() => Math.random() - 0.5);

  for (let day = 0; day < 30; day++) {
    const dayMsOffset = day * dayMs;
    const clicksToday = randomBetween(20, 60);
    for (let c = 0; c < clicksToday; c++) {
      // Power law: earlier index = more clicks
      const idx = randomBetween(0, Math.min(8, shuffled.length));
      const slug = shuffled[idx];

      await prisma.tool.updateMany({
        where: { slug },
        data: { click_count: { increment: 1 } },
      });
    }
  }

  const topTools = await prisma.tool.findMany({
    orderBy: { click_count: "desc" },
    select: { slug: true, click_count: true },
    take: 10,
  });
  console.log("  Top tools by clicks:");
  for (const t of topTools) {
    console.log(`    ${t.slug}: ${t.click_count}`);
  }

  // --- 4. Create submissions ---
  console.log("Creating sample submissions...");
  const statuses: ("pending" | "approved" | "rejected")[] = ["pending", "approved", "rejected", "pending", "approved"];
  for (let i = 0; i < SUBMISSION_NAMES.length; i++) {
    const s = SUBMISSION_NAMES[i];
    await prisma.submission.create({
      data: {
        id: randomUUID(),
        name: s.name,
        url: `https://example-${s.name.toLowerCase().replace(/\s+/g, "-")}.com`,
        description: `A powerful AI-powered ${s.category} tool`,
        category_id: s.category,
        price: "Freemium",
        tags: `ai, ${s.category}, automation`,
        status: statuses[i],
      },
    });
  }

  console.log("\n✅ Analytics seed complete!");
  console.log(`   Total page views:   ${totalViews}`);
  console.log(`   Unique queries:     ${queryCounts.length}`);
  console.log(`   Submissions:        ${SUBMISSION_NAMES.length} created`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
