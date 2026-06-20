/**
 * Sync all blog posts from seed-blog.js and new_blog_posts.json into the database.
 * Upserts existing posts (updates content if truncated) and creates new ones.
 * Run: node scripts/sync-blog-posts.js
 */
const fs = require('fs');
const path = require('path');

// ── Load seed-blog.js data (10 old posts with full content) ──
const seedBlogPath = path.join(__dirname, '..', 'seed-blog.js');
const seedBlogRaw = fs.readFileSync(seedBlogPath, 'utf-8');

// Extract the posts array from seed-blog.js
const postsMatch = seedBlogRaw.match(/const posts = \[([\s\S]*?)\];/);
const seedPosts = eval(`[${postsMatch[1]}]`);

// ── Load new_blog_posts.json (20 new posts with full content) ──
const newDataPath = path.join(__dirname, '..', 'data', 'new_blog_posts.json');
const newData = JSON.parse(fs.readFileSync(newDataPath, 'utf-8').replace(/^﻿/, ''));

// Merge all posts
const allPosts = [...seedPosts, ...newData.blog_posts];

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
    // Generate slug from title if not present (seed-blog.js posts don't have slug)
    let slug = post.slug;
    if (!slug) {
      slug = post.title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    }

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
