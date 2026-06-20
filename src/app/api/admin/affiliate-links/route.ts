/**
 * Admin API route for AffiliateLink CRUD operations.
 * Requires authentication via admin_token cookie.
 *
 * GET    /api/admin/affiliate-links?toolId=<id>  — list links for a tool
 * POST   /api/admin/affiliate-links               — create a new affiliate link
 * PATCH  /api/admin/affiliate-links/:id           — update an affiliate link
 * DELETE /api/admin/affiliate-links/:id           — delete an affiliate link
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

function extractCookieToken(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/(?:^|; )admin_token=([^;]+)/);
  return match ? match[1] : null;
}

async function requireAuth(request: Request): Promise<Response | null> {
  const token = extractCookieToken(request);
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

// GET: List affiliate links, optionally filtered by toolId
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const toolId = searchParams.get("toolId");

    if (toolId) {
      const links = await prisma.affiliateLink.findMany({
        where: { tool_id: toolId },
        orderBy: { click_count: "desc" },
      });
      return NextResponse.json(links);
    }

    // List all affiliate links with tool info
    const links = await prisma.affiliateLink.findMany({
      include: { tool: { select: { slug: true, name: true } } },
      orderBy: { click_count: "desc" },
    });
    return NextResponse.json(links);
  } catch (err) {
    console.error("Affiliate links GET error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Create a new affiliate link
export async function POST(request: Request) {
  const authErr = await requireAuth(request);
  if (authErr) return authErr;

  try {
    const body = await request.json();
    const { tool_id, label, url, network } = body;

    if (!tool_id || !label || !url) {
      return NextResponse.json(
        { error: "Missing required fields: tool_id, label, url" },
        { status: 400 }
      );
    }

    // Verify tool exists
    const tool = await prisma.tool.findUnique({ where: { id: tool_id } });
    if (!tool) {
      return NextResponse.json(
        { error: "Tool not found" },
        { status: 404 }
      );
    }

    const link = await prisma.affiliateLink.create({
      data: {
        tool_id,
        label,
        url,
        network: network || "Direct",
        click_count: 0,
      },
    });

    return NextResponse.json({ success: true, link });
  } catch (err) {
    console.error("Affiliate link POST error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH: Update an affiliate link
export async function PATCH(request: Request) {
  const authErr = await requireAuth(request);
  if (authErr) return authErr;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Missing link id" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { label, url, network } = body;

    const updateData: Record<string, unknown> = {};
    if (label !== undefined) updateData.label = label;
    if (url !== undefined) updateData.url = url;
    if (network !== undefined) updateData.network = network;

    const link = await prisma.affiliateLink.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, link });
  } catch (err) {
    console.error("Affiliate link PATCH error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Remove an affiliate link
export async function DELETE(request: Request) {
  const authErr = await requireAuth(request);
  if (authErr) return authErr;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Missing link id" },
        { status: 400 }
      );
    }

    await prisma.affiliateLink.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Affiliate link DELETE error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
