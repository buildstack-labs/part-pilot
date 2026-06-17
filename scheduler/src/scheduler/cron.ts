import cron from "node-cron";
import { config } from "@partpilot/data-collectors/config";
import { logger } from "@partpilot/data-collectors/logger";
import { runSync } from "@partpilot/data-collectors/services/sync-engine";

const log = logger("scheduler");

export function startScheduler(): void {
  const schedule = config.sync.cronSchedule;

  if (!cron.validate(schedule)) {
    throw new Error(`Invalid cron schedule: "${schedule}"`);
  }

  log.info(`Scheduler armed`, { schedule });

  cron.schedule(schedule, async () => {
    log.info("Cron tick — starting sync");
    try {
      const stats = await runSync();
      log.info("Cron sync finished", {
        upserted:    stats.upserted,
        failed:      stats.failed,
        urlRejected: stats.urlRejected,
      });
    } catch (err) {
      log.error("Cron sync failed", { error: err instanceof Error ? err.message : String(err) });
    }
  });
}
