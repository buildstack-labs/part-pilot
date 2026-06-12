"use client";

import Image from "next/image";
import { getCategoryImage } from "@/lib/category-assets";
import { cn } from "@/lib/cn";
import type { PartCategoryDto } from "@/types/api";

interface CategoryGridProps {
  categories: PartCategoryDto[];
  selectedId: string;
  onSelect: (id: string) => void;
}

function CategoryPlaceholder() {
  return (
    <div className="flex h-[60px] w-[60px] items-center justify-center rounded-lg bg-[#EDF2F7] text-2xl text-muted">
      🔩
    </div>
  );
}

export function CategoryGrid({
  categories,
  selectedId,
  onSelect,
}: CategoryGridProps) {
  return (
    <div className="mb-7 grid grid-cols-1 overflow-hidden rounded-xl border border-border bg-white shadow-card sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((cat, index) => {
        const imagePath = getCategoryImage(cat.id);
        const isActive = selectedId === cat.id;

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat.id)}
            className={cn(
              "relative flex items-start gap-3.5 border-b border-l border-border p-4 text-right transition-colors hover:bg-surface",
              isActive && "bg-[#FFFBF5]",
              "lg:[&:nth-child(3n)]:border-l-0 lg:[&:nth-last-child(-n+3)]:border-b-0",
              "sm:[&:nth-child(2n)]:border-l-0 sm:[&:nth-last-child(-n+2)]:border-b-0",
              index === categories.length - 1 && "border-b-0",
            )}
          >
            {isActive && (
              <span className="absolute bottom-0 right-0 top-0 w-[3px] rounded-l bg-orange" />
            )}
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg">
              {imagePath ? (
                <Image
                  src={imagePath}
                  alt=""
                  width={64}
                  height={64}
                  className="h-[60px] w-[60px] object-contain"
                />
              ) : (
                <CategoryPlaceholder />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-extrabold text-navy">{cat.nameHe}</div>
              <div className="mb-1.5 text-[11px] font-medium text-muted">{cat.nameEn}</div>
              <div className="flex flex-col gap-px">
                {cat.subcats.slice(0, 3).map((s) => (
                  <span key={s} className="text-xs leading-snug text-[#4A5568]">
                    {s}
                  </span>
                ))}
                {cat.subcats.length > 3 && (
                  <span className="mt-0.5 text-[11px] text-[#A0AEC0]">
                    ... עוד {cat.subcats.length - 3}
                  </span>
                )}
              </div>
              {!cat.hasSeededParts && (
                <span className="mt-1 inline-block text-[10px] font-semibold text-orange">
                  בקרוב
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
