import { VEHICLE_VARIANTS } from "../mocks/vehicles";

const UNKNOWN = "לא ידוע";

const MAKE_HE_TO_EN: Record<string, string> = {
  יונדאי: "Hyundai",
  טויוטה: "Toyota",
  קיה: "Kia",
  הונדה: "Honda",
  מאזדה: "Mazda",
  "אלפא": "Alfa Romeo",
};

function normalizeModelName(value: string): string {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9\u0590-\u05FF]/g, "")
    .trim();
}

const CATALOG_MATCHERS: Array<{
  variantId: string;
  test: (ctx: {
    makeHe: string;
    commercialName: string;
    year: number;
  }) => boolean;
}> = [
  {
    variantId: "b2000001-0000-4000-8000-000000000001",
    test: ({ makeHe, commercialName, year }) =>
      makeHe.includes("יונדאי") &&
      normalizeModelName(commercialName).includes("I20") &&
      year >= 2018 &&
      year <= 2022,
  },
  {
    variantId: "b2000001-0000-4000-8000-000000000002",
    test: ({ makeHe, commercialName, year }) =>
      makeHe.includes("טויוטה") &&
      normalizeModelName(commercialName).includes("COROLLA") &&
      year >= 2019 &&
      year <= 2023,
  },
  {
    variantId: "b2000001-0000-4000-8000-000000000003",
    test: ({ makeHe, commercialName, year }) =>
      makeHe.includes("קיה") &&
      normalizeModelName(commercialName).includes("SPORTAGE") &&
      year >= 2017 &&
      year <= 2022,
  },
  {
    variantId: "b2000001-0000-4000-8000-000000000004",
    test: ({ makeHe, commercialName, year }) =>
      makeHe.includes("הונדה") &&
      (normalizeModelName(commercialName).includes("JAZZ") ||
        normalizeModelName(commercialName).includes("FIT")) &&
      year >= 2015 &&
      year <= 2020,
  },
  {
    variantId: "b2000001-0000-4000-8000-000000000005",
    test: ({ makeHe, commercialName, year }) => {
      const norm = normalizeModelName(commercialName);
      return (
        makeHe.includes("מאזדה") &&
        (norm === "3" || norm.includes("MAZDA3")) &&
        year >= 2019 &&
        year <= 2023
      );
    },
  },
];

export function resolveVariantId(
  makeHe: string,
  commercialName: string,
  year: number,
): string | null {
  for (const matcher of CATALOG_MATCHERS) {
    if (matcher.test({ makeHe, commercialName, year })) {
      return matcher.variantId;
    }
  }
  return null;
}

export function resolveHasPartsCatalog(variantId: string | null): boolean {
  if (!variantId) return false;
  return VEHICLE_VARIANTS.some((v) => v.id === variantId);
}

export function parseManufacturer(tozeretNm: string): {
  makeHe: string;
  origin: string;
} {
  const trimmed = tozeretNm.trim();
  const parts = trimmed.split(/\s+/);
  const makeHe = parts[0] ?? trimmed;
  const origin = parts.slice(1).join(" ") || UNKNOWN;
  return { makeHe, origin };
}

export function makeEnFromHebrew(makeHe: string): string {
  for (const [he, en] of Object.entries(MAKE_HE_TO_EN)) {
    if (makeHe.startsWith(he)) return en;
  }
  return makeHe;
}

export function formatGovIlDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-");
  if (!y || !m || !d) return isoDate;
  return `${d.padStart(2, "0")}-${m.padStart(2, "0")}-${y}`;
}

export function formatTireSize(raw: string): string {
  return raw.replace(/\\/g, "/").trim();
}

export { UNKNOWN as GOVIL_UNKNOWN };
