import { NextResponse } from "next/server";
import { NotFoundError, getPartById } from "@partpilot/backend";
import { getPartImage } from "@/lib/category-assets";

type RouteParams = { params: Promise<{ partId: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { partId } = await params;
    const part = getPartById(partId);
    if (!part) {
      return NextResponse.json({ error: "חלק לא נמצא" }, { status: 404 });
    }
    return NextResponse.json({
      part: { ...part, imageUrl: getPartImage(part.imageKey) },
    });
  } catch (e) {
    if (e instanceof NotFoundError) {
      return NextResponse.json({ error: e.message }, { status: 404 });
    }
    return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  }
}
