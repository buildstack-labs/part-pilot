# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**PartPilot** is an Israeli vehicle parts discovery platform (Hebrew-first, RTL UI). Users enter a license plate, the app resolves the vehicle via the Israeli government API (data.gov.il), and then displays compatible OEM parts with supplier pricing comparisons.

## Commands

From `ui/`:
```bash
npm run dev                   # Next.js dev server at http://localhost:3000
npm run build                 # Production build
npm run start                 # Serve the production build
npm run lint                  # ESLint
npm run sync:supplier-prices  # Trigger one-shot price sync via scheduler/
```

From `scheduler/`:
```bash
npm run dev      # Start price-sync scheduler (node-cron, every 8 h)
npm run sync     # One-shot sync run → writes to Postgres
npm run lint     # TypeScript type-check
```

From `data-collectors/`:
```bash
npm run migrate  # Create/seed DB schema (run once after docker start)
npm run lint     # TypeScript type-check
```

`data-engine/` has no scripts — its TypeScript is consumed directly by the Next.js build via the `@partpilot/data-engine` package alias.

## Architecture

### Monorepo Layout

```
part-pilot/
├── ui/               # Next.js 15 + React 19 app — @partpilot/ui
│   └── src/
│       ├── app/api/  # Route Handlers — BFF layer calling data-engine services
│       ├── components/
│       ├── hooks/    # TanStack Query wrappers (use-api.ts)
│       ├── stores/   # Zustand (search-store.ts — recent plates)
│       ├── types/    # Frontend DTOs (api.ts)
│       └── lib/      # api-client.ts, format.ts, cn.ts
├── data-engine/      # Shared domain logic — @partpilot/data-engine
│   └── src/
│       ├── types/    # Core domain types (Vehicle, Part, Supplier, SupplierOffer)
│       ├── services/ # Business logic (vehicle lookup, parts catalog, offers)
│       ├── mocks/    # Static fixtures for demo plates
│       ├── data/     # Manual offer price fixtures (manual-offers.fixture.ts)
│       └── config/   # API keys / endpoint config
├── data-collectors/  # Firecrawl scraping pipeline — @partpilot/data-collectors
│   └── src/
│       ├── db/       # Postgres client, schema.sql, migrate.ts
│       ├── services/ # sync-engine.ts, firecrawl-client.ts, url-validator.ts
│       ├── config/   # Loads repo-root .env, validates required vars
│       ├── logger/   # Structured logger
│       └── types/    # Data-engine-specific types (SyncRunStats, ScrapeResult)
├── scheduler/        # Cron entry points — @partpilot/scheduler
│   └── src/
│       ├── scheduler/cron.ts  # node-cron wrapper
│       ├── index.ts           # Long-running process entry point
│       └── sync-once.ts       # One-shot sync for npm run sync
├── scripts/          # register-startup-task.ps1, start-data-engine.ps1
├── start-all.ps1     # Interactive dev launcher (Docker → DB → scheduler → Next.js)
└── docs/             # firecrawl-supplier-sync.md, ebay-epn-setup.md
```

### Package Dependency Graph

```
ui  →  data-engine
scheduler  →  data-collectors
data-collectors  (standalone — no partpilot deps)
data-engine      (standalone — no partpilot deps)
```

### Data Flow

**Vehicle Lookup:**  
Plate → `vehicle-service.ts` → data.gov.il CKAN API → WLTP enrichment → mock fallback → `VehicleDto`

**Parts Catalog:**  
Plate → vehicle resolved → `PART_COMPATIBILITIES` filtered by `variantId` → parts grouped by category → if no catalog: supplier browse links → `PartCategoryDto[]`

**Supplier Offers (priority order):**  
1. Manual fixtures (`data/manual-offers.fixture.ts`) — highest priority
2. Scraped DB rows (`supplier_offers` table in Postgres) — written by `data-collectors`, read via `scraped-offer-store.ts` using `pg` Pool directly; returns `[]` gracefully if DB is unavailable
3. Referral search links — fallback (no price, just a URL)

### Key Type Contracts

Domain types live in `data-engine/src/types/index.ts`. Frontend-facing DTOs live in `ui/src/types/api.ts`. `data-engine` services return domain types; Route Handlers in `ui/src/app/api/` transform them to DTOs before responding.

Important discriminated unions:
- `PartCategoryId` — 10 string literals (`"filters" | "brakes" | "engine" | ...`)
- `DifficultyLevel` — `"beginner" | "intermediate" | "professional"`
- `SupplierOffer.sourceType` — `"manual" | "referral" | "scraped" | "api"`
- `SupplierOffer.priceSource` — `"listed" | "estimate" | "on_site"`

### UI Patterns

- **API calls:** Always through `ui/src/hooks/use-api.ts` (TanStack Query, staleTime 60s).
- **Routing:** `/vehicle/[plate]/parts/[partId]` — plate is always the normalized Israeli format (digits only, no dashes, in the URL).
- **RTL:** The app is Hebrew-first. All user-facing text components support RTL. Hebrew strings appear in mocks and formatters.
- **Path alias:** `@/*` maps to `ui/src/*`.

### Environment Variables

`.env` at repo root (loaded by `data-collectors`; `ui/.env.local` for Next.js):

```
DATABASE_URL=postgresql://partpilot:partpilot@localhost:5432/partpilot
FIRECRAWL_API_KEY=          # Firecrawl supplier price scraper
```

Optional:
```
FIRECRAWL_SCRAPE_DELAY_MS=2500
SYNC_CRON_SCHEDULE=0 */8 * * *       # scheduler cron (default: every 8h)
SYNC_ON_START=false                  # Run sync immediately on scheduler start
SYNC_SUPPLIERS=partsouq,sparekorea   # Limit scraper scope
SYNC_PARTS=26300-35505               # Limit scraper scope
EBAY_BROWSE_API_ENABLED=false        # Future eBay integration
```

### Adding New Suppliers / Offers

- **New supplier definition:** `data-engine/src/mocks/suppliers.ts` AND `data-collectors/src/db/schema.sql` (INSERT into suppliers table)
- **Verified manual prices:** `data-engine/src/data/manual-offers.fixture.ts`
- **Scraped prices:** Run `npm run sync:supplier-prices` from `ui/` (triggers `scheduler/` one-shot sync → writes to Postgres)
- **Browse links for empty categories:** `data-engine/src/services/category-supplier-links.ts`

### Demo Plates (for local testing)

| Plate | Vehicle | Has Catalog |
|-------|---------|-------------|
| 12-345-67 | Hyundai i20 2019 | ✅ |
| 98-765-43 | Toyota Corolla 2021 | ✅ |
| 55-123-89 | Kia Sportage 2020 | ✅ |
| 64-519-74 | Hyundai i10 2011 | ❌ |
