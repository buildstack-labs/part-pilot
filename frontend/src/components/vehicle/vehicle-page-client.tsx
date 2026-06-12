"use client";

import { Header } from "@/components/layout/header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { VehicleDetailGrid } from "@/components/vehicle/vehicle-detail-grid";
import { VehicleSummaryCard } from "@/components/vehicle/vehicle-summary-card";
import { useVehicleLookup } from "@/hooks/use-api";
import { useSearchStore } from "@/stores/search-store";
import { useEffect } from "react";

interface VehiclePageClientProps {
  plate: string;
}

export function VehiclePageClient({ plate }: VehiclePageClientProps) {
  const { data, isLoading, error } = useVehicleLookup(plate);
  const addRecentPlate = useSearchStore((s) => s.addRecentPlate);

  useEffect(() => {
    if (data?.vehicle) addRecentPlate(data.vehicle.plate);
  }, [data, addRecentPlate]);

  return (
    <>
      <Header showSearchHint />
      <main className="flex-1">
        {isLoading && <LoadingSpinner label="מאתר רכב..." />}
        {error && (
          <div className="mx-auto max-w-[1000px] px-6 py-12">
            <EmptyState icon="⚠️" title="רכב לא נמצא" subtitle={error.message} />
          </div>
        )}
        {data && (
          <div className="mx-auto max-w-[1000px] px-6 py-6 animate-fade-in">
            <Breadcrumb
              items={[
                { label: "🏠 דף הבית", href: "/" },
                { label: `${data.vehicle.makeHe} ${data.vehicle.model} ${data.vehicle.year}` },
              ]}
            />
            <VehicleSummaryCard vehicle={data.vehicle} />
            <VehicleDetailGrid vehicle={data.vehicle} showPremium />
            <div className="mt-3.5 flex items-center gap-2 rounded-[10px] border border-[#90CDF4] bg-[#EBF8FF] px-4 py-3 text-[13px] text-[#2C5282]">
              ✅ נתוני הרכב נטענו מ-<strong>data.gov.il</strong> — מאגר רשות
              הרישוי הישראלית. המידע עדכני ורשמי.
            </div>
          </div>
        )}
      </main>
    </>
  );
}
