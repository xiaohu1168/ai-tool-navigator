import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, changePassword, getUserById } from '@/lib/auth';

function extractCookieToken(request: NextRequest): string | null {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/(?:^|; )admin_token=([^;]+)/);
  return match ? match[1] : null;
}

export async function POST(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/(?:^|; )admin_token=([^;]+)/);
  const token = tokenMatch ? tokenMatch[1] : null;
  const decoded = token ? await verifyToken(token) : null;

  if (!decoded) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { oldPassword, newPassword } = body;

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters' },
        { status: 400 }
      );
    }

    if (oldPassword === newPassword) {
      return NextResponse.json(
        { error: 'New password must be different from current password' },
        { status: 400 }
      );
    }

    await changePassword(decoded.userId, oldPassword, newPassword);

    return NextResponse.json({ success: true, message: 'Password changed successfully' });
  } catch (e) {
    const error = e as Error;
    if (error.message === 'Current password is incorrect') {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
    }
    if (error.message === 'User not found') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to change password' }, { status: 500 });
  }
}
