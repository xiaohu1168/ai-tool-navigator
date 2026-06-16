export const runtime = 'edge';
import { NextResponse } from "next/server";
import { incrementToolClick } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  
  try {
    await incrementToolClick(slug);
  } catch {
    // Silently ignore — don't break the user experience
  }
  
  // Look for redirect URL in query
  const { searchParams: origSearchParams } = new URL(request.url);
  const redirect = origSearchParams.get("redirect");
  if (redirect) {
    // Open redirect protection: validate redirect URL is on the same origin
    try {
      const redirectUrl = new URL(redirect);
      // Reject protocol-relative (//evil.com) and absolute URLs to other domains
      if (redirectUrl.protocol !== "http:" && redirectUrl.protocol !== "https:") {
        return NextResponse.redirect(new URL("/", request.url));
      }
      // Compare hostname+protocol against the request's origin
      const requestOrigin = new URL(request.url).origin;
      if (redirectUrl.origin !== requestOrigin) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      return NextResponse.redirect(redirectUrl);
    } catch {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  
  return NextResponse.redirect(new URL("/", request.url));
}