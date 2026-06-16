export const runtime = 'edge';
import { NextResponse } from "next/server";
import { addSubmission } from "@/lib/db";
import { createSubmissionSchema } from "@/lib/validation";

// Simple in-memory rate limiter (per IP)
const submissionAttempts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5; // max 5 submissions
const RATE_WINDOW = 15 * 60 * 1000; // 15 minutes

function checkSubmissionRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = submissionAttempts.get(ip);

  if (!entry || now > entry.resetAt) {
    submissionAttempts.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT) {
    return false;
  }

  entry.count++;
  return true;
}

export async function POST(request: Request) {
  try {
    // Extract client IP
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";

    // Rate limit check
    if (!checkSubmissionRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again in 15 minutes." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validated = createSubmissionSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.issues.map((e: any) => `${e.path.join('.')} ${e.message}`) },
        { status: 400 }
      );
    }
    const { name, url, description, category_id, price, tags } = validated.data;
    await addSubmission({ name, url, description, category_id, price: price || undefined, tags: tags || undefined });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Submit error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
