import crypto from "crypto";
import { prisma } from "./db";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  const { hashSync } = await import("@node-rs/bcrypt");
  return hashSync(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hashStr: string): Promise<boolean> {
  try {
    const { compareSync } = await import("@node-rs/bcrypt");
    return compareSync(password, hashStr);
  } catch {
    return false;
  }
}

// --- Base64url encoding helpers ---
function base64urlEncode(data: string): string {
  return Buffer.from(data).toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64urlDecode(str: string): string {
  let padded = str.replace(/-/g, "+").replace(/_/g, "/");
  while (padded.length % 4) padded += "=";
  return Buffer.from(padded, "base64").toString("utf8");
}

// --- JWT-like token (HMAC-SHA256) ---
export interface JwtPayload {
  userId: string;
  role: string;
  exp: number;
}

export function signToken(payload: JwtPayload): string {
  const secret = process.env.NEXT_PUBLIC_ADMIN_SALT;
  if (!secret) throw new Error("ADMIN_SALT not configured");
  const payloadJson = JSON.stringify(payload);
  const payloadB64 = base64urlEncode(payloadJson);
  const sig = crypto.createHmac("sha256", secret).update(payloadB64).digest("base64")
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return `${payloadB64}.${sig}`;
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [payloadB64, sigB64] = parts;

    // Verify signature
    const secret = process.env.NEXT_PUBLIC_ADMIN_SALT;
    if (!secret) return null;
    const expectedSig = crypto.createHmac("sha256", secret)
      .update(payloadB64).digest("base64")
      .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    if (expectedSig !== sigB64) return null;

    // Decode and validate expiry
    const payload = JSON.parse(base64urlDecode(payloadB64));
    if (!payload.userId || !payload.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

// --- Rate limiting (database-backed) ---
export async function isRateLimited(username: string): Promise<boolean> {
  try {
    const fifteenMinAgo = new Date(Date.now() - 15 * 60 * 1000);
    const count = await prisma.failedLoginAttempt.count({
      where: { username, timestamp: { gte: fifteenMinAgo } },
    });
    return count >= 5;
  } catch {
    return false;
  }
}

export async function recordFailedAttempt(username: string, ip?: string): Promise<void> {
  try {
    await prisma.failedLoginAttempt.create({
      data: { username, ip: ip || null },
    });
  } catch {
    // Non-critical: don't block auth on failed attempt logging
  }
}

export async function clearFailedAttempts(username: string): Promise<void> {
  try {
    await prisma.failedLoginAttempt.deleteMany({ where: { username } });
  } catch {
    // ignore
  }
}

// --- User queries ---
export interface DbUser {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: string;
  isActive: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function getUserByUsername(username: string): Promise<DbUser | null> {
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    return user as unknown as DbUser | null;
  } catch {
    return null;
  }
}

export async function getUserById(id: string): Promise<DbUser | null> {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    return user as unknown as DbUser | null;
  } catch {
    return null;
  }
}

export async function getAllUsers(): Promise<Omit<DbUser, "passwordHash">[]> {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return users as unknown as Omit<DbUser, "passwordHash">[];
  } catch {
    return [];
  }
}

export async function createUser(data: {
  username: string;
  email: string;
  password: string;
  role: string;
}): Promise<DbUser> {
  const passwordHash = await hashPassword(data.password);
  const user = await prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      passwordHash,
      role: data.role,
    },
  });
  return user as unknown as DbUser;
}

export async function updateUser(id: string, data: {
  email?: string;
  role?: string;
  isActive?: boolean;
}): Promise<DbUser | null> {
  try {
    const user = await prisma.user.update({
      where: { id },
      data,
    });
    return user as unknown as DbUser;
  } catch {
    return null;
  }
}

export async function deleteUser(id: string): Promise<void> {
  try {
    await prisma.user.delete({ where: { id } });
  } catch {
    throw new Error("Failed to delete user");
  }
}

export async function changePassword(
  userId: string,
  oldPassword: string,
  newPassword: string
): Promise<void> {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");
    if (!await verifyPassword(oldPassword, (user as unknown as DbUser).passwordHash)) {
      throw new Error("Current password is incorrect");
    }
    const newHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });
  } catch (e) {
    if (e instanceof Error) throw e;
    throw new Error("Failed to change password");
  }
}

export async function updateUserRole(id: string, role: string): Promise<DbUser | null> {
  try {
    const user = await prisma.user.update({
      where: { id },
      data: { role },
    });
    return user as unknown as DbUser;
  } catch {
    return null;
  }
}

export async function toggleUserActive(id: string): Promise<DbUser | null> {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    const userTyped = user as unknown as DbUser;
    const updated = await prisma.user.update({
      where: { id },
      data: { isActive: !userTyped.isActive },
    });
    return updated as unknown as DbUser;
  } catch {
    return null;
  }
}

export async function updateUserLastLogin(id: string): Promise<void> {
  try {
    await prisma.user.update({
      where: { id },
      data: { lastLogin: new Date() },
    });
  } catch {
    // non-critical
  }
}
