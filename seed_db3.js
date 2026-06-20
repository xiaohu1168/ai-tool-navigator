const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

function safeArr(val) {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') { try { return JSON.parse(val); } catch { return []; } }
  return [];
}

async function seed() {
  try {
    await prisma.$connect();
  } catch (e) {
    console.log('Seed skipped: database unavailable (expected in build environment)');
    return;
  }
  
  // 1. Ensure ALL categories from tool files exist
  const dataDir = path.join(__dirname, 'data');
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('_tools.json') && f !== 'other_tools.json');
  const allCatIds = new Set(files.map(f => f.replace('_tools.json', '')));
  
  // Also read categories.json
  const categories = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'categories.json'), 'utf-8').replace(/^\uFEFF/, '')
  );
  
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.id },
      update: {},
      create: { id: cat.id, slug: cat.id, name: cat.name, icon: cat.icon, description: cat.description || '' }
    });
  }
  
  // Ensure any missing category from tool files
  for (const catId of allCatIds) {
    const existing = await prisma.category.findUnique({ where: { slug: catId } });
    if (!existing) {
      await prisma.category.create({
        data: { id: catId, slug: catId, name: catId, icon: '🛠️', description: '' }
      });
      console.log('Created missing category:', catId);
    }
  }
  
  // 2. Seed tools
  let tc = 0;
  for (const file of files) {
    const catId = file.replace('_tools.json', '');
    const tools = JSON.parse(
      fs.readFileSync(path.join(dataDir, file), 'utf-8').replace(/^\uFEFF/, '')
    );
    for (const t of tools) {
      await prisma.tool.upsert({
        where: { slug: t.slug },
        update: {
          name: t.name, description: t.description, url: t.url,
          price: t.price || 'Free', price_type: t.price_type || 'Free',
          rating: t.rating || 4.0, featured: t.featured || false,
          tags: safeArr(t.tags), pros: safeArr(t.pros), cons: safeArr(t.cons),
          for_whom: t.for_whom || '', not_for: t.not_for || '', alternatives: t.alternatives || '',
          privacy: t.privacy || null, updated: t.updated || null,
        },
        create: {
          slug: t.slug, name: t.name, description: t.description, url: t.url,
          price: t.price || 'Free', price_type: t.price_type || 'Free',
          rating: t.rating || 4.0, featured: t.featured || false,
          tags: safeArr(t.tags),
          pros: safeArr(t.pros),
          cons: safeArr(t.cons),
          for_whom: t.for_whom || '', not_for: t.not_for || '', alternatives: t.alternatives || '',
          privacy: t.privacy || null, updated: t.updated || null,
          category_id: catId,
        }
      });
      tc++;
    }
  }
  console.log('Tools seeded/updated:', tc);

  // Update category counts
  const allTools = await prisma.tool.findMany();
  for (const cat of categories) {
    const toolCount = allTools.filter(t => t.category_id === cat.id).length;
    await prisma.category.update({
      where: { slug: cat.id },
      data: { count: toolCount }
    });
  }
  // Also count "other" category if it exists
  const otherTools = await prisma.tool.findMany({ where: { category_id: 'other' } });
  if (otherTools.length > 0) {
    await prisma.category.upsert({
      where: { slug: 'other' },
      update: { count: otherTools.length },
      create: { id: 'other', slug: 'other', name: 'Other', icon: '🛠️', description: '', count: otherTools.length }
    });
  }

  const finalCat = await prisma.category.count();
  const finalTool = await prisma.tool.count();
  console.log(`Final: ${finalCat} categories, ${finalTool} tools`);

  // ── Seed affiliate links (best-effort, non-blocking) ──
  try {
    console.log('\nSeeding affiliate links (best-effort)...');
    const { seed: seedAffiliate } = require('./scripts/seed-affiliate-links.js');
    await seedAffiliate(prisma);
  } catch {
    console.log('[WARN] Affiliate link seeding skipped (non-critical)');
  }

  // ── Import comparison pages (best-effort, non-blocking) ──
  try {
    console.log('\nImporting comparison pages...');
    const { importComparisonPages } = require('./scripts/import-comparison-pages.js');
    await importComparisonPages(prisma);
  } catch {
    console.log('[WARN] Comparison pages import skipped (non-critical)');
  }

  // ── Import best pages (best-effort, non-blocking) ──
  try {
    console.log('\nImporting Best pages...');
    const { importBestPages } = require('./scripts/import-best-pages.js');
    await importBestPages(prisma);
  } catch {
    console.log('[WARN] Best pages import skipped (non-critical)');
  }

  // ── Import new blog posts (best-effort, non-blocking) ──
  try {
    console.log('\nImporting new blog posts...');
    const { importNewBlogPosts } = require('./scripts/import-new-blog-posts.js');
    await importNewBlogPosts(prisma);
  } catch {
    console.log('[WARN] New blog posts import skipped (non-critical)');
  }

  await prisma.$disconnect();
  console.log('Done!');
}

seed().catch(e => { console.error(e); process.exit(1); });
