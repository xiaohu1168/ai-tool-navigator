export const runtime = 'edge';
import { NextResponse } from "next/server";
import { getToolBySlug, incrementToolClick } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const tool = await getToolBySlug(slug);
    if (!tool) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(tool);
  } catch (err) {
    console.error("Tool detail error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await incrementToolClick(slug);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Tool click error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
