import { Block, FieldLog, ProgramTemplate } from "@/lib/store";
import { BlockSuggestion } from "@/types/suggestions";
import { isAfter, subDays } from "date-fns";

export function getSuggestionsForBlock(
  block: Block, 
  logs: FieldLog[], 
  templates: ProgramTemplate[], 
  inventory: any[], // Type later
  allBlocks: Block[]
): BlockSuggestion[] {
  const suggestions: BlockSuggestion[] = [];
  const blockLogs = logs.filter(l => l.blockId === block.id);
  const now = new Date();

  // Basic MVP Rule 1: Nutrition gap (If no FERT logged in last 30 days)
  const recentFert = blockLogs.find(l => 
    l.actionType === "FERT" && 
    isAfter(new Date(l.date), subDays(now, 30))
  );

  if (!recentFert) {
    suggestions.push({
      id: `sug-nutr-${block.id}-${Date.now()}`,
      blockId: block.id,
      title: "Spring Nutrition Pass",
      category: "NUTRITION",
      confidence: "MEDIUM",
      reasonLines: [
        "No nutrition applications logged in the last 30 days.",
        `Standard early-season timing for ${block.crop}`
      ],
      sourceSignals: ["RECENCY", "CROP_TIMING"],
      operationType: "FERT"
    });
  }

  // Basic MVP Rule 2: Protection / Pest gap (Based on crop)
  const recentSpray = blockLogs.find(l => 
    l.actionType === "SPRAY" && 
    isAfter(new Date(l.date), subDays(now, 21))
  );

  if (!recentSpray && ["ALMONDS", "PISTACHIOS", "WALNUTS"].includes(block.crop)) {
    suggestions.push({
      id: `sug-prot-${block.id}-${Date.now()}`,
      blockId: block.id,
      title: "Pre-emergent / Floor Prep",
      category: "PROTECTION",
      confidence: "LOW",
      reasonLines: [
        "No recent floor sprays logged.",
        "Consider checking for weed escapes before bloom."
      ],
      sourceSignals: ["RECENCY", "CROP_TYPE"],
      operationType: "SPRAY"
    });
  }

  // Basic MVP Rule 3: Similar block activity
  const similarBlocks = allBlocks.filter(b => 
    b.id !== block.id && 
    b.crop === block.crop && 
    b.variety === block.variety
  );
  
  if (similarBlocks.length > 0) {
    // Find a recent log on a similar block that this block doesn't have
    for (const simBlock of similarBlocks) {
      const recentSimLogs = logs.filter(l => 
        l.blockId === simBlock.id && 
        isAfter(new Date(l.date), subDays(now, 7))
      );
      
      for (const simLog of recentSimLogs) {
        // Did we do this here?
        const didItHere = blockLogs.some(l => 
          l.material === simLog.material && 
          isAfter(new Date(l.date), subDays(now, 14))
        );
        
        if (!didItHere && simLog.material) {
          suggestions.push({
            id: `sug-sim-${block.id}-${simLog.id}`,
            blockId: block.id,
            title: simLog.material,
            category: "TEMPLATE",
            confidence: "HIGH",
            reasonLines: [
              `Recently applied to similar ${block.variety} blocks`,
              `Applied ${simLog.amount} ${simLog.unit} on ${simBlock.name}`
            ],
            sourceSignals: ["SIMILAR_BLOCKS"],
            operationType: simLog.actionType,
            productName: simLog.material,
            suggestedRate: simLog.amount,
            suggestedRateUnit: simLog.unit
          });
          break; // Just one similar suggestion for MVP
        }
      }
    }
  }

  // Deduplicate and rank (High > Med > Low)
  const ranked = suggestions.sort((a, b) => {
    const val = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    return val[b.confidence] - val[a.confidence];
  });

  return ranked.slice(0, 3); // Max 3 suggestions
}
