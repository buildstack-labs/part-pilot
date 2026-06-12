import type { Part, PartCompatibility } from "../types";

/** Spec seed set — 8 common maintenance parts */
export const PARTS: Part[] = [
  {
    id: "c3000001-0000-4000-8000-000000000001",
    oemNumber: "26300-35505",
    nameHe: "מסנן שמן",
    nameEn: "Oil Filter",
    categoryId: "filters",
    difficulty: "beginner",
    description: "להחלפה כל 10,000 ק״מ",
    imageKey: "oil-filter",
  },
  {
    id: "c3000001-0000-4000-8000-000000000002",
    oemNumber: "28113-2H000",
    nameHe: "מסנן אוויר",
    nameEn: "Air Filter",
    categoryId: "filters",
    difficulty: "beginner",
    description: "להחלפה כל 20,000 ק״מ",
    imageKey: "air-filter",
  },
  {
    id: "c3000001-0000-4000-8000-000000000003",
    oemNumber: "58101-2HA10",
    nameHe: "רפידות בלם קדמיות",
    nameEn: "Front Brake Pads",
    categoryId: "brakes",
    difficulty: "intermediate",
    description: "להחלפה כל 30,000-50,000 ק״מ",
    imageKey: "front-brake-pads",
  },
  {
    id: "c3000001-0000-4000-8000-000000000004",
    oemNumber: "58302-2HA10",
    nameHe: "רפידות בלם אחוריות",
    nameEn: "Rear Brake Pads",
    categoryId: "brakes",
    difficulty: "intermediate",
    description: "להחלפה כל 40,000-60,000 ק״מ",
    imageKey: "rear-brake-pads",
  },
  {
    id: "c3000001-0000-4000-8000-000000000005",
    oemNumber: "97133-2H000",
    nameHe: "מסנן מזגן",
    nameEn: "Cabin Filter",
    categoryId: "filters",
    difficulty: "beginner",
    description: "להחלפה כל שנה או 15,000 ק״מ",
    imageKey: "cabin-filter",
  },
  {
    id: "c3000001-0000-4000-8000-000000000006",
    oemNumber: "18841-11051",
    nameHe: "מצתים",
    nameEn: "Spark Plugs (x4)",
    categoryId: "engine",
    difficulty: "intermediate",
    description: "להחלפה כל 30,000 ק״מ",
    imageKey: "spark-plugs",
  },
  {
    id: "c3000001-0000-4000-8000-000000000007",
    oemNumber: "98350-2H100",
    nameHe: "מגבי שמשה קדמיים",
    nameEn: "Wiper Blades",
    categoryId: "body",
    difficulty: "beginner",
    description: "להחלפה כל שנה",
    imageKey: "wiper-blades",
  },
  {
    id: "c3000001-0000-4000-8000-000000000008",
    oemNumber: "25100-2B000",
    nameHe: "חיישן טמפרטורת קירור",
    nameEn: "Coolant Temp Sensor",
    categoryId: "engine",
    difficulty: "professional",
    description: "להחלפה בעת תקלה",
    imageKey: "coolant-temp-sensor",
  },
];

const ALL_VARIANT_IDS = [
  "b2000001-0000-4000-8000-000000000001",
  "b2000001-0000-4000-8000-000000000002",
  "b2000001-0000-4000-8000-000000000003",
  "b2000001-0000-4000-8000-000000000004",
  "b2000001-0000-4000-8000-000000000005",
];

/** All 8 parts compatible with all 5 seeded variants */
export const PART_COMPATIBILITIES: PartCompatibility[] = PARTS.flatMap((part) =>
  ALL_VARIANT_IDS.map((variantId) => ({ partId: part.id, variantId })),
);

export const PARTS_BY_ID = Object.fromEntries(PARTS.map((p) => [p.id, p]));
