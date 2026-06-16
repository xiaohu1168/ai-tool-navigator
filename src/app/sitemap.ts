import { getAllTools, getCategories } from '@/lib/tools';
import { getBlogPosts } from '@/lib/db';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://heyaihub.com';

  // Graceful fallback: if database is not available, return static sitemap
  let categories: any[] = [];
  let tools: any[] = [];
  let blogPosts: any[] = [];

  try {
    categories = await getCategories();
  } catch (e) {
    console.warn('Failed to fetch categories (database unavailable):', e instanceof Error ? e.message : e);
  }

  try {
    tools = await getAllTools();
  } catch (e) {
    console.warn('Failed to fetch tools (database unavailable):', e instanceof Error ? e.message : e);
  }

  try {
    blogPosts = await getBlogPosts();
  } catch (e) {
    console.warn('Failed to fetch blog posts (database unavailable):', e instanceof Error ? e.message : e);
  }

  const categoryPages = categories.map((cat) => ({
    url: baseUrl + '/category/' + cat.id,
    lastModified: new Date('2026-06-08'),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const bestOfPages = categories.map((cat) => ({
    url: baseUrl + '/best/' + cat.id,
    lastModified: new Date('2026-06-08'),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  const toolPages = tools.map((tool) => ({
    url: baseUrl + '/tools/' + tool.slug,
    lastModified: new Date(tool.updated || '2026-06-08'),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1.0 },
    { url: baseUrl + '/search', lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.5 },
    { url: baseUrl + '/blog', lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.8 },
    { url: baseUrl + '/about', lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: baseUrl + '/contact', lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: baseUrl + '/faq', lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: baseUrl + '/privacy', lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.2 },
    { url: baseUrl + '/terms', lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.2 },
    { url: baseUrl + '/editorial', lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: baseUrl + '/submit', lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
  ];

  const blogPages = blogPosts.map((post: any) => ({
    url: baseUrl + '/blog/' + post.slug,
    lastModified: new Date(post.updated_at || post.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages, ...bestOfPages, ...categoryPages, ...toolPages];
}
