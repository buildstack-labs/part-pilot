import type { GovIlDatastoreSearchResult, GovIlVehicleRecord } from "../types/govil";
import {
  GOVIL_DATASTORE_SEARCH_URL,
  GOVIL_REQUEST_TIMEOUT_MS,
  GOVIL_VEHICLE_RESOURCE_ID,
} from "../config/govil";

/**
 * Query data.gov.il CKAN datastore_search by plate number (mispar_rechev).
 *
 * Example:
 * GET https://data.gov.il/api/3/action/datastore_search
 *   ?resource_id=053cea08-09bc-40ec-8f7a-156f0677aff3
 *   &filters={"mispar_rechev":6451974}
 *   &limit=1
 */
export async function fetchGovIlVehicleByPlateDigits(
  plateDigits: number,
): Promise<GovIlVehicleRecord | null> {
  const filters = JSON.stringify({ mispar_rechev: plateDigits });
  const url = new URL(GOVIL_DATASTORE_SEARCH_URL);
  url.searchParams.set("resource_id", GOVIL_VEHICLE_RESOURCE_ID);
  url.searchParams.set("filters", filters);
  url.searchParams.set("limit", "1");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GOVIL_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url.toString(), {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`gov.il HTTP ${response.status}`);
    }

    const json = (await response.json()) as GovIlDatastoreSearchResult;

    if (!json.success || !json.result?.records?.length) {
      return null;
    }

    return json.result.records[0];
  } finally {
    clearTimeout(timeout);
  }
}
