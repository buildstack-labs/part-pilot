# eBay Partner Network (EPN) — Setup Guide

PartPilot can enrich supplier offers via the **eBay Browse API** (OEM search + compatibility). Integration is **disabled by default** until you complete the steps below and set `EBAY_BROWSE_API_ENABLED=true`.

---

## 1. Join eBay Partner Network (EPN)

1. Go to [https://partnernetwork.ebay.com/](https://partnernetwork.ebay.com/)
2. Sign in with your eBay account (or create one).
3. Apply to the program — approval is typically **1–3 business days**.
4. Once approved, open the EPN dashboard and note your **Campaign ID** (needed for affiliate tracking in listing URLs).

EPN is free; you earn commission on qualifying purchases through your referral links.

---

## 2. Create eBay Developer credentials

1. Go to [https://developer.ebay.com/](https://developer.ebay.com/) and sign in with the same eBay account.
2. Open **My Account → Application Keys**.
3. Create a new **Production** keyset (and optionally a **Sandbox** keyset for testing).
4. Save these three values securely (never commit them to git):

   | Credential | Purpose |
   |------------|---------|
   | **App ID** (Client ID) | OAuth client identifier |
   | **Dev ID** | Developer account ID |
   | **Cert ID** (Client Secret) | OAuth client secret |

5. Under **User Tokens**, generate an **Application access token** (client-credentials grant) for the Browse API scope, or plan for OAuth refresh if you need user-context calls later.

---

## 3. Configure PartPilot (when ready to implement)

Add to your local `.env` (not committed):

```env
EBAY_BROWSE_API_ENABLED=true
EBAY_APP_ID=YourAppId
EBAY_DEV_ID=YourDevId
EBAY_CERT_ID=YourCertId
# Optional — use sandbox while testing
# EBAY_BROWSE_API_BASE_URL=https://api.sandbox.ebay.com
```

The backend flag lives in `backend/src/config/ebay.ts`. When enabled, a future `ebay-browse-service` will:

- Search by OEM part number (`GET /buy/browse/v1/item_summary/search?q=...`)
- Map results to `SupplierOffer` rows with `sourceType: "api"`
- Merge with manual curated offers in `supplier-offer-store.ts`

---

## 4. Browse API endpoints we will use

| Endpoint | Use in PartPilot |
|----------|------------------|
| `item_summary/search` | Find listings by OEM / MPN keyword |
| `item/{item_id}` | Full listing detail (price, condition, seller) |
| `item/get_items_by_item_group` | Variants of the same product |

Docs: [https://developer.ebay.com/api-docs/buy/browse/overview.html](https://developer.ebay.com/api-docs/buy/browse/overview.html)

---

## 5. Affiliate link requirements

EPN requires tracked outbound URLs. When we implement the service, listing `url` values will include your campaign parameters so clicks count toward EPN reporting.

---

## 6. What to send back to Cursor

Once approved, share only that credentials are ready (do **not** paste secrets in chat). We will wire:

- `backend/src/services/ebay-browse-service.ts` — OAuth + search
- Merge logic in `supplier-offer-store.ts` for the 8 seeded OEM numbers
- Optional UI badge: `sourceType: "api"` → “eBay”

Until then, **manual fixtures** in `backend/src/data/manual-offers.fixture.ts` remain the primary offer source.
