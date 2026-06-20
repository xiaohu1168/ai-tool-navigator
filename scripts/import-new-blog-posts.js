/**
 * Import new blog posts from data/new_blog_posts.json
 * Run: node scripts/import-new-blog-posts.js
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

async function importNewBlogPosts(prisma) {
  const shouldDisconnect = !prisma;
  if (shouldDisconnect) {
    const { PrismaClient } = require('@prisma/client');
    prisma = new PrismaClient();
  }

  const filePath = path.join(DATA_DIR, 'new_blog_posts.json');
  const raw = fs.readFileSync(filePath, 'utf-8').replace(/^﻿/, '');
  const data = JSON.parse(raw);
  const posts = data.blog_posts;

  console.log(`Importing ${posts.length} new blog posts...\n`);

  let created = 0;
  let skipped = 0;

  for (const post of posts) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: post.slug } });
    if (existing) {
      console.log(`  Skipped (exists): ${post.title}`);
      skipped++;
      continue;
    }

    await prisma.blogPost.create({
      data: {
        slug: post.slug,
        title: post.title,
        content: post.content,
        category: post.category,
        date: post.date,
        views: 0,
      },
    });

    console.log(`  Created: ${post.title}`);
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
  importNewBlogPosts()
    .catch(e => { console.error(e); process.exit(1); });
}

module.exports = { importNewBlogPosts };
