# Firecrawl supplier price sync

PartPilot uses [Firecrawl](https://www.firecrawl.dev/) to scrape **direct product page URLs** and **live prices** from affiliate suppliers, then caches results for the app.

## Recommended refresh architecture

| Approach | Verdict | Why |
|----------|---------|-----|
| **Scheduled batch sync** (daily or weekly) | **Recommended** | Fast app reads, predictable Firecrawl cost, validated URLs written once |
| Scrape every 30 minutes | Only if prices must be near-real-time | High API cost, rate limits, little benefit for auto parts |
| Scrape on every user request | **Avoid** | Slow UX, unreliable, easy to get blocked |
| Webhook from suppliers | **Ideal long-term** | Requires supplier partnerships — not available today |

**Production pattern:** GitHub Action / cron → `npm run sync:supplier-prices` → commit or upload `scraped-offers.cache.json` → deploy. The Next.js app only reads the cache at request time (no live scrape).

**User-facing links:**

- **Product offers** (`לחנות →` on a part): must be a validated direct product URL (scraped or manual). Invalid search URLs are dropped and the app falls back to referral search links.
- **Category browse** (empty category): intentionally uses supplier **search** URLs — these are labeled “חפש אצל ספקים”, not product pages.

## Why a sync job (not live scrape)?

- Supplier pages are slow and rate-limited — scraping on every user click would be unreliable.
- A scheduled/on-demand **job** keeps prices accurate while the app reads a fast local cache.
- Each cached offer includes a **validated product URL** (not homepage/search) so **לחנות →** opens the exact product page.

## Setup

1. Sign in at [firecrawl.dev](https://www.firecrawl.dev/app/api-keys)
2. Create an API key
3. Copy `.env.example` → `.env` and set:

```env
FIRECRAWL_API_KEY=fc-your-key-here
```

## Run the sync job

From the `frontend` folder (PowerShell):

```powershell
$env:FIRECRAWL_API_KEY="fc-your-key-here"
npm run sync:supplier-prices
```

Or with subset (faster test):

```powershell
$env:FIRECRAWL_API_KEY="fc-..."
$env:SYNC_SUPPLIERS="partsouq,sparekorea"
$env:SYNC_PARTS="26300-35505"
npm run sync:supplier-prices
```

Output is written to:

`backend/src/data/scraped-offers.cache.json`

Restart `npm run dev` after sync so Next.js reloads the cache.

## Data priority in the app

For each supplier × part:

1. **Manual fixtures** (`manual-offers.fixture.ts`) — your verified prices
2. **Firecrawl cache** (`scraped-offers.cache.json`) — scraped product URL + price
3. **Referral estimates** — search links + reference prices (fallback)

Scraped offers show **מחיר מהאתר** and link directly to the product page.

## Suppliers covered by sync

Affiliate international:

- PartSouq, Amayama, IMPEX Japan, MegaZip, Spare Korea, RockAuto

Israeli suppliers remain referral links until site-specific scrape rules are added.

## Accuracy

- Scrapes search URL → extracts product detail URL → re-scrapes product page to verify price.
- URLs rejected if homepage/search-only (`supplier-url-validator.ts`).
- Re-run weekly or when prices drift.
