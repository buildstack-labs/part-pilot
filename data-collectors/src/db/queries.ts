import { Pool } from "pg";
import type { PartRow, SupplierOfferRow, SupplierRow } from "../types/index";

function pool(): Pool {
  // Imported lazily so callers that don't use the DB don't trigger config validation
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("./client").getPool() as Pool;
}

export async function getActiveOffersForPart(partId: string): Promise<SupplierOfferRow[]> {
  const { rows } = await pool().query<SupplierOfferRow>(
    `SELECT * FROM supplier_offers
     WHERE part_id = $1 AND is_active = true
     ORDER BY price ASC`,
    [partId],
  );
  return rows;
}

export async function getAllActiveOffers(): Promise<SupplierOfferRow[]> {
  const { rows } = await pool().query<SupplierOfferRow>(
    `SELECT * FROM supplier_offers
     WHERE is_active = true
     ORDER BY part_id, price ASC`,
  );
  return rows;
}

export async function getActiveSuppliers(): Promise<SupplierRow[]> {
  const { rows } = await pool().query<SupplierRow>(
    `SELECT * FROM suppliers WHERE is_active = true ORDER BY priority ASC`,
  );
  return rows;
}

export async function getActiveParts(): Promise<PartRow[]> {
  const { rows } = await pool().query<PartRow>(
    `SELECT * FROM parts WHERE is_active = true ORDER BY oem_number ASC`,
  );
  return rows;
}

export async function getRecentSyncLogs(limit = 10) {
  const { rows } = await pool().query(
    `SELECT id, run_id, started_at, finished_at, status,
            offers_upserted, offers_failed, offers_url_rejected, error_message
     FROM sync_logs
     ORDER BY started_at DESC
     LIMIT $1`,
    [limit],
  );
  return rows;
}
