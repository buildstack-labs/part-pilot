/**
 * eBay Browse API integration (EPN) — disabled until credentials are configured.
 * See docs/ebay-epn-setup.md for registration steps.
 */
export const EBAY_BROWSE_API_ENABLED =
  process.env.EBAY_BROWSE_API_ENABLED === "true";

/** Production Browse API base — sandbox uses api.sandbox.ebay.com */
export const EBAY_BROWSE_API_BASE_URL =
  process.env.EBAY_BROWSE_API_BASE_URL ?? "https://api.ebay.com";
