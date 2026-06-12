import type { DifficultyLevel } from "@/types/api";

export const DIFFICULTY_MAP: Record<
  DifficultyLevel,
  { label: string; color: string; bg: string }
> = {
  beginner: { label: "קל — מתחיל", color: "#48BB78", bg: "#F0FFF4" },
  intermediate: { label: "בינוני", color: "#F6AD55", bg: "#FFFAF0" },
  professional: { label: "מקצועי — מוסך", color: "#F56565", bg: "#FFF5F5" },
};

export function formatPrice(amount: number, currency = "ILS"): string {
  if (currency === "ILS") return `${Math.round(amount)}₪`;
  return `${amount} ${currency}`;
}
