import { NextResponse } from "next/server";
import { PART_CATEGORIES } from "@partpilot/data-engine";

export async function GET() {
  return NextResponse.json({ categories: PART_CATEGORIES });
}
