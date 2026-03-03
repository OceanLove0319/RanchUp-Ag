export function isPerAcreUnit(unit: string): boolean {
  if (!unit) return false;
  // match pattern */ac case-insensitive and handle spaces
  const normalized = unit.toLowerCase().replace(/\s/g, '');
  return normalized.endsWith('/ac');
}

export function getBaseUnit(unit: string): string {
  if (!unit) return '';
  const normalized = unit.toLowerCase().replace(/\s/g, '');
  if (normalized.endsWith('/ac')) {
    return normalized.substring(0, normalized.length - 3);
  }
  return unit;
}

export function normalizeUnit(u: string): { base: "GAL" | "LB" | "OZ" | "TON" | "ACRE" | "HRS" | "USD_AC" | "UNKNOWN"; multiplier?: number } {
  if (!u) return { base: "UNKNOWN" };
  const str = u.toUpperCase().replace(/\s/g, '');
  
  if (str === "HRS" || str === "HR") return { base: "HRS" };
  if (str === "$/AC") return { base: "USD_AC" };
  if (str === "ACRE" || str === "ACRES") return { base: "ACRE" };
  if (str === "TON" || str === "TONS") return { base: "TON" };
  
  // Strip /AC suffix for base comparison
  let baseStr = str;
  if (str.endsWith('/AC')) {
    baseStr = str.substring(0, str.length - 3);
  }

  // Handle pack sizes
  const packMatch = baseStr.match(/^([\d\.]+)(GAL|LB|OZ)$/);
  if (packMatch) {
    const mult = parseFloat(packMatch[1]);
    const unitType = packMatch[2] as "GAL" | "LB" | "OZ";
    return { base: unitType, multiplier: mult };
  }

  if (baseStr === "GAL" || baseStr === "GALLON" || baseStr === "GALLONS") return { base: "GAL" };
  if (baseStr === "LB" || baseStr === "LBS" || baseStr === "POUND" || baseStr === "POUNDS") return { base: "LB" };
  if (baseStr === "OZ" || baseStr === "OUNCE" || baseStr === "OUNCES") return { base: "OZ" };

  return { base: "UNKNOWN" };
}

export function areUnitsCompatible(chemicalUnit: string, logUnit: string): boolean {
  const cNorm = normalizeUnit(chemicalUnit);
  const lNorm = normalizeUnit(logUnit);
  
  if (cNorm.base === "UNKNOWN" || lNorm.base === "UNKNOWN") return false;
  return cNorm.base === lNorm.base;
}

export function calcTotal(rate: number | null | undefined, acres: number | null | undefined): number | null {
  if (rate == null || isNaN(rate) || acres == null || isNaN(acres) || acres <= 0) {
    return null;
  }
  return rate * acres;
}

export function calcLoads(total: number | null | undefined, tankSize: number | null | undefined): number | null {
  if (total == null || tankSize == null || isNaN(tankSize) || tankSize <= 0) {
    return null;
  }
  return total / tankSize;
}

export function formatNumber(n: number | null, decimals: number): string {
  if (n === null) return '—';
  return parseFloat(n.toFixed(decimals)).toString();
}
