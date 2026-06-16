export type DifficultyLevel = "beginner" | "intermediate" | "professional";

export type SupplierType = "local" | "international";

export type PartCategoryId =
  | "filters"
  | "brakes"
  | "engine"
  | "body"
  | "electrical"
  | "suspension"
  | "cooling"
  | "exhaust"
  | "steering"
  | "aircon";

/** WLTP catalog row exposed when composite key matches multiple variants */
export interface WLTPSpecCandidate {
  id: string;
  degemNm: string;
  trim: string;
  engineDisplacementCc: number | null;
  horsepower: number | null;
  gearbox: string;
  driveType: string;
  fuelType: string;
  doors: number | null;
  bodyType: string;
  /** Short Hebrew label for future disambiguation UI */
  label: string;
}

export interface VehicleSpecs {
  power: string;
  engineCC: string;
  fuelType: string;
  gearbox: string;
  transportCode: string;
  registrationNote: string;
  tireFront: string;
  tireRear: string;
  driveType: string;
  driveNote: string;
  airbags: string;
  electricWindows: string;
  doors: string;
  bodyType: string;
  sunroof: string;
  stabilityControl: string;
  abs: string;
  powerSteering: string;
  alloyWheels: string;
  laneAssist: string;
  adaptiveCruise: string;
  pollutionGroup: string;
}

export interface Vehicle {
  plate: string;
  make: string;
  makeHe: string;
  model: string;
  trim: string;
  year: number;
  color: string;
  origin: string;
  vin: string;
  lastTest: string;
  licenseExpiry: string;
  annualFee: string;
  engine: string;
  specs: VehicleSpecs;
  /** Linked variant for parts compatibility; null = no catalog */
  variantId: string | null;
  hasPartsCatalog: boolean;
  /** fitment_verified = OEM matched to variant; maintenance_generic = common maintenance browse */
  catalogTier?: "fitment_verified" | "maintenance_generic";
  /** Set when WLTP composite key matches 2+ rows — specs stay unmerged until user picks */
  specCandidates?: WLTPSpecCandidate[];
}

export interface VehicleModel {
  id: string;
  make: string;
  makeHe: string;
  model: string;
  yearFrom: number;
  yearTo: number;
}

export interface VehicleVariant {
  id: string;
  modelId: string;
  engine: string;
  trim: string;
  yearFrom: number;
  yearTo: number;
}

export interface PartCategory {
  id: PartCategoryId;
  nameHe: string;
  nameEn: string;
  subcats: string[];
}

export interface Part {
  id: string;
  oemNumber: string;
  nameHe: string;
  nameEn: string;
  categoryId: PartCategoryId;
  difficulty: DifficultyLevel;
  description: string;
  imageKey: string;
}

export interface Supplier {
  id: string;
  nameHe: string;
  nameEn: string;
  country: string;
  countryCode: string;
  flag: string;
  type: SupplierType;
  rating: number;
  deliveryDays: string;
  baseUrl: string;
  /** Partner / affiliate — listed first in comparison UI */
  isAffiliate: boolean;
  /** Lower number = higher display priority within tier */
  priority: number;
  /** Supports vehicle lookup by Israeli license plate on supplier site */
  supportsPlateLookup: boolean;
}

/** How the offer row was sourced */
export type OfferSourceType = "manual" | "referral" | "scraped" | "api";

/** How the displayed price was obtained */
export type PriceSource = "listed" | "estimate" | "on_site";

/**
 * Canonical supplier referral offer (sr_* layer).
 * Manual fixtures are primary for MVP; API-sourced rows merge in when enabled.
 */
export interface SupplierOffer {
  id: string;
  supplierId: string;
  partId: string;
  price: number;
  currency: string;
  url: string;
  /** Shipping in the same currency as price; 0 = free */
  shipping: number;
  inStock: boolean;
  lastUpdated: string;
  sourceType: OfferSourceType;
  priceSource: PriceSource;
  /** Hebrew hint when price is estimated or only on supplier site */
  priceNoteHe?: string;
}

/** @deprecated Use SupplierOffer — kept as alias for transitional imports */
export type PartOffer = SupplierOffer;

export interface PartCompatibility {
  partId: string;
  variantId: string;
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ServiceError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = "ServiceError";
  }
}
