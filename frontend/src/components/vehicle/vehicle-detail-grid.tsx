import type { VehicleDto } from "@/types/api";

interface SpecRowProps {
  label: string;
  value: React.ReactNode;
  dir?: "ltr" | "rtl";
}

function SpecRow({ label, value, dir = "rtl" }: SpecRowProps) {
  return (
    <div className="flex items-start gap-3 border-b border-[#EDF2F7] py-2">
      <div className="w-40 shrink-0 text-right text-[13px] text-muted">{label}</div>
      <div
        className="flex-1 text-sm font-semibold text-[#2D3748]"
        dir={dir}
      >
        {value}
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-1 mt-2 border-b-2 border-border pb-1.5 pt-3.5 text-base font-extrabold text-navy">
      {children}
    </div>
  );
}

function yesNo(val: string) {
  if (val === "כן")
    return <span className="font-bold text-[#276749]">✓ כן</span>;
  if (val === "לא")
    return <span className="font-semibold text-[#9B2C2C]">✗ לא</span>;
  return <span className="font-semibold">{val}</span>;
}

interface VehicleDetailGridProps {
  vehicle: VehicleDto;
  /** MVP: always true. Later: gate premium section behind auth/subscription. */
  showPremium?: boolean;
}

export function VehicleDetailGrid({
  vehicle,
  showPremium = true,
}: VehicleDetailGridProps) {
  const s = vehicle.specs;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="rounded-[14px] border border-border bg-white p-5 shadow-card">
        <SectionTitle>פרטי רכב</SectionTitle>
        <SpecRow
          label="מספר רכב"
          value={
            <span className="tracking-wide" dir="ltr">
              {vehicle.plate}
            </span>
          }
        />
        <SpecRow label="יצרן" value={vehicle.makeHe} />
        <SpecRow label="דגם" value={vehicle.model} />
        <SpecRow label="תת דגם" value={vehicle.trim} />
        <SpecRow label="שנת עלייה לכביש" value={vehicle.year} />
        <SpecRow label="תוצרת" value={vehicle.origin || "—"} />
        <SpecRow
          label="מספר שלדה"
          value={
            <span className="text-xs tracking-wide" dir="ltr">
              {vehicle.vin}
            </span>
          }
        />
        <SpecRow label="תאריך טסט אחרון" value={vehicle.lastTest} />
        <SpecRow label="תוקף רישיון" value={vehicle.licenseExpiry} />
        <SpecRow label="צבע" value={vehicle.color} />
        <SpecRow label="אגרת רכב" value={`${vehicle.annualFee} ₪`} />
      </div>

      <div className="rounded-[14px] border border-border bg-white p-5 shadow-card">
        <SectionTitle>מידע נוסף</SectionTitle>
        <SpecRow label="הספק מרבי" value={s.power} />
        <SpecRow label="נפח מנוע" value={s.engineCC} />
        <SpecRow label="סוג מנוע" value={s.fuelType} />
        <SpecRow label="גיר" value={s.gearbox} />
        <SpecRow
          label="קוד משרד התחבורה"
          value={<span dir="ltr">{s.transportCode}</span>}
        />
        <SpecRow label="הוראת רישום" value={s.registrationNote} />
        <SpecRow
          label="מידות צמיג קדמי"
          value={<span dir="ltr">{s.tireFront}</span>}
        />
        <SpecRow
          label="מידות צמיג אחורי"
          value={<span dir="ltr">{s.tireRear}</span>}
        />
        <SpecRow label="הנעה" value={<span dir="ltr">{s.driveType}</span>} />
        <SpecRow label="סוג הנעה" value={s.driveNote} />
        <SpecRow label="כריות אוויר" value={s.airbags} />
        <SpecRow label="חלונות חשמל" value={s.electricWindows} />
        <SpecRow label="מספר דלתות" value={s.doors} />
        <SpecRow label="מרכב" value={s.bodyType} />
        <SpecRow
          label="חלון שמש"
          value={yesNo(s.sunroof === "לא" ? "לא" : s.sunroof === "כן" ? "כן" : s.sunroof)}
        />
        <SpecRow label="בקרת יציבות" value={yesNo(s.stabilityControl)} />
        <SpecRow label="מערכת ABS" value={yesNo(s.abs)} />
        <SpecRow label="הגה כוח" value={yesNo(s.powerSteering)} />
        <SpecRow label="גלגלי סגסוגת קלה" value={yesNo(s.alloyWheels)} />

        {/* Premium section — free in MVP; structure ready for future gating */}
        <div
          className={
            showPremium
              ? ""
              : "pointer-events-none select-none opacity-50 blur-[1px]"
          }
          data-premium-section
        >
          <SectionTitle>
            דוח מתקדם
            {!showPremium && (
              <span className="mr-2 text-xs font-normal text-orange">🔒 Premium</span>
            )}
          </SectionTitle>
          <SpecRow label="בקרת סטיה מנתיבים" value={yesNo(s.laneAssist)} />
          <SpecRow label="בקרת שיוט אדפטיבית" value={yesNo(s.adaptiveCruise)} />
          <SpecRow label="קבוצת זיהום" value={s.pollutionGroup} />
        </div>
      </div>
    </div>
  );
}
