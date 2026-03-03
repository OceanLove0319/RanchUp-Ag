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
