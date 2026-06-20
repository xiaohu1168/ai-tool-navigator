/**
 * Seed script to populate AffiliateLink records for high-value tools.
 * Reads tool data from JSON files, resolves tool IDs via the database,
 * and creates affiliate links with realistic labels and networks.
 *
 * Usage: node scripts/seed-affiliate-links.js
 * Or:    const { seed } = require('./scripts/seed-affiliate-links.js')
 *        await seed(prismaInstance)
 *
 * This script is idempotent — it skips links that already exist.
 */
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const dataDir = path.join(process.cwd(), "data");

// High-value affiliate link templates organized by category
// These are representative affiliate programs. Replace URLs with your real links.
const AFFILIATE_TEMPLATES = [
  // Coding tools
  {
    category: "coding",
    tools: [
      {
        name: "Cursor",
        links: [
          { label: "Try Cursor Free", url: "https://www.cursor.com/?via=heyaihub", network: "Direct" },
          { label: "Cursor Pro — $20/mo", url: "https://www.cursor.com/pricing?via=heyaihub", network: "Direct" },
        ],
      },
      {
        name: "Windsurf",
        links: [
          { label: "Try Windsurf Free", url: "https://windsurf.ai/?via=heyaihub", network: "Direct" },
        ],
      },
    ],
  },
  // Writing tools
  {
    category: "writing",
    tools: [
      {
        name: "ChatGPT",
        links: [
          { label: "Try ChatGPT Plus", url: "https://chat.openai.com/plus?via=heyaihub", network: "OpenAI" },
          { label: "ChatGPT Enterprise", url: "https://enterprise.openai.com/?via=heyaihub", network: "OpenAI" },
        ],
      },
      {
        name: "Claude",
        links: [
          { label: "Try Claude Pro", url: "https://claude.ai/pro?via=heyaihub", network: "Anthropic" },
          { label: "Claude Team Plan", url: "https://claude.ai/team?via=heyaihub", network: "Anthropic" },
        ],
      },
      {
        name: "Jasper",
        links: [
          { label: "Try Jasper Free Trial", url: "https://jasper.ai/?via=heyaihub", network: "Impact" },
        ],
      },
    ],
  },
  // Design tools
  {
    category: "design",
    tools: [
      {
        name: "Midjourney",
        links: [
          { label: "Start Midjourney Plan", url: "https://www.midjourney.com/?via=heyaihub", network: "Direct" },
        ],
      },
      {
        name: "Canva",
        links: [
          { label: "Try Canva Pro Free", url: "https://www.canva.com/pro?via=heyaihub", network: "ShareASale" },
        ],
      },
    ],
  },
  // Video tools
  {
    category: "video",
    tools: [
      {
        name: "Runway",
        links: [
          { label: "Try Runway ML", url: "https://runwayml.com/?via=heyaihub", network: "Direct" },
        ],
      },
    ],
  },
  // Voice tools
  {
    category: "voice",
    tools: [
      {
        name: "ElevenLabs",
        links: [
          { label: "Try ElevenLabs Free", url: "https://elevenlabs.io/?via=heyaihub", network: "Direct" },
        ],
      },
    ],
  },
  // Productivity tools
  {
    category: "productivity",
    tools: [
      {
        name: "Notion",
        links: [
          { label: "Try Notion AI", url: "https://www.notion.so/product/ai?via=heyaihub", network: "Impact" },
        ],
      },
    ],
  },
  // SEO / Marketing tools
  {
    category: "seo",
    tools: [
      {
        name: "Jasper",
        links: [
          { label: "Try Jasper for SEO", url: "https://jasper.ai/?via=heyaihub", network: "Impact" },
        ],
      },
    ],
  },
  {
    category: "marketing",
    tools: [
      {
        name: "Jasper",
        links: [
          { label: "Try Jasper Marketing", url: "https://jasper.ai/?via=heyaihub", network: "Impact" },
        ],
      },
    ],
  },
];

