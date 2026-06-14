# Migration guide for Netlify

Add this section to your netlify.toml postbuild:

```toml
[build]
  command = "npx prisma migrate deploy && npm run build"
```

This ensures Prisma migrations are applied before the Next.js build.

## Manual steps

1. Run this ONCE on the production server (or via psql):
   ```bash
   npx prisma migrate dev --name init
   ```

2. This generates SQL in `prisma/migrations/` directory.

3. On production, `npx prisma migrate deploy` reads these files and applies them.
