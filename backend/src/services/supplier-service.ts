import { getOffersForPart } from "../mocks/offers";
import { SUPPLIERS_BY_ID } from "../mocks/suppliers";
import { getPartById } from "./parts-service";
import { NotFoundError } from "../types";
import type { PartOffer, Supplier, SupplierType } from "../types";

export interface SupplierOfferDto {
  offer: PartOffer;
  supplier: Supplier;
  totalPrice: number;
}

export interface SupplierOffersResult {
  offers: SupplierOfferDto[];
  partId: string;
}

export function getSupplierOffers(
  partId: string,
  filter: "all" | SupplierType = "all",
): SupplierOffersResult {
  const part = getPartById(partId);
  if (!part) throw new NotFoundError("חלק לא נמצא");

  let offers = getOffersForPart(partId).map((offer) => {
    const supplier = SUPPLIERS_BY_ID[offer.supplierId];
    if (!supplier) throw new Error(`Missing supplier ${offer.supplierId}`);
    return {
      offer,
      supplier,
      totalPrice: offer.price + offer.shipping,
    };
  });

  if (filter === "local") {
    offers = offers.filter((o) => o.supplier.type === "local");
  } else if (filter === "international") {
    offers = offers.filter((o) => o.supplier.type === "international");
  }

  offers.sort((a, b) => {
    if (a.supplier.type !== b.supplier.type) {
      return a.supplier.type === "local" ? -1 : 1;
    }
    return a.totalPrice - b.totalPrice;
  });

  return { offers, partId };
}

export function listAllSuppliers(): Supplier[] {
  return Object.values(SUPPLIERS_BY_ID);
}
