# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**PartPilot** is an Israeli vehicle parts discovery platform (Hebrew-first, RTL UI). Users enter a license plate, the app resolves the vehicle via the Israeli government API (data.gov.il), and then displays compatible OEM parts with supplier pricing comparisons.

## Commands

All commands run from the `frontend/` directory:

```bash
npm run dev                   # Next.js dev server at http://localhost:3000
npm run build                 # Production build
npm run lint                  # ESLint
npm run sync:supplier-prices  # Trigger Firecrawl batch scraper via data-engine
```

From `data-engine/`:
```bash
npm run dev      # Start price-sync scheduler (node-cron, every 8 h)
npm run sync     # One-shot sync run → writes to Postgres
npm run migrate  # Create/seed DB schema (run once after docker start)
```

The backend has no build step — its TypeScript is consumed directly by the Next.js build via the `@partpilot/backend` package alias.

## Architecture

### Monorepo Layout

```
part-pilot/
├── backend/          # Shared business logic — published as @partpilot/backend
│   └── src/
│       ├── types/    # Core domain types (Vehicle, Part, Supplier, SupplierOffer)
│       ├── services/ # Business logic (vehicle lookup, parts catalog, offers)
│       ├── mocks/    # Static fixtures for demo plates
│       ├── data/     # Manual offer price fixtures (manual-offers.fixture.ts)
│       └── config/   # API keys / endpoint config
├── data-engine/      # Price-sync service — @partpilot/data-engine
│   └── src/
│       ├── db/       # Postgres client, schema.sql, migrate.ts
│       ├── services/ # sync-engine.ts, url-validator.ts, firecrawl client
│       ├── scheduler/# node-cron wrapper (cron.ts)
│       ├── config/   # Loads repo-root .env, validates required vars
│       ├── index.ts  # Long-running scheduler entry point
│       └── sync-once.ts # One-shot sync for npm run sync
├── frontend/         # Next.js 15 + React 19 app
│   └── src/
│       ├── app/api/  # Route Handlers — BFF layer calling backend services
│       ├── components/
│       ├── hooks/    # TanStack Query wrappers (use-api.ts)
│       ├── stores/   # Zustand (search-store.ts — recent plates)
│       ├── types/    # Frontend DTOs (api.ts)
│       └── lib/      # api-client.ts, format.ts, cn.ts
├── scripts/          # register-startup-task.ps1, start-data-engine.ps1
├── start-all.ps1     # Interactive dev launcher (Docker → DB → engine → Next.js)
└── docs/             # firecrawl-supplier-sync.md, ebay-epn-setup.md
```

### Data Flow

**Vehicle Lookup:**  
Plate → `vehicle-service.ts` → data.gov.il CKAN API → WLTP enrichment → mock fallback → `VehicleDto`

**Parts Catalog:**  
Plate → vehicle resolved → `PART_COMPATIBILITIES` filtered by `variantId` → parts grouped by category → if no catalog: supplier browse links → `PartCategoryDto[]`

**Supplier Offers (priority order):**  
1. Manual fixtures (`data/manual-offers.fixture.ts`) — highest priority
2. Scraped DB rows (`supplier_offers` table in Postgres) — written by `data-engine`, read via `scraped-offer-store.ts` using `pg` Pool directly; returns `[]` gracefully if DB is unavailable
3. Referral search links — fallback (no price, just a URL)

### Key Type Contracts

Domain types live in `backend/src/types/index.ts`. Frontend-facing DTOs live in `frontend/src/types/api.ts`. Backend services return domain types; Route Handlers transform them to DTOs before responding.

Important discriminated unions:
- `PartCategoryId` — 10 string literals (`"filters" | "brakes" | "engine" | ...`)
- `DifficultyLevel` — `"beginner" | "intermediate" | "professional"`
- `SupplierOffer.sourceType` — `"manual" | "referral" | "scraped" | "api"`
- `SupplierOffer.priceSource` — `"listed" | "estimate" | "on_site"`

### Frontend Patterns

- **API calls:** Always through `frontend/src/hooks/use-api.ts` (TanStack Query, staleTime 60s).
- **Routing:** `/vehicle/[plate]/parts/[partId]` — plate is always the normalized Israeli format (digits only, no dashes, in the URL).
- **RTL:** The app is Hebrew-first. All user-facing text components support RTL. Hebrew strings appear in mocks and formatters.
- **Path alias:** `@/*` maps to `frontend/src/*`.

### Environment Variables

`.env` at repo root (loaded by `data-engine`; `frontend/.env.local` for Next.js):

```
DATABASE_URL=postgresql://partpilot:partpilot@localhost:5432/partpilot
FIRECRAWL_API_KEY=          # Firecrawl supplier price scraper
```

Optional:
```
FIRECRAWL_SCRAPE_DELAY_MS=2500
SYNC_CRON_SCHEDULE=0 */8 * * *       # data-engine cron (default: every 8h)
SYNC_ON_START=false                  # Run sync immediately on data-engine start
SYNC_SUPPLIERS=partsouq,sparekorea   # Limit scraper scope
SYNC_PARTS=26300-35505               # Limit scraper scope
EBAY_BROWSE_API_ENABLED=false        # Future eBay integration
```

### Adding New Suppliers / Offers

- **New supplier definition:** `backend/src/mocks/suppliers.ts` AND `data-engine/src/db/schema.sql` (INSERT into suppliers table)
- **Verified manual prices:** `backend/src/data/manual-offers.fixture.ts`
- **Scraped prices:** Run `npm run sync:supplier-prices` from `frontend/` (triggers `data-engine` one-shot sync → writes to Postgres)
- **Browse links for empty categories:** `backend/src/services/category-supplier-links.ts`

### Demo Plates (for local testing)

| Plate | Vehicle | Has Catalog |
|-------|---------|-------------|
| 12-345-67 | Hyundai i20 2019 | ✅ |
| 98-765-43 | Toyota Corolla 2021 | ✅ |
| 55-123-89 | Kia Sportage 2020 | ✅ |
| 64-519-74 | Hyundai i10 2011 | ❌ |
