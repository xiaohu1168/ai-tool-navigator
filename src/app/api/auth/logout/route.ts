import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Clear cookie
    const cookieParts = ['admin_token=; Path=/; Max-Age=0; HttpOnly'];
    if (process.env.NODE_ENV === 'production') cookieParts.push('Secure');

    return NextResponse.json(
      {
        success: true,
        message: 'Logged out successfully'
      },
      {
        status: 200,
        headers: { 'Set-Cookie': cookieParts.join('; ') }
      }
    );
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}