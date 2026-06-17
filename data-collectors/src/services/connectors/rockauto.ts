import axios from "axios";
import { load } from "cheerio";
import type { FoundProductUrl, ExtractedProduct } from "../firecrawl-client";

const BASE_URL = "https://www.rockauto.com";

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Referer": "https://www.rockauto.com/",
};

/**
 * Step 1 — part number search results page.
 * RockAuto embeds full listing data (including moreinfo.php links) in the
 * initial HTML. We take the first moreinfo.php link, which is the top-ranked
 * compatible listing. Results are aftermarket-compatible parts, not necessarily
 * the exact OEM, so we don't filter by OEM number here.
 */
export async function findProductUrl(searchUrl: string, _oemNumber: string): Promise<FoundProductUrl> {
  const res = await axios.get<string>(searchUrl, { headers: HEADERS });
  const $ = load(res.data);

  let productUrl: string | undefined;
  $('a[href*="moreinfo.php"]').each((_, el) => {
    const href = $(el).attr("href");
    if (href) {
      productUrl = href.startsWith("http") ? href : BASE_URL + href;
      return false; // break on first match
    }
  });

  return productUrl ? { found: true, product_url: productUrl } : { found: false };
}

/**
 * Step 2 — moreinfo product page.
 * Price lives in <span id="dprice[1][v]">($1.86/Each)</span>.
 * If that element is absent or empty, the listing is out of stock or
 * requires option selection — we return found=false in both cases.
 * No OEM verification: the moreinfo page shows the aftermarket part
 * number, not the searched OEM, so a text-match would always fail.
 */
export async function extractProduct(productUrl: string, _oemNumber: string): Promise<ExtractedProduct> {
  const res = await axios.get<string>(productUrl, { headers: HEADERS });
  const $ = load(res.data);

  // <span id="dprice[1][v]">($1.86/Each)</span>
  const priceText = $('span[id="dprice[1][v]"]').text();
  const match = priceText.match(/\$([0-9]+(?:\.[0-9]+)?)/);
  if (!match) return { found: false };

  const price = parseFloat(match[1]);
  if (price <= 0) return { found: false };

  // "More Information for PRO-TEC PXL51334" → "PRO-TEC PXL51334"
  const title = $("title").text().replace(/^More Information for\s*/i, "").trim() || undefined;

  return {
    found: true,
    title: title || undefined,
    price,
    currency: "USD",
    in_stock: true,
  };
}
