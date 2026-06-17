"use client";

import Image from "next/image";
import { DifficultyBadge } from "@/components/ui/difficulty-badge";
import type { PartDto, VehicleDto } from "@/types/api";

interface PartDetailHeaderProps {
  part: PartDto;
  vehicle: VehicleDto;
}

function PartImagePlaceholder() {
  return (
    <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-[#EDF2F7] text-4xl">
      🔩
    </div>
  );
}

export function PartDetailHeader({ part, vehicle }: PartDetailHeaderProps) {
  return (
    <div className="mb-5 rounded-[14px] border border-border bg-white p-6 shadow-card animate-slide-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        {part.imageUrl ? (
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#EDF2F7]">
            <Image src={part.imageUrl} alt="" fill className="object-contain p-2" />
          </div>
        ) : (
          <PartImagePlaceholder />
        )}
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2.5">
            <span
              dir="ltr"
              className="rounded-md bg-[#EDF2F7] px-3 py-1 text-[13px] font-bold text-navy"
            >
              {part.oemNumber}
            </span>
            <span className="text-xs text-muted">מספר OEM מקורי</span>
          </div>
          <h1 className="mb-1 text-[26px] font-extrabold text-navy">{part.nameHe}</h1>
          <p className="mb-3 text-sm text-muted">{part.nameEn}</p>
          <p className="mb-3.5 rounded-lg bg-surface px-3.5 py-3 text-sm leading-relaxed text-[#2D3748]">
            📋 {part.description}
          </p>
          <div className="flex flex-wrap gap-2">
            <DifficultyBadge level={part.difficulty} className="text-xs px-2.5 py-1" />
            <span className="rounded-md bg-[#EBF8FF] px-2.5 py-1 text-xs font-semibold text-[#2B6CB0]">
              🚗 {vehicle.makeHe} {vehicle.model} {vehicle.year}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
