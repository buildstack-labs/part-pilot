/**
 * Curated supplier offers — PRIMARY data source for MVP.
 *
 * Add one row per supplier × part combination. When you send real prices/links,
 * append objects to MANUAL_OFFER_FIXTURES below.
 *
 * Fields:
 * - supplierId — must exist in mocks/suppliers.ts (e.g. "s1", "s2")
 * - partRef   — seeded part UUID OR OEM number (e.g. "26300-35505")
 * - price     — item price in `currency`
 * - shipping  — optional; defaults to 0 (free local delivery)
 * - url       — direct product or search page on the supplier site
 * - inStock   — optional; defaults to true
 * - lastUpdated — optional ISO date; defaults to fixture load time
 *
 * Seeded parts (OEM → name):
 * | OEM          | Part                    |
 * |--------------|-------------------------|
 * | 26300-35505  | Oil Filter              |
 * | 28113-2H000  | Air Filter              |
 * | 58101-2HA10  | Front Brake Pads        |
 * | 58302-2HA10  | Rear Brake Pads         |
 * | 97133-2H000  | Cabin Filter            |
 * | 18841-11051  | Spark Plugs (x4)        |
 * | 98350-2H100  | Wiper Blades            |
 * | 25100-2B000  | Coolant Temp Sensor     |
 */
export interface ManualOfferFixture {
  supplierId: string;
  partRef: string;
  price: number;
  currency?: string;
  shipping?: number;
  url: string;
  inStock?: boolean;
  lastUpdated?: string;
}

/** Real curated offers — empty until you provide supplier data */
export const MANUAL_OFFER_FIXTURES: ManualOfferFixture[] = [
  // Example (delete or replace when adding real data):
  // {
  //   supplierId: "s1",
  //   partRef: "26300-35505",
  //   price: 42,
  //   currency: "ILS",
  //   shipping: 0,
  //   url: "https://supplier.example/oil-filter",
  //   inStock: true,
  // },
];
