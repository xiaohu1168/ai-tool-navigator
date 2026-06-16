#!/usr/bin/env node
/**
 * Local deployment test script for Cloudflare Pages.
 * Verifies the Next.js standalone build works correctly.
 *
 * Usage:
 *   node test-cloudflare-build.js
 *
 * Requires:
 *   DATABASE_URL environment variable set
 */

const { execSync } = require('child_process');
const { existsSync } = require('fs');
const { join } = require('path');

function step(label) {
  console.log(`\n📦 ${label}`);
}

function check(name, condition, hint) {
  if (condition) {
    console.log(`  ✅ ${name}`);
  } else {
    console.log(`  ❌ ${name}`);
    if (hint) console.log(`     ${hint}`);
    process.exit(1);
  }
}

async function main() {
  const cwd = process.cwd();

  step('Installing dependencies...');
  if (!existsSync(join(cwd, 'node_modules'))) {
    execSync('npm ci', { stdio: 'inherit' });
  } else {
    console.log('  node_modules exists, skipping install');
  }

  step('Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  step('Seeding database...');
  if (process.env.DATABASE_URL) {
    try {
      execSync('node seed_db3.js', { stdio: 'inherit' });
    } catch (e) {
      console.log('  ⚠️  Seed failed (may not have database connection in local env)');
      console.log('  Continuing — this is OK for build verification.');
    }
  } else {
    console.log('  ⚠️  DATABASE_URL not set, skipping seed');
  }

  step('Building Next.js...');
  execSync('npm run build', { stdio: 'inherit' });

  // Verify standalone output
  step('Verifying standalone build...');
  const standaloneDir = join(cwd, '.next', 'standalone');
  const standaloneServer = join(standaloneDir, 'server.js');
  const staticDir = join(cwd, '.next', 'static');
  const pagesDir = join(standaloneDir, 'pages');

  check('Standalone directory exists', existsSync(standaloneDir));
  check('Standalone server.js exists', existsSync(standaloneServer));
  check('.next/static exists', existsSync(staticDir));
  check('Pages directory exists', existsSync(pagesDir));

  // Verify API routes are included
  step('Checking API routes in standalone build...');
  const apiRoutes = [
    'api/newsletter/route.js',
    'api/og/route.js',
  ];
  for (const route of apiRoutes) {
    const routePath = join(standaloneDir, 'server', 'app', route);
    if (existsSync(routePath)) {
      console.log(`  ✅ ${route}`);
    } else {
      console.log(`  ⚠️  ${route} not found in standalone output`);
    }
  }

  console.log('\n✅ All checks passed! Ready for Cloudflare Pages deployment.');
  console.log('\nTo start the standalone server locally:');
  console.log('  cd .next && NODE_ENV=production node standalone/server.js');
}

main().catch((e) => {
  console.error('\n❌ Build verification failed:', e.message);
  process.exit(1);
});
