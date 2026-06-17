import type { Vehicle } from "../types";

/** Strip internal fields before API response. */
export function toVehicleDto(vehicle: Vehicle) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { variantId, ...dto } = vehicle;
  return dto;
}
