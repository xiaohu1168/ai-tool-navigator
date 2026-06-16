/**
 * Merge all enhanced description files into a single database update.
 * Reads all enhanced_*.json files from data/ and updates tools in the database.
 *
 * Usage: node scripts/bulk-update-descriptions.js
 */
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const DATA_DIR = path.join(__dirname, '..', 'data');

// Mapping of enhanced description files to their category tool files
const FILE_MAP = {
  'enhanced_coding_descriptions.json': 'coding_tools.json',
  'enhanced_writing_descriptions.json': 'writing_tools.json',
  'enhanced_design_descriptions.json': 'design_tools.json',
  'enhanced_seo_marketing_productivity_descriptions.json': null, // array format
  'enhanced_voice_video_analytics_descriptions.json': null,      // array format
  'enhanced_remaining_descriptions.json': null,                  // array format
};

async function main() {
  console.log('='.repeat(60));
  console.log('Bulk Description Updater');
  console.log('='.repeat(60));

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  // Process object-format files (keyed by slug)
  const objectFiles = [
    'enhanced_coding_descriptions.json',
    'enhanced_writing_descriptions.json',
    'enhanced_design_descriptions.json',
  ];

  for (const file of objectFiles) {
    const filePath = path.join(DATA_DIR, file);
    if (!fs.existsSync(filePath)) {
      console.warn(`Skipping missing file: ${file}`);
      continue;
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8').replace(/^﻿/, ''));
    console.log(`\nProcessing ${file}...`);

    for (const [slug, toolData] of Object.entries(data)) {
      try {
        const tool = await prisma.tool.findUnique({ where: { slug } });
        if (!tool) {
          console.warn(`  Tool not found: ${slug}`);
          skipped++;
          continue;
        }

        if (tool.description === toolData.description) {
          console.log(`  Skipping (unchanged): ${toolData.name}`);
          skipped++;
          continue;
        }

        await prisma.tool.update({
          where: { slug },
          data: { description: toolData.description }
        });

        console.log(`  Updated: ${toolData.name} (${toolData.description.length} chars)`);
        updated++;
      } catch (err) {
        console.error(`  Error updating ${slug}:`, err.message);
        errors++;
      }
    }
  }

  // Process array-format files
  const arrayFiles = [
    'enhanced_seo_marketing_productivity_descriptions.json',
    'enhanced_voice_video_analytics_descriptions.json',
    'enhanced_remaining_descriptions.json',
  ];

  for (const file of arrayFiles) {
    const filePath = path.join(DATA_DIR, file);
    if (!fs.existsSync(filePath)) {
      console.warn(`Skipping missing file: ${file}`);
      continue;
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8').replace(/^﻿/, ''));
    console.log(`\nProcessing ${file} (${Object.keys(data).length} categories)...`);

    for (const [category, tools] of Object.entries(data)) {
      console.log(`  ${category}: ${tools.length} tools`);
      for (const toolData of tools) {
        try {
          const tool = await prisma.tool.findUnique({ where: { slug: toolData.slug } });
          if (!tool) {
            console.warn(`    Tool not found: ${toolData.slug}`);
            skipped++;
            continue;
          }

          if (tool.description === toolData.description) {
            skipped++;
            continue;
          }

          await prisma.tool.update({
            where: { slug: toolData.slug },
            data: { description: toolData.description }
          });

          console.log(`    Updated: ${toolData.name} (${toolData.description.length} chars)`);
          updated++;
        } catch (err) {
          console.error(`    Error: ${toolData.slug}:`, err.message);
          errors++;
        }
      }
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`DONE! Updated: ${updated}, Skipped: ${skipped}, Errors: ${errors}`);
  console.log(`${'='.repeat(60)}`);

  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
