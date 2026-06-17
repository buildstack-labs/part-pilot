import type { PartCategoryId } from "@/types/api";

export interface CategoryAsset {
  imagePath: string | null;
}

/**
 * Semantic mapping of category/part slugs → public asset paths.
 * Categories without a match use null (placeholder in UI).
 *
 * Unused source assets (reserved for future categories):
 * - hitch (icon 22), clutch (7), gear-shifter (23), cv-joint (24), wheel-tire (25)
 */
export const CATEGORY_ASSETS: Record<PartCategoryId, CategoryAsset> = {
  filters: { imagePath: "/assets/categories/filters.jpg" },
  brakes: { imagePath: "/assets/categories/brakes.jpg" },
  engine: { imagePath: "/assets/categories/engine.jpg" },
  body: { imagePath: "/assets/categories/body.jpg" },
  electrical: { imagePath: "/assets/categories/electrical.jpg" },
  suspension: { imagePath: "/assets/categories/suspension.jpg" },
  cooling: { imagePath: "/assets/categories/cooling.jpg" },
  exhaust: { imagePath: "/assets/categories/exhaust.jpg" },
  steering: { imagePath: "/assets/categories/steering.jpg" },
  aircon: { imagePath: "/assets/categories/aircon.jpg" },
};

const PART_IMAGE_KEYS: Record<string, string> = {
  "oil-filter": "/assets/parts/oil-filter.jpg",
  "air-filter": "/assets/parts/air-filter.jpg",
  "cabin-filter": "/assets/parts/cabin-filter.jpg",
  "front-brake-pads": "/assets/parts/front-brake-pads.jpg",
  "rear-brake-pads": "/assets/parts/rear-brake-pads.jpg",
  "spark-plugs": "/assets/parts/spark-plugs.jpg",
  "wiper-blades": "/assets/parts/wiper-blades.jpg",
  "coolant-temp-sensor": "/assets/parts/coolant-temp-sensor.jpg",
};

export function getCategoryImage(categoryId: PartCategoryId): string | null {
  return CATEGORY_ASSETS[categoryId]?.imagePath ?? null;
}

export function getPartImage(imageKey: string): string | null {
  return PART_IMAGE_KEYS[imageKey] ?? null;
}

export function getPlaceholderImage(): null {
  return null;
}
