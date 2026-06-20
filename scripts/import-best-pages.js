/**
 * Import "Best X Tools" pages into the database.
 *
 * Usage: node scripts/import-best-pages.js
 * Or:    const { importBestPages } = require('./scripts/import-best-pages.js')
 *        await importBestPages(prismaInstance)
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

async function importBestPages(prisma) {
  const shouldDisconnect = !prisma;
  if (shouldDisconnect) {
    const { PrismaClient } = require('@prisma/client');
    prisma = new PrismaClient();
  }

  const filePath = path.join(DATA_DIR, 'best_pages_data.json');
  const raw = fs.readFileSync(filePath, 'utf-8').replace(/^﻿/, '');
  const data = JSON.parse(raw);
  const pages = data.best_pages;

  console.log(`Importing ${pages.length} Best pages...\n`);

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
  importBestPages()
    .catch(e => { console.error(e); process.exit(1); });
}

module.exports = { importBestPages };
