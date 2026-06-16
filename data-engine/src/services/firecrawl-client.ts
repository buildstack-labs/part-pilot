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

const EXTRACT_SCHEMA = {
  type: "object",
  properties: {
    found:             { type: "boolean", description: "True if a matching product listing was found" },
    product_url:       { type: "string",  description: "Full HTTPS URL to the specific product detail page — NOT a homepage, category, or generic search page" },
    title:             { type: "string" },
    price:             { type: "number" },
    currency:          { type: "string" },
    in_stock:          { type: "boolean" },
    shipping_estimate: { type: "number" },
  },
  required: ["found"],
} as const;

export class FirecrawlError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = "FirecrawlError";
  }
}

export async function firecrawlExtractProduct(
  url: string,
  oemNumber: string,
  supplierName: string,
): Promise<ExtractedProduct> {
  log.debug(`Scraping`, { url, oemNumber });

  const res = await fetch(`${config.firecrawl.baseUrl}/scrape`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.firecrawl.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
      formats: ["extract"],
      extract: {
        prompt: `You are extracting auto parts data from ${supplierName}.
Find the listing matching OEM part number "${oemNumber}" (with or without dashes).
Return the DIRECT product detail page URL where the user can purchase this exact part.
Do NOT return a homepage, category page, or generic search results page.
Return the exact numeric price, currency code (USD/ILS/EUR/JPY/KRW), product title, and stock status.`,
        schema: EXTRACT_SCHEMA,
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new FirecrawlError(
      `Firecrawl ${res.status}: ${body.slice(0, 200)}`,
      res.status,
    );
  }

  const json = (await res.json()) as {
    success?: boolean;
    data?: { extract?: ExtractedProduct };
  };

  const extracted = json.data?.extract;
  if (extracted?.found) return extracted;

  return { found: false };
}
