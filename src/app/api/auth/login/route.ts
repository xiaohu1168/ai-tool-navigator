import { NextResponse } from "next/server";
import { getUserByUsername, verifyPassword, recordFailedAttempt, clearFailedAttempts, isRateLimited, signToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    // Rate limit check
    if (await isRateLimited(username)) {
      return NextResponse.json(
        { error: "Too many failed attempts. Please try again in 15 minutes." },
        { status: 429 }
      );
    }

    // Look up user in database
    const user = await getUserByUsername(username);
    if (!user || !user.isActive) {
      await recordFailedAttempt(username);
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    if (!await verifyPassword(password, user.passwordHash)) {
      await recordFailedAttempt(username);
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Success: clear failed attempts and update last login
    await clearFailedAttempts(username);
    await updateUserLastLogin(user.id);

    // Generate JWT-like token with userId and role
    const token = signToken({
      userId: user.id,
      role: user.role,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const isProduction = process.env.NODE_ENV === "production";
    const cookieParts = [
      `admin_token=${token}`,
      "Path=/",
      "Max-Age=604800",
      "SameSite=Lax",
      "HttpOnly",
      ...(isProduction ? ["Secure"] : []),
    ];

    return NextResponse.json(
      { success: true, message: "Login successful" },
      { status: 200, headers: { "Set-Cookie": cookieParts.join("; "), "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("LOGIN_ROUTE_ERROR:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function updateUserLastLogin(id: string): Promise<void> {
  try {
    const { prisma } = await import("@/lib/db");
    await prisma.user.update({
      where: { id },
      data: { lastLogin: new Date() },
    });
  } catch {
    // non-critical
  }
}
