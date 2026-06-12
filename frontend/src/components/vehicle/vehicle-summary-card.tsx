import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { VehicleDto } from "@/types/api";

interface VehicleSummaryCardProps {
  vehicle: VehicleDto;
}

export function VehicleSummaryCard({ vehicle }: VehicleSummaryCardProps) {
  return (
    <div className="mb-5 overflow-hidden rounded-[14px] border border-border bg-white shadow-card">
      <div className="flex items-center justify-between bg-gradient-to-br from-navy to-navy-light px-6 py-5">
        <div>
          <div className="text-[13px] text-white/60">{vehicle.makeHe}</div>
          <div className="text-[26px] font-extrabold leading-tight text-white">
            {vehicle.makeHe} {vehicle.model}
          </div>
          <div className="mt-0.5 text-[15px] font-semibold text-orange">
            {vehicle.year} · {vehicle.trim}
          </div>
        </div>
        <div className="min-w-[110px] rounded-lg bg-white px-3.5 py-2 text-center">
          <div className="text-[9px] font-semibold uppercase tracking-wide text-muted">
            🇮🇱 Israel
          </div>
          <div
            dir="ltr"
            className="text-[17px] font-extrabold tracking-[2px] text-navy"
          >
            {vehicle.plate}
          </div>
        </div>
      </div>
      <div className="flex gap-2.5 bg-surface px-6 py-4">
        {vehicle.hasPartsCatalog ? (
          <Link href={`/vehicle/${encodeURIComponent(vehicle.plate)}/parts`}>
            <Button type="button">🔧 צפה בחלקים מתאימים</Button>
          </Link>
        ) : (
          <Button type="button" disabled title="אין קטלוג חלקים לדגם זה">
            🔧 אין קטלוג חלקים
          </Button>
        )}
        <Button variant="secondary" type="button" disabled title="בקרוב">
          💾 שמור לגראז׳
        </Button>
      </div>
    </div>
  );
}
