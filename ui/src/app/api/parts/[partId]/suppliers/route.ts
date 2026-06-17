import { NextResponse } from "next/server";
import { NotFoundError, getSupplierOffers } from "@partpilot/backend";
import type { SupplierType } from "@partpilot/backend";

type RouteParams = { params: Promise<{ partId: string }> };

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { partId } = await params;
    const { searchParams } = new URL(request.url);
    const filter = (searchParams.get("filter") ?? "all") as
      | "all"
      | SupplierType;
    const plate = searchParams.get("plate") ?? undefined;

    const result = await getSupplierOffers(partId, filter, { plate });
    return NextResponse.json({ offers: result.offers });
  } catch (e) {
    if (e instanceof NotFoundError) {
      return NextResponse.json({ error: e.message }, { status: 404 });
    }
    return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  }
}
