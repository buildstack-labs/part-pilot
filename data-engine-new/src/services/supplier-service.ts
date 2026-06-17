import { getSupplierOffersForPart } from "./supplier-offer-store";
import { SUPPLIERS_BY_ID } from "../mocks/suppliers";
import { getPartById } from "./parts-service";
import { lookupVehicleByPlate } from "./vehicle-service";
import { NotFoundError } from "../types";
import type { Supplier, SupplierOffer, SupplierType } from "../types";

export interface SupplierOfferDto {
  offer: SupplierOffer;
  supplier: Supplier;
  totalPrice: number;
}

export interface SupplierOffersResult {
  offers: SupplierOfferDto[];
  partId: string;
}

export interface SupplierOffersOptions {
  plate?: string;
}

export async function getSupplierOffers(
  partId: string,
  filter: "all" | SupplierType = "all",
  options: SupplierOffersOptions = {},
): Promise<SupplierOffersResult> {
  const part = getPartById(partId);
  if (!part) throw new NotFoundError("חלק לא נמצא");

  let vehicle = null;
  if (options.plate) {
    const lookup = await lookupVehicleByPlate(options.plate);
    vehicle = lookup.vehicle;
  }

  let offers = (await getSupplierOffersForPart(partId, vehicle, options.plate)).map(
    (offer) => {
      const supplier = SUPPLIERS_BY_ID[offer.supplierId];
      if (!supplier) throw new Error(`Missing supplier ${offer.supplierId}`);
      return {
        offer,
        supplier,
        totalPrice: offer.price + offer.shipping,
      };
    },
  );

  if (filter === "local") {
    offers = offers.filter((o) => o.supplier.type === "local");
  } else if (filter === "international") {
    offers = offers.filter((o) => o.supplier.type === "international");
  }

  offers.sort((a, b) => {
    if (a.supplier.isAffiliate !== b.supplier.isAffiliate) {
      return a.supplier.isAffiliate ? -1 : 1;
    }
    if (a.supplier.priority !== b.supplier.priority) {
      return a.supplier.priority - b.supplier.priority;
    }
    if (a.supplier.type !== b.supplier.type) {
      return a.supplier.type === "international" ? -1 : 1;
    }
    return a.totalPrice - b.totalPrice;
  });

  return { offers, partId };
}

export function listAllSuppliers(): Supplier[] {
  return Object.values(SUPPLIERS_BY_ID);
}