// Helper: load all tools from JSON files
function loadAllTools() {
  const tools = [];
  const files = fs
    .readdirSync(dataDir)
    .filter((f) => f.endsWith("_tools.json") && f !== "other_tools.json");
  files.forEach((file) => {
    const catId = file.replace("_tools.json", "");
    const content = fs.readFileSync(path.join(dataDir, file), "utf-8").replace(/^﻿/, "");
    const catTools = JSON.parse(content);
    catTools.forEach((t) => {
      t.category_id = catId;
      tools.push(t);
    });
  });
  return tools;
}

// Helper: find tool by name (case-insensitive) in a category
function findToolByName(tools, categoryName, toolName) {
  return tools.find(
    (t) =>
      t.name.toLowerCase() === toolName.toLowerCase() &&
      t.category_id === categoryName
  );
}

async function seed(externalPrisma) {
  const prisma = externalPrisma || new PrismaClient();
  const shouldDisconnect = !externalPrisma;

  console.log("Loading tools from JSON files...");
  const allTools = loadAllTools();
  console.log(`Loaded ${allTools.length} tools.`);

  console.log("Connecting to database...");
  if (!externalPrisma) {
    try {
      await prisma.$connect();
    } catch {
      console.warn(
        "[WARN] Could not connect to database. Affiliate links will be logged but not saved."
      );
      // Log what would be created
      AFFILIATE_TEMPLATES.forEach((catTemplate) => {
        catTemplate.tools.forEach((toolDef) => {
          const tool = findToolByName(allTools, catTemplate.category, toolDef.name);
          toolDef.links.forEach((linkDef) => {
            console.log(
              `  Would create: tool="${toolDef.name}" (${tool?.id || "NOT FOUND"}) → ${linkDef.label} (${linkDef.network})`
            );
          });
        });
      });
      if (shouldDisconnect) await prisma.$disconnect();
      return { created: 0, skipped: 0 };
    }
  }

  let created = 0;
  let skipped = 0;

  console.log("\nSeeding affiliate links...\n");

  for (const catTemplate of AFFILIATE_TEMPLATES) {
    for (const toolDef of catTemplate.tools) {
      // Find tool in DB by slug or name
      const dbTool = await prisma.tool.findFirst({
        where: {
          OR: [
            { slug: toolDef.name.toLowerCase().replace(/\s+/g, "-") },
            { name: { equals: toolDef.name, mode: "insensitive" } },
          ],
        },
      });

      if (!dbTool) {
        console.log(
          `  ⚠ Tool "${toolDef.name}" not found in DB, skipping.`
        );
        skipped += toolDef.links.length;
        continue;
      }

      for (const linkDef of toolDef.links) {
        // Check if link already exists (idempotent)
        const existing = await prisma.affiliateLink.findFirst({
          where: {
            tool_id: dbTool.id,
            url: linkDef.url,
          },
        });

        if (existing) {
          console.log(`  ✓ Already exists: ${linkDef.label} → ${linkDef.url.substring(0, 50)}...`);
          skipped++;
          continue;
        }

        try {
          await prisma.affiliateLink.create({
            data: {
              tool_id: dbTool.id,
              label: linkDef.label,
              url: linkDef.url,
              network: linkDef.network,
              click_count: 0,
            },
          });
          console.log(`  + Created: ${linkDef.label} → ${linkDef.url.substring(0, 50)}...`);
          created++;
        } catch (err) {
          console.error(`  ✗ Failed to create "${linkDef.label}":`, err.message);
        }
      }
    }
  }

  console.log(`\nDone! Created: ${created}, Skipped: ${skipped}`);

  if (shouldDisconnect) {
    await prisma.$disconnect();
  }

  return { created, skipped };
}

// Auto-run when executed directly (node scripts/seed-affiliate-links.js)
if (require.main === module) {
  seed()
    .catch((e) => {
      console.error("Seed failed:", e);
      process.exit(1);
    });
}

// Export for use by seed_db3.js
module.exports = { seed };
