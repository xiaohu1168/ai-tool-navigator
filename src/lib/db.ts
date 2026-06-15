import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: [
    { emit: 'stdout', level: 'error' },
  ],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

function safeParseJsonArray(val: unknown): string[] {
  if (Array.isArray(val)) return val.map(String);
  if (typeof val === 'string') {
    try { const parsed = JSON.parse(val); return Array.isArray(parsed) ? parsed.map(String) : []; } catch { return val.trim() ? val.split(',').map(s => s.trim()) : []; }
  }
  return [];
}

export interface DbTool {
  id: string;
  slug: string;
  name: string;
  description: string;
  url: string;
  price: string;
  price_type: string;
  rating: number;
  featured: boolean;
  tags: string[];
  pros: string[];
  cons: string[];
  for_whom: string;
  not_for: string;
  alternatives: string;
  privacy: string | null;
  updated: string | null;
  category_id: string;
  click_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface DbCategory {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description: string;
  count: number;
}

export interface DbSubmission {
  id: string;
  name: string;
  url: string;
  description: string;
  category_id: string;
  price: string | null;
  tags: string | null;
  status: string;
  created_at: Date;
  updated_at: Date;
}

// --- Tool CRUD --- (PostgreSQL: tags/pros/cons are String[], returned as-is from Prisma)
export async function getAllTools(): Promise<DbTool[]> {
  return (await prisma.tool.findMany({ orderBy: { rating: 'desc' } })) as unknown as DbTool[];
}

export async function getToolsByCategory(categoryId: string): Promise<DbTool[]> {
  return (await prisma.tool.findMany({
    where: { category_id: categoryId },
    orderBy: { rating: 'desc' }
  })) as unknown as DbTool[];
}

export async function getToolBySlug(slug: string): Promise<DbTool | undefined> {
  return (await prisma.tool.findUnique({ where: { slug } })) as unknown as DbTool | undefined;
}

export async function getFeaturedTools(count = 6): Promise<DbTool[]> {
  return (await prisma.tool.findMany({
    where: { featured: true },
    orderBy: { rating: 'desc' },
    take: count
  })) as unknown as DbTool[];
}

export async function searchTools(query: string): Promise<DbTool[]> {
  if (!query) return getAllTools();
  return (await prisma.tool.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { tags: { has: query } }
      ]
    },
    orderBy: { rating: 'desc' }
  })) as unknown as DbTool[];
}

// --- Category ---
export async function getCategories(): Promise<DbCategory[]> {
  return (await prisma.category.findMany({ orderBy: { name: 'asc' } })) as unknown as DbCategory[];
}

// --- Submission ---
export async function getSubmissions(): Promise<DbSubmission[]> {
  return (await prisma.submission.findMany({ orderBy: { created_at: 'desc' } })) as unknown as DbSubmission[];
}

export async function addSubmission(data: {
  name: string;
  url: string;
  description: string;
  category_id: string;
  price?: string;
  tags?: string;
}): Promise<string> {
  const submission = await prisma.submission.create({
    data: {
      name: data.name,
      url: data.url,
      description: data.description,
      category_id: data.category_id,
      price: data.price || null,
      tags: data.tags || null,
      status: 'pending'
    }
  });
  return submission.id;
}

export async function updateSubmissionStatus(
  id: string,
  status: 'approved' | 'rejected'
) {
  await prisma.submission.update({
    where: { id },
    data: { status }
  });
}

// --- Click Tracking ---
export async function incrementToolClick(slug: string) {
  await prisma.tool.updateMany({
    where: { slug },
    data: { click_count: { increment: 1 } }
  });
}

export async function getToolClicks(): Promise<{ slug: string; count: number }[]> {
  return (await prisma.tool.findMany({
    select: { slug: true, click_count: true },
    orderBy: { click_count: 'desc' },
    take: 50
  })) as unknown as { slug: string; count: number }[];
}

