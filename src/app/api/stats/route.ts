import { NextResponse } from "next/server";
import { getPageStats, addPageView, incrementToolClick, addSearchQuery } from "@/lib/db";
import { verifyHMACToken } from '@/lib/auth';

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

export async function GET() {
  try {
    const stats = await getPageStats();
    return NextResponse.json(stats);
  } catch (err) {
    console.error("Stats error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const authErr = requireAuth(request);
  if (authErr) return authErr;

  try {
    const body = await request.json();
    const { type, ...data } = body;
    switch (type) {
      case "view":
        await addPageView(data);
        break;
      case "click":
        await incrementToolClick(data.slug);
        break;
      case "search":
        await addSearchQuery(data.query, data.results || 0);
        break;
      default:
        return NextResponse.json({ error: "Unknown type" }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Stats POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}