import { NextResponse } from "next/server";
import { NotFoundError, getPartsByCategory } from "@partpilot/data-engine";
import type { PartCategoryId } from "@partpilot/data-engine";
import { getPartImage } from "@/lib/category-assets";

type RouteParams = { params: Promise<{ plate: string; category: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { plate, category } = await params;
    const parts = (
      await getPartsByCategory(
        decodeURIComponent(plate),
        category as PartCategoryId,
      )
    ).map((p) => ({
      ...p,
      imageUrl: getPartImage(p.imageKey),
    }));
    return NextResponse.json({ parts });
  } catch (e) {
    if (e instanceof NotFoundError) {
      return NextResponse.json({ error: e.message }, { status: 404 });
    }
    return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  }
}
