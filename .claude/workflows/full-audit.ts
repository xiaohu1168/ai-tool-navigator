export const meta = {
  name: 'full-audit',
  description: 'Comprehensive full-stack project audit across all dimensions',
  phases: [
    { title: 'Codebase Understanding' },
    { title: 'Security Review' },
    { title: 'UI/UX & Performance Review' },
    { title: 'Synthesis & Report' },
  ],
};

// Phase 1: Structure & Codebase Understanding
phase('Codebase Understanding');

const [structureMap, componentAudit, pageAudit, stylingAudit] = await Promise.all([
  agent(
    'Map the project structure thoroughly. Read CLAUDE.md, AGENTS.md, package.json, next.config.*, eslint config, tsconfig, and any docs/ folder. Identify the framework, key dependencies, project architecture (app dir vs pages dir, server components, routing structure). Return a structured summary of: framework/version, dependencies, routing, data layer (db, orm, cache), and key architecture decisions. Focus on what makes THIS project unique.',
    { label: 'Structure map', phase: 'Codebase Understanding' }
  ),
  agent(
    'Review all React components in src/components/. Read every component file. Assess: component organization, prop types, reusability, server vs client component usage, accessibility, responsive design considerations, state management patterns. Check for common issues like missing keys, unnecessary client components, missing ARIA attributes, hardcoded values. Summarize findings with specific file:line references.',
    { label: 'Component audit', phase: 'Codebase Understanding' }
  ),
  agent(
    'Review all pages in src/app/. Read route.ts files and page.tsx files. Assess: loading states, error boundaries, metadata/SEO, data fetching patterns, dynamic routing, accessibility, mobile responsiveness in page layouts. Check for proper use of Next.js features (generateMetadata, loading.tsx, error.tsx). Summarize with specific file:line references.',
    { label: 'Page audit', phase: 'Codebase Understanding' }
  ),
  agent(
    'Review all styling in the project: global CSS, tailwind config, any CSS modules, component styles. Assess: design consistency, tailwind usage patterns, custom vs utility classes, responsive breakpoints, color system, typography, dark mode support, design tokens. Check tailwind.config.* for configuration quality.',
    { label: 'Styling audit', phase: 'Codebase Understanding' }
  ),
]);

// Phase 2: Security Deep Dive
phase('Security Review');

const [apiSecurity, authReview, dataLayer, configAudit] = await Promise.all([
  agent(
    'Review ALL API routes in src/app/api/. Read every route.ts/route.ts file. Assess: authentication, authorization, input validation, rate limiting, error handling, CSRF protection, CORS, data leakage in error messages. Check the middleware.ts for auth protection. Flag any missing auth checks, missing input validation, SQL injection risks, XSS risks, information disclosure. Be extremely thorough — read every line of every API route.',
    { label: 'API security', phase: 'Security Review' }
  ),
  agent(
    'Review authentication and authorization: read src/lib/auth.ts, src/middleware.ts, and any auth-related API routes. Assess: token management, session handling, cookie security (HttpOnly, Secure, SameSite), password handling, HMAC verification, admin authorization checks, token refresh, logout flow. Check for common auth vulnerabilities.',
    { label: 'Auth review', phase: 'Security Review' }
  ),
  agent(
    'Review the data layer: read src/lib/db.ts, src/lib/datastore.ts, and any database/schema files. Assess: connection management, query patterns, SQL injection risks, N+1 queries, missing indexes, schema design, data validation at the DB level, migrations strategy, error handling on DB operations. Check for hardcoded credentials or secrets.',
    { label: 'Data layer', phase: 'Security Review' }
  ),
  agent(
    'Review configuration and secrets management. Check for: hardcoded API keys, environment variable usage, .env.example presence, secrets in git history, secure defaults. Read next.config.*, any CI/CD configs, deployment configs. Assess overall security hygiene of configuration.',
    { label: 'Config audit', phase: 'Security Review' }
  ),
]);

// Phase 3: Additional Dimensions
phase('UI/UX & Performance Review');

const [performance, codeQuality, seoOps] = await Promise.all([
  agent(
    'Review for performance issues: image optimization, bundle size concerns, unnecessary re-renders, missing memoization, server vs client component balance, data fetching efficiency, caching strategies, font loading, lazy loading patterns, database query efficiency. Check for common Next.js performance anti-patterns.',
    { label: 'Performance', phase: 'UI/UX & Performance Review' }
  ),
  agent(
    'Review code quality across the codebase: TypeScript usage (strict mode, any usage), error handling consistency, code organization, naming conventions, DRY principle adherence, complexity (cyclomatic), dead code, test coverage, linting configuration. Read src/lib/ files thoroughly. Assess overall code maintainability.',
    { label: 'Code quality', phase: 'UI/UX & Performance Review' }
  ),
  agent(
    'Review SEO and operational aspects: metadata in pages, Open Graph tags, sitemap configuration, robots.txt, analytics integration, AdSense integration (check AdBanner.tsx, AdSenseScript.tsx), accessibility (a11y), structured data, canonical URLs, language attributes, meta descriptions. Check src/components/Header.tsx, src/app/layout.tsx for SEO elements.',
    { label: 'SEO/ops', phase: 'UI/UX & Performance Review' }
  ),
]);

// Phase 4: Synthesis
phase('Synthesis & Report');

const synthesis = await agent(
  'You are a senior tech audit lead. Synthesize the following audit findings into a comprehensive, actionable report in Chinese.\n\n' +
  '## Project Structure\n' + structureMap + '\n\n' +
  '## Component Audit\n' + componentAudit + '\n\n' +
  '## Page Audit\n' + pageAudit + '\n\n' +
  '## Styling Audit\n' + stylingAudit + '\n\n' +
  '## API Security\n' + apiSecurity + '\n\n' +
  '## Auth Review\n' + authReview + '\n\n' +
  '## Data Layer\n' + dataLayer + '\n\n' +
  '## Config/Secrets\n' + configAudit + '\n\n' +
  '## Performance\n' + performance + '\n\n' +
  '## Code Quality\n' + codeQuality + '\n\n' +
  '## SEO & Operations\n' + seoOps + '\n\n' +
  '## Deliver a structured report in Chinese:\n\n' +
  '1. **项目概览** — 技术栈、架构特点\n' +
  '2. **🔴 严重问题** (必须立即修复的安全/功能 bug)\n' +
  '3. **🟡 重要建议** (应该尽快改进的 UI/性能/代码质量)\n' +
  '4. **🟢 优化建议** (锦上添花的改进)\n' +
  '5. **整体评分** (满分10分)\n\n' +
  '对每个问题给出：问题描述 + 严重程度 + 具体文件位置 + 修复建议\n' +
  '按优先级排序，确保建议是可操作的具体步骤。',
  { label: 'Final report', phase: 'Synthesis & Report' }
);

return synthesis;
