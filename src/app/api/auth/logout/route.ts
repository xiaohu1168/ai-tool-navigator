export const runtime = 'edge';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieParts = ['admin_token=; Path=/; Max-Age=0; HttpOnly'];
    if (isProduction) cookieParts.push('Secure');

    return NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200, headers: { 'Set-Cookie': cookieParts.join('; ') } }
    );
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
