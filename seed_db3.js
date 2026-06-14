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
  await prisma.$connect();
  
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
  
  const finalCat = await prisma.category.count();
  const finalTool = await prisma.tool.count();
  console.log(`Final: ${finalCat} categories, ${finalTool} tools`);
  
  await prisma.$disconnect();
  console.log('Done!');
}

seed().catch(e => { console.error(e); process.exit(1); });
