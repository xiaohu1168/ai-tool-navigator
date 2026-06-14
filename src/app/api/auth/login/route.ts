import { NextResponse } from "next/server";
import { verifyPassword, clearFailedAttempts, isRateLimited, recordFailedAttempt } from "@/lib/auth";
import crypto from "crypto";
import path from "path";
import fs from "fs";

function parseEnvFile(filePath: string): Record<string, string> {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const env: Record<string, string> = {};
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx <= 0) continue;
      const key = trimmed.substring(0, eqIdx).trim();
      var value = trimmed.substring(eqIdx + 1);
      // Strip surrounding double quotes
      if (value.length >= 2 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
        value = value.substring(1, value.length - 1);
      }
      env[key] = value;
    }
    return env;
  } catch {
    return {};
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    // Read .env.local first (higher priority), then fall back to .env
    const env = { ...parseEnvFile(path.join(process.cwd(), ".env.local")) };
    if (Object.keys(env).length === 0) {
      const envFallback = parseEnvFile(path.join(process.cwd(), ".env"));
      for (const [k, v] of Object.entries(envFallback)) {
        if (!(k in env)) env[k] = v;
      }
    }
    const adminUsername = env.ADMIN_USERNAME || "admin";
    const adminPasswordHash = env.ADMIN_PASSWORD || "";
    const adminSalt = env.ADMIN_SALT || "";

    console.log("ENV_DEBUG:", {
      hashLength: adminPasswordHash?.length,
      hashStart: adminPasswordHash?.substring(0, 10),
      hashEnd: adminPasswordHash?.substring(adminPasswordHash.length - 5),
    });

    if (!adminPasswordHash || !adminSalt) {
      console.error("Missing env vars");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // Rate limit check
    if (isRateLimited(username)) {
      return NextResponse.json(
        { error: "Too many failed attempts. Please try again in 15 minutes." },
        { status: 429 }
      );
    }

    const isValidPassword = verifyPassword(password, adminPasswordHash);
    console.log("BCRYPT_RESULT:", isValidPassword);

    if (username !== adminUsername || !isValidPassword) {
      recordFailedAttempt(username);
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    clearFailedAttempts(username);

    const payload = { username: adminUsername, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 };
    const payloadJson = JSON.stringify(payload);
    const payloadB64 = Buffer.from(payloadJson).toString("base64");
    const signature = crypto.createHmac("sha256", adminSalt).update(payloadB64).digest("base64");
    const token = payloadB64 + "." + signature;

    const maxAge = 7 * 24 * 60 * 60;
    const cookieParts = [
      "admin_token=" + token,
      "Path=/",
      "Max-Age=" + maxAge,
      "SameSite=Lax",
      "HttpOnly",
      "Secure"
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
