export const runtime = 'edge';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getAllUsers, createUser, updateUser, deleteUser, changePassword, updateUserRole, toggleUserActive } from '@/lib/auth';

// Get the role from the cookie token
async function requireAuth(request: NextRequest): Promise<{ decoded: ReturnType<typeof verifyToken> | null; response: NextResponse | null }> {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/(?:^|; )admin_token=([^;]+)/);
  const token = match ? match[1] : null;
  const decoded = token ? verifyToken(token) : null;

  if (!decoded) {
    return { decoded: null, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  return { decoded, response: null };
}

// Check if user has required role level
function hasRole(decoded: ReturnType<typeof verifyToken> | null, minRole: string): boolean {
  if (!decoded) return false;
  const LEVELS: Record<string, number> = { EDITOR: 1, ADMIN: 2, SUPER_ADMIN: 3 };
  return (LEVELS[decoded.role] ?? 0) >= (LEVELS[minRole] ?? 0);
}

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth.response) return auth.response;
  if (!auth.decoded || !hasRole(auth.decoded, 'ADMIN')) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
  }

  const users = await getAllUsers();
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth.response) return auth.response;
  if (!auth.decoded || auth.decoded.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Only SUPER_ADMIN can create users' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { username, email, password, role } = body;

    // Validate required fields
    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Username, email, and password are required' }, { status: 400 });
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    // Validate role
    const validRoles = ['ADMIN', 'EDITOR', 'SUPER_ADMIN'];
    if (role && !validRoles.includes(role)) {
      return NextResponse.json({ error: `Role must be one of: ${validRoles.join(', ')}` }, { status: 400 });
    }

    const user = await createUser({ username, email, password, role: role || 'ADMIN' });
    // Don't return passwordHash
    const { passwordHash, ...safeUser } = user as unknown as Record<string, unknown>;
    return NextResponse.json(safeUser, { status: 201 });
  } catch (e) {
    const error = e as Error;
    if (error.message.includes('unique')) {
      return NextResponse.json({ error: 'Username or email already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
