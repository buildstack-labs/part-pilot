import { Pool } from "pg";
import { SUPPLIERS_BY_ID } from "../mocks/suppliers";
import type { SupplierOffer } from "../types";
import { isDirectProductUrl, normalizeProductUrl } from "./supplier-url-validator";

interface DbOfferRow {
  supplier_id: string;
  part_id: string;
  mpn: string;
  url: string;
  price: string | number;
  currency: string;
  shipping: string | number;
  in_stock: boolean;
  product_title: string | null;
  last_verified: string | null;
}

let _pool: Pool | null = null;

function getPool(): Pool {
  if (!_pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error("DATABASE_URL not set");
    _pool = new Pool({ connectionString });
    _pool.on("error", (err) => console.error("[scraped-offer-store] pool error:", err.message));
  }
  return _pool;
}

function rowToOffer(row: DbOfferRow): SupplierOffer | null {
  const supplier = SUPPLIERS_BY_ID[row.supplier_id];
  if (!supplier) return null;

  const url = normalizeProductUrl(row.url, supplier.baseUrl);
  if (!isDirectProductUrl(row.supplier_id, url, row.mpn)) return null;

  return {
    id: `scraped-${row.supplier_id}-${row.part_id}`,
    supplierId:  row.supplier_id,
    partId:      row.part_id,
    price:       Number(row.price),
    currency:    row.currency,
    url,
    shipping:    Number(row.shipping),
    inStock:     row.in_stock,
    lastUpdated: row.last_verified ?? new Date().toISOString(),
    sourceType:  "scraped",
    priceSource: "listed",
    priceNoteHe: "מחיר מהאתר — עודכן בניתוח אוטומטי",
  };
}

export async function getScrapedOffersForPart(partId: string): Promise<SupplierOffer[]> {
  try {
    const { rows } = await getPool().query<DbOfferRow>(
      `SELECT supplier_id, part_id, mpn, url, price, currency, shipping,
              in_stock, product_title, last_verified
       FROM supplier_offers
       WHERE part_id = $1 AND is_active = true
       ORDER BY price ASC`,
      [partId],
    );
    return rows.map(rowToOffer).filter((o): o is SupplierOffer => o !== null);
  } catch {
    // DB unavailable in local dev without Postgres — fall through to referral tier
    return [];
  }
}

export async function getScrapedOffersCacheMeta(): Promise<{
  scrapedAt: string | null;
  count: number;
}> {
  try {
    const { rows } = await getPool().query<{ started_at: string; offers_upserted: number }>(
      `SELECT started_at, offers_upserted
       FROM sync_logs
       WHERE status = 'completed'
       ORDER BY started_at DESC
       LIMIT 1`,
    );
    if (!rows.length) return { scrapedAt: null, count: 0 };
    return { scrapedAt: rows[0].started_at, count: rows[0].offers_upserted };
  } catch {
    return { scrapedAt: null, count: 0 };
  }
}
