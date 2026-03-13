import { useStore } from "@/lib/store";
import { useBlocks, useFieldLogs, useTemplates, useProductLibrary } from "@/hooks/useData";
import { getSuggestionsForBlock } from "@/lib/suggestions/getSuggestionsForBlock";
import { SuggestionCard } from "./SuggestionCard";
import { Lightbulb, Info } from "lucide-react";
import { useMemo } from "react";

export function BlockSuggestionsCard({ blockId }: { blockId: string }) {
  const activeRanchId = useStore(s => s.activeRanchId);
  const { data: allBlocks = [] } = useBlocks(activeRanchId);
  const block = allBlocks.find(b => b.id === blockId);
  const { data: logs = [] } = useFieldLogs(activeRanchId);
  const { data: templates = [] } = useTemplates();
  const { data: library = [] } = useProductLibrary();

  // Suggestion state management (local UI state in Zustand)
  const dismissedSuggestions = useStore(s => s.dismissedSuggestions) || [];
  const dismissSuggestion = useStore(s => s.dismissSuggestion);
  
  const suggestions = useMemo(() => {
    if (!block) return [];
    
    const rawSuggestions = getSuggestionsForBlock(block, logs, templates, library, allBlocks);
    
    // Add estimated totals if acreage exists
    return rawSuggestions
      .filter(s => !dismissedSuggestions.includes(s.id))
      .map(s => {
        if (s.suggestedRate && s.suggestedRateUnit?.toLowerCase().includes('/ac') && block.acreage) {
          return {
            ...s,
            estimatedTotal: s.suggestedRate * block.acreage,
            estimatedTotalUnit: s.suggestedRateUnit.split('/')[0] // extract GAL from GAL/AC
          };
        }
        return s;
      });
  }, [block, logs, templates, library, allBlocks, dismissedSuggestions]);

  if (!block) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-primary/20 rounded-md">
          <Lightbulb className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-xl font-black uppercase tracking-tight">Suggested for This Block</h2>
      </div>

      {suggestions.length === 0 ? (
        <div className="bg-card border border-border p-6 rounded-lg text-center">
          <p className="text-muted-foreground font-medium mb-2">Not enough block signals yet</p>
          <p className="text-sm text-muted-foreground/70 max-w-md mx-auto">
            Suggestions improve when this block has more recent logs, issue notes, attached templates, or inventory data.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suggestions.map(suggestion => (
            <SuggestionCard 
              key={suggestion.id} 
              suggestion={suggestion} 
              onDismiss={dismissSuggestion}
              onSave={() => {}} // Stub
            />
          ))}
        </div>
      )}
      
      {suggestions.length > 0 && (
        <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground/60 justify-end">
          <Info className="w-3 h-3" />
          <p>Operational suggestions only. Always follow label, PCA, and ranch practices.</p>
        </div>
      )}
    </div>
  );
}
