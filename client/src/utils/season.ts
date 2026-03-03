import { todayPacificISO } from "./dates";

export function inferCropType(variety: string): "STONE_FRUIT" | "CITRUS" | "NUT" | "OTHER" {
  const v = variety.toLowerCase();
  
  if (v.includes("peach") || v.includes("nectarine") || v.includes("plum") || v.includes("apricot") || v.includes("cherry")) {
    return "STONE_FRUIT";
  }
  
  if (v.includes("citrus") || v.includes("orange") || v.includes("mandarin") || v.includes("lemon") || v.includes("grapefruit")) {
    return "CITRUS";
  }
  
  if (v.includes("almond") || v.includes("pistachio") || v.includes("walnut")) {
    return "NUT";
  }
  
  return "OTHER";
}

export function getActiveSeasonWindow(block: { variety: string; seasonGroup: string }): { startISO: string; endISO: string } {
  const currentYear = todayPacificISO().slice(0, 4);
  const cropType = inferCropType(block.variety);
  
  if (cropType === "STONE_FRUIT") {
    const start = `${currentYear}-02-01`;
    if (block.seasonGroup === "Early") return { startISO: start, endISO: `${currentYear}-06-30` };
    if (block.seasonGroup === "Mid") return { startISO: start, endISO: `${currentYear}-08-31` };
    if (block.seasonGroup === "Late") return { startISO: start, endISO: `${currentYear}-10-31` };
    return { startISO: start, endISO: `${currentYear}-10-31` }; // fallback
  }
  
  // Default for Citrus, Nut, Other
  return { startISO: `${currentYear}-01-01`, endISO: `${currentYear}-12-31` };
}
