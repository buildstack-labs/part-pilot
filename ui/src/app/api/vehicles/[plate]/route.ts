import { NextResponse } from "next/server";
import { NotFoundError, lookupVehicleByPlate, toVehicleDto } from "@partpilot/backend";

type RouteParams = { params: Promise<{ plate: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { plate } = await params;
    const decoded = decodeURIComponent(plate);
    const result = await lookupVehicleByPlate(decoded);
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
