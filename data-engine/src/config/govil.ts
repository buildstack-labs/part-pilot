/** data.gov.il — private & commercial vehicles up to 3.5t (רכב פרטי ומסחרי עד 3.5 טון) */
export const GOVIL_VEHICLE_RESOURCE_ID =
  "053cea08-09bc-40ec-8f7a-156f0677aff3";

/** data.gov.il — model catalog with type-approval / WLTP technical specs */
export const GOVIL_WLTP_RESOURCE_ID =
  "142afde2-6228-49f9-8a29-9b6c3a0cbe40";

export const GOVIL_DATASTORE_SEARCH_URL =
  "https://data.gov.il/api/3/action/datastore_search";

/** Request timeout — gov.il can be slow on filtered queries */
export const GOVIL_REQUEST_TIMEOUT_MS = 30_000;

/** Max WLTP rows fetched when resolving variant ambiguity */
export const GOVIL_WLTP_MATCH_LIMIT = 50;
