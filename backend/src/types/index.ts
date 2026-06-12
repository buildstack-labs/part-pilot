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
  /** Linked variant for parts compatibility; null = no catalog (e.g. i10 demo) */
  variantId: string | null;
  hasPartsCatalog: boolean;
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
}

export interface PartOffer {
  id: string;
  partId: string;
  supplierId: string;
  price: number;
  currency: string;
  shipping: number;
  inStock: boolean;
  offerUrl: string;
  lastCheckedAt: string;
}

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
