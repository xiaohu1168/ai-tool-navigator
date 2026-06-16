import { NextResponse } from "next/server";
import {
  getBlogPosts, getBlogPostBySlug, addBlogPost,
  updateBlogPost, deleteBlogPost, incrementBlogPostViews
} from "@/lib/db";
import { verifyToken } from '@/lib/auth';

function extractCookieToken(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/(?:^|; )admin_token=([^;]+)/);
  return match ? match[1] : null;
}

async function requireAuth(request: Request): Promise<Response | null> {
  const token = extractCookieToken(request);
  if (!await verifyToken(token ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    if (slug) {
      const post = await getBlogPostBySlug(slug);
      if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(post);
    }
    return NextResponse.json(await getBlogPosts());
  } catch (err) {
    console.error("Blog GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const authErr = await requireAuth(request);
  if (authErr) return authErr;

  try {
    const body = await request.json();
    const { title, content, category, date, slug: slugProp } = body;
    if (!title || !content) {
      return NextResponse.json({ error: "Missing title or content" }, { status: 400 });
    }

    // Auto-generate slug from title if not provided
    let slug = slugProp || title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    // Ensure slug uniqueness
    const existing = await getBlogPostBySlug(slug);
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const postDate = date || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

    await addBlogPost({ title, content, category: category || "General", date: postDate, slug });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Blog POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const authErr = await requireAuth(request);
  if (authErr) return authErr;

  try {
    const body = await request.json();
    const { slug, ...data } = body;
    if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    await updateBlogPost(slug, data);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Blog PUT error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const authErr = requireAuth(request);
  if (authErr) return authErr;

  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    await deleteBlogPost(slug);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Blog DELETE error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}