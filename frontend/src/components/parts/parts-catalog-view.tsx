"use client";

import { useState } from "react";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { CategoryGrid } from "@/components/parts/category-grid";
import { PartCard } from "@/components/parts/part-card";
import { CategorySupplierBrowse } from "@/components/parts/category-supplier-browse";
import { VehicleContextBar } from "@/components/vehicle/vehicle-context-bar";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { usePartsByCategory, usePartsCatalog, useVehicleLookup } from "@/hooks/use-api";
import type { PartCategoryId } from "@/types/api";

interface PartsCatalogViewProps {
  plate: string;
}

export function PartsCatalogView({ plate }: PartsCatalogViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<PartCategoryId>("filters");

  const { data: vehicleData } = useVehicleLookup(plate);
  const { data: catalog, isLoading: catalogLoading } = usePartsCatalog(plate);
  const { data: partsData, isLoading: partsLoading } = usePartsByCategory(
    plate,
    selectedCategory,
  );

  const vehicle = vehicleData?.vehicle;
  const selectedCat = catalog?.categories.find((c) => c.id === selectedCategory);

  if (catalogLoading || !vehicle) {
    return <LoadingSpinner label="טוען קטלוג..." />;
  }

  if (!catalog?.hasCatalog) {
    return (
      <div className="mx-auto max-w-[1000px] px-6 py-6 animate-fade-in">
        <Breadcrumb
          items={[
            { label: "🏠 דף הבית", href: "/" },
            {
              label: `${vehicle.makeHe} ${vehicle.model}`,
              href: `/vehicle/${encodeURIComponent(plate)}`,
            },
            { label: "קטלוג חלקים" },
          ]}
        />
        <VehicleContextBar vehicle={vehicle} />
        <EmptyState
          icon="📦"
          title="אין עדיין קטלוג חלקים לרכב זה"
          subtitle="הצגנו את פרטי הרכב מ-data.gov.il — קטלוג החלקים יתווסף בקרוב לדגמים נוספים."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1000px] px-6 py-6 animate-fade-in">
      <Breadcrumb
        items={[
          { label: "🏠 דף הבית", href: "/" },
          {
            label: `${vehicle.makeHe} ${vehicle.model}`,
            href: `/vehicle/${encodeURIComponent(plate)}`,
          },
          { label: "קטלוג חלקים" },
        ]}
      />

      <VehicleContextBar vehicle={vehicle} />

      {catalog.catalogTier === "maintenance_generic" && (
        <div className="mb-4 rounded-lg border border-orange bg-[#FFFBF5] px-4 py-3 text-[13px] text-[#744210]">
          ℹ️ קטלוג תחזוקה כללי ל{vehicle.makeHe} {vehicle.model} {vehicle.year} — מספרי
          OEM לדוגמה. השווה מחירים בחנויות וודא התאמה לפי מספר רישוי / VIN לפני
          הזמנה.
        </div>
      )}

      <div className="mb-3.5 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-extrabold text-navy">
          קטגוריות חלקים
          <span className="rounded-[10px] bg-[#EDF2F7] px-2 py-0.5 text-[13px] font-medium text-muted">
            {catalog.categories.length} קטגוריות
          </span>
        </h2>
      </div>

      <CategoryGrid
        categories={catalog.categories}
        selectedId={selectedCategory}
        onSelect={(id) => setSelectedCategory(id as PartCategoryId)}
      />

      {selectedCat && (
        <>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-extrabold text-navy">
            {selectedCat.nameHe}
            <span className="rounded-[10px] bg-[#EDF2F7] px-2 py-0.5 text-[13px] font-medium text-muted">
              {selectedCat.partCount} חלקים
            </span>
          </h2>

          {partsLoading ? (
            <LoadingSpinner />
          ) : !selectedCat.hasSeededParts || (partsData?.parts.length ?? 0) === 0 ? (
            <CategorySupplierBrowse category={selectedCat} />
          ) : (
            <div className="flex flex-col gap-2.5">
              {partsData!.parts.map((part) => (
                <PartCard key={part.id} part={part} plate={plate} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
