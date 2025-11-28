// Simple lowdb prototype storage.
// Replace with Postgres + Prisma or MongoDB in production.

import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { join } from "path";
import fs from "fs";

const file = process.env.DB_FILE || join(process.cwd(), "data", "db.json");

// ensure data directory exists
const dir = join(process.cwd(), "data");
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const adapter = new JSONFile(file);
const db = new Low(adapter);

async function initDB() {
  await db.read();
  db.data ||= { users: [], verificationCodes: [], uploads: [], products: [] };
  await db.write();
}

async function getDB() {
  if (!db.data) await initDB();
  return db;
}

export { getDB, initDB };