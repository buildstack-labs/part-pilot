import type { PartCategory } from "../types";

export const PART_CATEGORIES: PartCategory[] = [
  {
    id: "filters",
    nameHe: "פילטרים",
    nameEn: "Filters",
    subcats: ["מסנן שמן", "מסנן אוויר", "מסנן מזגן", "מסנן דלק"],
  },
  {
    id: "brakes",
    nameHe: "מערכת בלמים",
    nameEn: "Braking System",
    subcats: ["רפידות בלם", "דיסקי בלם", "נוזל בלמים", "מאחז בלם"],
  },
  {
    id: "engine",
    nameHe: "מנוע",
    nameEn: "Engine",
    subcats: ["מצתים", "רצועת תזמון", "חיישני מנוע"],
  },
  {
    id: "body",
    nameHe: "מרכב",
    nameEn: "Body",
    subcats: ["מגבים", "מראות", "פגושים", "קפוט"],
  },
  {
    id: "electrical",
    nameHe: "חשמל ומצבר",
    nameEn: "Electrics",
    subcats: ["מצבר", "פנסים", "חיישני חמצן", "יחידות בקרה"],
  },
  {
    id: "suspension",
    nameHe: "מתלים והיגוי",
    nameEn: "Suspension / Steering",
    subcats: ["קפיצים", "שוחצים", "זרועות", "כדורי היגוי"],
  },
  {
    id: "cooling",
    nameHe: "מערכת קירור",
    nameEn: "Cooling System",
    subcats: ["רדיאטור", "תרמוסטט", "צינורות", "נוזל קירור"],
  },
  {
    id: "exhaust",
    nameHe: "מערכת פליטה",
    nameEn: "Exhaust System",
    subcats: ["מפלט", "חיישן חמצן", "ממיר קטליטי"],
  },
  {
    id: "steering",
    nameHe: "הגה ובקרת כיוון",
    nameEn: "Steering",
    subcats: ["הגה כוח", "זרוע היגוי", "מסבי גלגל"],
  },
  {
    id: "aircon",
    nameHe: "מיזוג אוויר",
    nameEn: "Air Conditioning",
    subcats: ["קומפרסור", "קולט חום", "חיישני טמפרטורה"],
  },
];

/** @deprecated Runtime uses partCount > 0; kept for legacy imports */
export const SEEDED_CATEGORY_IDS = new Set([
  "filters",
  "brakes",
  "engine",
  "body",
  "cooling",
  "suspension",
  "steering",
  "aircon",
  "exhaust",
  "electrical",
]);