// --- Page View ---
export async function addPageView(data: {
  path: string;
  referrer?: string;
  ip?: string;
  user_agent?: string;
}) {
  await prisma.pageView.create({
    data: {
      path: data.path,
      referrer: data.referrer || null,
      ip: data.ip || null,
      user_agent: data.user_agent || null
    }
  });
}

// --- Search Query ---
export async function addSearchQuery(query: string, results: number) {
  await prisma.searchQuery.create({
    data: { query, results }
  });
}

// --- Stats --- (FIXED: async with awaits)
export async function getPageStats() {
  const views = await prisma.pageView.count() as unknown as number;
  const tools = await getToolClicks();
  const queries = await prisma.searchQuery.groupBy({
    by: ['query'],
    _count: { query: true },
    orderBy: { _count: { query: 'desc' } },
    take: 50
  }) as unknown as { query: string; cnt: number }[];

  return {
    total_views: views,
    tool_clicks: tools,
    search_queries: queries.map(q => ({ query: q.query, count: q.cnt }))
  };
}

// --- Blog ---
export async function getBlogPosts() {
  return await prisma.blogPost.findMany({ orderBy: { date: 'desc' } });
}

export async function getBlogPostBySlug(slug: string) {
  return await prisma.blogPost.findUnique({ where: { slug } });
}

export async function addBlogPost(data: {
  title: string;
  content: string;
  category: string;
  date: string;
  slug?: string;
}): Promise<string> {
  const slug = data.slug || data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const post = await prisma.blogPost.create({
    data: { slug, title: data.title, content: data.content, category: data.category, date: data.date }
  });
  return post.id;
}

export async function updateBlogPost(
  slug: string,
  data: Partial<{ title: string; content: string; category: string; date: string }>
) {
  await prisma.blogPost.update({
    where: { slug },
    data
  });
}

export async function deleteBlogPost(slug: string) {
  await prisma.blogPost.delete({ where: { slug } });
}

export async function incrementBlogPostViews(slug: string) {
  await prisma.blogPost.updateMany({
    where: { slug },
    data: { views: { increment: 1 } }
  });
}

// --- Affiliate ---
export async function getAffiliateLinksByTool(toolId: string) {
  return await prisma.affiliateLink.findMany({
    where: { tool_id: toolId },
    orderBy: { click_count: 'desc' }
  });
}

export async function addAffiliateLink(data: {
  tool_id: string;
  label: string;
  url: string;
  network: string;
}): Promise<string> {
  const link = await prisma.affiliateLink.create({ data });
  return link.id;
}

export async function trackAffiliateClick(linkId: string) {
  await prisma.affiliateLink.updateMany({
    where: { id: linkId },
    data: { click_count: { increment: 1 } }
  });
}

// --- Prompt ---
export async function getPromptsByTool(toolId: string) {
  return await prisma.prompt.findMany({
    where: { tool_id: toolId },
    orderBy: { copy_count: 'desc' }
  });
}

export async function addPrompt(data: {
  tool_id: string;
  title: string;
  prompt_text: string;
  use_case: string;
  best_model?: string;
}): Promise<string> {
  const prompt = await prisma.prompt.create({
    data: { ...data, best_model: data.best_model || null }
  });
  return prompt.id;
}

export async function trackPromptCopy(promptId: string) {
  await prisma.prompt.updateMany({
    where: { id: promptId },
    data: { copy_count: { increment: 1 } }
  });
}

// --- Compare ---
export async function getComparePageBySlug(slug: string) {
  return await prisma.comparePage.findUnique({ where: { slug } });
}

export async function getAllComparePages() {
  return await prisma.comparePage.findMany({ orderBy: { created_at: 'desc' } });
}

export async function addComparePage(data: {
  slug: string;
  tool1_id: string;
  tool2_id: string;
  title: string;
  content: string;
}): Promise<string> {
  const page = await prisma.comparePage.create({ data });
  return page.id;
}

export async function incrementComparePageViews(slug: string) {
  await prisma.comparePage.updateMany({
    where: { slug },
    data: { views: { increment: 1 } }
  });
}