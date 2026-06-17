import { DIFFICULTY_MAP } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { DifficultyLevel } from "@/types/api";

interface DifficultyBadgeProps {
  level: DifficultyLevel;
  className?: string;
}

export function DifficultyBadge({ level, className }: DifficultyBadgeProps) {
  const diff = DIFFICULTY_MAP[level];
  return (
    <span
      style={{ background: diff.bg, color: diff.color }}
      className={cn(
        "inline-block rounded-md px-2.5 py-0.5 text-[11px] font-semibold",
        className,
      )}
    >
      {diff.label}
    </span>
  );
}
