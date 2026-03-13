import { isWithin } from "./dates";
import { ChemicalApp } from "@/hooks/useData";

export function getSeasonSpendForBlock(
  blockId: string, 
  logs: ChemicalApp[], 
  window: { startISO: string; endISO: string }
): number {
  return logs
    .filter(log => 
      log.blockId === blockId && 
      isWithin(log.dateApplied, window.startISO, window.endISO) &&
      typeof log.estimatedCost === 'number'
    )
    .reduce((sum, log) => sum + (log.estimatedCost || 0), 0);
}

export function getSeasonSpendByCategory(
  blockId: string, 
  logs: ChemicalApp[], 
  window: { startISO: string; endISO: string }
): Record<string, number> {
  const categoryTotals: Record<string, number> = {};
  
  logs
    .filter(log => 
      log.blockId === blockId && 
      isWithin(log.dateApplied, window.startISO, window.endISO) &&
      typeof log.estimatedCost === 'number'
    )
    .forEach(log => {
      const cat = log.category || "OTHER";
      categoryTotals[cat] = (categoryTotals[cat] || 0) + (log.estimatedCost || 0);
    });
    
  return categoryTotals;
}
