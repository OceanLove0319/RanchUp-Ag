import { BlockSuggestion } from "@/types/suggestions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Droplets, Shield, CalendarClock, Package, FileText, ChevronRight, X, BookmarkPlus } from "lucide-react";
import { useLocation } from "wouter";

interface SuggestionCardProps {
  suggestion: BlockSuggestion;
  onDismiss: (id: string) => void;
  onSave: (id: string) => void;
}

export function SuggestionCard({ suggestion, onDismiss, onSave }: SuggestionCardProps) {
  const [, setLocation] = useLocation();

  const getIcon = () => {
    switch (suggestion.category) {
      case "NUTRITION": return <Droplets className="w-4 h-4" />;
      case "PROTECTION": return <Shield className="w-4 h-4" />;
      case "PROGRAM_GAP": return <CalendarClock className="w-4 h-4" />;
      case "INVENTORY": return <Package className="w-4 h-4" />;
      case "TEMPLATE": return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getConfidenceColor = () => {
    switch (suggestion.confidence) {
      case "HIGH": return "bg-primary text-primary-foreground";
      case "MEDIUM": return "bg-blue-500/20 text-blue-400";
      case "LOW": return "bg-muted text-muted-foreground";
    }
  };

  const handleLogUse = () => {
    let url = `/app/log?block=${suggestion.blockId}`;
    if (suggestion.operationType) url += `&action=${suggestion.operationType}`;
    if (suggestion.productName) url += `&material=${encodeURIComponent(suggestion.productName)}`;
    if (suggestion.suggestedRate) url += `&rate=${suggestion.suggestedRate}`;
    if (suggestion.suggestedRateUnit) url += `&unit=${encodeURIComponent(suggestion.suggestedRateUnit)}`;
    setLocation(url);
  };

  if (suggestion.dismissed) return null;

  return (
    <Card className="p-4 bg-card/50 border-border relative group">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-background border border-border rounded text-muted-foreground">
            {getIcon()}
          </div>
          <div>
            <h4 className="font-bold text-foreground leading-tight">{suggestion.title}</h4>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className={`text-[10px] px-1.5 py-0 rounded-sm font-semibold tracking-wider ${getConfidenceColor()} border-0`}>
                {suggestion.confidence} CONFIDENCE
              </Badge>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                {suggestion.category.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={() => onSave(suggestion.id)} title="Save for later">
            <BookmarkPlus className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => onDismiss(suggestion.id)} title="Dismiss">
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <div className="mt-3 space-y-1">
        {suggestion.reasonLines.map((line, i) => (
          <p key={i} className="text-sm text-muted-foreground flex items-start gap-2">
            <span className="text-primary/50 mt-1">•</span> {line}
          </p>
        ))}
      </div>

      {(suggestion.suggestedRate || suggestion.estimatedTotal) && (
        <div className="mt-4 p-2 bg-background/50 rounded border border-border/50 flex flex-wrap gap-4">
          {suggestion.suggestedRate && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Suggested Rate</p>
              <p className="text-sm font-medium">{suggestion.suggestedRate} {suggestion.suggestedRateUnit}</p>
            </div>
          )}
          {suggestion.estimatedTotal && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Est. Total Needed</p>
              <p className="text-sm font-medium text-primary">{suggestion.estimatedTotal} {suggestion.estimatedTotalUnit}</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <Button size="sm" className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground font-bold tracking-wider uppercase text-xs" onClick={handleLogUse}>
          Add to Log <ChevronRight className="w-3 h-3 ml-1" />
        </Button>
      </div>
    </Card>
  );
}
