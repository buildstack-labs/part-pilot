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

export interface VehicleDto {
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
  hasPartsCatalog: boolean;
  catalogTier?: "fitment_verified" | "maintenance_generic";
  specCandidates?: WLTPSpecCandidate[];
}

/** WLTP catalog row when composite key matches multiple variants */
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
  label: string;
}

export interface VehicleLookupResponse {
  vehicle: VehicleDto;
  source: string;
  cached: boolean;
}

export interface PartCategoryDto {
  id: PartCategoryId;
  nameHe: string;
  nameEn: string;
  subcats: string[];
  partCount: number;
  hasSeededParts: boolean;
  browseLinks?: { supplierId: string; nameHe: string; url: string }[];
}

export interface PartsCatalogResponse {
  categories: PartCategoryDto[];
  hasCatalog: boolean;
  catalogTier?: "fitment_verified" | "maintenance_generic";
  noCatalogReason?: string;
}

export interface PartDto {
  id: string;
  oemNumber: string;
  nameHe: string;
  nameEn: string;
  categoryId: PartCategoryId;
  difficulty: DifficultyLevel;
  description: string;
  imageKey: string;
  imageUrl: string | null;
}

export interface SupplierDto {
  id: string;
  nameHe: string;
  nameEn: string;
  country: string;
  countryCode: string;
  flag: string;
  type: SupplierType;
  rating: number;
  deliveryDays: string;
  isAffiliate: boolean;
  priority: number;
  supportsPlateLookup: boolean;
}

export type OfferSourceType = "manual" | "referral" | "scraped" | "api";
export type PriceSource = "listed" | "estimate" | "on_site";

export interface SupplierOfferDto {
  id: string;
  supplierId: string;
  partId: string;
  price: number;
  currency: string;
  url: string;
  shipping: number;
  inStock: boolean;
  lastUpdated: string;
  sourceType: OfferSourceType;
  priceSource: PriceSource;
  priceNoteHe?: string;
}

/** @deprecated Use SupplierOfferDto */
export type PartOfferDto = SupplierOfferDto;

export interface SupplierOfferResponse {
  offer: SupplierOfferDto;
  supplier: SupplierDto;
  totalPrice: number;
}

export interface ApiError {
  error: string;
  code?: string;
}

export interface SupportedVehiclesResponse {
  vehicles: VehicleDto[];
  stats: {
    models: number;
    parts: number;
    suppliers: number;
  };
}
