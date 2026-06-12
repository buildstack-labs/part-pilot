import type {
  ApiError,
  PartCategoryDto,
  PartDto,
  PartsCatalogResponse,
  SupplierOfferResponse,
  SupportedVehiclesResponse,
  VehicleLookupResponse,
} from "@/types/api";

const BASE = "";

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as ApiError;
    throw new Error(err.error ?? `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export const api = {
  lookupVehicle: (plate: string) =>
    fetchJson<VehicleLookupResponse>(
      `/api/vehicles/${encodeURIComponent(plate)}`,
    ),

  getPartsCatalog: (plate: string) =>
    fetchJson<PartsCatalogResponse>(
      `/api/vehicles/${encodeURIComponent(plate)}/parts`,
    ),

  getPartsByCategory: (plate: string, category: string) =>
    fetchJson<{ parts: PartDto[] }>(
      `/api/vehicles/${encodeURIComponent(plate)}/parts/${encodeURIComponent(category)}`,
    ),

  getPart: (partId: string) =>
    fetchJson<{ part: PartDto }>(`/api/parts/${encodeURIComponent(partId)}`),

  getSupplierOffers: (partId: string, filter = "all") =>
    fetchJson<{ offers: SupplierOfferResponse[] }>(
      `/api/parts/${encodeURIComponent(partId)}/suppliers?filter=${filter}`,
    ),

  getSupportedVehicles: () =>
    fetchJson<SupportedVehiclesResponse>("/api/vehicles"),

  getCategories: () =>
    fetchJson<{ categories: PartCategoryDto[] }>("/api/categories"),
};
