import { NextResponse } from "next/server";
import { NotFoundError, getPartsCatalog } from "@partpilot/backend";

type RouteParams = { params: Promise<{ plate: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { plate } = await params;
    const catalog = getPartsCatalog(decodeURIComponent(plate));
    return NextResponse.json(catalog);
  } catch (e) {
    if (e instanceof NotFoundError) {
      return NextResponse.json({ error: e.message }, { status: 404 });
    }
    return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  }
}
