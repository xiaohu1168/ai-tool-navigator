/**
 * Import comparison pages into the database.
 * Reads from data/comparison_pages_data.json and creates BlogPost entries.
 *
 * Usage: node scripts/import-comparison-pages.js
 * Or:    const { importComparisonPages } = require('./scripts/import-comparison-pages.js')
 *        await importComparisonPages(prismaInstance)
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

async function importComparisonPages(prisma) {
  const shouldDisconnect = !prisma;
  if (shouldDisconnect) {
    const { PrismaClient } = require('@prisma/client');
    prisma = new PrismaClient();
  }

  const filePath = path.join(DATA_DIR, 'comparison_pages_data.json');
  const raw = fs.readFileSync(filePath, 'utf-8').replace(/^﻿/, '');
  const data = JSON.parse(raw);
  const pages = data.comparison_pages;

  console.log(`Importing ${pages.length} comparison pages...\n`);

  let created = 0;
  let skipped = 0;

  for (const page of pages) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: page.slug } });
    if (existing) {
      console.log(`  Skipped (exists): ${page.title}`);
      skipped++;
      continue;
    }

    await prisma.blogPost.create({
      data: {
        slug: page.slug,
        title: page.title,
        content: page.content,
        category: page.category,
        date: page.date,
        views: 0,
      },
    });

    console.log(`  Created: ${page.title}`);
    created++;
  }

  console.log(`\nDone! Created: ${created}, Skipped: ${skipped}`);

  if (shouldDisconnect) {
    await prisma.$disconnect();
  }

  return { created, skipped };
}

// Auto-run when executed directly
if (require.main === module) {
  importComparisonPages()
    .catch(e => { console.error(e); process.exit(1); });
}

module.exports = { importComparisonPages };
