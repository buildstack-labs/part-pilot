import type { Vehicle, VehicleSpecs, WLTPSpecCandidate } from "../types";
import type { GovIlWltpRecord } from "../types/govil-wltp";
import { GOVIL_UNKNOWN } from "./variant-resolver";

function formatYesNo(value: number | null | undefined): string {
  if (value === 1) return "כן";
  if (value === 0) return "לא";
  return GOVIL_UNKNOWN;
}

function formatGearbox(automaticInd: number | null | undefined): string {
  if (automaticInd === 1) return "אוטומט";
  if (automaticInd === 0) return "ידני";
  return GOVIL_UNKNOWN;
}

function formatPower(koahSus: number | null | undefined): string {
  if (koahSus == null || Number.isNaN(koahSus)) return GOVIL_UNKNOWN;
  return `${koahSus} כ"ס`;
}

function formatEngineCc(nefahManoa: number | null | undefined): string {
  if (nefahManoa == null || Number.isNaN(nefahManoa)) return GOVIL_UNKNOWN;
  return `${nefahManoa.toLocaleString("he-IL")} סמ"ק`;
}

function formatCount(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return GOVIL_UNKNOWN;
  return String(value);
}

function formatPollutionGroup(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return GOVIL_UNKNOWN;
  return String(value);
}

export function mapWltpRecordToSpecs(record: GovIlWltpRecord): Partial<VehicleSpecs> {
  return {
    power: formatPower(record.koah_sus),
    engineCC: formatEngineCc(record.nefah_manoa),
    fuelType: record.delek_nm?.trim() || GOVIL_UNKNOWN,
    gearbox: formatGearbox(record.automatic_ind),
    driveType: record.hanaa_nm?.trim() || GOVIL_UNKNOWN,
    driveNote: record.technologiat_hanaa_nm?.trim() || GOVIL_UNKNOWN,
    airbags: formatCount(record.mispar_kariot_avir),
    electricWindows: formatCount(record.mispar_halonot_hashmal),
    doors: formatCount(record.mispar_dlatot),
    bodyType: record.merkav?.trim() || GOVIL_UNKNOWN,
    sunroof: formatYesNo(record.halon_bagg_ind),
    stabilityControl: formatYesNo(record.bakarat_yatzivut_ind),
    abs: formatYesNo(record.abs_ind),
    powerSteering: formatYesNo(record.hege_koah_ind),
    alloyWheels: formatYesNo(record.galgaley_sagsoget_kala_ind),
    laneAssist: formatYesNo(record.bakarat_stiya_menativ_ind),
    adaptiveCruise: formatYesNo(record.bakarat_shyut_adaptivit_ind),
    pollutionGroup: formatPollutionGroup(record.kvutzat_zihum),
  };
}

function buildCandidateLabel(record: GovIlWltpRecord): string {
  const parts = [
    record.degem_nm?.trim(),
    formatEngineCc(record.nefah_manoa),
    formatPower(record.koah_sus),
    formatGearbox(record.automatic_ind),
    record.hanaa_nm?.trim(),
  ].filter((part) => part && part !== GOVIL_UNKNOWN);

  return parts.join(" · ") || `וריאנט ${record._id}`;
}

export function mapWltpRecordToCandidate(record: GovIlWltpRecord): WLTPSpecCandidate {
  return {
    id: String(record._id),
    degemNm: record.degem_nm?.trim() || GOVIL_UNKNOWN,
    trim: record.ramat_gimur?.trim() || GOVIL_UNKNOWN,
    engineDisplacementCc: record.nefah_manoa,
    horsepower: record.koah_sus,
    gearbox: formatGearbox(record.automatic_ind),
    driveType: record.hanaa_nm?.trim() || GOVIL_UNKNOWN,
    fuelType: record.delek_nm?.trim() || GOVIL_UNKNOWN,
    doors: record.mispar_dlatot,
    bodyType: record.merkav?.trim() || GOVIL_UNKNOWN,
    label: buildCandidateLabel(record),
  };
}

function mergeSpecs(base: VehicleSpecs, wltp: Partial<VehicleSpecs>): VehicleSpecs {
  return { ...base, ...wltp };
}

function enhanceEngineSummary(engine: string, record: GovIlWltpRecord): string {
  const cc = record.nefah_manoa;
  const fuel = record.delek_nm?.trim();
  if (cc == null && !fuel) return engine;

  const liters =
    cc != null ? `${(cc / 1000).toFixed(1).replace(/\.0$/, "")}L` : null;
  const summary = [liters, fuel].filter(Boolean).join(" ");
  if (!summary) return engine;
  if (engine === GOVIL_UNKNOWN) return summary;
  if (engine.includes(summary)) return engine;
  return `${engine} · ${summary}`;
}

/**
 * Apply WLTP enrichment with strict match-count rules:
 * - 0 matches: unchanged
 * - 1 match: merge specs
 * - 2+ matches: expose specCandidates, leave WLTP-derived specs unknown
 */
export function enrichVehicleWithWltp(
  vehicle: Vehicle,
  wltpRecords: GovIlWltpRecord[],
  totalMatches?: number,
): Vehicle {
  const matchCount = totalMatches ?? wltpRecords.length;

  if (matchCount === 0 || wltpRecords.length === 0) {
    return vehicle;
  }

  if (matchCount === 1 && wltpRecords.length === 1) {
    const wltpSpecs = mapWltpRecordToSpecs(wltpRecords[0]);
    return {
      ...vehicle,
      engine: enhanceEngineSummary(vehicle.engine, wltpRecords[0]),
      specs: mergeSpecs(vehicle.specs, wltpSpecs),
    };
  }

  return {
    ...vehicle,
    specCandidates: wltpRecords.map(mapWltpRecordToCandidate),
  };
}
