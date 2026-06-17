# data-engine

> Previously `backend/` (published as `@partpilot/backend`). Renamed to `data-engine/`
> (`@partpilot/data-engine`) as part of the service restructure.

Shared domain logic package consumed by `ui` (via Next.js build alias) and
indirectly by `data-collectors` (for supplier/part definitions).

## Responsibility

- All core domain types (`Vehicle`, `Part`, `Supplier`, `SupplierOffer`, etc.)
- Vehicle lookup: plate → mock → gov.il CKAN API → WLTP enrichment
- Parts catalog: compatibility filtering, category definitions, OEM assignments
- Offer aggregation: merges manual fixtures > scraped DB rows > referral links
- Supplier registry and URL builder (all suppliers, including Israeli plate-lookup)
- Reads scraped offers from Postgres via `scraped-offer-store` (graceful fail when DB down)

## Files moving here (from `backend/`)

```
backend/                          → data-engine/
  package.json                    (rename package to @partpilot/data-engine)
  tsconfig.json
  src/types/index.ts              domain types
  src/types/govil.ts              gov.il API response shapes
  src/types/govil-wltp.ts         WLTP API response shapes
  src/config/govil.ts             gov.il base URLs
  src/config/firecrawl.ts         Firecrawl base URL constant
  src/config/ebay.ts              eBay feature flag
  src/mocks/vehicles.ts           demo vehicle fixtures
  src/mocks/parts.ts              static parts catalog
  src/mocks/categories.ts         10 PartCategoryId definitions
  src/mocks/suppliers.ts          supplier registry
  src/data/manual-offers.fixture.ts    hand-curated prices (highest priority)
  src/data/reference-prices.fixture.ts estimate prices for referral tier
  src/services/vehicle-service.ts      vehicle lookup orchestrator
  src/services/govil-client.ts         HTTP client → data.gov.il
  src/services/govil-mapper.ts         raw CKAN → Vehicle
  src/services/govil-wltp-client.ts    HTTP client → WLTP API
  src/services/govil-wltp-mapper.ts    WLTP rows → VehicleSpecs
  src/services/variant-resolver.ts     plate → variantId
  src/services/parts-service.ts        parts catalog queries
  src/services/category-supplier-links.ts  browse links for empty categories
  src/services/supplier-service.ts     supplier lookups
  src/services/supplier-offer-store.ts offer aggregator (manual+scraped+referral)
  src/services/scraped-offer-store.ts  reads Postgres supplier_offers table
  src/services/referral-offer-service.ts referral offers + merge logic
  src/services/supplier-link-builder.ts  deep-link URLs for all 10 suppliers
  src/services/supplier-url-validator.ts  URL validation used by scraped-offer-store
  src/utils/plate.ts              plate normalization
  src/utils/vehicle-dto.ts        Vehicle → VehicleDto
  src/index.ts                    barrel export
```

## Files NOT moving here

- `backend/src/services/firecrawl-client.ts` — old single-step scraper, used only by
  the legacy `scripts/sync-supplier-prices.ts`. Candidate for deletion.
- `backend/src/data/scraped-offers.cache.json` — legacy JSON cache from old scraper.
  Candidate for deletion once Postgres is the sole scraped-offer source.

## Dependencies

- `pg` (reads scraped offers from Postgres, gracefully fails if DB is down)
- data.gov.il public API (vehicle lookup)
- No dependency on `data-collectors` or `scheduler`
