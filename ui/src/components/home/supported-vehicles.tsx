import Link from "next/link";
import type { VehicleDto } from "@/types/api";

interface SupportedVehiclesProps {
  vehicles: VehicleDto[];
}

export function SupportedVehicles({ vehicles }: SupportedVehiclesProps) {
  return (
    <div className="mx-auto max-w-[1000px] px-6 py-6">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-extrabold text-navy">
        רכבים נתמכים
        <span className="rounded-[10px] bg-[#EDF2F7] px-2 py-0.5 text-[13px] font-medium text-muted">
          MVP
        </span>
      </h2>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3">
        {vehicles.map((v) => (
          <Link
            key={v.plate}
            href={`/vehicle/${encodeURIComponent(v.plate)}`}
            className="rounded-xl border border-border bg-white p-3.5 shadow-card transition-shadow hover:shadow-md"
          >
            <div className="mb-0.5 text-[11px] font-semibold text-muted">{v.makeHe}</div>
            <div className="text-base font-extrabold text-navy">
              {v.makeHe} {v.model}
            </div>
            <div className="text-[13px] text-muted">
              {v.year} · {v.engine}
            </div>
            <div
              dir="ltr"
              className="mt-1.5 inline-block rounded-[5px] bg-[#EDF2F7] px-2 py-0.5 text-[11px] font-semibold tracking-wide text-navy"
            >
              {v.plate}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
