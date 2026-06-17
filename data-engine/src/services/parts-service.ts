import { PART_CATEGORIES } from "../mocks/categories";
import { PART_COMPATIBILITIES, PARTS, PARTS_BY_ID } from "../mocks/parts";
import { lookupVehicleByPlate } from "./vehicle-service";
import {
  getCategoryBrowseLinks,
  type CategoryBrowseLink,
} from "./category-supplier-links";
import { NotFoundError } from "../types";
import type { Part, PartCategory, PartCategoryId, Vehicle } from "../types";

export interface CategoryWithCount extends PartCategory {
  partCount: number;
  hasSeededParts: boolean;
  /** Supplier category search when partCount is 0 */
  browseLinks?: CategoryBrowseLink[];
}

export interface PartsCatalogResult {
  categories: CategoryWithCount[];
  hasCatalog: boolean;
  catalogTier?: "fitment_verified" | "maintenance_generic";
  noCatalogReason?: string;
}

async function resolveVehicle(plate: string): Promise<Vehicle> {
  const result = await lookupVehicleByPlate(plate);
  return result.vehicle;
}

export async function getPartsCatalog(plate: string): Promise<PartsCatalogResult> {
  const vehicle = await resolveVehicle(plate);

  if (!vehicle.hasPartsCatalog || !vehicle.variantId) {
    return {
      categories: PART_CATEGORIES.map((c) => ({
        ...c,
        partCount: 0,
        hasSeededParts: false,
      })),
      hasCatalog: false,
      catalogTier: vehicle.catalogTier,
      noCatalogReason: "no_parts_data",
    };
  }

  const compatiblePartIds = new Set(
    PART_COMPATIBILITIES.filter((c) => c.variantId === vehicle.variantId).map(
      (c) => c.partId,
    ),
  );

  const categories = PART_CATEGORIES.map((cat) => {
    const count = PARTS.filter(
      (p) => p.categoryId === cat.id && compatiblePartIds.has(p.id),
    ).length;
    return {
      ...cat,
      partCount: count,
      hasSeededParts: count > 0,
      browseLinks:
        count === 0
          ? getCategoryBrowseLinks(cat.id, vehicle, plate)
          : undefined,
    };
  });

  return {
    categories,
    hasCatalog: true,
    catalogTier: vehicle.catalogTier ?? "fitment_verified",
  };
}

export async function getPartsByCategory(
  plate: string,
  categoryId: PartCategoryId,
): Promise<Part[]> {
  const vehicle = await resolveVehicle(plate);
  if (!vehicle.hasPartsCatalog || !vehicle.variantId) {
    return [];
  }

  const compatiblePartIds = new Set(
    PART_COMPATIBILITIES.filter((c) => c.variantId === vehicle.variantId).map(
      (c) => c.partId,
    ),
  );

  return PARTS.filter(
    (p) => p.categoryId === categoryId && compatiblePartIds.has(p.id),
  );
}

export function getPartById(partId: string): Part | null {
  return PARTS_BY_ID[partId] ?? null;
}

export function isPartCompatibleWithVehicle(
  partId: string,
  variantId: string | null,
): boolean {
  if (!variantId) return false;
  return PART_COMPATIBILITIES.some(
    (c) => c.partId === partId && c.variantId === variantId,
  );
}
