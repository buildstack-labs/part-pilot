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
}

export interface PartsCatalogResponse {
  categories: PartCategoryDto[];
  hasCatalog: boolean;
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
}

export interface PartOfferDto {
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

export interface SupplierOfferResponse {
  offer: PartOfferDto;
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
