/**
 * One-shot sync — runs a single pass and exits.
 * Usage: npm run sync (from scheduler/)
 */
import { logger } from "@partpilot/data-collectors/logger";
import { runSync } from "@partpilot/data-collectors/services/sync-engine";
import { closePool } from "@partpilot/data-collectors/db/client";

const log = logger("sync-once");

runSync()
  .then((stats) => {
    log.info("Done", {
      upserted:    stats.upserted,
      failed:      stats.failed,
      urlRejected: stats.urlRejected,
    });
    return closePool();
  })
  .then(() => process.exit(0))
  .catch((err) => {
    log.error("Fatal", { error: err instanceof Error ? err.message : String(err) });
    closePool().finally(() => process.exit(1));
  });
