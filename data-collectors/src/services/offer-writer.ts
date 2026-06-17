import { getPool } from "../db/client";
import { logger } from "../logger/index";
import type { ScrapeResult, SyncRunStats } from "../types/index";

const log = logger("offer-writer");

function offerId(supplierId: string, partId: string): string {
  return `${supplierId}:${partId}`;
}

export async function startSyncLog(
  runId: string,
  totalParts: number,
  totalSuppliers: number,
): Promise<void> {
  await getPool().query(
    `INSERT INTO sync_logs (run_id, status, total_parts, total_suppliers)
     VALUES ($1, 'running', $2, $3)`,
    [runId, totalParts, totalSuppliers],
  );
}

export async function finishSyncLog(
  runId: string,
  stats: Pick<SyncRunStats, "upserted" | "failed" | "urlRejected" | "details">,
  fatalError?: string,
): Promise<void> {
  await getPool().query(
    `UPDATE sync_logs
     SET finished_at       = NOW(),
         status            = $2,
         offers_upserted   = $3,
         offers_failed     = $4,
         offers_url_rejected = $5,
         error_message     = $6,
         details           = $7
     WHERE run_id = $1`,
    [
      runId,
      fatalError ? "failed" : "completed",
      stats.upserted,
      stats.failed,
      stats.urlRejected,
      fatalError ?? null,
      JSON.stringify(stats.details),
    ],
  );
}

export async function upsertOffer(result: ScrapeResult, verifiedAt: string): Promise<void> {
  const id = offerId(result.supplierId, result.partId);

  await getPool().query(
    `INSERT INTO supplier_offers
       (id, supplier_id, part_id, mpn, url, price, currency, shipping,
        in_stock, product_title, source_type, last_verified, url_verified, is_active, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'scraped',$11,TRUE,TRUE,NOW())
     ON CONFLICT (supplier_id, part_id) DO UPDATE SET
       mpn           = EXCLUDED.mpn,
       url           = EXCLUDED.url,
       price         = EXCLUDED.price,
       currency      = EXCLUDED.currency,
       shipping      = EXCLUDED.shipping,
       in_stock      = EXCLUDED.in_stock,
       product_title = EXCLUDED.product_title,
       last_verified = EXCLUDED.last_verified,
       url_verified  = TRUE,
       is_active     = TRUE,
       updated_at    = NOW()`,
    [
      id,
      result.supplierId,
      result.partId,
      result.mpn,
      result.url,
      result.price,
      result.currency,
      result.shipping,
      result.inStock,
      result.productTitle ?? null,
      verifiedAt,
    ],
  );

  log.info(`Upserted ${id}`, { price: result.price, currency: result.currency });
}
