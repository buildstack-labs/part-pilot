/**
 * Firecrawl supplier price sync job.
 *
 * Usage (from frontend/):
 *   npm run sync:supplier-prices
 *
 * Requires FIRECRAWL_API_KEY in repo-root .env or environment.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_PATH = path.resolve(
  __dirname,
  "../backend/src/data/scraped-offers.cache.json",
);

function loadDotEnv(): void {
  const envPath = path.resolve(__dirname, "../.env");
  if (!fs.existsSync(envPath)) return;
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

interface ScrapedOfferRecord {
  partId: string;
  supplierId: string;
  oemNumber: string;
  url: string;
  price: number;
  currency: string;
  shipping?: number;
  inStock: boolean;
  productTitle?: string;
  scrapedAt: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseSubset(envVal: string | undefined): Set<string> | null {
  if (!envVal?.trim()) return null;
  return new Set(
    envVal
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );
}

async function main(): Promise<void> {
  loadDotEnv();

  if (!process.env.FIRECRAWL_API_KEY) {
    console.error(
      "Missing FIRECRAWL_API_KEY. Get one at https://www.firecrawl.dev/app/api-keys",
    );
    process.exit(1);
  }

  const { PARTS } = await import("../backend/src/mocks/parts");
  const { SUPPLIERS } = await import("../backend/src/mocks/suppliers");
  const { buildOfferLinkContext, buildSupplierOfferUrl } = await import(
    "../backend/src/services/supplier-link-builder"
  );
  const { firecrawlExtractProduct } = await import(
    "../backend/src/services/firecrawl-client"
  );
  const { isDirectProductUrl, normalizeProductUrl } = await import(
    "../backend/src/services/supplier-url-validator"
  );

  const DELAY_MS = Number(process.env.FIRECRAWL_SCRAPE_DELAY_MS ?? 2500);
  const AFFILIATE_IDS = new Set(
    SUPPLIERS.filter((s) => s.isAffiliate).map((s) => s.id),
  );

  async function scrapeOffer(
    part: (typeof PARTS)[number],
    supplier: (typeof SUPPLIERS)[number],
  ): Promise<ScrapedOfferRecord | null> {
    const ctx = buildOfferLinkContext(part, null, undefined);
    const searchUrl = buildSupplierOfferUrl(supplier.id, ctx);

    console.log(`  → search: ${searchUrl}`);

    let extracted = await firecrawlExtractProduct(
      searchUrl,
      part.oemNumber,
      supplier.nameEn,
    );

    if (!extracted.found || !extracted.product_url) {
      console.log("  ✗ no product found");
      return null;
    }

    let productUrl = normalizeProductUrl(extracted.product_url, supplier.baseUrl);

    if (!isDirectProductUrl(supplier.id, productUrl, part.oemNumber)) {
      console.log(`  ⚠ rejected non-product URL: ${productUrl}`);
      return null;
    }

    if (productUrl !== searchUrl) {
      await sleep(DELAY_MS);
      console.log(`  → verify product page: ${productUrl}`);
      const verified = await firecrawlExtractProduct(
        productUrl,
        part.oemNumber,
        supplier.nameEn,
      );
      if (verified.found) {
        if (verified.product_url) {
          const verifiedUrl = normalizeProductUrl(
            verified.product_url,
            supplier.baseUrl,
          );
          if (isDirectProductUrl(supplier.id, verifiedUrl, part.oemNumber)) {
            productUrl = verifiedUrl;
          }
        }
        extracted = { ...extracted, ...verified, product_url: productUrl };
      }
    }

    const price = extracted.price ?? 0;
    if (price <= 0) {
      console.log("  ✗ no price extracted");
      return null;
    }

    if (!isDirectProductUrl(supplier.id, productUrl, part.oemNumber)) {
      console.log(`  ⚠ final URL failed validation: ${productUrl}`);
      return null;
    }

    const record: ScrapedOfferRecord = {
      partId: part.id,
      supplierId: supplier.id,
      oemNumber: part.oemNumber,
      url: productUrl,
      price,
      currency: extracted.currency ?? "USD",
      shipping: extracted.shipping_estimate,
      inStock: extracted.in_stock ?? true,
      productTitle: extracted.title,
      scrapedAt: new Date().toISOString(),
    };

    console.log(
      `  ✓ ${record.currency} ${record.price} — ${record.url.slice(0, 80)}…`,
    );
    return record;
  }

  const supplierFilter = parseSubset(process.env.SYNC_SUPPLIERS);
  const partFilter = parseSubset(process.env.SYNC_PARTS);

  const suppliers = SUPPLIERS.filter(
    (s) =>
      AFFILIATE_IDS.has(s.id) &&
      (!supplierFilter || supplierFilter.has(s.id)),
  );

  const parts = PARTS.filter(
    (p) => !partFilter || partFilter.has(p.oemNumber) || partFilter.has(p.id),
  );

  console.log(
    `Syncing ${parts.length} parts × ${suppliers.length} affiliate suppliers…\n`,
  );

  const offers: ScrapedOfferRecord[] = [];
  let failures = 0;

  for (const part of parts) {
    console.log(`\n[${part.oemNumber}] ${part.nameEn}`);
    for (const supplier of suppliers) {
      console.log(`  ${supplier.nameEn}:`);
      try {
        const record = await scrapeOffer(part, supplier);
        if (record) offers.push(record);
        else failures += 1;
      } catch (err) {
        failures += 1;
        console.log(
          `  ✗ error: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
      await sleep(DELAY_MS);
    }
  }

  const payload = {
    version: 1,
    scrapedAt: new Date().toISOString(),
    offers,
  };

  fs.writeFileSync(CACHE_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

  console.log(
    `\nDone. ${offers.length} offers saved, ${failures} gaps. Cache: ${CACHE_PATH}`,
  );
  console.log("Restart the dev server to load updated prices in the app.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
