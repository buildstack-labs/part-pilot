import { EBAY_BROWSE_API_ENABLED } from "../config/ebay";
import {
  MANUAL_OFFER_FIXTURES,
  type ManualOfferFixture,
} from "../data/manual-offers.fixture";
import { PARTS, PARTS_BY_ID } from "../mocks/parts";
import { SUPPLIERS_BY_ID } from "../mocks/suppliers";
import type { SupplierOffer, Vehicle } from "../types";
import {
  buildReferralOffers,
  mergeSupplierOffers,
} from "./referral-offer-service";
import { getScrapedOffersForPart } from "./scraped-offer-store";
import { getPartById } from "./parts-service";

const PART_ID_BY_OEM = Object.fromEntries(
  PARTS.map((p) => [p.oemNumber, p.id]),
);

function resolvePartId(partRef: string): string | null {
  if (PARTS_BY_ID[partRef]) return partRef;
  return PART_ID_BY_OEM[partRef] ?? null;
}

function manualOfferId(supplierId: string, partId: string): string {
  return `manual-${supplierId}-${partId}`;
}

function toSupplierOffer(
  fixture: ManualOfferFixture,
  partId: string,
  loadedAt: string,
): SupplierOffer {
  return {
    id: manualOfferId(fixture.supplierId, partId),
    supplierId: fixture.supplierId,
    partId,
    price: fixture.price,
    currency: fixture.currency ?? "ILS",
    url: fixture.url,
    shipping: fixture.shipping ?? 0,
    inStock: fixture.inStock ?? true,
    lastUpdated: fixture.lastUpdated ?? loadedAt,
    sourceType: "manual",
    priceSource: "listed",
  };
}

function loadManualOffers(loadedAt: string): SupplierOffer[] {
  const offers: SupplierOffer[] = [];
  const seen = new Set<string>();

  for (const fixture of MANUAL_OFFER_FIXTURES) {
    if (!SUPPLIERS_BY_ID[fixture.supplierId]) {
      console.warn(
        `[supplier-offers] Unknown supplierId "${fixture.supplierId}" — skipped`,
      );
      continue;
    }

    const partId = resolvePartId(fixture.partRef);
    if (!partId) {
      console.warn(
        `[supplier-offers] Unknown partRef "${fixture.partRef}" — skipped`,
      );
      continue;
    }

    const dedupeKey = `${fixture.supplierId}:${partId}`;
    if (seen.has(dedupeKey)) {
      console.warn(
        `[supplier-offers] Duplicate offer for ${dedupeKey} — skipped`,
      );
      continue;
    }
    seen.add(dedupeKey);

    offers.push(toSupplierOffer(fixture, partId, loadedAt));
  }

  return offers;
}

/** API-sourced offers — stub until EPN Browse integration is implemented */
function loadApiOffers(_partId: string, _loadedAt: string): SupplierOffer[] {
  if (!EBAY_BROWSE_API_ENABLED) return [];
  return [];
}

export async function getSupplierOffersForPart(
  partId: string,
  vehicle: Vehicle | null = null,
  plate?: string,
): Promise<SupplierOffer[]> {
  const part = getPartById(partId);
  if (!part) return [];

  const loadedAt = new Date().toISOString();
  const manualForPart = loadManualOffers(loadedAt).filter(
    (o) => o.partId === partId,
  );
  const scrapedForPart = await getScrapedOffersForPart(partId);
  const referral = buildReferralOffers(part, vehicle, plate, loadedAt);
  const api = loadApiOffers(partId, loadedAt);

  return [...mergeSupplierOffers(manualForPart, scrapedForPart, referral), ...api];
}

export async function listAllSupplierOffers(): Promise<SupplierOffer[]> {
  const loadedAt = new Date().toISOString();
  const manual = loadManualOffers(loadedAt);
  const scraped = (
    await Promise.all(PARTS.map((part) => getScrapedOffersForPart(part.id)))
  ).flat();
  const referral = PARTS.flatMap((part) =>
    buildReferralOffers(part, null, undefined, loadedAt),
  );
  return mergeSupplierOffers(manual, scraped, referral);
}
