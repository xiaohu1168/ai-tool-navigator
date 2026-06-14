// Data layer - uses Prisma PostgreSQL database
import {
  getAllTools,
  getToolsByCategory,
  getToolBySlug,
  searchTools,
  getFeaturedTools,
  getCategories,
  getSubmissions,
  updateSubmissionStatus,
  getPageStats,
  addPageView,
  addSearchQuery,
  incrementToolClick,
} from "./db";

// Re-export for backward compatibility
export {
  getAllTools,
  getToolsByCategory,
  getToolBySlug,
  searchTools,
  getFeaturedTools,
  getCategories,
  getSubmissions,
  updateSubmissionStatus,
  getPageStats,
};

// Type alias for compatibility
export type ToolEntry = {
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
  privacy?: string;
  updated?: string;
  category?: string;
};

export async function getAllToolsLegacy(): Promise<ToolEntry[]> {
  const dbTools = await getAllTools();
  return dbTools.map((t) => ({
    id: t.id,
    slug: t.slug,
    name: t.name,
    description: t.description,
    url: t.url,
    price: t.price,
    price_type: t.price_type,
    rating: t.rating,
    featured: t.featured,
    tags: Array.isArray(t.tags) ? t.tags : [],
    pros: Array.isArray(t.pros) ? t.pros : [],
    cons: Array.isArray(t.cons) ? t.cons : [],
    for_whom: t.for_whom,
    not_for: t.not_for,
    alternatives: t.alternatives,
    privacy: t.privacy || undefined,
    updated: t.updated || undefined,
    category: t.category_id,
  }));
}

export async function getSubmissionsLegacy() {
  const subs = await getSubmissions();
  return subs.map((s) => ({
    ...s,
    price: s.price || undefined,
    tags: s.tags || undefined,
  }));
}

export async function trackView(path: string) {
  await addPageView({ path });
}

export async function trackSearch(query: string, results: number) {
  await addSearchQuery(query, results);
}

export async function trackToolClick(slug: string) {
  await incrementToolClick(slug);
}
