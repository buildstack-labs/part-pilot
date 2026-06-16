"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useSupplierOffers } from "@/hooks/use-api";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { SupplierOfferResponse } from "@/types/api";

interface SupplierComparisonProps {
  partId: string;
  plate: string;
}

type Filter = "all" | "local" | "international";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "הכל" },
  { value: "local", label: "🇮🇱 ישראל בלבד" },
  { value: "international", label: "🌍 חו״ל בלבד" },
];

function OfferRow({
  row,
  rank,
  isBest,
}: {
  row: SupplierOfferResponse;
  rank: number;
  isBest: boolean;
}) {
  const { offer, supplier, totalPrice } = row;
  const showTotal =
    offer.priceSource !== "on_site" && offer.price > 0 && totalPrice > offer.price;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3.5 rounded-[11px] border bg-white p-4 shadow-card transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] sm:flex-nowrap",
        isBest && "border-success border-[1.5px]",
      )}
    >
      <div
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EDF2F7] text-xs font-extrabold text-navy",
          isBest && "bg-[#FEFCBF] text-[#975A16]",
        )}
      >
        {rank}
      </div>
      <span className="shrink-0 text-xl">{supplier.flag}</span>
      <div className="min-w-0 flex-1">
        <div className="text-[15px] font-bold text-[#2D3748]">
          {isBest && (
            <span className="ml-1.5 rounded border border-[#9AE6B4] bg-[#F0FFF4] px-1.5 py-0.5 text-[10px] font-bold text-[#276749]">
              💰 מומלץ
            </span>
          )}
          {supplier.isAffiliate && (
            <span className="ml-1.5 rounded border border-[#BEE3F8] bg-[#EBF8FF] px-1.5 py-0.5 text-[10px] font-bold text-[#2B6CB0]">
              שותף
            </span>
          )}
          {supplier.nameHe}
        </div>
        <div className="text-xs text-muted">
          {supplier.country} · ⭐ {supplier.rating}
        </div>
        <div className="mt-0.5 text-xs text-muted">
          🚚 {supplier.deliveryDays} ימי עסקים
          {supplier.supportsPlateLookup && " · התאמה לפי מספר רישוי"}
          {offer.sourceType === "manual" && " · מחיר מאומת"}
          {offer.sourceType === "scraped" && " · מחיר מהאתר"}
        </div>
        {offer.priceNoteHe && (
          <div className="mt-1 text-[11px] text-[#975A16]">{offer.priceNoteHe}</div>
        )}
      </div>
      <div className="text-left">
        <div className="text-[22px] font-extrabold text-navy">
          {formatPrice(offer.price, offer.currency, offer.priceSource ?? "estimate")}
        </div>
        {offer.price > 0 && offer.shipping > 0 && (
          <div className="text-[11px] text-muted">
            + {formatPrice(offer.shipping, offer.currency)} משלוח
          </div>
        )}
        {offer.price > 0 && offer.shipping === 0 && supplier.type === "local" && (
          <div className="text-[11px] text-muted">✅ משלוח / איסוף לפי אתר</div>
        )}
        {showTotal && (
          <div className="text-[11px] text-muted">
            סה״כ: ~{formatPrice(totalPrice, offer.currency)}
          </div>
        )}
      </div>
      {offer.inStock ? (
        <a href={offer.url} target="_blank" rel="noopener noreferrer">
          <Button
            variant="navy"
            type="button"
            className="whitespace-nowrap px-4 py-2 text-[13px]"
          >
            לחנות →
          </Button>
        </a>
      ) : (
        <span className="text-xs font-semibold text-error">אזל מהמלאי</span>
      )}
    </div>
  );
}

function OfferSection({
  title,
  offers,
  bestRankOffset,
}: {
  title: string;
  offers: SupplierOfferResponse[];
  bestRankOffset: number;
}) {
  if (offers.length === 0) return null;
  return (
    <div className="mb-5">
      <h3 className="mb-2.5 text-sm font-bold text-navy">{title}</h3>
      <div className="flex flex-col gap-2.5">
        {offers.map((row, idx) => (
          <OfferRow
            key={row.offer.id}
            row={row}
            rank={bestRankOffset + idx + 1}
            isBest={bestRankOffset === 0 && idx === 0}
          />
        ))}
      </div>
    </div>
  );
}

