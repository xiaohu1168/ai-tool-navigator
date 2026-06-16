import { NextResponse } from 'next/server';
import { trackAffiliateClick } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { linkId } = await request.json();
    if (linkId) {
      await trackAffiliateClick(linkId);
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const linkId = searchParams.get('linkId');
  if (!linkId) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  await trackAffiliateClick(linkId);
  return NextResponse.redirect(new URL('/', request.url));
}
