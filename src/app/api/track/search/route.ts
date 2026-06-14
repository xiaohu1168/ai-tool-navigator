import { NextResponse } from "next/server";
import { addSearchQuery } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const { query, results } = body;
  if (!query) return NextResponse.json({ error: "Missing query" }, { status: 400 });
  
  try {
    await addSearchQuery(query, results || 0);
  } catch {
    // Silently ignore
  }
  
  return NextResponse.json({ success: true });
}