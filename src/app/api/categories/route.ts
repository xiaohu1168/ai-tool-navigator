export const runtime = 'edge';
﻿import { NextResponse } from "next/server";
import { getCategories } from "@/lib/db";

export async function GET() {
  try {
    const cats = await getCategories();
    return NextResponse.json(cats);
  } catch (err) {
    console.error("Categories error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
