import { VEHICLES } from "../mocks/vehicles";
import { normalizePlate, plateToDigits } from "../utils/plate";
import { NotFoundError } from "../types";
import type { Vehicle } from "../types";
import { fetchGovIlVehicleByPlateDigits } from "./govil-client";
import { mapGovIlRecordToVehicle } from "./govil-mapper";
import {
  fetchGovIlWltpByVehicleRecord,
  fetchGovIlWltpTotal,
} from "./govil-wltp-client";
import { enrichVehicleWithWltp } from "./govil-wltp-mapper";

export type VehicleLookupSource = "data.gov.il" | "mock-fallback";

export interface VehicleLookupResult {
  vehicle: Vehicle;
  source: VehicleLookupSource;
  cached: boolean;
}

/** In-memory cache of vehicles resolved via gov.il (for parts catalog flow) */
const resolvedVehicleCache = new Map<string, Vehicle>();

function cacheVehicle(vehicle: Vehicle): void {
  for (const key of normalizePlate(vehicle.plate)) {
    resolvedVehicleCache.set(key, vehicle);
  }
}

function findMockVehicle(candidates: string[]): Vehicle | undefined {
  return candidates.reduce<Vehicle | undefined>(
    (acc, plate) => acc ?? VEHICLES[plate],
    undefined,
  );
}

async function lookupGovIl(rawPlate: string): Promise<Vehicle | null> {
  const digits = plateToDigits(rawPlate);
  if (digits == null) return null;

  try {
    const record = await fetchGovIlVehicleByPlateDigits(digits);
    if (!record) return null;

    let vehicle = mapGovIlRecordToVehicle(record);

    try {
      const [wltpRecords, totalMatches] = await Promise.all([
        fetchGovIlWltpByVehicleRecord(record),
        fetchGovIlWltpTotal(record),
      ]);
      vehicle = enrichVehicleWithWltp(vehicle, wltpRecords, totalMatches);
    } catch (error) {
      console.warn("[vehicle-service] WLTP enrichment skipped:", error);
    }

    cacheVehicle(vehicle);
    return vehicle;
  } catch (error) {
    console.warn("[vehicle-service] gov.il lookup failed, will try mock fallback:", error);
    return null;
  }
}

/**
 * Look up vehicle by license plate.
 * 1. Query data.gov.il (CKAN datastore_search)
 * 2. Fall back to local mock fixtures (demo plates, offline dev)
 */
export async function lookupVehicleByPlate(
  rawPlate: string,
): Promise<VehicleLookupResult> {
  const candidates = normalizePlate(rawPlate);
  if (candidates.length === 0) {
    throw new NotFoundError("נא להזין מספר לוחית תקין");
  }

  const cached = candidates.reduce<Vehicle | undefined>(
    (acc, plate) => acc ?? resolvedVehicleCache.get(plate),
    undefined,
  );
  if (cached) {
    return { vehicle: cached, source: "data.gov.il", cached: true };
  }

  const govVehicle = await lookupGovIl(rawPlate);
  if (govVehicle) {
    return { vehicle: govVehicle, source: "data.gov.il", cached: false };
  }

  const mockVehicle = findMockVehicle(candidates);
  if (mockVehicle) {
    cacheVehicle(mockVehicle);
    return { vehicle: mockVehicle, source: "mock-fallback", cached: false };
  }

  throw new NotFoundError(`לא נמצא רכב עם לוחית "${rawPlate.trim()}"`);
}

export function listSupportedVehicles(): Vehicle[] {
  return Object.values(VEHICLES).filter((v) => v.hasPartsCatalog);
}

export function getVehicleByPlate(plate: string): Vehicle | null {
  const candidates = normalizePlate(plate);

  for (const c of candidates) {
    const cached = resolvedVehicleCache.get(c);
    if (cached) return cached;
  }

  for (const c of candidates) {
    if (VEHICLES[c]) return VEHICLES[c];
  }

  return null;
}
