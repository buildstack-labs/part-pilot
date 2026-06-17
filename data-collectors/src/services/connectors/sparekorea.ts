import axios from "axios";
import { load } from "cheerio";
import type { FoundProductUrl, ExtractedProduct } from "../firecrawl-client";

const BASE_URL = "https://www.sparekorea.com";

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};

function compact(oem: string): string {
  return oem.replace(/-/g, "").toUpperCase();
}

/**
 * Step 1 — fetch the search results page and return the URL of the first
 * matching product. Product links have the form /product/parts/{id}/{oem}/{slug}.
 * We prefer the link whose path contains the compact OEM, falling back to the
 * first /product/parts/ link (search URL already filtered by OEM number).
 */
export async function findProductUrl(searchUrl: string, oemNumber: string): Promise<FoundProductUrl> {
  const res = await axios.get<string>(searchUrl, { headers: HEADERS });
  const $ = load(res.data);
  const oemCompact = compact(oemNumber).toLowerCase();

  let productUrl: string | undefined;

  $('a[href*="/product/parts/"]').each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;
    if (href.toLowerCase().includes(oemCompact)) {
      productUrl = href.startsWith("http") ? href : BASE_URL + href;
      return false; // break on first OEM match
    }
  });

  // Fallback: take the first /product/parts/ link — search already pre-filtered
  if (!productUrl) {
    const firstHref = $('a[href*="/product/parts/"]').first().attr("href");
    if (firstHref) {
      productUrl = firstHref.startsWith("http") ? firstHref : BASE_URL + firstHref;
    }
  }

  return productUrl ? { found: true, product_url: productUrl } : { found: false };
}

/**
 * Step 2 — fetch the product page and extract price/currency/stock from JSON-LD.
 * Falls back to the Alpine.js x-init attribute if JSON-LD is absent.
 * Returns found=false if the OEM number does not appear anywhere on the page.
 */
export async function extractProduct(productUrl: string, oemNumber: string): Promise<ExtractedProduct> {
  const res = await axios.get<string>(productUrl, { headers: HEADERS });
  const $ = load(res.data);

  // Guard: OEM must appear on the page (compact or raw form)
  const oemCompact = compact(oemNumber);
  const pageText = $("body").text();
  if (!pageText.includes(oemCompact) && !pageText.includes(oemNumber)) {
    return { found: false };
  }

  let price: number | undefined;
  let currency: string | undefined;
  let inStock: boolean | undefined;

  // JSON-LD — SpareKorea embeds structured offer data at root level
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).text()) as Record<string, unknown>;
      const offerData = (data.offers as Record<string, unknown>) ?? data;
      const rawPrice = offerData.price;
      if (rawPrice != null) {
        const parsed = parseFloat(String(rawPrice));
        if (!isNaN(parsed) && parsed > 0) {
          price = parsed;
          currency = String(offerData.priceCurrency ?? "USD");
          const avail = String(offerData.availability ?? "");
          inStock = avail === "" || avail.toLowerCase().includes("instock");
          return false; // break
        }
      }
    } catch {
      // ignore malformed blocks
    }
  });

  // Fallback: Alpine.js x-init="saleMoney = 6.72; ..."
  if (price == null) {
    const xInit = $("[x-init]").attr("x-init") ?? "";
    const m = xInit.match(/saleMoney\s*=\s*([\d.]+)/);
    if (m) {
      price = parseFloat(m[1]);
      currency ??= "USD";
      inStock ??= true;
    }
  }

  if (price == null || price <= 0) return { found: false };

  const title =
    $("#cart h2.bold").text().trim() ||
    $("h2.bold").first().text().trim() ||
    undefined;

  return {
    found: true,
    title: title || undefined,
    price,
    currency: currency ?? "USD",
    in_stock: inStock ?? true,
  };
}
