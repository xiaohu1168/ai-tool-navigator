/**
 * Update tool descriptions in the database with enhanced versions.
 * Reads from data/enhanced_<category>_descriptions.json and updates the database.
 *
 * Usage: node scripts/update-descriptions.js <category>
 * Example: node scripts/update-descriptions.js coding
 */
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const DATA_DIR = path.join(__dirname, '..', 'data');

async function updateDescriptions(category) {
  const filePath = path.join(DATA_DIR, `enhanced_${category}_descriptions.json`);

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    console.error('Make sure you have generated enhanced descriptions first.');
    process.exit(1);
  }

  const enhancements = JSON.parse(fs.readFileSync(filePath, 'utf-8').replace(/^﻿/, ''));
  let updated = 0;
  let skipped = 0;

  for (const [slug, data] of Object.entries(enhancements)) {
    const tool = await prisma.tool.findUnique({ where: { slug } });
    if (!tool) {
      console.warn(`Tool not found in database: ${slug}`);
      skipped++;
      continue;
    }

    const oldDesc = tool.description;
    const newDesc = data.description;

    if (oldDesc === newDesc) {
      console.log(`Skipping (unchanged): ${data.name}`);
      skipped++;
      continue;
    }

    await prisma.tool.update({
      where: { slug },
      data: { description: newDesc }
    });

    console.log(`Updated: ${data.name}`);
    console.log(`  Old: ${oldDesc.substring(0, 80)}...`);
    console.log(`  New: ${newDesc.substring(0, 80)}...`);
    updated++;
  }

  console.log(`\nDone! Updated: ${updated}, Skipped: ${skipped}`);
}

async function main() {
  const category = process.argv[2];
  if (!category) {
    console.error('Usage: node scripts/update-descriptions.js <category>');
    console.error('Example: node scripts/update-descriptions.js coding');
    process.exit(1);
  }

  await prisma.$connect();
  await updateDescriptions(category);
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
