import crypto from "crypto";
import { compareSync, hashSync } from "@node-rs/bcrypt";

// bcrypt cost factor
const SALT_ROUNDS = 12;

export function hashPasswordSync(password: string): string {
  return hashSync(password, SALT_ROUNDS);
}

export function verifyPassword(password: string, hashStr: string): boolean {
  try {
    const result = compareSync(password, hashStr);
    return result;
  } catch (error) {
    console.error("Error verifying password:", error);
    return false;
  }
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// Simple session store (in production, use Redis or database)
const sessions = new Map<string, { expiresAt: number; createdAt: number }>();

// Rate limiting for failed login attempts
const failedAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export function isRateLimited(ipOrToken: string): boolean {
  const record = failedAttempts.get(ipOrToken);
  if (!record) return false;
  if (Date.now() - record.lastAttempt > LOCKOUT_DURATION_MS) {
    failedAttempts.delete(ipOrToken);
    return false;
  }
  return record.count >= MAX_FAILED_ATTEMPTS;
}

export function recordFailedAttempt(ipOrToken: string): void {
  const record = failedAttempts.get(ipOrToken) || { count: 0, lastAttempt: Date.now() };
  record.count += 1;
  record.lastAttempt = Date.now();
  failedAttempts.set(ipOrToken, record);
}

export function clearFailedAttempts(ipOrToken: string): void {
  failedAttempts.delete(ipOrToken);
}

export function createSession(): string {
  const token = generateToken();
  sessions.set(token, { expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, createdAt: Date.now() });
  return token;
}

export function validateSession(token: string): boolean {
  if (!token) return false;
  const session = sessions.get(token);
  if (!session) return false;
  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
    return false;
  }
  return true;
}

export function deleteSession(token: string): void {
  sessions.delete(token);
}

export function verifyHMACToken(token: string | null): boolean {
  try {
    if (!token) return false;
    const parts = token.split(".");
    if (parts.length !== 2) return false;
    const [payloadB64, signatureB64] = parts;
    const secret = process.env.ADMIN_SALT;
    if (!secret) return false;
    const expectedBuf = crypto.createHmac("sha256", secret).update(payloadB64).digest();
    const sigBuf = Buffer.from(signatureB64, "base64");
    if (expectedBuf.length !== sigBuf.length) return false;
    if (!crypto.timingSafeEqual(expectedBuf, sigBuf)) return false;
    const payloadJson = Buffer.from(payloadB64, "base64").toString("utf8");
    const payload = JSON.parse(payloadJson);
    if (!payload.exp || Date.now() > payload.exp) return false;
    return true;
  } catch (e) {
    return false;
  }
}

// Cleanup expired sessions every 30 minutes
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of sessions.entries()) {
    if (now > session.expiresAt) {
      sessions.delete(token);
    }
  }
}, 30 * 60 * 1000);
