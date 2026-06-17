"use client";

import { Header } from "@/components/layout/header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { PartDetailHeader } from "@/components/parts/part-detail-header";
import { SupplierComparison } from "@/components/suppliers/supplier-comparison";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { usePartDetail, useVehicleLookup } from "@/hooks/use-api";

interface PartDetailPageClientProps {
  plate: string;
  partId: string;
}

export function PartDetailPageClient({ plate, partId }: PartDetailPageClientProps) {
  const { data: vehicleData, isLoading: vehicleLoading } = useVehicleLookup(plate);
  const { data: partData, isLoading: partLoading, error } = usePartDetail(partId);

  const isLoading = vehicleLoading || partLoading;

  return (
    <>
      <Header showSearchHint />
      <main className="flex-1">
        {isLoading && <LoadingSpinner label="טוען פרטי חלק..." />}
        {error && (
          <div className="mx-auto max-w-[1000px] px-6 py-12">
            <EmptyState icon="⚠️" title="חלק לא נמצא" subtitle={error.message} />
          </div>
        )}
        {vehicleData && partData && (
          <div className="mx-auto max-w-[1000px] px-6 py-6 animate-fade-in">
            <Breadcrumb
              items={[
                { label: "🏠 דף הבית", href: "/" },
                {
                  label: `${vehicleData.vehicle.makeHe} ${vehicleData.vehicle.model}`,
                  href: `/vehicle/${encodeURIComponent(plate)}`,
                },
                {
                  label: "קטלוג חלקים",
                  href: `/vehicle/${encodeURIComponent(plate)}/parts`,
                },
                { label: partData.part.nameHe },
              ]}
            />
            <PartDetailHeader part={partData.part} vehicle={vehicleData.vehicle} />
            <SupplierComparison partId={partId} plate={plate} />
          </div>
        )}
      </main>
    </>
  );
}
