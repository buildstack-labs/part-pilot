import assert from "node:assert/strict";

process.env.DATABASE_URL ??= "postgresql://partpilot:partpilot@localhost:5432/partpilot";

async function main(): Promise<void> {
  const { isDirectProductUrl: isCollectorDirectProductUrl } = await import("./url-validator");
  const { isDirectProductUrl: isDataEngineDirectProductUrl } = await import(
    "@partpilot/data-engine/services/supplier-url-validator"
  );

  const megazipProductUrl =
    "https://www.megazip.net/zapchasti-dlya/hyundai/korpus-vozdushnogo-filtra-281132s000";
  const oemNumber = "28113-2S000";

  assert.equal(
    isCollectorDirectProductUrl("megazip", megazipProductUrl, oemNumber),
    true,
    "collector should accept MegaZip product URLs emitted by the connector",
  );

  assert.equal(
    isDataEngineDirectProductUrl("megazip", megazipProductUrl, oemNumber),
    true,
    "data-engine should keep scraped MegaZip offers visible on read",
  );
}

void main();
