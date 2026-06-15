import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// --- Base64url decode → string (Edge compatible via btoa/atob) ---
function base64urlDecode(str: string): string {
  let padded = str.replace(/-/g, '+').replace(/_/g, '/');
  while (padded.length % 4) padded += '=';
  // btoa only handles ASCII after base64 decode
  const binary = atob(padded);
  // Return as UTF-8 string (most JWT payloads are ASCII-safe)
  return binary;
}

// --- Encode Uint8Array → base64url string (Edge compatible) ---
function uint8ArrayToBase64url(data: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < data.length; i++) {
    binary += String.fromCharCode(data[i]);
  }
  let b64 = '';
  for (let i = 0; i < binary.length; i += 8192) {
    b64 += btoa(binary.substring(i, i + 8192));
  }
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// --- JWT verification using Web Crypto API (Edge compatible) ---
async function verifyCookieToken(token: string | null): Promise<{ valid: boolean; userId?: string; role?: string }> {
  try {
    if (!token) return { valid: false };
    const parts = token.split('.');
    if (parts.length !== 2) return { valid: false };
    const [payloadB64, sigB64] = parts;
    const secret = process.env.NEXT_PUBLIC_ADMIN_SALT;
    if (!secret) return { valid: false };

    // Import key for signing (needed to compute expected signature for comparison)
    const encoder = new TextEncoder();
    const secretKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    // Compute expected signature
    const expectedSig = new Uint8Array(
      await crypto.subtle.sign('HMAC', secretKey, encoder.encode(payloadB64))
    );
    const expectedSigB64 = uint8ArrayToBase64url(expectedSig);

    if (expectedSigB64 !== sigB64) return { valid: false };

    // Decode payload JSON
    const payloadJson = base64urlDecode(payloadB64);
    const payload = JSON.parse(payloadJson);

    if (!payload.userId || !payload.exp || Date.now() > payload.exp) return { valid: false };

    return { valid: true, userId: payload.userId, role: payload.role };
  } catch {
    return { valid: false };
  }
}

// Extract cookie token
function extractCookieToken(request: NextRequest): string | null {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/(?:^|; )admin_token=([^;]+)/);
  return match ? match[1] : null;
}

// Security headers
function addSecurityHeaders(response: NextResponse): void {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '0');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

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

// Role-based access control
const PROTECTED_PATHS: Record<string, string> = {
  '/admin': 'ADMIN',
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public auth paths
  const publicAuthPaths = ['/api/auth/login', '/api/auth/logout'];
  if (publicAuthPaths.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Public pages
  const publicPages = ['/login'];
  if (publicPages.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Protected paths — async verification needed
  for (const [path, minRole] of Object.entries(PROTECTED_PATHS)) {
    if (pathname.startsWith(path)) {
      const token = extractCookieToken(request);
      const result = await verifyCookieToken(token);

      if (!result.valid) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      // Role check: SUPER_ADMIN > ADMIN > EDITOR
      const ROLE_LEVELS: Record<string, number> = { EDITOR: 1, ADMIN: 2, SUPER_ADMIN: 3 };
      const userLevel = result.role ? (ROLE_LEVELS[result.role] ?? 0) : 0;
      const requiredLevel = ROLE_LEVELS[minRole] || 2;

      if (userLevel < requiredLevel) {
        return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
      }
    }
  }

  const response = NextResponse.next();
  addSecurityHeaders(response);
  return response;
}

export const config = {
  matcher: ['/admin(.*)', '/login', '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:css|js|png|jpeg|jpg|gif|svg|ico|webp)).*)'],
};
