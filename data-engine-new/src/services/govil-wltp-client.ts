import type { GovIlVehicleRecord } from "../types/govil";
import type { GovIlWltpRecord, GovIlWltpSearchResult } from "../types/govil-wltp";
import {
  GOVIL_DATASTORE_SEARCH_URL,
  GOVIL_REQUEST_TIMEOUT_MS,
  GOVIL_WLTP_MATCH_LIMIT,
  GOVIL_WLTP_RESOURCE_ID,
} from "../config/govil";

export interface WltpLookupKey {
  tozeret_cd: number;
  degem_cd: number;
  sug_degem: string;
  shnat_yitzur: number;
  ramat_gimur: string;
}

export function buildWltpLookupKey(record: GovIlVehicleRecord): WltpLookupKey {
  return {
    tozeret_cd: record.tozeret_cd,
    degem_cd: record.degem_cd,
    sug_degem: record.sug_degem,
    shnat_yitzur: record.shnat_yitzur,
    ramat_gimur: record.ramat_gimur?.trim() ?? "",
  };
}

async function datastoreSearch(
  filters: WltpLookupKey,
  limit: number,
): Promise<GovIlWltpSearchResult> {
  const url = new URL(GOVIL_DATASTORE_SEARCH_URL);
  url.searchParams.set("resource_id", GOVIL_WLTP_RESOURCE_ID);
  url.searchParams.set("filters", JSON.stringify(filters));
  url.searchParams.set("limit", String(limit));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GOVIL_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url.toString(), {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`gov.il WLTP HTTP ${response.status}`);
    }

    return (await response.json()) as GovIlWltpSearchResult;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Fetch WLTP / type-approval rows matching the vehicle's composite catalog key.
 * Returns all matches up to GOVIL_WLTP_MATCH_LIMIT (total may be higher).
 */
export async function fetchGovIlWltpByVehicleRecord(
  record: GovIlVehicleRecord,
): Promise<GovIlWltpRecord[]> {
  const filters = buildWltpLookupKey(record);
  const json = await datastoreSearch(filters, GOVIL_WLTP_MATCH_LIMIT);

  if (!json.success) {
    throw new Error("gov.il WLTP search failed");
  }

  return json.result?.records ?? [];
}

export async function fetchGovIlWltpTotal(
  record: GovIlVehicleRecord,
): Promise<number> {
  const filters = buildWltpLookupKey(record);
  const json = await datastoreSearch(filters, 0);
  return json.result?.total ?? 0;
}
