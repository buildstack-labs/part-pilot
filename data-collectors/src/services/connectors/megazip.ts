import axios from "axios";
import { load } from "cheerio";
import type { FoundProductUrl, ExtractedProduct } from "../firecrawl-client";

const BASE_URL = "https://www.megazip.net";

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};

function compact(oem: string): string {
  return oem.replace(/-/g, "").toUpperCase();
}

/**
 * Step 1 — search results page.
 * MegaZip emits two link types per result:
 *   /zapchasti-dlya/{make}/{oem}-{oem}          ← generic catalog listing
 *   /zapchasti-dlya/{make}/{slug-name}-{oem}[P]  ← specific product page
 * We prefer the descriptive slug (last path segment doesn't start with the
 * compact OEM), falling back to whichever link contains the OEM.
 */
export async function findProductUrl(searchUrl: string, oemNumber: string): Promise<FoundProductUrl> {
  const res = await axios.get<string>(searchUrl, { headers: HEADERS });
  const $ = load(res.data);
  const oemCompact = compact(oemNumber).toLowerCase();

  let preferred: string | undefined;
  let fallback: string | undefined;

  $('a[href*="/zapchasti-dlya/"]').each((_, el) => {
    const href = $(el).attr("href");
    if (!href || !href.toLowerCase().includes(oemCompact)) return;

    const full = href.startsWith("http") ? href : BASE_URL + href;

    // Slug = last path segment before the query string
    const slug = (href.split("?")[0].split("/").pop() ?? "").toLowerCase();
    if (!slug.startsWith(oemCompact)) {
      preferred ??= full;
    } else {
      fallback ??= full;
    }

    if (preferred) return false; // break once we have a descriptive link
  });

  const productUrl = preferred ?? fallback;
  return productUrl ? { found: true, product_url: productUrl } : { found: false };
}

interface MegaZipOffer {
  currency?: string;
  value?: number | false;
  items?: Array<{ item_name?: string }>;
}

/**
 * Step 2 — product page.
 * Price and stock are in the data-offer JSON attribute on the price block:
 *   data-offer='{"currency":"USD","value":12.99,"items":[{"item_name":"..."}]}'
 * value=false means out of stock; a positive number means in stock at that price.
 */
export async function extractProduct(productUrl: string, oemNumber: string): Promise<ExtractedProduct> {
  const res = await axios.get<string>(productUrl, { headers: HEADERS });
  const $ = load(res.data);

  const raw = $("[data-offer]").first().attr("data-offer");
  if (!raw) return { found: false };

  let offer: MegaZipOffer;
  try {
    offer = JSON.parse(raw) as MegaZipOffer;
  } catch {
    return { found: false };
  }

  if (offer.value === false || offer.value == null || offer.value <= 0) {
    return { found: false };
  }

  // Verify the OEM appears on the page
  const oemCompact = compact(oemNumber);
  const pageText = $("body").text();
  if (!pageText.includes(oemCompact) && !pageText.includes(oemNumber)) {
    return { found: false };
  }

  const title = offer.items?.[0]?.item_name ?? undefined;

  return {
    found: true,
    title,
    price: offer.value,
    currency: offer.currency ?? "USD",
    in_stock: true,
  };
}
