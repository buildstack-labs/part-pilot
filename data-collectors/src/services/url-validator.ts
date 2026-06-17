import { config } from "../config/index";
import { logger } from "../logger/index";

const log = logger("url-validator");

export interface UrlValidationResult {
  valid: boolean;
  statusCode?: number;
  error?: string;
}

/** Path-based check: reject homepages and generic search-result pages. */
export function isDirectProductUrl(supplierId: string, rawUrl: string, oemNumber: string): boolean {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return false;
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") return false;

  const urlPath = url.pathname.toLowerCase();
  const oemCompact = oemNumber.replace(/-/g, "").toLowerCase();
  const href = url.href.toLowerCase();
  const oemInUrl = href.includes(oemCompact) || href.includes(oemNumber.toLowerCase());

  if (urlPath === "/" || urlPath === "/en" || urlPath === "/en/") return false;
  if (/^\/(search|shop\/?)$/.test(urlPath)) return false;

  switch (supplierId) {
    case "partsouq":
      if (urlPath.includes("/search")) return false;
      return urlPath.includes("/catalog/") || (/\.html$/i.test(urlPath) && oemInUrl);

    case "amayama":
      return urlPath.includes("/parts/") && !urlPath.endsWith("/parts/");

    case "impex-jp":
      return urlPath.includes("/parts/") && urlPath.length > 12;

    case "megazip":
      return (
        urlPath.includes("/part/") ||
        urlPath.includes("/parts/") ||
        (urlPath.includes("/search") && oemInUrl)
      );

    case "sparekorea":
      return urlPath.includes("/product/parts/");

    case "rockauto":
      return urlPath.includes("/moreinfo") || urlPath.includes("moreinfo.php");

    default:
      return urlPath.split("/").filter(Boolean).length >= 2;
  }
}

export function normalizeProductUrl(rawUrl: string, fallbackOrigin: string): string {
  try {
    const url = new URL(rawUrl, fallbackOrigin);
    url.hash = "";
    return url.href;
  } catch {
    return rawUrl;
  }
}

/** Live check: HTTP HEAD request to confirm the URL resolves to a real page. */
export async function validateUrlLive(url: string): Promise<UrlValidationResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.urlValidator.timeoutMs);

  try {
    const response = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; PartPilot-Bot/1.0)" },
    });
    clearTimeout(timer);

    const valid = response.status >= 200 && response.status < 400;
    if (!valid) log.warn(`HEAD ${response.status}`, { url });
    return { valid, statusCode: response.status };
  } catch (err) {
    clearTimeout(timer);
    const error = err instanceof Error ? err.message : String(err);
    log.warn("HEAD request failed", { url, error });
    return { valid: false, error };
  }
}
