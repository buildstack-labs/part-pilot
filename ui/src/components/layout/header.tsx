"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  showSearchHint?: boolean;
}

export function Header({ showSearchHint = false }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex h-[60px] items-center justify-between bg-navy px-6 shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
      <Link href="/" className="flex items-center gap-2.5">
        <div className="flex h-[34px] w-[34px] items-center justify-center rounded-lg bg-orange text-lg">
          🔩
        </div>
        <div>
          <div className="text-xl font-extrabold tracking-tight text-white">
            PartPilot
          </div>
          <div className="mt-[-2px] text-[10px] font-normal text-orange">
            חלקי רכב ישראלי
          </div>
        </div>
      </Link>

      {showSearchHint && (
        <Link
          href="/"
          className="mx-6 flex max-w-[380px] flex-1 cursor-pointer items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 transition-colors hover:bg-white/15"
        >
          <span className="text-white/50">🔍</span>
          <span className="text-sm text-white/60">חיפוש לפי לוחית...</span>
        </Link>
      )}

      <div className="flex items-center gap-3">
        <Button variant="ghost" type="button" disabled title="בקרוב">
          התחברות
        </Button>
      </div>
    </header>
  );
}
