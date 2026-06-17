import type { PartCategoryId, Vehicle } from "../types";
import { plateToDigits } from "../utils/plate";

export interface CategoryBrowseLink {
  supplierId: string;
  nameHe: string;
  url: string;
}

const CATEGORY_SEARCH_TERMS: Record<PartCategoryId, { he: string; en: string }> =
  {
    filters: { he: "פילטרים", en: "filters" },
    brakes: { he: "בלמים", en: "brake" },
    engine: { he: "מנוע", en: "engine" },
    body: { he: "מרכב", en: "body" },
    electrical: { he: "חשמל", en: "electrical" },
    suspension: { he: "מתלים", en: "suspension" },
    cooling: { he: "קירור", en: "cooling" },
    exhaust: { he: "פליטה", en: "exhaust" },
    steering: { he: "הגה", en: "steering" },
    aircon: { he: "מיזוג", en: "air conditioning" },
  };

/** Outbound category browse links when no OEM parts are seeded yet for a category. */
export function getCategoryBrowseLinks(
  categoryId: PartCategoryId,
  vehicle: Vehicle | null,
  plate?: string,
): CategoryBrowseLink[] {
  const terms = CATEGORY_SEARCH_TERMS[categoryId];
  const plateDigits = plate ? plateToDigits(plate) : null;
  const make = vehicle?.make ?? "";
  const model = vehicle?.model ?? "";
  const q = encodeURIComponent(`${make} ${model} ${terms.en}`.trim());
  const qHe = encodeURIComponent(`${terms.he} ${make} ${model}`.trim());

  const links: CategoryBrowseLink[] = [
    {
      supplierId: "partsouq",
      nameHe: "PartSouq",
      url: `https://partsouq.com/en/search/all?q=${q}`,
    },
    {
      supplierId: "sparekorea",
      nameHe: "Spare Korea",
      url: `https://www.sparekorea.com/product/parts?name=${q}&manufacturer=A&model=A`,
    },
  ];

  if (plateDigits != null) {
    links.unshift(
      {
        supplierId: "il-motory",
        nameHe: "מוטורי",
        url: `https://starter.co.il/?plate=${plateDigits}&q=${qHe}`,
      },
      {
        supplierId: "il-yaam",
        nameHe: "ים חלקי חילוף",
        url: `https://yaam.co.il/?plate=${plateDigits}&search=${qHe}`,
      },
    );
  }

  return links;
}
