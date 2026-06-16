import { getAllTools as dbGetAllTools, getToolsByCategory as dbGetByCat, getToolBySlug as dbGetBySlug, searchTools as dbSearch, getFeaturedTools as dbGetFeatured, getCategories as dbGetCats } from "./db";
import { prisma } from "./db";

export interface Tool {
  id: string; slug: string; name: string; description: string; url: string;
  affiliate_url: string;
  price: string; price_type: string; rating: number; featured: boolean;
  tags: string[]; pros: string[]; cons: string[];
  for_whom: string; not_for: string; alternatives: string;
  privacy?: string; updated?: string; category?: string;
}

export interface AffiliateLink {
  id: string;
  tool_id: string;
  label: string;
  url: string;
  network: string;
  click_count: number;
}

export interface Prompt {
  id: string;
  tool_id: string;
  title: string;
  prompt_text: string;
  use_case: string;
  best_model?: string;
  copy_count: number;
}

export interface ComparePage {
  id: string;
  slug: string;
  tool1_id: string;
  tool2_id: string;
  title: string;
  content: string;
  views: number;
}

export interface Category {
  id: string; name: string; icon: string; description: string; count: number;
}

function safeParseJsonArray(val: unknown): string[] {
  if (Array.isArray(val)) return val.map(String);
  if (typeof val !== "string") return [];
  try {
    const parsed = JSON.parse(val);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    if (val.trim()) return val.split(",").map(s => s.trim());
    return [];
  }
}

function getField<T>(obj: unknown, key: string, fallback: T): T {
  if (obj && typeof obj === 'object' && key in (obj as Record<string, unknown>)) {
    return ((obj as Record<string, unknown>)[key] as unknown) as T;
  }
  return fallback;
}

function toTool(db: unknown): Tool {
  if (!db || typeof db !== 'object') throw new Error('Invalid db tool');
  const o = db as Record<string, unknown>;
  return {
    id: String(o.id),
    slug: String(o.slug),
    name: String(o.name),
    description: String(getField(o, 'description', '')),
    url: String(getField(o, 'url', '')),
    affiliate_url: String(getField(o, 'affiliate_url', '')),
    price: String(getField(o, 'price', '')),
    price_type: String(getField(o, 'price_type', '')),
    rating: typeof o.rating === 'number' ? (o.rating as number) : 4.0,
    featured: o.featured === 1 || o.featured === true,
    tags: safeParseJsonArray(getField(o, 'tags', [])),
    pros: safeParseJsonArray(getField(o, 'pros', [])),
    cons: safeParseJsonArray(getField(o, 'cons', [])),
    for_whom: String(getField(o, 'for_whom', '')),
    not_for: String(getField(o, 'not_for', '')),
    alternatives: String(getField(o, 'alternatives', '')),
    privacy: getField(o, 'privacy', undefined) as string | undefined,
    updated: getField(o, 'updated', undefined) as string | undefined,
    category: String(getField(o, 'category_id', '')),
  };
}

export async function getCategories(): Promise<Category[]> {
  try {
    const cats = await dbGetCats();
    return cats.map((c) => ({ id: c.id, name: c.name, icon: c.icon, description: c.description, count: c.count }));
  } catch {
    // Edge runtime: fs/path not available, fall back to empty
    return [];
  }
}

export async function getAllTools(): Promise<Tool[]> {
  try { const db = await dbGetAllTools(); return db.map(toTool).filter(Boolean) as Tool[]; }
  catch { return []; }
}

export async function getToolsByCategory(categoryId: string): Promise<Tool[]> {
  try {
    const result = await dbGetByCat(categoryId);
    const tools = result.map(toTool).filter(Boolean) as Tool[];
    return tools;
  } catch (err) {
    console.error("[tools.ts] getToolsByCategory error:", err);
    return [];
  }
}

export async function getToolBySlug(slug: string): Promise<Tool | undefined> {
  try {
    const db = await dbGetBySlug(slug);
    return db ? toTool(db) : undefined;
  } catch { return undefined; }
}

export async function searchTools(query: string): Promise<Tool[]> {
  try { const db = await dbSearch(query); return db.map(toTool).filter(Boolean) as Tool[]; }
  catch { return []; }
}

export async function getFeaturedTools(count = 6): Promise<Tool[]> {
  try { const db = await dbGetFeatured(count); return db.map(toTool).filter(Boolean) as Tool[]; }
  catch { return []; }
}

export async function getAffiliateLinksByToolSlug(slug: string): Promise<AffiliateLink[]> {
  const tool = await prisma.tool.findUnique({ where: { slug } });
  if (!tool) return [];
  const links = await prisma.affiliateLink.findMany({ where: { tool_id: tool.id } });
  return links.map((l: unknown) => {
    const r = l as Record<string, unknown>;
    return {
      id: String(r.id), tool_id: String(r.tool_id), label: String(r.label), url: String(r.url),
      network: String(r.network), click_count: typeof r.click_count === 'number' ? (r.click_count as number) : Number(r.click_count)
    };
  });
}

export async function getPromptsByToolSlug(slug: string): Promise<Prompt[]> {
  const tool = await prisma.tool.findUnique({ where: { slug } });
  if (!tool) return [];
  const prompts = await prisma.prompt.findMany({ where: { tool_id: tool.id } });
  return prompts.map((p: unknown) => {
    const r = p as Record<string, unknown>;
    return {
      id: String(r.id), tool_id: String(r.tool_id), title: String(r.title),
      prompt_text: String(r.prompt_text), use_case: String(r.use_case),
      best_model: r.best_model ? String(r.best_model) : undefined, copy_count: typeof r.copy_count === 'number' ? (r.copy_count as number) : Number(r.copy_count)
    };
  });
}

export async function getComparePagesByTool(slug: string): Promise<ComparePage[]> {
  const tool = await prisma.tool.findUnique({ where: { slug } });
  if (!tool) return [];
  const allCompare = await prisma.comparePage.findMany();
  return allCompare.filter((c: unknown) => {
    const r = c as Record<string, unknown>;
    return String(r.tool1_id) === String(tool.id) || String(r.tool2_id) === String(tool.id);
  });
}
export async function getComparePageBySlug(slug: string): Promise<ComparePage | undefined> {
  try {
    const db = await prisma.comparePage.findUnique({ where: { slug } });
    return db ? {
      id: db.id,
      slug: db.slug,
      tool1_id: db.tool1_id,
      tool2_id: db.tool2_id,
      title: db.title,
      content: db.content,
      views: db.views
    } : undefined;
  } catch {
    return undefined;
  }
}

