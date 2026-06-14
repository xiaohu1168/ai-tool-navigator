import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyHMACToken } from '@/lib/auth';
import { createToolSchema, updateToolSchema, deleteToolSchema } from '@/lib/validation';

function safeConvertArray(val: unknown): string[] {
  if (Array.isArray(val)) return val.map(String);
  if (typeof val === 'string') {
    try { return JSON.parse(val).map(String); } catch { return val.split(',').map(s => s.trim()); }
  }
  return [];
}

function extractCookieToken(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/(?:^|; )admin_token=([^;]+)/);
  return match ? match[1] : null;
}

function requireAuth(request: Request): Response | null {
  const token = extractCookieToken(request);
  if (!verifyHMACToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const q = searchParams.get("q");
    const slug = searchParams.get("slug");

    if (slug) {
      const tool = await prisma.tool.findUnique({ where: { slug } });
      if (!tool) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(tool);
    }

    if (category) {
      const tools = await prisma.tool.findMany({
        where: { category_id: category },
        orderBy: { rating: 'desc' }
      });
      return NextResponse.json(tools);
    }

    if (featured === "true") {
      const count = parseInt(searchParams.get("count") || "6");
      const tools = await prisma.tool.findMany({
        where: { featured: true },
        orderBy: { rating: 'desc' },
        take: count
      });
      return NextResponse.json(tools);
    }

    if (q) {
      const tools = await prisma.tool.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
            { tags: { has: q } }
          ]
        },
        orderBy: { rating: 'desc' }
      });
      return NextResponse.json(tools);
    }

    const tools = await prisma.tool.findMany({ orderBy: { rating: 'desc' } });
    return NextResponse.json(tools);
  } catch (err) {
    console.error("Tools GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const authErr = requireAuth(request);
  if (authErr) return authErr;

  try {
    const body = await request.json();
    const { id, slug, name, description, url, price, price_type, rating, featured, tags, pros, cons, for_whom, not_for, alternatives, category_id } = body;
    if (!slug || !name || !description || !url || !category_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    await prisma.tool.upsert({
      where: { slug },
      create: {
        id: id || `tool_${slug}_${Date.now()}`,
        slug, name, description, url,
        price: price ?? "Free",
        price_type: price_type ?? "Free",
        rating: rating ?? 4.0,
        featured: featured ? true : false,
        tags: tags ?? "[]",
        pros: pros ?? "[]",
        cons: cons ?? "[]",
        for_whom: for_whom ?? "",
        not_for: not_for ?? "",
        alternatives: alternatives ?? "",
        category_id
      },
      update: {
        name, description, url,
        price: price ?? "Free",
        price_type: price_type ?? "Free",
        rating: rating ?? 4.0,
        featured: featured ? true : false,
        tags: tags ?? "[]",
        pros: pros ?? "[]",
        cons: cons ?? "[]",
        for_whom: for_whom ?? "",
        not_for: not_for ?? "",
        alternatives: alternatives ?? "",
        category_id
      }
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST tool error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const authErr = requireAuth(request);
  if (authErr) return authErr;

  try {
    const body = await request.json();
    const id = body.id as string | undefined;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const validated = updateToolSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.issues.map((e: any) => `${e.path.join('.')} ${e.message}`) },
        { status: 400 }
      );
    }
    const { name, description, url, price, price_type, rating, featured, tags, pros, cons, for_whom, not_for, alternatives, category_id } = validated.data;

    await prisma.tool.update({
      where: { id },
      data: {
        name, description, url, price, price_type, rating, featured,
        for_whom, not_for, alternatives, category_id,
        tags: safeConvertArray(tags),
        pros: safeConvertArray(pros),
        cons: safeConvertArray(cons),
      } as any
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT tool error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const authErr = requireAuth(request);
  if (authErr) return authErr;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    await prisma.tool.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}