import { config } from "@partpilot/data-collectors/config";
import { logger } from "@partpilot/data-collectors/logger";
import { startScheduler } from "./scheduler/cron";
import { runSync } from "@partpilot/data-collectors/services/sync-engine";
import { closePool } from "@partpilot/data-collectors/db/client";

const log = logger("main");

async function main(): Promise<void> {
  log.info("PartPilot Data Engine starting", { schedule: config.sync.cronSchedule });

  if (config.sync.runOnStart) {
    log.info("SYNC_ON_START=true — running initial sync before arming scheduler");
    try {
      await runSync();
    } catch (err) {
      log.error("Initial sync failed", { error: err instanceof Error ? err.message : String(err) });
    }
  }

  startScheduler();
  log.info("Scheduler running. Press Ctrl+C to stop.");
}

process.on("SIGINT",  () => { log.info("SIGINT received — shutting down"); closePool().then(() => process.exit(0)); });
process.on("SIGTERM", () => { log.info("SIGTERM received — shutting down"); closePool().then(() => process.exit(0)); });

main().catch((err) => {
  console.error("[main] Fatal:", err);
  process.exit(1);
});
