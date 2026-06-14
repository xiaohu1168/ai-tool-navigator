const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

async function seed() {
  await prisma.$connect();
  console.log('Connected to database!');
  
  const categories = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'data', 'categories.json'), 'utf-8').replace(/^\uFEFF/, '')
  );
  
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.id },
      update: {},
      create: { id: cat.id, slug: cat.id, name: cat.name, icon: cat.icon, description: cat.description || '' }
    });
  }
  console.log('Categories seeded:', categories.length);
  
  // Seed tools
  const files = fs.readdirSync(path.join(__dirname, 'data')).filter(f => f.endsWith('_tools.json') && f !== 'other_tools.json');
  let toolCount = 0;
  for (const file of files) {
    const catId = file.replace('_tools.json', '');
    const tools = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'data', file), 'utf-8').replace(/^\uFEFF/, '')
    );
    for (const t of tools) {
      await prisma.tool.upsert({
        where: { slug: t.slug },
        update: {},
        create: {
          slug: t.slug, name: t.name, description: t.description, url: t.url,
          price: t.price || 'Free', price_type: t.price_type || 'Free',
          rating: t.rating || 4.0, featured: t.featured || false,
          tags: t.tags ? JSON.stringify(t.tags) : '[]',
          pros: t.pros ? JSON.stringify(t.pros) : '[]',
          cons: t.cons ? JSON.stringify(t.cons) : '[]',
          for_whom: t.for_whom || '', not_for: t.not_for || '', alternatives: t.alternatives || '',
          privacy: t.privacy || null, updated: t.updated || null,
          category_id: catId,
        }
      });
      toolCount++;
    }
  }
  console.log('Tools seeded:', toolCount);
  await prisma.$disconnect();
  console.log('Done!');
}

seed().catch(e => { console.error(e); process.exit(1); });
