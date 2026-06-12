"use client";

import Image from "next/image";
import Link from "next/link";
import { DifficultyBadge } from "@/components/ui/difficulty-badge";
import type { PartDto } from "@/types/api";

interface PartCardProps {
  part: PartDto;
  plate: string;
}

function PartImagePlaceholder() {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-[#EDF2F7] text-xl">
      🔩
    </div>
  );
}

export function PartCard({ part, plate }: PartCardProps) {
  return (
    <Link
      href={`/vehicle/${encodeURIComponent(plate)}/parts/${part.id}`}
      className="group flex cursor-pointer items-center gap-3.5 rounded-[11px] border border-border bg-white p-4 shadow-card transition-all duration-150 hover:border-orange hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
    >
      {part.imageUrl ? (
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-[10px] bg-[#EDF2F7]">
          <Image
            src={part.imageUrl}
            alt=""
            fill
            className="object-contain p-1"
            sizes="44px"
          />
        </div>
      ) : (
        <PartImagePlaceholder />
      )}
      <div className="min-w-0 flex-1">
        <div className="text-[15px] font-bold text-[#2D3748]">{part.nameHe}</div>
        <div className="mt-px text-xs text-muted">{part.nameEn}</div>
        <div
          dir="ltr"
          className="mt-1 inline-block rounded-[5px] bg-[#EDF2F7] px-2 py-0.5 text-[11px] font-semibold text-navy"
        >
          {part.oemNumber}
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <DifficultyBadge level={part.difficulty} />
        <span className="text-base text-muted transition-transform group-hover:-translate-x-0.5">
          ←
        </span>
      </div>
    </Link>
  );
}
