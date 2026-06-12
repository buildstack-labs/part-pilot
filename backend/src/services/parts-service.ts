import { PART_CATEGORIES, SEEDED_CATEGORY_IDS } from "../mocks/categories";
import { PART_COMPATIBILITIES, PARTS, PARTS_BY_ID } from "../mocks/parts";
import { getVehicleByPlate } from "./vehicle-service";
import { NotFoundError } from "../types";
import type { Part, PartCategory, PartCategoryId } from "../types";

export interface CategoryWithCount extends PartCategory {
  partCount: number;
  hasSeededParts: boolean;
}

export interface PartsCatalogResult {
  categories: CategoryWithCount[];
  hasCatalog: boolean;
  noCatalogReason?: string;
}

export function getPartsCatalog(plate: string): PartsCatalogResult {
  const vehicle = getVehicleByPlate(plate);
  if (!vehicle) {
    throw new NotFoundError("רכב לא נמצא");
  }

  if (!vehicle.hasPartsCatalog || !vehicle.variantId) {
    return {
      categories: PART_CATEGORIES.map((c) => ({
        ...c,
        partCount: 0,
        hasSeededParts: false,
      })),
      hasCatalog: false,
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
      hasSeededParts: SEEDED_CATEGORY_IDS.has(cat.id) && count > 0,
    };
  });

  return { categories, hasCatalog: true };
}

export function getPartsByCategory(
  plate: string,
  categoryId: PartCategoryId,
): Part[] {
  const vehicle = getVehicleByPlate(plate);
  if (!vehicle) throw new NotFoundError("רכב לא נמצא");
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
