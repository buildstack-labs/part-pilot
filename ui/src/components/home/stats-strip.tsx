interface StatsStripProps {
  models: number;
  parts: number;
  suppliers: number;
}

export function StatsStrip({ models, parts, suppliers }: StatsStripProps) {
  const stats = [
    { num: String(models), label: "דגמי רכב" },
    { num: String(parts), label: "חלקים קטלוג" },
    { num: String(suppliers), label: "ספקים" },
    { num: "חינם", label: "גישה למידע" },
  ];

  return (
    <div className="flex justify-center gap-12 border-b border-border bg-white px-6 py-4">
      {stats.map((s) => (
        <div key={s.label} className="text-center">
          <div className="text-[22px] font-extrabold text-navy">{s.num}</div>
          <div className="mt-0.5 text-xs text-muted">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
