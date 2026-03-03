import { todayPacificISO } from "./dates";
import { inferCropType } from "./crops";

export function getActiveSeasonWindow(block: { variety: string; seasonGroup: string }): { startISO: string; endISO: string; label: string } {
  const currentYear = todayPacificISO().slice(0, 4);
  const cropType = inferCropType(block.variety);
  
  if (cropType === "STONE_FRUIT") {
    const start = `${currentYear}-02-01`;
    let endISO = `${currentYear}-10-31`; // fallback
    
    if (block.seasonGroup === "Early") endISO = `${currentYear}-06-30`;
    else if (block.seasonGroup === "Mid") endISO = `${currentYear}-08-31`;
    else if (block.seasonGroup === "Late") endISO = `${currentYear}-10-31`;
    
    return { 
      startISO: start, 
      endISO, 
      label: `Active season (Stone fruit ${block.seasonGroup}): Feb 1 – ${endISO.slice(5).replace('-','/')}` 
    };
  }
  
  // Default for Citrus, Nut, Other
  return { 
    startISO: `${currentYear}-01-01`, 
    endISO: `${currentYear}-12-31`,
    label: `Active season: Jan 1 – Dec 31`
  };
}
