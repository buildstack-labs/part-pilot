import Link from "next/link";
import type { VehicleDto } from "@/types/api";

interface VehicleContextBarProps {
  vehicle: VehicleDto;
}

export function VehicleContextBar({ vehicle }: VehicleContextBarProps) {
  return (
    <div className="mb-5 flex items-center gap-3 rounded-[10px] border border-border bg-white px-4 py-3 shadow-card">
      <span className="text-xl" aria-hidden>
        🚗
      </span>
      <div className="flex-1">
        <div className="text-sm font-bold text-navy">
          {vehicle.makeHe} {vehicle.model} {vehicle.trim} · {vehicle.year}
        </div>
        <div className="text-xs text-muted">
          {vehicle.engine} · לוחית {vehicle.plate}
        </div>
      </div>
      <Link
        href="/"
        className="rounded-md border border-border px-3 py-1 text-xs font-semibold text-[#4A5568] transition-colors hover:bg-surface"
      >
        שנה רכב
      </Link>
    </div>
  );
}
