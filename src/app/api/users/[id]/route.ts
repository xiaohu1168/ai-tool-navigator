import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, updateUser, deleteUser, changePassword, updateUserRole, toggleUserActive, getUserById } from '@/lib/auth';

function extractCookieToken(request: NextRequest): string | null {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/(?:^|; )admin_token=([^;]+)/);
  return match ? match[1] : null;
}

function hasRole(decoded: ReturnType<typeof verifyToken> | null, minRole: string): boolean {
  if (!decoded) return false;
  const LEVELS: Record<string, number> = { EDITOR: 1, ADMIN: 2, SUPER_ADMIN: 3 };
  return (LEVELS[decoded.role] ?? 0) >= (LEVELS[minRole] ?? 0);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieHeader = request.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/(?:^|; )admin_token=([^;]+)/);
  const token = tokenMatch ? tokenMatch[1] : null;
  const decoded = token ? await verifyToken(token) : null;

  if (!decoded) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  // Users can change their own email but not role/isActive
  // Only ADMIN+ can change other users' role/isActive
  if (decoded.userId !== id && !hasRole(decoded, 'ADMIN')) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { email, role, isActive } = body;

    const allowedFields: Record<string, unknown> = {};
    if (email !== undefined) allowedFields.email = email;

    // Only ADMIN+ can change role or active status, and not on self
    if (decoded.userId !== id && hasRole(decoded, 'ADMIN')) {
      if (role !== undefined) allowedFields.role = role;
      if (isActive !== undefined) allowedFields.isActive = isActive;
    }

    if (Object.keys(allowedFields).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const user = await updateUser(id, allowedFields);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { passwordHash, ...safeUser } = user as unknown as Record<string, unknown>;
    return NextResponse.json(safeUser);
  } catch {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieHeader = request.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/(?:^|; )admin_token=([^;]+)/);
  const token = tokenMatch ? tokenMatch[1] : null;
  const decoded = token ? await verifyToken(token) : null;

  if (!decoded) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  // Only SUPER_ADMIN can delete, and not self
  if (decoded.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Only SUPER_ADMIN can delete users' }, { status: 403 });
  }
  if (decoded.userId === id) {
    return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 });
  }

  await deleteUser(id);
  return NextResponse.json({ success: true });
}
