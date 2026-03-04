import { useStore } from "@/lib/store";
import { getSuggestionsForBlock } from "@/lib/suggestions/getSuggestionsForBlock";
import { BlockSuggestion } from "@/types/suggestions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, Plus, X } from "lucide-react";
import { useMemo } from "react";

interface QuickLogSuggestionsProps {
  blockId: string;
  onSelectSuggestion: (suggestion: BlockSuggestion) => void;
}

export function QuickLogSuggestions({ blockId, onSelectSuggestion }: QuickLogSuggestionsProps) {
  const block = useStore(s => s.blocks.find(b => b.id === blockId));
  const logs = useStore(s => s.logs);
  const templates = useStore(s => s.templates);
  const allBlocks = useStore(s => s.blocks);
  const library = useStore(s => s.productLibrary);
  
  // Suggestion state
  const dismissedSuggestions = useStore(s => (s as any).dismissedSuggestions || []);
  const dismissSuggestion = useStore(s => (s as any).dismissSuggestion || (() => {}));

  const suggestions = useMemo(() => {
    if (!block) return [];
    
    return getSuggestionsForBlock(block, logs, templates, library, allBlocks)
      .filter(s => !dismissedSuggestions.includes(s.id))
      .slice(0, 2); // Max 2 for quick log
  }, [block, logs, templates, library, allBlocks, dismissedSuggestions]);

  if (!block || suggestions.length === 0) return null;

  return (
    <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-primary">Suggested Next Move</h3>
      </div>
      
      <div className="space-y-2">
        {suggestions.map(suggestion => (
          <div key={suggestion.id} className="flex items-center justify-between bg-card border border-border p-3 rounded-md hover:border-primary/50 transition-colors group">
            <div className="flex-1 min-w-0 mr-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-foreground truncate">{suggestion.title}</span>
                <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 uppercase bg-background border-border shrink-0">
                  {suggestion.category.replace('_', ' ')}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground truncate">{suggestion.reasonLines[0]}</p>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => dismissSuggestion(suggestion.id)}
              >
                <X className="w-4 h-4" />
              </Button>
              <Button 
                size="sm" 
                className="h-8 bg-primary text-primary-foreground hover:bg-primary/90 font-bold tracking-wider uppercase text-[10px]"
                onClick={() => onSelectSuggestion(suggestion)}
              >
                <Plus className="w-3 h-3 mr-1" /> Use
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
