import { NextResponse } from "next/server";
import { incrementBlogPostViews, getBlogPostBySlug } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const post = await getBlogPostBySlug(slug);
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    await incrementBlogPostViews(slug);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
