import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const categoryCount = await prisma.category.count();
    const toolCount = await prisma.tool.count();
    const blogCount = await prisma.blogPost.count();
    const dbUrl = process.env.DATABASE_URL ? 'SET' : 'NOT SET';
    return NextResponse.json({
      DATABASE_URL: dbUrl,
      nodeEnv: process.env.NODE_ENV,
      categories: categoryCount,
      tools: toolCount,
      blogPosts: blogCount,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
