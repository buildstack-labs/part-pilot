import { FIRECRAWL_API_BASE_URL } from "../config/firecrawl";

export interface ExtractedProduct {
  found: boolean;
  product_url?: string;
  title?: string;
  price?: number;
  currency?: string;
  in_stock?: boolean;
  shipping_estimate?: number;
}

const PRODUCT_EXTRACT_SCHEMA = {
  type: "object",
  properties: {
    found: {
      type: "boolean",
      description: "True if a matching product listing was found",
    },
    product_url: {
      type: "string",
      description:
        "Full absolute HTTPS URL to the specific product detail page — NOT homepage, NOT generic search",
    },
    title: { type: "string" },
    price: { type: "number" },
    currency: { type: "string" },
    in_stock: { type: "boolean" },
    shipping_estimate: { type: "number" },
  },
  required: ["found"],
} as const;

export class FirecrawlError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "FirecrawlError";
  }
}

function getFirecrawlApiKey(): string {
  return process.env.FIRECRAWL_API_KEY ?? "";
}

/** Scrape a supplier search or product URL and extract structured product data. */
export async function firecrawlExtractProduct(
  url: string,
  oemNumber: string,
  supplierName: string,
): Promise<ExtractedProduct> {
  const apiKey = getFirecrawlApiKey();
  if (!apiKey) {
    throw new FirecrawlError("FIRECRAWL_API_KEY is not configured");
  }

  const res = await fetch(`${FIRECRAWL_API_BASE_URL}/scrape`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
      formats: ["extract", "markdown"],
      extract: {
        prompt: `You are extracting auto parts data from ${supplierName}.
Find the listing that matches OEM part number "${oemNumber}" (with or without dashes).
Return the DIRECT product detail page URL where the user can buy this exact part.
Do NOT return the site homepage, category page, or generic search results page unless that page IS the only product detail view.
Return the exact numeric price shown on the page, currency code (USD/ILS/EUR), product title, and stock availability.`,
        schema: PRODUCT_EXTRACT_SCHEMA,
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new FirecrawlError(
      `Firecrawl scrape failed (${res.status}): ${body.slice(0, 200)}`,
      res.status,
    );
  }

  const json = (await res.json()) as {
    success?: boolean;
    data?: { extract?: ExtractedProduct; markdown?: string };
  };

  const extracted = json.data?.extract;
  if (extracted?.found) return extracted;

  return { found: false };
}
