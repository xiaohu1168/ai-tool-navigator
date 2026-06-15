/**
 * Migration script: Seeds the initial admin user from .env values into the database.
 * Run with: npx tsx scripts/migrate-users.ts
 *
 * This reads ADMIN_USERNAME and ADMIN_PASSWORD from .env,
 * creates a User record with role SUPER_ADMIN,
 * and prints the result.
 */
import { hashSync } from "@node-rs/bcrypt";
import { randomBytes } from "crypto";
import { readFileSync } from "fs";
import { join } from "path";

function parseEnvFile(filePath: string): Record<string, string> {
  try {
    const content = readFileSync(filePath, "utf8");
    const env: Record<string, string> = {};
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx <= 0) continue;
      const key = trimmed.substring(0, eqIdx).trim();
      let value = trimmed.substring(eqIdx + 1);
      if (value.length >= 2 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
        value = value.substring(1, value.length - 1);
      }
      env[key] = value;
    }
    return env;
  } catch {
    return {};
  }
}

async function main() {
  // Load env
  const env = parseEnvFile(join(process.cwd(), ".env"));
  const envLocal = parseEnvFile(join(process.cwd(), ".env.local"));
  const merged = { ...envLocal, ...env };

  const username = merged.ADMIN_USERNAME || "admin";
  const passwordHash = merged.ADMIN_PASSWORD || "";
  const salt = merged.ADMIN_SALT || "";

  // Generate a strong ADMIN_SALT if it's weak
  let finalSalt = salt;
  if (!salt || salt.length < 32 || /^a1b2c3/.test(salt)) {
    finalSalt = randomBytes(64).toString("hex");
    console.log("⚠️  Weak ADMIN_SALT detected. Generating a strong one:");
    console.log(`   ADMIN_SALT="${finalSalt}"`);
    console.log("   Add this to your .env file!");
  }

  // Set env for Prisma
  process.env.NEXT_PUBLIC_ADMIN_SALT = finalSalt;
  process.env.DATABASE_URL = merged.DATABASE_URL || "postgresql://localhost:5432/heyaihub";

  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();

  // Check if user already exists
  const existing = await prisma.user.findFirst({ where: { username } });
  if (existing) {
    console.log(`✅ User "${username}" already exists (id: ${existing.id}, role: ${existing.role})`);
  } else {
    // Create user from .env credentials
    const user = await prisma.user.create({
      data: {
        username,
        email: `${username}@heyaihub.com`,
        passwordHash: passwordHash || hashSync("changeme123", 12),
        role: "SUPER_ADMIN",
      },
    });
    console.log(`✅ Created user "${username}" (id: ${user.id}, role: SUPER_ADMIN)`);
  }

  // Print summary
  const allUsers = await prisma.user.findMany({
    select: { id: true, username: true, email: true, role: true, isActive: true, createdAt: true },
  });
  console.log(`\n📋 Current users (${allUsers.length}):`);
  for (const u of allUsers) {
    console.log(`   ${u.username} (${u.email}) — ${u.role} — ${u.isActive ? "active" : "disabled"}`);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("Migration failed:", e);
  process.exit(1);
});
