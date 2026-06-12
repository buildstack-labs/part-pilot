import type { PartOffer } from "../types";
import { PARTS } from "./parts";

/**
 * Static cached-style offer fixtures — deterministic, DB-row shaped.
 * Prices vary slightly by part to feel realistic.
 */
const LAST_CHECKED = "2026-06-01T08:00:00.000Z";

type OfferTemplate = {
  supplierId: string;
  priceOffset: number;
  shipping: number;
  inStock: boolean;
};

const TEMPLATES: OfferTemplate[] = [
  { supplierId: "s1", priceOffset: 40, shipping: 0, inStock: true },
  { supplierId: "s2", priceOffset: 48, shipping: 0, inStock: true },
  { supplierId: "s3", priceOffset: 28, shipping: 35, inStock: true },
  { supplierId: "s4", priceOffset: 25, shipping: 42, inStock: true },
  { supplierId: "s5", priceOffset: 30, shipping: 38, inStock: false },
];

/** Base price per part category for deterministic totals */
const PART_BASE_PRICES: Record<string, number> = {
  "c3000001-0000-4000-8000-000000000001": 45,
  "c3000001-0000-4000-8000-000000000002": 55,
  "c3000001-0000-4000-8000-000000000003": 180,
  "c3000001-0000-4000-8000-000000000004": 160,
  "c3000001-0000-4000-8000-000000000005": 65,
  "c3000001-0000-4000-8000-000000000006": 120,
  "c3000001-0000-4000-8000-000000000007": 75,
  "c3000001-0000-4000-8000-000000000008": 95,
};

let offerCounter = 0;

function nextOfferId(): string {
  offerCounter += 1;
  return `d4000001-0000-4000-8000-${String(offerCounter).padStart(12, "0")}`;
}

export const PART_OFFERS: PartOffer[] = PARTS.flatMap((part) => {
  const base = PART_BASE_PRICES[part.id] ?? 80;
  return TEMPLATES.map((t) => ({
    id: nextOfferId(),
    partId: part.id,
    supplierId: t.supplierId,
    price: base + t.priceOffset,
    currency: "ILS",
    shipping: t.shipping,
    inStock: t.inStock,
    offerUrl: `https://example.com/offer/${part.id}/${t.supplierId}`,
    lastCheckedAt: LAST_CHECKED,
  }));
});

export function getOffersForPart(partId: string): PartOffer[] {
  return PART_OFFERS.filter((o) => o.partId === partId);
}
