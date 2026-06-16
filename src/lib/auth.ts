import { hashSync, compareSync } from "bcryptjs";
import { prisma } from "./db";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return hashSync(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hashStr: string): Promise<boolean> {
  try {
    return compareSync(password, hashStr);
  } catch {
    return false;
  }
}

// --- Base64url encoding helpers (Edge-compatible, no Buffer) ---
function base64urlEncode(data: string): string {
  try {
    return btoa(unescape(encodeURIComponent(data)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  } catch {
    const bytes = Array.from(new TextEncoder().encode(data));
    let binary = "";
    bytes.forEach(b => binary += String.fromCharCode(b));
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
}

function base64urlDecode(str: string): string {
  let padded = str.replace(/-/g, "+").replace(/_/g, "/");
  while (padded.length % 4) padded += "=";
  try {
    const binary = atob(padded).split("").map(c => String.fromCharCode(c.charCodeAt(0))).join("");
    return decodeURIComponent(binary.split("%").map(p =>
      "%" + p.padStart(2, "0")
    ).join(""));
  } catch {
    return atob(padded).split("").map(c => String.fromCharCode(c.charCodeAt(0))).join("");
  }
}

// --- HMAC-SHA256 using Web Crypto API (Edge-compatible, no node:crypto) ---
const hmacKeyCache = new Map<string, CryptoKey>();

async function getHmacKey(secret: string): Promise<CryptoKey> {
  const cached = hmacKeyCache.get(secret);
  if (cached) return cached;
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  hmacKeyCache.set(secret, key);
  return key;
}

function uint8ToBase64url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function signToken(payload: JwtPayload): Promise<string> {
  const secret = process.env.NEXT_PUBLIC_ADMIN_SALT;
  if (!secret) throw new Error("ADMIN_SALT not configured");
  const payloadJson = JSON.stringify(payload);
  const payloadB64 = base64urlEncode(payloadJson);
  const key = await getHmacKey(secret);
  const sigBuffer = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payloadB64));
  const sigB64 = uint8ToBase64url(new Uint8Array(sigBuffer));
  return `${payloadB64}.${sigB64}`;
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [payloadB64, sigB64] = parts;

    const secret = process.env.NEXT_PUBLIC_ADMIN_SALT;
    if (!secret) return null;
    const key = await getHmacKey(secret);
    const sigBuffer = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payloadB64));
    const expectedSig = uint8ToBase64url(new Uint8Array(sigBuffer));
    if (expectedSig !== sigB64) return null;

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
