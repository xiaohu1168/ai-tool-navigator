# Database Migration Guide

## Prerequisites

1. **Install Git** (if not already installed)
   ```
   winget install Git.Git
   ```

2. **Ensure DATABASE_URL is set** in `.env` or `.env.local`:
   ```
   DATABASE_URL=postgresql://user:password@host:5432/heyaihub
   ```

## Generate Migration

Run in project root:

```bash
npx prisma migrate dev --name init
```

This will:
1. Analyze `src/prisma/schema.prisma`
2. Create SQL migration files in `prisma/migrations/`
3. Apply the migration to your database
4. Generate Prisma Client

## Deploy to Production

On production deployment (Netlify/Vercel), run:

```bash
npx prisma migrate deploy
```

This applies pending migrations without generating new ones.

## Recommended: Add to netlify.toml

Add a postbuild hook to auto-apply migrations:

```toml
[build]
  command = "npx prisma migrate deploy && npm run build"
  publish = ".next"
```

## Current Schema Models

| Model | Description |
|-------|-------------|
| Tool | AI tool listing (name, slug, description, URL, rating, etc.) |
| Category | Tool categories |
| Submission | User-submitted tool requests |
| BlogPost | Blog articles |
| SearchQuery | Logged search queries |
| PageView | Analytics page views |
| AdPerformance | Ad performance tracking |
| AffiliateLink | Affiliate link tracking |
| Prompt | AI prompts per tool |
| ComparePage | Tool comparison pages |
