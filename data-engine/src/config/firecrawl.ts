/**
 * Firecrawl — used by scripts/sync-supplier-prices.ts to refresh supplier product URLs/prices.
 * Get an API key: https://www.firecrawl.dev/app/api-keys
 */
export const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY ?? "";

export const FIRECRAWL_API_BASE_URL =
  process.env.FIRECRAWL_API_BASE_URL ?? "https://api.firecrawl.dev/v1";

export const FIRECRAWL_SYNC_ENABLED = Boolean(FIRECRAWL_API_KEY);

/** Delay between scrape requests to respect rate limits */
export const FIRECRAWL_SCRAPE_DELAY_MS = Number(
  process.env.FIRECRAWL_SCRAPE_DELAY_MS ?? 2500,
);
