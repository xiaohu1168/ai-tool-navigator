import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Edge-compatible HMAC verification (no Node.js crypto import)
async function verifyCookieToken(token: string | null): Promise<boolean> {
  try {
    if (!token) return false;
    const parts = token.split('.');
    if (parts.length !== 2) return false;
    const [payloadB64, signatureB64] = parts;
    const secret = process.env.ADMIN_SALT;
    if (!secret) return false;

    // Web Crypto API (available in Edge Runtime)
    const encoder = new TextEncoder();
    const secretKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign', 'verify']
    );

    // Verify signature
    const sigBuf = base64UrlDecode(signatureB64);
    const expectedSig = new Uint8Array(
      await crypto.subtle.sign('HMAC', secretKey, encoder.encode(payloadB64))
    );

    if (expectedSig.length !== sigBuf.length) return false;
    let equal = true;
    for (let i = 0; i < expectedSig.length; i++) {
      if (expectedSig[i] !== sigBuf[i]) { equal = false; break; }
    }
    if (!equal) return false;

    // Verify payload expiry
    const payloadJson = new TextDecoder().decode(base64UrlDecode(payloadB64));
    const payload = JSON.parse(payloadJson);
    if (!payload.exp || Date.now() > payload.exp) return false;

    return true;
  } catch {
    return false;
  }
}

function base64UrlDecode(str: string): Uint8Array {
  // Handle standard base64 (not base64url) since we used regular base64 in login
  const padded = str + '='.repeat((4 - str.length % 4) % 4);
  const base64 = padded.replace(/-/g, '+').replace(/_/g, '/');
  const binary = Buffer.from(base64, 'base64').toString('binary');
  return new Uint8Array(binary.split('').map(c => c.charCodeAt(0)));
}

function extractCookieToken(request: NextRequest): string | null {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/(?:^|; )admin_token=([^;]+)/);
  return match ? match[1] : null;
}

// Security headers middleware
function addSecurityHeaders(response: NextResponse): void {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '0'); // modern apps use CSP instead
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // HSTS — enforce HTTPS for 1 year (only in production)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  // Basic CSP — allow inline scripts for AdSense, Next.js, and our own assets
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://heyaihub.com';
  const cspValue = [
    `default-src 'self'`,
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://pagead2.googlesyndication.com https://www.google.com https://www.gstatic.com`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: https: http:`,
    `font-src 'self'`,
    `connect-src 'self' ${siteUrl} https://www.google-analytics.com https://www.googletagmanager.com`,
    `frame-src 'self' https://www.google.com https://pagead2.googlesyndication.com`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
  ].join('; ');
  response.headers.set('Content-Security-Policy', cspValue);
}

export async function middleware(request: NextRequest) {
  const protectedPaths = ['/admin'];
  const publicPaths = ['/api/auth/login', '/api/auth/logout', '/login'];
  const { pathname } = request.nextUrl;

  if (publicPaths.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  if (protectedPaths.some(p => pathname.startsWith(p))) {
    const token = extractCookieToken(request);
    if (!await verifyCookieToken(token)) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  const response = NextResponse.next();
  addSecurityHeaders(response);
  return response;
}

export const config = {
  matcher: ['/admin(.*)', '/login', '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:css|js|png|jpg|jpeg|gif|svg|ico|webp)).*)'],
};
