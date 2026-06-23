# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hey AI Hub is a Next.js-based AI tool directory and comparison platform deployed on Netlify. It curates AI tools across 12+ categories, publishes blog content, and offers tool comparison pages. The site uses PostgreSQL (Neon) with Prisma ORM and follows the App Router pattern.

## Key Commands

### Development
```bash
npm run dev          # Start Next.js dev server (port 3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
```

### Database
```bash
npx prisma generate  # Generate Prisma client (required before seed/build)
npx prisma db push   # Push schema to database (dev)
npx prisma migrate   # Use migrations in production
```

### Seed Data
```bash
node seed_db3.js              # Full seed: categories, tools, affiliates, comparisons, best pages, blog posts
node seed-blog.js             # Legacy: seed only the 10 original blog posts
node scripts/sync-blog-posts.js  # Upsert all 30 blog posts (10 legacy + 20 new) from JSON data files
```

### Testing
```bash
npm run test:env       # Validate environment variables
npm run build:verify   # Test Cloudflare build compatibility
npx pa11y http://localhost:3000  # Accessibility audit
```

### Deployment
- **Netlify**: Push to `master` triggers auto-deploy. Build command in `netlify.toml`:
  ```
  npx prisma generate && node seed_db3.js && npm run build
  ```
- **Node.js**: Set to `22` in `netlify.toml` (Node 20 is deprecated on runners)
- **Required env vars**: `DATABASE_URL`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_ADSENSE_PUB_ID`, `NEXT_PUBLIC_GA_ID`

## Architecture

### Data Flow
```
JSON data files (data/*.json)
    ↓ seed_db3.js
Prisma schema (prisma/schema.prisma)
    ↓ PostgreSQL (Neon)
db.ts (database layer) → tools.ts (type transformation + caching)
    ↓
API routes (src/app/api/*) → Server Components / Pages
```

### Core Layers

**Data Source** — `data/` directory contains:
- `*_tools.json` files (12+ category tool lists)
- `categories.json` (category metadata)
- `new_blog_posts.json` (20 new blog articles)
- `seed_blog_legacy.json` (10 legacy blog articles)
- `best_pages_data.json`, `comparison_pages_data.json` (comparison/best-of pages)
- `prompts_seed.json`, `submissions.json` (admin data)

**Database Layer** — `src/lib/db.ts`:
- Exports Prisma client with connection pooling
- Defines interfaces: `DbTool`, `DbCategory`, `DbSubmission`, etc.
- CRUD functions for all entities (tools, blogs, categories, submissions, affiliate links, compare pages, prompts)
- Analytics: click tracking, page views, search queries

**Type Transformation** — `src/lib/tools.ts`:
- Bridges raw Prisma results to typed interfaces (`Tool`, `Category`, `AffiliateLink`, `Prompt`, `ComparePage`)
- Handles JSON array parsing for `tags`, `pros`, `cons` fields
- Graceful error handling: returns empty arrays on DB failures

**API Routes** — `src/app/api/`:
- `/api/tools` — CRUD for tools (auth-protected for write)
- `/api/blog` — Blog post CRUD
- `/api/categories` — Category listing
- `/api/track/click` — Tool click tracking
- `/api/track/affiliate` — Affiliate link tracking
- `/api/submit` — User tool submissions
- `/api/stats` — Admin analytics
- `/api/auth/*` — Login/logout/me endpoints

**Pages** — `src/app/`:
- `page.tsx` — Home: hero, featured tools, latest tools, blog preview, FAQ
- `tools/[slug]/page.tsx` — Individual tool detail with affiliate links, prompts, comparisons
- `blog/[slug]/page.tsx` — Blog post with view tracking
- `category/[slug]/page.tsx` — Category listing
- `best/[slug]/page.tsx` — "Best of" curated list per category
- `compare/[slug1]-vs-[slug2]/page.tsx` — Side-by-side tool comparison
- `search/page.tsx` — Full-text search
- `admin/page.tsx` — Admin dashboard (auth required)
- Static pages: `/about`, `/contact`, `/faq`, `/privacy`, `/terms`, `/editorial`, `/submit`

**Admin Auth** — Cookie-based JWT stored in `admin_token` cookie:
- `src/middleware.ts` handles route protection (`/admin` paths)
- HMAC-SHA256 signed tokens using `NEXT_PUBLIC_ADMIN_SALT`
- Role levels: EDITOR < ADMIN < SUPER_ADMIN

### Key Components
- `components/layout/Header.tsx` — Navigation with search
- `components/layout/Footer.tsx` — Site footer
- `components/ToolCard.tsx` — Tool listing card
- `components/CategoryCard.tsx` — Category grid item
- `components/AdBanner.tsx` — AdSense ad placement
- `components/AdSenseScript.tsx` / `ConsentBanner.tsx` / `GoogleAnalytics.tsx` — Third-party scripts
- `components/admin/*` — Admin dashboard sub-components

### SEO & Discovery
- `src/app/sitemap.ts` — Dynamic sitemap from DB (tools, categories, blogs, best pages)
- `src/app/feed.ts` — RSS feed for latest 20 tools
- `src/app/api/og/route.tsx` — Open Graph image generation
- JSON-LD structured data in `layout.tsx` (Organization + WebSite schemas)
- Google Search Console + Impact verification meta tags in `layout.tsx`

### Scripts Directory
`scripts/` contains data transformation and migration tools:
- `sync-blog-posts.js` — **Primary blog sync**: upserts all 30 posts from JSON
- `seed-affiliate-links.js` — Affiliate link seeding
- `import-comparison-pages.js` — Comparison page import
- `import-best-pages.js` — Best-of page import
- `generate-enhanced-descriptions.js` — AI description generation
- `migrate_data.js`, `migrate-to-pg.js` — Data migrations
- Various legacy seed scripts (`seed-db.js`, `seed-db2.js`, `write-pages.js`, etc.)

## Important Conventions

- **Next.js 16** — Breaking changes from older versions; check `node_modules/next/dist/docs/` for migration notes
- **Tailwind CSS v4** + **shadcn/ui** components in `components/ui/`
- **Server Components** are the default; use `'use client'` directive only when interactivity is needed
- **Error resilience** — API routes and server components use try/catch with graceful degradation (empty arrays, not crashes)
- **Prisma String arrays** — `tags`, `pros`, `cons` are stored as PostgreSQL `TEXT[]` arrays
- **No TypeScript errors in build** — `nextConfig.ts` sets `ignoreDuringBuilds: true` for both ESLint and TypeScript; fix properly instead of suppressing

## Environment Files
- `.env.example` — Template with all required variables
- `.env.local` — Local development overrides
- `.env.production` — Production values (committed; ensure secrets are managed via Netlify dashboard instead)
