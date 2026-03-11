import { Recommendation } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, DollarSign, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/lib/store";

interface SavingsCenterProps {
  ranchId: string;
}

export function SavingsCenter({ ranchId }: SavingsCenterProps) {
  const { toast } = useToast();
  const allRecs = useStore(s => s.recommendations);
  const allBlocks = useStore(s => s.blocks);
  const updateRec = useStore(s => s.updateRecommendation);

  // Find recommendations with cheaper alternatives
  const opportunities = allRecs.filter(rec => {
    if (rec.ranchId !== ranchId || rec.status !== 'PENDING') return false;
    if (!rec.alternatives || rec.alternatives.length === 0) return false;
    
    // Check if any alternative is cheaper
    const currentCost = rec.estimatedCostPerAcre || 0;
    return rec.alternatives.some(alt => alt.estimatedCostPerAcre < currentCost);
  });

  const handleSwitchToAlternative = (recId: string, alt: any) => {
    updateRec(recId, {
      product: alt.productName,
      estimatedPricePerUnit: alt.estimatedPricePerUnit,
      estimatedCostPerAcre: alt.estimatedCostPerAcre,
      // Clear out alternatives since we've picked one
      alternatives: [] 
    });
    
    toast({
      title: "Switched to Alternative",
      description: `Recommendation updated to use ${alt.productName}.`,
    });
  };

  if (opportunities.length === 0) {
    return (
      <div className="bg-[#111113] border border-border border-dashed p-6 rounded-xl text-center">
        <CheckCircle2 className="w-8 h-8 text-green-500/50 mx-auto mb-3" />
        <h3 className="font-bold text-sm text-foreground mb-1">Cost Optimized</h3>
        <p className="text-xs text-muted-foreground">All pending recommendations are using the most cost-effective options.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {opportunities.map(rec => {
        const block = allBlocks.find(b => b.id === rec.blockId);
        const currentCost = rec.estimatedCostPerAcre || 0;
        
        // Find best alternative
        const bestAlt = [...rec.alternatives!].sort((a, b) => a.estimatedCostPerAcre - b.estimatedCostPerAcre)[0];
        const savingsPerAcre = currentCost - bestAlt.estimatedCostPerAcre;
        const totalSavings = savingsPerAcre * (block?.acreage || 0);

        return (
          <div key={rec.id} className="bg-card border border-green-500/20 p-5 rounded-xl flex flex-col md:flex-row gap-6 shadow-sm hover:border-green-500/40 transition-colors">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-[10px] uppercase tracking-widest text-green-400 border-green-400/30 bg-green-400/10">
                  <DollarSign className="w-3 h-3 mr-1" /> Savings Opportunity
                </Badge>
                <span className="text-xs font-bold text-muted-foreground">{block?.name}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="opacity-60">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Recommended</p>
                  <p className="font-bold text-sm line-through">{rec.product}</p>
                  <p className="text-xs">${currentCost.toFixed(2)} / ac</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-green-400 mb-1">Alternative</p>
                  <p className="font-bold text-sm text-green-400">{bestAlt.productName}</p>
                  <p className="text-xs text-green-400/80">${bestAlt.estimatedCostPerAcre.toFixed(2)} / ac</p>
                </div>
              </div>
            </div>
            
            <div className="bg-[#111113] border border-border rounded-lg p-4 flex flex-col justify-center items-center text-center min-w-[160px]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Savings</p>
              <p className="text-2xl font-black text-green-400 mb-4">${totalSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              
              <Button 
                onClick={() => handleSwitchToAlternative(rec.id, bestAlt)}
                className="w-full text-xs font-bold uppercase tracking-widest bg-green-600/20 text-green-500 hover:bg-green-600/30 border border-green-500/30"
              >
                Accept Switch
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
