import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SearchState {
  recentPlates: string[];
  addRecentPlate: (plate: string) => void;
  clearRecent: () => void;
}

/** Zustand — lightweight client state for recent plate searches (persisted locally). */
export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      recentPlates: [],
      addRecentPlate: (plate) => {
        const normalized = plate.trim();
        const next = [
          normalized,
          ...get().recentPlates.filter((p) => p !== normalized),
        ].slice(0, 5);
        set({ recentPlates: next });
      },
      clearRecent: () => set({ recentPlates: [] }),
    }),
    { name: "partpilot-recent-searches" },
  ),
);
