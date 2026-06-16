import { Pool } from "pg";
import { config } from "../config/index";

let _pool: Pool | null = null;

export function getPool(): Pool {
  if (!_pool) {
    _pool = new Pool({ connectionString: config.db.url });
    _pool.on("error", (err) => {
      console.error("[db] Unexpected pool error:", err.message);
    });
  }
  return _pool;
}

export async function closePool(): Promise<void> {
  if (_pool) {
    await _pool.end();
    _pool = null;
  }
}
