import { config } from "../config/index";
import { logger } from "../logger/index";

const log = logger("firecrawl");

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

// Step 1 schema: only the URL of the first matching result — no price fields,
// so the LLM cannot hallucinate a price from the search listing.
const SEARCH_SCHEMA = {
  type: "object",
  properties: {
    found:       { type: "boolean", description: "True if at least one matching product listing was found on this search results page" },
    product_url: { type: "string",  description: "Full HTTPS URL of the first result that matches the OEM number — must link directly to the product detail page, NOT back to a search page" },
  },
  required: ["found"],
} as const;

// Step 2 schema: full product details from the product page itself.
const PRODUCT_SCHEMA = {
  type: "object",
  properties: {
    found:             { type: "boolean", description: "True if this page is a product detail page for the given OEM part number" },
    product_url:       { type: "string",  description: "Canonical URL of this product page if different from the URL you were given" },
    title:             { type: "string" },
    price:             { type: "number",  description: "Numeric price shown on the page, no currency symbol" },
    currency:          { type: "string",  description: "ISO 4217 currency code, e.g. USD, ILS, EUR, KRW" },
    in_stock:          { type: "boolean" },
    shipping_estimate: { type: "number",  description: "Shipping cost if shown, else omit" },
  },
  required: ["found"],
} as const;

export class FirecrawlError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = "FirecrawlError";
  }
}

async function firecrawlScrape(url: string, prompt: string, schema: object): Promise<unknown> {
  log.debug(`Scraping`, { url });

  const res = await fetch(`${config.firecrawl.baseUrl}/scrape`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.firecrawl.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
      formats: ["extract"],
      extract: { prompt, schema },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new FirecrawlError(`Firecrawl ${res.status}: ${body.slice(0, 200)}`, res.status);
  }

  const json = (await res.json()) as { data?: { extract?: unknown } };
  return json.data?.extract ?? null;
}

/**
 * Step 1 — scrape a search results page and return only the URL of the first
 * matching product. No price is requested here, preventing search-listing
 * prices from leaking into the result.
 */
export async function firecrawlFindProductUrl(
  searchUrl: string,
  oemNumber: string,
  supplierName: string,
): Promise<FoundProductUrl> {
  log.debug(`Step 1 — find product URL`, { searchUrl, oemNumber });

  const prompt =
    `You are extracting auto parts data from ${supplierName}. ` +
    `This page is a search results listing. ` +
    `Find the first result whose OEM/part number matches "${oemNumber}" (with or without dashes). ` +
    `Return only the DIRECT product detail page URL for that result. ` +
    `Do NOT return the search page URL, a category page, or a homepage.`;

  const data = await firecrawlScrape(searchUrl, prompt, SEARCH_SCHEMA) as FoundProductUrl | null;
  if (data?.found && data.product_url) return data;
  return { found: false };
}

/**
 * Step 2 — scrape the actual product page and extract price, currency, stock,
 * and the canonical URL. This is the authoritative source of truth for pricing.
 */
export async function firecrawlExtractProduct(
  productUrl: string,
  oemNumber: string,
  supplierName: string,
): Promise<ExtractedProduct> {
  log.debug(`Step 2 — extract product details`, { productUrl, oemNumber });

  const prompt =
    `You are extracting auto parts data from ${supplierName}. ` +
    `This page should be the product detail page for OEM part number "${oemNumber}" (with or without dashes). ` +
    `Extract the exact numeric price (no currency symbol), the ISO 4217 currency code, the product title, ` +
    `and whether it is currently in stock. ` +
    `If this is not a product page or the part number does not match, return found=false.`;

  const data = await firecrawlScrape(productUrl, prompt, PRODUCT_SCHEMA) as ExtractedProduct | null;
  if (data?.found) return data;
  return { found: false };
}
