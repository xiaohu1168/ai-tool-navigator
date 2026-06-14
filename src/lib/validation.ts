import { z } from "zod";

// --- Tool validation ---
export const createToolSchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, "slug must be lowercase alphanumeric with dashes"),
  name: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  url: z.string().url("Invalid URL"),
  price: z.string().default("Free"),
  price_type: z.string().default("Free"),
  rating: z.number().min(0).max(5).default(4.0),
  featured: z.boolean().default(false),
  tags: z.union([z.array(z.string()), z.string()]).default("[]"),
  pros: z.union([z.array(z.string()), z.string()]).default("[]"),
  cons: z.union([z.array(z.string()), z.string()]).default("[]"),
  for_whom: z.string().default(""),
  not_for: z.string().default(""),
  alternatives: z.string().default(""),
  category_id: z.string().min(1),
  id: z.string().optional(),
});

// Allowed fields for the PUT /api/tools endpoint
export const updateToolSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(2000).optional(),
  url: z.string().url("Invalid URL").optional(),
  price: z.string().optional(),
  price_type: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  featured: z.boolean().optional(),
  tags: z.union([z.array(z.string()), z.string()]).optional(),
  pros: z.union([z.array(z.string()), z.string()]).optional(),
  cons: z.union([z.array(z.string()), z.string()]).optional(),
  for_whom: z.string().optional(),
  not_for: z.string().optional(),
  alternatives: z.string().optional(),
  category_id: z.string().min(1).optional(),
});

export const deleteToolSchema = z.object({
  id: z.string().min(1),
});

// --- Blog validation ---
export const createBlogPostSchema = z.object({
  title: z.string().min(1).max(300),
  content: z.string().min(1),
  category: z.string().default("General"),
  date: z.string().default(""),
});

// --- Submission validation ---
export const createSubmissionSchema = z.object({
  name: z.string().min(1).max(200),
  url: z.string().url("Invalid URL"),
  description: z.string().min(1).max(2000),
  category_id: z.string().min(1),
  price: z.string().nullable().optional(),
  tags: z.string().nullable().optional(),
});

// --- Stats / analytics validation ---
export const trackEventSchema = z.object({
  type: z.enum(["view", "click", "search"]),
  path: z.string().optional(),
  slug: z.string().optional(),
  query: z.string().optional(),
  results: z.number().int().nonnegative().optional(),
});

// --- Admin submissions ---
export const updateSubmissionStatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["approved", "rejected"]),
});
