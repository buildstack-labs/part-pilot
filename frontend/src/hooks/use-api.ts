"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export function useVehicleLookup(plate: string, enabled = true) {
  return useQuery({
    queryKey: ["vehicle", plate],
    queryFn: () => api.lookupVehicle(plate),
    enabled: enabled && plate.length > 0,
  });
}

export function useSupportedVehicles() {
  return useQuery({
    queryKey: ["supported-vehicles"],
    queryFn: () => api.getSupportedVehicles(),
  });
}

export function usePartsCatalog(plate: string) {
  return useQuery({
    queryKey: ["parts-catalog", plate],
    queryFn: () => api.getPartsCatalog(plate),
    enabled: plate.length > 0,
  });
}

export function usePartsByCategory(plate: string, category: string) {
  return useQuery({
    queryKey: ["parts", plate, category],
    queryFn: () => api.getPartsByCategory(plate, category),
    enabled: plate.length > 0 && category.length > 0,
  });
}

export function usePartDetail(partId: string) {
  return useQuery({
    queryKey: ["part", partId],
    queryFn: () => api.getPart(partId),
    enabled: partId.length > 0,
  });
}

export function useSupplierOffers(partId: string, plate: string, filter: string) {
  return useQuery({
    queryKey: ["suppliers", partId, plate, filter],
    queryFn: () => api.getSupplierOffers(partId, filter, plate),
    enabled: partId.length > 0,
  });
}
