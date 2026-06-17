# scheduler

Thin process-level entry points that trigger `data-collectors` on a schedule
or on demand. Contains no scraping or business logic of its own.

## Responsibility

- Long-running process: arms a `node-cron` schedule (default every 8 h) and
  calls `runSync()` from `data-collectors` on each tick
- Optional initial sync on startup (`SYNC_ON_START=true`)
- One-shot mode: runs a single sync pass then exits cleanly
- Graceful shutdown on SIGINT / SIGTERM

## Files moving here (from `data-engine/src/`)

```
data-engine/src/scheduler/cron.ts    node-cron wrapper — validate schedule, arm tick
data-engine/src/index.ts             long-running entry point (npm run dev)
data-engine/src/sync-once.ts         one-shot entry point (npm run sync)
```

## Environment variables

```
SYNC_CRON_SCHEDULE=0 */8 * * *   cron expression (default: every 8 h)
SYNC_ON_START=false               run one sync immediately before arming
SYNC_SUPPLIERS=partsouq,...       comma-separated supplier filter (optional)
SYNC_PARTS=26300-35505,...        comma-separated OEM/part-id filter (optional)
```

## Dependencies

- `data-collectors` (imports `runSync`)
- `node-cron`
- No direct Postgres or Firecrawl access — those live in `data-collectors`
