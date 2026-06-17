/** Reject homepage/search-only URLs — we need direct product pages. */
export function isDirectProductUrl(
  supplierId: string,
  rawUrl: string,
  oemNumber: string,
): boolean {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return false;
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") return false;

  const path = url.pathname.toLowerCase();
  const oemCompact = oemNumber.replace(/-/g, "").toLowerCase();
  const href = url.href.toLowerCase();
  const oemInUrl =
    href.includes(oemCompact) || href.includes(oemNumber.toLowerCase());

  // Generic reject: root or shallow search-only paths
  if (path === "/" || path === "/en" || path === "/en/") return false;
  if (/^\/(search|shop\/?)$/.test(path)) return false;

  switch (supplierId) {
    case "partsouq":
      if (path.includes("/search")) return false;
      return (
        path.includes("/catalog/") ||
        (/\.html$/i.test(path) && oemInUrl)
      );

    case "amayama":
      return path.includes("/parts/") && !path.endsWith("/parts/");

    case "impex-jp":
      return path.includes("/parts/") && path.length > 12;

    case "megazip":
      return (
        path.includes("/part/") ||
        path.includes("/parts/") ||
        (path.includes("/search") && oemInUrl)
      );

    case "sparekorea":
      return path.includes("/product/parts/");

    case "rockauto":
      return path.includes("/moreinfo") || path.includes("moreinfo.php");

    case "il-motory":
    case "il-yaam":
    case "il-abparts":
    case "il-nivos":
      return (
        path.length > 8 &&
        !path.endsWith("/shop") &&
        !path.endsWith("/shop/") &&
        (oemInUrl || path.includes("/product") || path.includes("/p/"))
      );

    default:
      return path.split("/").filter(Boolean).length >= 2;
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
