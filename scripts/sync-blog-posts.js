/**
 * Sync all blog posts from seed_blog_legacy.json and new_blog_posts.json into the database.
 * Upserts existing posts (updates content if truncated) and creates new ones.
 * Run: node scripts/sync-blog-posts.js
 */
const fs = require('fs');
const path = require('path');

// ── Load seed blog legacy data (10 old posts with full content) ──
const legacyPath = path.join(__dirname, '..', 'data', 'seed_blog_legacy.json');
const legacyPosts = JSON.parse(fs.readFileSync(legacyPath, 'utf-8'));

// ── Load new blog posts batch 1 (20 posts with full content) ──
const newDataPath = path.join(__dirname, '..', 'data', 'new_blog_posts.json');
const newData = JSON.parse(fs.readFileSync(newDataPath, 'utf-8').replace(/^﻿/, ''));

// ── Load new blog posts batch 2 (10 posts with full content) ──
const newData2Path = path.join(__dirname, '..', 'data', 'new_blog_posts_batch2.json');
const newData2 = JSON.parse(fs.readFileSync(newData2Path, 'utf-8'));

// Merge all posts
const allPosts = [...legacyPosts, ...newData.blog_posts, ...newData2];

// ── Prisma sync ──
async function syncBlogPosts(prisma) {
  const shouldDisconnect = !prisma;
  if (shouldDisconnect) {
    const { PrismaClient } = require('@prisma/client');
    prisma = new PrismaClient();
  }

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const post of allPosts) {
    const slug = post.slug;

    const existing = await prisma.blogPost.findUnique({ where: { slug } });

    if (existing) {
      // Update if content is significantly different (e.g. truncated)
      const existingLen = existing.content ? existing.content.length : 0;
      const newLen = post.content ? post.content.length : 0;

      if (newLen > existingLen + 10) {
        await prisma.blogPost.update({
          where: { slug },
          data: {
            title: post.title,
            content: post.content,
            category: post.category,
            date: post.date,
          },
        });
        console.log(`  Updated: ${post.title} (${existingLen} -> ${newLen} chars)`);
        updated++;
      } else {
        console.log(`  Skipped: ${post.title} (content already complete)`);
        skipped++;
      }
    } else {
      await prisma.blogPost.create({
        data: {
          slug,
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
  }

  console.log(`\nDone! Created: ${created}, Updated: ${updated}, Skipped: ${skipped}`);

  if (shouldDisconnect) {
    await prisma.$disconnect();
  }

  return { created, updated, skipped };
}

// Auto-run when executed directly
if (require.main === module) {
  syncBlogPosts()
    .catch(e => { console.error(e); process.exit(1); });
}

module.exports = { syncBlogPosts };
