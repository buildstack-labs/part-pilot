import type { GovIlVehicleRecord } from "../types/govil";
import type { Vehicle } from "../types";
import { formatPlateFromDigits } from "../utils/plate";
import {
  formatGovIlDate,
  formatTireSize,
  GOVIL_UNKNOWN,
  makeEnFromHebrew,
  parseManufacturer,
  GENERIC_MAINTENANCE_VARIANT_ID,
  resolveVariantId,
} from "./variant-resolver";

/**
 * Map a data.gov.il vehicle record to our internal Vehicle shape.
 * Fields not provided by gov.il are filled with "לא ידוע" or "—".
 */
export function mapGovIlRecordToVehicle(record: GovIlVehicleRecord): Vehicle {
  const { makeHe, origin } = parseManufacturer(record.tozeret_nm);
  const make = makeEnFromHebrew(makeHe);
  const model = record.kinuy_mishari?.trim() || record.degem_nm;
  const trim = record.ramat_gimur?.trim() || GOVIL_UNKNOWN;
  const year = record.shnat_yitzur;
  const plate = formatPlateFromDigits(record.mispar_rechev);
  const color = record.tzeva_rechev?.trim() || GOVIL_UNKNOWN;

  const matchedVariantId = resolveVariantId(makeHe, model, year);
  const variantId = matchedVariantId ?? GENERIC_MAINTENANCE_VARIANT_ID;
  const catalogTier = matchedVariantId
    ? ("fitment_verified" as const)
    : ("maintenance_generic" as const);
  const hasPartsCatalog = true;

  const engineCode = record.degem_manoa?.trim();
  const fuel = record.sug_delek_nm?.trim();
  const engine =
    engineCode && fuel
      ? `${engineCode} · ${fuel}`
      : engineCode || fuel || GOVIL_UNKNOWN;

  return {
    plate,
    make,
    makeHe,
    model,
    trim,
    year,
    color,
    origin,
    vin: record.misgeret?.trim() || GOVIL_UNKNOWN,
    lastTest: formatGovIlDate(record.mivchan_acharon_dt),
    licenseExpiry: formatGovIlDate(record.tokef_dt),
    annualFee: "—",
    engine,
    variantId,
    hasPartsCatalog,
    catalogTier,
    specs: {
      power: GOVIL_UNKNOWN,
      engineCC: GOVIL_UNKNOWN,
      fuelType: fuel || GOVIL_UNKNOWN,
      gearbox: GOVIL_UNKNOWN,
      transportCode: String(record.degem_cd ?? GOVIL_UNKNOWN),
      registrationNote:
        record.horaat_rishum != null
          ? String(record.horaat_rishum)
          : GOVIL_UNKNOWN,
      tireFront: formatTireSize(record.zmig_kidmi || GOVIL_UNKNOWN),
      tireRear: formatTireSize(record.zmig_ahori || GOVIL_UNKNOWN),
      driveType: GOVIL_UNKNOWN,
      driveNote: GOVIL_UNKNOWN,
      airbags: GOVIL_UNKNOWN,
      electricWindows: GOVIL_UNKNOWN,
      doors: GOVIL_UNKNOWN,
      bodyType: GOVIL_UNKNOWN,
      sunroof: GOVIL_UNKNOWN,
      stabilityControl: GOVIL_UNKNOWN,
      abs: GOVIL_UNKNOWN,
      powerSteering: GOVIL_UNKNOWN,
      alloyWheels: GOVIL_UNKNOWN,
      laneAssist: GOVIL_UNKNOWN,
      adaptiveCruise: GOVIL_UNKNOWN,
      pollutionGroup:
        record.kvutzat_zihum != null
          ? String(record.kvutzat_zihum)
          : GOVIL_UNKNOWN,
    },
  };
}
