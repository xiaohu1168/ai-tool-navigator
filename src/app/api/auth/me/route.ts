export const runtime = 'edge';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getUserById } from '@/lib/auth';

function extractCookieToken(request: NextRequest): string | null {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/(?:^|; )admin_token=([^;]+)/);
  return match ? match[1] : null;
}

export async function GET(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/(?:^|; )admin_token=([^;]+)/);
  const token = tokenMatch ? tokenMatch[1] : null;
  const decoded = token ? verifyToken(token) : null;

  if (!decoded) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await getUserById(decoded.userId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Don't expose password hash
  const { passwordHash, ...safeUser } = user as unknown as Record<string, unknown>;
  return NextResponse.json(safeUser);
}
