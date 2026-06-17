# data-collectors

Price-scraping pipeline. Iterates every active part × supplier combination,
uses Firecrawl to locate and extract prices from supplier websites, and writes
verified results into the Postgres `supplier_offers` table.

## Responsibility

- Postgres schema, migrations, connection pool, and query helpers
- Two-step Firecrawl scrape: step 1 finds the product URL from a search results
  page (no price requested); step 2 extracts the verified price from the product page
- Per-supplier URL validation rules (path checks + live HEAD requests)
- MPN normalization and alias generation
- Offer upsert logic and sync-run audit logging (`sync_logs` table)
- Supplier search URL builder for the 6 scrapeable international suppliers

## Files moving here (from `data-engine/src/`)

```
data-engine/src/config/index.ts         env loader + typed config
data-engine/src/logger/index.ts         structured logger
data-engine/src/types/index.ts          SupplierRow, PartRow, SyncRunStats, etc.
data-engine/src/db/schema.sql           Postgres schema
data-engine/src/db/client.ts            pg Pool singleton + closePool()
data-engine/src/db/index.ts             DB barrel export
data-engine/src/db/migrate.ts           one-time schema + seed migration
data-engine/src/db/queries.ts           getActiveParts(), getActiveSuppliers()
data-engine/src/services/firecrawl-client.ts   two-step Firecrawl client
data-engine/src/services/sync-engine.ts         main sync loop (parts × suppliers)
data-engine/src/services/offer-writer.ts        upsertOffer(), startSyncLog(), finishSyncLog()
data-engine/src/services/url-validator.ts       path rules + HEAD check per supplier
data-engine/src/services/supplier-link-builder.ts  search URLs (international suppliers only)
data-engine/src/services/mpn-normalizer.ts      normalizeMpn(), buildPartAliases()
```

## Note on supplier-link-builder duplication

`data-engine/src/services/supplier-link-builder.ts` is a trimmed-down copy of
`backend/src/services/supplier-link-builder.ts` covering only the 6 scrapeable
suppliers. After the restructure, `data-collectors` should import from `data-engine`
(the shared package) rather than maintaining its own copy.

## Dependencies

- Postgres (`DATABASE_URL`)
- Firecrawl API (`FIRECRAWL_API_KEY`)
- `data-engine` (shared) for supplier/part definitions
- Called by `scheduler` (which provides the trigger, not the logic)
