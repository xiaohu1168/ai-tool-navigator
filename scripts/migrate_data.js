const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const cwd = process.cwd();
const dbPath = path.join(cwd, "prisma", "dev.db");
const dataDir = path.join(cwd, "data");

// Remove old DB if exists for clean migration
if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

console.log("=== Creating tables ===");

db.exec(`
  CREATE TABLE tools (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    url TEXT NOT NULL,
    price TEXT NOT NULL,
    price_type TEXT DEFAULT 'Free',
    rating REAL DEFAULT 4.0,
    featured INTEGER DEFAULT 0,
    tags TEXT DEFAULT '[]',
    pros TEXT DEFAULT '[]',
    cons TEXT DEFAULT '[]',
    for_whom TEXT,
    not_for TEXT,
    alternatives TEXT,
    privacy TEXT,
    updated TEXT,
    category_id TEXT NOT NULL,
    click_count INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE INDEX idx_tools_category ON tools(category_id);
  CREATE INDEX idx_tools_slug ON tools(slug);
  CREATE INDEX idx_tools_featured ON tools(featured);

  CREATE TABLE categories (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    description TEXT NOT NULL,
    count INTEGER DEFAULT 0
  );

  CREATE TABLE submissions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT NOT NULL,
    category_id TEXT NOT NULL,
    price TEXT,
    tags TEXT,
    status TEXT DEFAULT 'pending',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE blog_posts (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT,
    date TEXT,
    views INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE search_queries (
    id TEXT PRIMARY KEY,
    query TEXT NOT NULL,
    results INTEGER DEFAULT 0,
    timestamp TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE page_views (
    id TEXT PRIMARY KEY,
    path TEXT NOT NULL,
    referrer TEXT,
    ip TEXT,
    user_agent TEXT,
    timestamp TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE ad_performance (
    id TEXT PRIMARY KEY,
    slot TEXT NOT NULL,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    date TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(slot, date)
  );
`);

console.log("Tables created successfully");

// --- Migrate categories ---
console.log("\n=== Migrating categories ===");
const catsFile = path.join(dataDir, "categories.json");
const catsRaw = fs.readFileSync(catsFile, "utf-8").replace(/^\uFEFF/, "");
const categories = JSON.parse(catsRaw);

const catInsert = db.prepare(
  "INSERT OR REPLACE INTO categories (id, slug, name, icon, description, count) VALUES (?, ?, ?, ?, ?, ?)"
);

for (const cat of categories) {
  catInsert.run(cat.id, cat.id, cat.name, cat.icon, cat.description, cat.count);
}
console.log("  Migrated " + categories.length + " categories");

// --- Migrate tools ---
console.log("\n=== Migrating tools ===");
const toolFiles = fs.readdirSync(dataDir).filter(f => f.endsWith("_tools.json") && f !== "other_tools.json");
let totalTools = 0;

const toolInsert = db.prepare(
  "INSERT OR REPLACE INTO tools (id,slug,name,description,url,price,price_type,rating,featured,tags,pros,cons,for_whom,not_for,alternatives,privacy,updated,category_id,click_count) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
);

for (const file of toolFiles) {
  const catId = file.replace("_tools.json", "");
  const raw = fs.readFileSync(path.join(dataDir, file), "utf-8").replace(/^\uFEFF/, "");
  const tools = JSON.parse(raw);
  
  const params = tools.map(t => [
    t.id, t.slug, t.name, t.description, t.url, t.price,
    t.price_type || "Free", t.rating || 4.0,
    t.featured ? 1 : 0,
    JSON.stringify(t.tags || []),
    JSON.stringify(t.pros || []),
    JSON.stringify(t.cons || []),
    t.for_whom || "",
    t.not_for || "",
    t.alternatives || "",
    t.privacy || null,
    t.updated || null,
    catId,
    t.click_count || 0
  ]);

  const insertMany = db.transaction((items) => {
    for (const p of items) {
      toolInsert.run(p);
    }
  });
  insertMany(params);
  totalTools += tools.length;
  console.log("  " + file + ": " + tools.length + " tools (" + catId + ")");
}
console.log("  Total: " + totalTools + " tools migrated");

// --- Migrate submissions ---
console.log("\n=== Migrating submissions ===");
const subsFile = path.join(dataDir, "submissions.json");
if (fs.existsSync(subsFile)) {
  const subsRaw = fs.readFileSync(subsFile, "utf-8");
  const submissions = JSON.parse(subsRaw);
  
  const subInsert = db.prepare(
    "INSERT OR REPLACE INTO submissions (id,name,url,description,category_id,price,tags,status,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)"
  );
  
  for (const sub of submissions) {
    subInsert.run(
      sub.id, sub.name, sub.url, sub.description, sub.category_id,
      sub.price || null, sub.tags || null, sub.status || "pending",
      sub.created_at || new Date().toISOString(),
      new Date().toISOString()
    );
  }
  console.log("  Migrated " + submissions.length + " submissions");
} else {
  console.log("  No submissions file found");
}

// --- Update category counts ---
console.log("\n=== Updating category counts ===");
db.exec(
  "UPDATE categories SET count = (SELECT COUNT(*) FROM tools WHERE tools.category_id = categories.id)"
);

const counts = db.prepare("SELECT id, name, count FROM categories").all();
for (const c of counts) {
  console.log("  " + c.name + ": " + c.count + " tools");
}

// --- Verify ---
console.log("\n=== Verification ===");
const toolCount = db.prepare("SELECT COUNT(*) as n FROM tools").get();
const catCount = db.prepare("SELECT COUNT(*) as n FROM categories").get();
const subCount = db.prepare("SELECT COUNT(*) as n FROM submissions").get();
console.log("  Tools: " + toolCount.n);
console.log("  Categories: " + catCount.n);
console.log("  Submissions: " + subCount.n);

db.close();
console.log("\n=== Migration complete! ===");
