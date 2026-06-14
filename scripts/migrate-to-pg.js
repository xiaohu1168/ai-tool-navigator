// Run this AFTER setting up Neon and setting DATABASE_URL in .env.local
// Usage: node scripts/migrate-to-pg.js
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function main() {
  console.log('Starting PostgreSQL migration...');
  
  // Read tools from JSON files
  const dataDir = path.join(__dirname, '..', 'data');
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('_tools.json') && f !== 'other_tools.json');
  
  let toolCount = 0;
  for (const file of files) {
    const catId = file.replace('_tools.json', '');
    const tools = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf-8').replace(/^\uFEFF/, ''));
    
    for (const t of tools) {
      const tags = t.tags || [];
      const pros = t.pros || [];
      const cons = t.cons || [];
      
      await prisma.tool.upsert({
        where: { slug: t.slug },
        update: { ...t, tags, pros, cons, category_id: catId },
        create: {
          slug: t.slug,
          name: t.name,
          description: t.description,
          url: t.url,
          price: t.price,
          price_type: t.price_type || 'Free',
          rating: t.rating || 4.0,
          tags,
          pros,
          cons,
          for_whom: t.for_whom || '',
          not_for: t.not_for || '',
          alternatives: t.alternatives || '',
          category_id: catId,
        }
      });
      toolCount++;
    }
  }
  
  console.log(Migrated  tools to PostgreSQL);
  
  // Seed comparisons and prompts would go here too
  console.log('Migration complete!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.());
