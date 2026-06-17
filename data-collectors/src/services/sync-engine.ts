import { randomUUID } from "node:crypto";
import { config } from "../config/index";
import { logger } from "../logger/index";
import { normalizeMpn } from "./mpn-normalizer";
import { isDirectProductUrl, normalizeProductUrl, validateUrlLive } from "./url-validator";
import { firecrawlFindProductUrl, firecrawlExtractProduct } from "./firecrawl-client";
import { buildSupplierOfferUrl } from "@partpilot/data-engine/services/supplier-link-builder";
import { upsertOffer, startSyncLog, finishSyncLog } from "./offer-writer";
import { getActiveParts, getActiveSuppliers } from "../db/queries";
import type { ScrapeResult, SyncDetail, SyncRunStats } from "../types/index";

const log = logger("sync-engine");

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseFilter(raw: string): Set<string> | null {
  if (!raw.trim()) return null;
  return new Set(raw.split(",").map((s) => s.trim()).filter(Boolean));
}

async function scrapeOne(
  part:     { id: string; oem_number: string; name_en: string },
  supplier: { id: string; name_en: string; base_url: string },
): Promise<{ result: ScrapeResult | null; detail: SyncDetail }> {
  const base: Omit<SyncDetail, "status"> = {
    partId: part.id,
    oemNumber: part.oem_number,
    supplierId: supplier.id,
  };

  const searchUrl = buildSupplierOfferUrl(supplier.id, { oemNumber: part.oem_number, partNameEn: part.name_en, partNameHe: "" });
  log.debug(`Step 1 — search`, { supplier: supplier.id, oem: part.oem_number, url: searchUrl });

  // Step 1: find the product URL from the search results page (no price extracted here)
  const found = await firecrawlFindProductUrl(searchUrl, part.oem_number, supplier.name_en);

  if (!found.found || !found.product_url) {
    log.info(`No product found in search — ${supplier.id} / ${part.oem_number}`);
    return { result: null, detail: { ...base, status: "no_product" } };
  }

  let productUrl = normalizeProductUrl(found.product_url, supplier.base_url);

  if (!isDirectProductUrl(supplier.id, productUrl, part.oem_number)) {
    log.warn(`Step 1 URL rejected (not a product page)`, { url: productUrl });
    return { result: null, detail: { ...base, status: "url_rejected", url: productUrl } };
  }

  // Step 2: scrape the actual product page for the real price
  await sleep(config.firecrawl.delayMs);
  log.debug(`Step 2 — product page`, { url: productUrl });

  const extracted = await firecrawlExtractProduct(productUrl, part.oem_number, supplier.name_en);

  if (!extracted.found) {
    log.info(`Product page did not confirm part — ${supplier.id} / ${part.oem_number}`, { url: productUrl });
    return { result: null, detail: { ...base, status: "no_product", url: productUrl } };
  }

  // If Step 2 resolved a more canonical URL, prefer it
  if (extracted.product_url) {
    const canonicalUrl = normalizeProductUrl(extracted.product_url, supplier.base_url);
    if (isDirectProductUrl(supplier.id, canonicalUrl, part.oem_number)) {
      productUrl = canonicalUrl;
    }
  }

  const price = extracted.price ?? 0;
  if (price <= 0) {
    log.info(`No price — ${supplier.id} / ${part.oem_number}`);
    return { result: null, detail: { ...base, status: "no_price", url: productUrl } };
  }

  // Live HEAD check before writing to DB
  const { valid } = await validateUrlLive(productUrl);
  if (!valid) {
    log.warn(`HEAD check failed`, { url: productUrl });
    return { result: null, detail: { ...base, status: "url_rejected", url: productUrl } };
  }

  const result: ScrapeResult = {
    supplierId:   supplier.id,
    partId:       part.id,
    mpn:          normalizeMpn(part.oem_number),
    url:          productUrl,
    price,
    currency:     extracted.currency ?? "USD",
    shipping:     extracted.shipping_estimate ?? 0,
    inStock:      extracted.in_stock ?? true,
    productTitle: extracted.title,
  };

  log.info(`✓ ${supplier.id} / ${part.oem_number}`, { price, currency: result.currency, url: productUrl });
  return {
    result,
    detail: { ...base, status: "ok", url: productUrl, price },
  };
}

export async function runSync(): Promise<SyncRunStats> {
  const runId = randomUUID();
  const startedAt = new Date().toISOString();
  log.info(`Sync started`, { runId });

  const [allParts, allSuppliers] = await Promise.all([getActiveParts(), getActiveSuppliers()]);

  const supplierFilter = parseFilter(config.sync.supplierFilter);
  const partFilter     = parseFilter(config.sync.partFilter);

  const suppliers = allSuppliers.filter(
    (s) => s.is_affiliate && (!supplierFilter || supplierFilter.has(s.id)),
  );
  const parts = allParts.filter(
    (p) => !partFilter || partFilter.has(p.oem_number) || partFilter.has(p.id),
  );

  log.info(`Scope: ${parts.length} parts × ${suppliers.length} suppliers`, { runId });
  await startSyncLog(runId, parts.length, suppliers.length);

  const stats: SyncRunStats = {
    runId,
    startedAt,
    totalParts:     parts.length,
    totalSuppliers: suppliers.length,
    upserted:       0,
    failed:         0,
    urlRejected:    0,
    details:        [],
  };

  for (const part of parts) {
    log.info(`[${part.oem_number}] ${part.name_en}`);

    for (const supplier of suppliers) {
      try {
        const { result, detail } = await scrapeOne(part, supplier);
        stats.details.push(detail);

        if (result) {
          await upsertOffer(result, new Date().toISOString());
          stats.upserted++;
        } else if (detail.status === "url_rejected") {
          stats.urlRejected++;
        } else {
          stats.failed++;
        }
      } catch (err) {
        const error = err instanceof Error ? err.message : String(err);
        log.error(`Scrape error`, { supplier: supplier.id, oem: part.oem_number, error });
        stats.details.push({
          partId:     part.id,
          oemNumber:  part.oem_number,
          supplierId: supplier.id,
          status:     "failed",
          error,
        });
        stats.failed++;
      }

      await sleep(config.firecrawl.delayMs);
    }
  }

  await finishSyncLog(runId, stats);

  log.info(`Sync complete`, {
    runId,
    upserted:    stats.upserted,
    failed:      stats.failed,
    urlRejected: stats.urlRejected,
  });

  return stats;
}
