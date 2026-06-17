import { plateToDigits } from "../utils/plate";
import type { Part, Vehicle } from "../types";

export interface OfferLinkContext {
  oemNumber: string;
  partNameEn: string;
  partNameHe: string;
  plate?: string;
  plateDigits?: string;
  make?: string;
  makeHe?: string;
  model?: string;
  year?: number;
  vin?: string;
}

export function buildOfferLinkContext(
  part: Part,
  vehicle: Vehicle | null,
  plate?: string,
): OfferLinkContext {
  const resolvedPlate = plate ?? vehicle?.plate;
  const digits = resolvedPlate ? plateToDigits(resolvedPlate) : null;
  return {
    oemNumber: part.oemNumber,
    partNameEn: part.nameEn,
    partNameHe: part.nameHe,
    plate: resolvedPlate,
    plateDigits: digits != null ? String(digits) : undefined,
    make: vehicle?.make,
    makeHe: vehicle?.makeHe,
    model: vehicle?.model,
    year: vehicle?.year,
    vin: vehicle?.vin,
  };
}

function stripOemDashes(oem: string): string {
  return oem.replace(/-/g, "").toUpperCase();
}

function encodeQ(value: string): string {
  return encodeURIComponent(value);
}

/** Build a deep-link search URL for a supplier + part (+ vehicle when available). */
export function buildSupplierOfferUrl(
  supplierId: string,
  ctx: OfferLinkContext,
): string {
  const oemCompact = stripOemDashes(ctx.oemNumber);
  const oemEncoded = encodeQ(ctx.oemNumber);
  const plateDigits = ctx.plateDigits ?? "";

  switch (supplierId) {
    case "partsouq":
      return `https://partsouq.com/en/search/all?q=${encodeQ(oemCompact)}`;

    case "amayama":
      return `https://www.amayama.com/en/parts/?q=${encodeQ(oemCompact)}`;

    case "impex-jp":
      return `https://en.impex-jp.com/?q=${encodeQ(oemCompact)}`;

    case "megazip":
      return `https://www.megazip.net/search?q=${encodeQ(oemCompact)}`;

    case "sparekorea":
      return `https://www.sparekorea.com/product/parts?no=${encodeQ(oemCompact)}&name=&manufacturer=A&model=A`;

    case "rockauto": {
      const make = (ctx.make ?? "hyundai").toLowerCase();
      return `https://www.rockauto.com/en/partsearch/?partnum=${oemEncoded}&mfr=${encodeQ(make)}`;
    }

    case "il-motory":
      if (plateDigits) {
        return `https://starter.co.il/?plate=${encodeQ(plateDigits)}&q=${encodeQ(oemCompact)}`;
      }
      return `https://starter.co.il/search?q=${encodeQ(oemCompact)}`;

    case "il-yaam":
      if (plateDigits) {
        return `https://yaam.co.il/?plate=${encodeQ(plateDigits)}&search=${encodeQ(oemCompact)}`;
      }
      return `https://yaam.co.il/?search=${encodeQ(oemCompact)}`;

    case "il-abparts":
      if (plateDigits) {
        return `https://abparts.shop/search?q=${encodeQ(`${plateDigits} ${ctx.oemNumber}`)}`;
      }
      return `https://abparts.shop/search?q=${encodeQ(ctx.oemNumber)}`;

    case "il-nivos":
      if (plateDigits) {
        return `https://nivos.co.il/shop/?s=${encodeQ(`${ctx.oemNumber} ${plateDigits}`)}`;
      }
      return `https://nivos.co.il/shop/?s=${encodeQ(ctx.oemNumber)}`;

    default:
      return `https://www.google.com/search?q=${encodeQ(`${ctx.oemNumber} ${ctx.partNameEn}`)}`;
  }
}
