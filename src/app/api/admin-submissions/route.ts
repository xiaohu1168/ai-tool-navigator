import { NextResponse } from "next/server";
import { getSubmissions, updateSubmissionStatus } from "@/lib/db";
import { prisma } from "@/lib/db";
import { verifyHMACToken } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const headerToken = request.headers.get('x-admin-token');
    const cookieHeader = request.headers.get('cookie') || '';
    const cookieMatch = cookieHeader.match(/(?:^|; )admin_token=([^;]+)/);
    const cookieToken = cookieMatch ? cookieMatch[1] : null;
    const token = headerToken || cookieToken;

    if (!(await verifyHMACToken(token))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subs = await getSubmissions();
    return NextResponse.json(subs);
  } catch (err) {
    console.error("Admin submissions error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const headerToken = request.headers.get('x-admin-token');
    const cookieHeader = request.headers.get('cookie') || '';
    const cookieMatch = cookieHeader.match(/(?:^|; )admin_token=([^;]+)/);
    const cookieToken = cookieMatch ? cookieMatch[1] : null;
    const token = headerToken || cookieToken;

    if (!(await verifyHMACToken(token))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  } catch (e) {
    console.error('Auth check failed for POST admin-submissions', e);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { id, status } = body;
    if (!id || !status) {
      return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
    }
    if (status !== "approved" && status !== "rejected") {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    
    await updateSubmissionStatus(id, status as "approved" | "rejected");
    
    // Auto-create tool when approved
    if (status === "approved") {
      try {
        const sub = await prisma.submission.findUnique({ where: { id } });
        if (sub && sub.status === "approved") {
          const slug = sub.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
          let tags: string[] = [];
          try {
            if (sub.tags) {
              const t = JSON.parse(sub.tags as string);
              if (Array.isArray(t)) tags = t.map(String);
              else if (typeof t === 'string') tags = [t];
            }
          } catch {
            // fallback: try comma split
            if (typeof sub.tags === 'string' && sub.tags.length) tags = sub.tags.split(',').map(s => s.trim()).filter(Boolean);
          }
          if (tags.length === 0) tags = [sub.category_id || "other"];
          
          await prisma.tool.create({
            data: {
              slug,
              name: sub.name,
              description: sub.description || "",
              url: sub.url || "",
              price: sub.price || "Free",
              price_type: "Free",
              rating: 4.0,
              featured: false,
              tags: Array.isArray(tags) ? tags : [tags],
              for_whom: "General users",
              not_for: "Enterprise teams",
              alternatives: "",
              category_id: sub.category_id || "other",
              click_count: 0
            }
          });
        }
      } catch (err) {
        console.error("Auto-create tool from submission error:", err);
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Update submission error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
