import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getPool, closePool } from "./client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCHEMA_PATH = path.resolve(__dirname, "schema.sql");

async function migrate(): Promise<void> {
  const sql = fs.readFileSync(SCHEMA_PATH, "utf8");
  const pool = getPool();

  console.log("[migrate] Applying schema + seed data...");
  await pool.query(sql);
  console.log("[migrate] Done.");

  await closePool();
}

migrate().catch((err) => {
  console.error("[migrate] Failed:", err);
  process.exit(1);
});