export function SupplierComparison({ partId, plate }: SupplierComparisonProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const [tab, setTab] = useState<"suppliers" | "info">("suppliers");
  const { data, isLoading, error } = useSupplierOffers(partId, plate, filter);

  const affiliateOffers =
    data?.offers.filter((o) => o.supplier.isAffiliate) ?? [];
  const localOffers =
    data?.offers.filter((o) => !o.supplier.isAffiliate && o.supplier.type === "local") ??
    [];

  return (
    <>
      <div className="mb-4 flex gap-0.5 rounded-[9px] bg-[#EDF2F7] p-1">
        <button
          type="button"
          onClick={() => setTab("suppliers")}
          className={cn(
            "flex-1 rounded-md px-3.5 py-2 text-center text-[13px] font-semibold transition-all",
            tab === "suppliers"
              ? "bg-white text-navy shadow-card"
              : "text-muted",
          )}
        >
          🛒 ספקים ומחירים
        </button>
        <button
          type="button"
          onClick={() => setTab("info")}
          className={cn(
            "flex-1 rounded-md px-3.5 py-2 text-center text-[13px] font-semibold transition-all",
            tab === "info" ? "bg-white text-navy shadow-card" : "text-muted",
          )}
        >
          📖 מידע נוסף
        </button>
      </div>

      {tab === "suppliers" && (
        <div className="animate-fade-in">
          <div className="mb-3.5 flex flex-wrap gap-2">
            <span className="self-center text-[13px] text-muted">סנן:</span>
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className={cn(
                  "rounded-md border-[1.5px] px-3.5 py-1.5 text-[13px] font-semibold transition-all",
                  filter === f.value
                    ? "border-navy bg-[#EDF2F7] text-navy"
                    : "border-border bg-white text-muted",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {isLoading && <LoadingSpinner label="טוען הצעות ספקים..." />}
          {error && (
            <EmptyState icon="⚠️" title="שגיאה בטעינת ספקים" subtitle={error.message} />
          )}

          {data && data.offers.length === 0 && (
            <EmptyState
              icon="🔍"
              title="לא נמצאו ספקים"
              subtitle="נסה לשנות את הסינון"
            />
          )}

          {data && data.offers.length > 0 && (
            <>
              {filter === "all" ? (
                <>
                  <OfferSection
                    title="🌍 ספקים בינלאומיים (שותפים)"
                    offers={affiliateOffers}
                    bestRankOffset={0}
                  />
                  <OfferSection
                    title="🇮🇱 ספקים ישראליים"
                    offers={localOffers}
                    bestRankOffset={affiliateOffers.length}
                  />
                </>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {data.offers.map((row, idx) => (
                    <OfferRow
                      key={row.offer.id}
                      row={row}
                      rank={idx + 1}
                      isBest={idx === 0}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          <p className="mt-4 text-[11px] text-muted">
            מחירים מסומנים ב-~ הם משוערים — לחץ &quot;לחנות&quot; לאימות מחיר ומלאי באתר
            הספק. קישורים לספקים ישראליים משתמשים במספר הרישוי {plate} להתאמה.
          </p>
        </div>
      )}

      {tab === "info" && (
        <div className="animate-fade-in rounded-xl border border-border bg-white p-5">
          <div className="rounded-lg border border-orange bg-[#FFFBF5] px-3.5 py-3 text-[13px] text-[#744210]">
            ⚠️ תמיד בדוק תאימות עם מספר השילדה לפני הזמנה. מידע זה מסופק לצורך
            מידע בלבד.
          </div>
          <p className="mt-4 text-sm text-muted">
            תרשים אינטראקטיבי עם נקודות חמות — יתווסף בגרסה 1.0
          </p>
        </div>
      )}
    </>
  );
}
