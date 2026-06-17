import { NextResponse } from "next/server";
import {
  NotFoundError,
  listSupportedVehicles,
  lookupVehicleByPlate,
  toVehicleDto,
  PARTS,
  SUPPLIERS,
} from "@partpilot/data-engine";

export async function GET() {
  const vehicles = listSupportedVehicles().map(toVehicleDto);
  return NextResponse.json({
    vehicles,
    stats: {
      models: vehicles.length,
      parts: PARTS.length,
      suppliers: SUPPLIERS.length,
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { plate?: string };
    if (!body.plate) {
      return NextResponse.json({ error: "נא להזין מספר לוחית" }, { status: 400 });
    }
    const result = await lookupVehicleByPlate(body.plate);
    return NextResponse.json({
      vehicle: toVehicleDto(result.vehicle),
      source: result.source,
      cached: result.cached,
    });
  } catch (e) {
    if (e instanceof NotFoundError) {
      return NextResponse.json({ error: e.message }, { status: 404 });
    }
    return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  }
}
