export function normalizeMpn(raw: string): string {
  return raw.replace(/[-\s]/g, "").toUpperCase();
}

export function mpnsMatch(a: string, b: string): boolean {
  return normalizeMpn(a) === normalizeMpn(b);
}

export function buildPartAliases(oemNumber: string): Array<{ alias: string; aliasRaw: string }> {
  const aliases: Array<{ alias: string; aliasRaw: string }> = [];
  const normalized = normalizeMpn(oemNumber);

  if (normalized !== oemNumber) {
    aliases.push({ alias: normalized, aliasRaw: oemNumber });
  }

  const upper = oemNumber.toUpperCase();
  if (upper !== oemNumber) {
    const upperNorm = normalizeMpn(upper);
    if (upperNorm !== normalized) {
      aliases.push({ alias: upperNorm, aliasRaw: upper });
    }
  }

  return aliases;
}
