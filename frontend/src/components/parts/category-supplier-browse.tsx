"use client";

import { Button } from "@/components/ui/button";
import type { PartCategoryDto } from "@/types/api";

interface CategorySupplierBrowseProps {
  category: PartCategoryDto;
}

export function CategorySupplierBrowse({ category }: CategorySupplierBrowseProps) {
  const links = category.browseLinks ?? [];
  if (links.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-white p-5 shadow-card">
      <h3 className="mb-1 text-base font-bold text-navy">
        חפש {category.nameHe} אצל ספקים
      </h3>
      <p className="mb-4 text-sm text-muted">
        אין עדיין חלקים עם מספר OEM בקטגוריה זו — פתח חיפוש מותאם לרכב שלך
        אצל הספקים:
      </p>
      <div className="flex flex-col gap-2">
        {links.map((link) => (
          <a
            key={link.supplierId}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="secondary"
              type="button"
              className="w-full justify-between text-[13px]"
            >
              <span>{link.nameHe}</span>
              <span>חפש →</span>
            </Button>
          </a>
        ))}
      </div>
    </div>
  );
}
