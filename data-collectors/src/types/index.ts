export interface SupplierRow {
  id: string;
  name_en: string;
  name_he: string;
  base_url: string;
  country_code: string;
  type: "local" | "international";
  is_affiliate: boolean;
  supports_plate_lookup: boolean;
  priority: number;
  rating: number | null;
  delivery_days: string | null;
  is_active: boolean;
}

export interface PartRow {
  id: string;
  oem_number: string;
  name_en: string;
  name_he: string;
  category_id: string;
  difficulty: string;
  is_active: boolean;
}

export interface PartAliasRow {
  id: number;
  part_id: string;
  alias: string;
  alias_raw: string;
}

export interface SupplierOfferRow {
  id: string;
  supplier_id: string;
  part_id: string;
  mpn: string;
  url: string;
  price: number;
  currency: string;
  shipping: number;
  in_stock: boolean;
  product_title: string | null;
  source_type: string;
  last_verified: string | null;
  url_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SyncLogRow {
  id: number;
  run_id: string;
  started_at: string;
  finished_at: string | null;
  status: "running" | "completed" | "failed";
  total_parts: number | null;
  total_suppliers: number | null;
  offers_upserted: number;
  offers_failed: number;
  offers_url_rejected: number;
  error_message: string | null;
  details: Record<string, unknown> | null;
}

export interface ScrapeResult {
  supplierId: string;
  partId: string;
  mpn: string;
  url: string;
  price: number;
  currency: string;
  shipping: number;
  inStock: boolean;
  productTitle?: string;
}

export interface SyncDetail {
  partId: string;
  oemNumber: string;
  supplierId: string;
  status: "ok" | "failed" | "url_rejected" | "no_product" | "no_price";
  url?: string;
  price?: number;
  error?: string;
}

export interface SyncRunStats {
  runId: string;
  startedAt: string;
  totalParts: number;
  totalSuppliers: number;
  upserted: number;
  failed: number;
  urlRejected: number;
  details: SyncDetail[];
}
