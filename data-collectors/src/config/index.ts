import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Load repo-root .env before reading env vars (mirrors scripts/sync-supplier-prices.ts pattern)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../../../.env"); // data-engine/src/config → repo root
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

function required(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`Missing required env var: ${name}`);
  return val;
}

function optional(name: string, fallback: string): string {
  return process.env[name] ?? fallback;
}

export const config = {
  db: {
    url: required("DATABASE_URL"),
  },
  firecrawl: {
    apiKey: required("FIRECRAWL_API_KEY"),
    baseUrl: optional("FIRECRAWL_API_BASE_URL", "https://api.firecrawl.dev/v1"),
    delayMs: Number(optional("FIRECRAWL_SCRAPE_DELAY_MS", "2500")),
  },
  sync: {
    cronSchedule: optional("SYNC_CRON_SCHEDULE", "0 */8 * * *"),
    runOnStart: optional("SYNC_ON_START", "false") === "true",
    supplierFilter: optional("SYNC_SUPPLIERS", ""),
    partFilter: optional("SYNC_PARTS", ""),
  },
  urlValidator: {
    timeoutMs: Number(optional("URL_VALIDATOR_TIMEOUT_MS", "8000")),
  },
} as const;
