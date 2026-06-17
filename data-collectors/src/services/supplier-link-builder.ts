function compact(oem: string): string {
  return oem.replace(/-/g, "").toUpperCase();
}

function q(value: string): string {
  return encodeURIComponent(value);
}

/** Build the initial OEM search URL for a given supplier. */
export function buildSupplierSearchUrl(
  supplierId: string,
  oemNumber: string,
  partNameEn: string,
): string {
  const oemCompact = compact(oemNumber);
  const oemEncoded = q(oemNumber);

  switch (supplierId) {
    case "partsouq":
      return `https://partsouq.com/en/search/all?q=${q(oemCompact)}`;

    case "amayama":
      return `https://www.amayama.com/en/parts/?q=${q(oemCompact)}`;

    case "impex-jp":
      return `https://en.impex-jp.com/parts/new?partno=${oemEncoded}`;

    case "megazip":
      return `https://www.megazip.net/search?q=${q(oemCompact)}`;

    case "sparekorea":
      return `https://www.sparekorea.com/product/parts?no=${q(oemCompact)}&name=&manufacturer=A&model=A`;

    case "rockauto":
      return `https://www.rockauto.com/en/partsearch/?partnum=${oemEncoded}&mfr=hyundai`;

    default:
      return `https://www.google.com/search?q=${q(`${oemNumber} ${partNameEn}`)}`;
  }
}
