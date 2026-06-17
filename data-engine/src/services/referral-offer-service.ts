import { getReferencePrice } from "../data/reference-prices.fixture";
import { SUPPLIERS } from "../mocks/suppliers";
import type { Part, PriceSource, SupplierOffer, Vehicle } from "../types";
import {
  buildOfferLinkContext,
  buildSupplierOfferUrl,
} from "./supplier-link-builder";

function referralOfferId(supplierId: string, partId: string): string {
  return `referral-${supplierId}-${partId}`;
}

function resolvePrice(
  partId: string,
  supplierId: string,
  isLocal: boolean,
): Pick<SupplierOffer, "price" | "currency" | "shipping" | "priceSource" | "priceNoteHe"> {
  const ref = getReferencePrice(partId, supplierId);
  if (!ref) {
    return {
      price: 0,
      currency: isLocal ? "ILS" : "USD",
      shipping: 0,
      priceSource: "on_site",
      priceNoteHe: "מחיר באתר הספק",
    };
  }

  return {
    price: ref.price,
    currency: ref.currency,
    shipping: ref.shipping ?? 0,
    priceSource: isLocal ? "estimate" : "estimate",
    priceNoteHe: isLocal
      ? "מחיר משוער — אימות לפי מספר רישוי באתר"
      : "מחיר משוער — אימות באתר הספק",
  };
}

/**
 * Auto-generated referral offers for all registered suppliers.
 * Manual fixtures override these when present for the same supplier×part.
 */
export function buildReferralOffers(
  part: Part,
  vehicle: Vehicle | null,
  plate?: string,
  loadedAt?: string,
): SupplierOffer[] {
  const ctx = buildOfferLinkContext(part, vehicle, plate);
  const timestamp = loadedAt ?? new Date().toISOString();

  return SUPPLIERS.map((supplier) => {
    const pricing = resolvePrice(part.id, supplier.id, supplier.type === "local");

    return {
      id: referralOfferId(supplier.id, part.id),
      supplierId: supplier.id,
      partId: part.id,
      url: buildSupplierOfferUrl(supplier.id, ctx),
      inStock: true,
      lastUpdated: timestamp,
      sourceType: "referral" as const,
      ...pricing,
    };
  });
}

export function mergeSupplierOffers(
  manual: SupplierOffer[],
  scraped: SupplierOffer[],
  referral: SupplierOffer[],
): SupplierOffer[] {
  const bySupplier = new Map<string, SupplierOffer>();

  for (const offer of referral) {
    bySupplier.set(offer.supplierId, offer);
  }
  for (const offer of scraped) {
    bySupplier.set(offer.supplierId, offer);
  }
  for (const offer of manual) {
    bySupplier.set(offer.supplierId, {
      ...offer,
      priceSource: (offer.priceSource ?? "listed") as PriceSource,
    });
  }

  return [...bySupplier.values()];
}
