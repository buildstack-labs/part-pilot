import { logger } from "../logger/index";
import * as sparekorea from "./connectors/sparekorea";

const log = logger("scraper");

export interface ExtractedProduct {
  found: boolean;
  product_url?: string;
  title?: string;
  price?: number;
  currency?: string;
  in_stock?: boolean;
  shipping_estimate?: number;
}

export interface FoundProductUrl {
  found: boolean;
  product_url?: string;
}

function detectConnector(url: string): string | null {
  if (url.includes("sparekorea.com")) return "sparekorea";
  return null;
}

/**
 * Step 1 — find the direct product page URL from a supplier search results page.
 * Routes to a per-supplier Cheerio connector. Returns found=false for suppliers
 * without a connector yet.
 */
export async function firecrawlFindProductUrl(
  searchUrl: string,
  oemNumber: string,
  supplierName: string,
): Promise<FoundProductUrl> {
  const connector = detectConnector(searchUrl);
  switch (connector) {
    case "sparekorea":
      return sparekorea.findProductUrl(searchUrl, oemNumber);
    default:
      log.warn(`No connector implemented for ${supplierName} — skipping`, { url: searchUrl });
      return { found: false };
  }
}

/**
 * Step 2 — extract price, currency, stock status, and title from a product page.
 * Routes to a per-supplier Cheerio connector. Returns found=false for suppliers
 * without a connector yet.
 */
export async function firecrawlExtractProduct(
  productUrl: string,
  oemNumber: string,
  supplierName: string,
): Promise<ExtractedProduct> {
  const connector = detectConnector(productUrl);
  switch (connector) {
    case "sparekorea":
      return sparekorea.extractProduct(productUrl, oemNumber);
    default:
      log.warn(`No connector implemented for ${supplierName} — skipping`, { url: productUrl });
      return { found: false };
  }
}
