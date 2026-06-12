/** Normalize Israeli license plate input to dashed canonical form. */
export function normalizePlate(raw: string): string[] {
  const trimmed = raw.trim().toUpperCase().replace(/\s+/g, "");
  if (!trimmed) return [];

  const candidates = new Set<string>();
  candidates.add(trimmed);

  const digits = trimmed.replace(/-/g, "");
  if (digits.length === 7) {
    candidates.add(`${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5, 7)}`);
  }
  if (digits.length === 8) {
    candidates.add(`${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 8)}`);
  }

  return [...candidates];
}

export function isValidPlateFormat(raw: string): boolean {
  const digits = raw.trim().replace(/-/g, "");
  return /^[0-9]{7,8}$/.test(digits);
}

/** Format numeric plate from gov.il (mispar_rechev) to dashed display form */
export function formatPlateFromDigits(digits: string | number): string {
  const d = String(digits).replace(/\D/g, "");
  if (d.length === 7) {
    return `${d.slice(0, 2)}-${d.slice(2, 5)}-${d.slice(5, 7)}`;
  }
  if (d.length === 8) {
    return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5, 8)}`;
  }
  return d;
}

/** Extract numeric plate for gov.il API filters */
export function plateToDigits(raw: string): number | null {
  const digits = raw.trim().replace(/-/g, "");
  if (!/^[0-9]{7,8}$/.test(digits)) return null;
  return Number.parseInt(digits, 10);
}
