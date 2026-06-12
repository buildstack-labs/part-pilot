"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { plateSchema, type PlateFormValues } from "@/schemas/plate.schema";
import { useSearchStore } from "@/stores/search-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

interface HeroSearchProps {
  defaultPlate?: string;
}

/** React Hook Form + Zod — validated license plate search with Hebrew error messages. */
export function HeroSearch({ defaultPlate = "" }: HeroSearchProps) {
  const router = useRouter();
  const { recentPlates, addRecentPlate } = useSearchStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PlateFormValues>({
    resolver: zodResolver(plateSchema),
    defaultValues: { plate: defaultPlate },
  });

  const onSubmit = async (data: PlateFormValues) => {
    addRecentPlate(data.plate.trim());
    router.push(`/vehicle/${encodeURIComponent(data.plate.trim())}`);
  };

  return (
    <section className="relative flex flex-1 flex-col justify-center overflow-hidden bg-gradient-to-br from-navy via-[#2d5f9e] to-[#1a3050] px-6 pb-28 pt-20 text-center">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10">
        <h1 className="mb-3 text-4xl font-black leading-tight text-white md:text-[40px]">
          מצא חלקים <span className="text-orange">בדיוק</span> לרכב שלך
        </h1>
        <p className="mb-10 text-base font-normal text-white/65">
          הזן מספר לוחית וקבל קטלוג חלקי OEM, מספרי יצרן והשוואת מחירים
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative z-10 mx-auto max-w-[560px] rounded-[14px] bg-white p-5 text-right shadow-card-lg"
        >
          <label htmlFor="plate" className="mb-2.5 block text-[13px] font-semibold text-muted">
            מספר לוחית רכב
          </label>
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <input
              id="plate"
              {...register("plate")}
              placeholder="12-345-67"
              maxLength={10}
              dir="ltr"
              autoFocus
              className={cn(
                "flex-1 rounded-[10px] border-2 bg-surface px-4 py-3.5 text-center text-[22px] font-bold tracking-[3px] text-navy outline-none transition-colors focus:border-orange focus:bg-white",
                errors.plate ? "border-error" : "border-border",
              )}
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="whitespace-nowrap px-7 py-3.5 text-base shadow-[0_4px_12px_rgba(246,173,85,0.35)]"
            >
              {isSubmitting ? "מחפש..." : "מצא חלקים"}
            </Button>
          </div>

          {errors.plate && (
            <p className="mt-2.5 text-center text-[13px] font-medium text-error" role="alert">
              ⚠️ {errors.plate.message}
            </p>
          )}

          {recentPlates.length > 0 && (
            <div className="mt-3.5 flex flex-wrap justify-center gap-2">
              <span className="self-center text-xs text-[#A0AEC0]">חיפושים אחרונים:</span>
              {recentPlates.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setValue("plate", p);
                    router.push(`/vehicle/${encodeURIComponent(p)}`);
                  }}
                  className="rounded-md bg-[#EDF2F7] px-2.5 py-1 text-xs font-semibold tracking-wide text-navy transition-colors hover:bg-[#E2E8F0]"
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
