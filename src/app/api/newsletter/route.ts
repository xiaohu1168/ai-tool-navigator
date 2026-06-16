/**
 * Newsletter subscription API route.
 * Stores subscriber email in database for future email campaigns.
 *
 * Usage: POST /api/newsletter with { email: "user@example.com" }
 * Requires: NEXT_PUBLIC_RESEND_API_KEY (optional, for email confirmation)
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = subscribeSchema.parse(body);

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: validated.email },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Already subscribed!" },
        { status: 200 }
      );
    }

    // Create subscriber
    await prisma.newsletterSubscriber.create({
      data: { email: validated.email },
    });

    return NextResponse.json(
      { message: "Subscribed successfully!" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}
