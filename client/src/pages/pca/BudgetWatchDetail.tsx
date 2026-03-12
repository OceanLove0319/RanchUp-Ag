import { useStore } from "@/lib/store";
import { Link, useRoute } from "wouter";
import { ArrowLeft, AlertTriangle, TrendingUp, CheckCircle2, Save, FileText, ChevronRight, MessageSquareText, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function BudgetWatchDetail() {
  const [, params] = useRoute("/pca/budget-watch/:id");
  const blockId = params?.id;
  
  const user = useStore(s => s.user);
  const isPCA = user?.role === 'PCA';
  
  const blocks = useStore(s => s.blocks);
  const ranches = useStore(s => s.ranches);
  const allApps = useStore(s => s.chemicalApps);
  const allLogs = useStore(s => s.logs);
  const recommendations = useStore(s => s.recommendations);
  
  const { toast } = useToast();
  
  const [noteText, setNoteText] = useState("");
  const [savedNote, setSavedNote] = useState<string | null>(null);

  // Find base block
  const block = blocks.find(b => b.id === blockId);
  const ranch = ranches.find(r => r.id === block?.ranchId);
  
  // Calculate specific mock data for this block
  const budgetData = useMemo(() => {
    if (!block) return null;

    const blockApps = allApps.filter(a => a.blockId === block.id);
    const blockLogs = allLogs.filter(l => l.blockId === block.id);
    const blockRecs = recommendations.filter(r => r.blockId === block.id && r.status !== 'CLOSED');
    
    const actualSpend = blockLogs.reduce((sum, log) => sum + (log.cost || 0), 0) + Math.random() * 2000;
    const basePlan = (block.acreage || 40) * 200; 
    const plannedBudget = basePlan;
    
    const varianceAmount = actualSpend - plannedBudget;
    const variancePercent = plannedBudget > 0 ? (varianceAmount / plannedBudget) * 100 : 0;
    
    let status: "On Track" | "Watch" | "Over" = "On Track";
    if (variancePercent > 15) status = "Over";
    else if (variancePercent > 5) status = "Watch";

    const missingActuals = blockApps.some(a => a.costStatus === 'UNIT_MISMATCH') || blockLogs.some(l => !l.cost);

    // Get latest rec if any
    const latestRec = blockRecs[0];
    let recommendationImpact = null;

    if (latestRec) {
      const recCost = latestRec.estimatedTotalCost || ((latestRec.estimatedCostPerAcre || 0) * (block.acreage || 0));
      const projectedSpend = actualSpend + recCost;
      const projectedVariancePercent = ((projectedSpend - plannedBudget) / plannedBudget) * 100;
      
      let projStatus: "On Track" | "Watch" | "Over" = "On Track";
      if (projectedVariancePercent > 15) projStatus = "Over";
      else if (projectedVariancePercent > 5) projStatus = "Watch";

      const hasAlternative = latestRec.alternatives && latestRec.alternatives.length > 0;
      const alt = hasAlternative ? latestRec.alternatives![0] : null;
      
      recommendationImpact = {
        recommendationName: latestRec.product || "Unknown Product",
        costPerAcre: latestRec.estimatedCostPerAcre || 0,
        blockTotal: recCost,
        projectedStatus: projStatus,
        alternativeName: alt?.productName,
        alternativeCostPerAcre: alt?.estimatedCostPerAcre,
        alternativeBlockTotal: (alt?.estimatedCostPerAcre || 0) * (block.acreage || 0),
        savingsDelta: recCost - ((alt?.estimatedCostPerAcre || 0) * (block.acreage || 0))
      };
    }

    return {
      plannedBudget,
      actualSpend,
      varianceAmount,
      variancePercent,
      status,
      missingActuals,
      categorySpend: {
        cropProtection: actualSpend * 0.45,
        fertilizer: actualSpend * 0.25,
        irrigation: actualSpend * 0.1,
        labor: actualSpend * 0.15,
        customOther: actualSpend * 0.05
      },
      recommendationImpact,
      // Mocked drivers based on state
      varianceDrivers: variancePercent > 5 ? [
        "Extra fungicide pass in April",
        "Premium herbicide selection used",
        missingActuals ? "Missing actual unit log" : null
      ].filter(Boolean) : []
    };
  }, [block, allApps, allLogs, recommendations]);

  if (!isPCA) {
    return <div className="p-8 text-center text-muted-foreground">Access Restricted.</div>;
  }

  if (!block || !budgetData) {
    return <div className="p-8 text-center text-muted-foreground">Block not found.</div>;
  }

  const handleSaveNote = () => {
    setSavedNote(noteText);
    toast({
      title: "Note Saved",
      description: "Variance note has been attached to this block.",
    });
  };

  return (
    <div className="animate-in fade-in duration-500 pb-24 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Link href="/pca/budget-watch" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Budget Watch
        </Link>
      </div>

      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">{ranch?.name}</p>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-black uppercase tracking-tighter text-foreground">{block.name}</h1>
              <Badge variant="outline" className={`text-xs px-3 py-1 uppercase tracking-widest ${
                budgetData.status === 'On Track' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                budgetData.status === 'Watch' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' :
                'bg-red-500/10 text-red-400 border-red-500/30'
              }`}>
                {budgetData.status}
              </Badge>
            </div>
            <p className="text-muted-foreground font-medium text-sm">{block.variety || 'Mixed Crop'} • {block.acreage} Acres</p>
          </div>
          
          {budgetData.missingActuals && (
            <div className="flex items-center gap-2 bg-blue-500/10 text-blue-400 border border-blue-500/30 px-3 py-2 rounded-lg">
              <Search className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Missing Logs/Costs</span>
            </div>
          )}
        </div>
      </header>

      {/* A. Budget Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border border-border p-4 rounded-xl">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Season Plan</p>
          <p className="text-xl font-medium text-foreground">${budgetData.plannedBudget.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
        </div>
        <div className="bg-card border border-border p-4 rounded-xl">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Actual Spend</p>
          <p className="text-xl font-medium text-foreground">${budgetData.actualSpend.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
        </div>
        <div className="bg-card border border-border p-4 rounded-xl">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Variance $</p>
          <p className={`text-xl font-black ${budgetData.varianceAmount > 0 ? 'text-red-400' : 'text-green-400'}`}>
            {budgetData.varianceAmount > 0 ? '+' : ''}${budgetData.varianceAmount.toLocaleString(undefined, {maximumFractionDigits: 0})}
          </p>
        </div>
        <div className="bg-card border border-border p-4 rounded-xl">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Variance %</p>
          <p className={`text-xl font-black ${budgetData.varianceAmount > 0 ? 'text-red-400' : 'text-green-400'}`}>
            {budgetData.varianceAmount > 0 ? '+' : ''}{budgetData.variancePercent.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* B. Spend By Category */}
        <div className="bg-[#111113] border border-border rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4">Spend by Category</h3>
          <div className="space-y-3">
            {[
              { label: "Crop Protection", value: budgetData.categorySpend.cropProtection, color: "bg-purple-500" },
              { label: "Fertilizer", value: budgetData.categorySpend.fertilizer, color: "bg-orange-500" },
              { label: "Irrigation", value: budgetData.categorySpend.irrigation, color: "bg-blue-500" },
              { label: "Labor", value: budgetData.categorySpend.labor, color: "bg-gray-400" },
              { label: "Custom / Other", value: budgetData.categorySpend.customOther, color: "bg-primary" }
            ].map(cat => (
              <div key={cat.label}>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-foreground">{cat.label}</span>
                  <span className="text-muted-foreground">${cat.value.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                </div>
                <div className="w-full bg-background rounded-full h-1.5 overflow-hidden">
                  <div className={`h-full ${cat.color}`} style={{ width: `${Math.min(100, (cat.value / budgetData.actualSpend) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* D. Top Variance Drivers & E. Note */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4">Top Variance Drivers</h3>
            {budgetData.varianceDrivers.length > 0 ? (
              <ul className="space-y-2">
                {budgetData.varianceDrivers.map((driver, i) => (
                  <li key={i} className="text-sm flex items-start gap-2 text-foreground font-medium">
                    <span className="text-red-400 mt-0.5">•</span> {driver}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground italic">No significant drivers detected.</p>
            )}
          </div>

          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
              <MessageSquareText className="w-4 h-4" /> PCA Variance Note
            </h3>
            
            {savedNote ? (
              <div className="bg-background border border-border p-3 rounded-lg mb-3">
                <p className="text-sm text-foreground italic">"{savedNote}"</p>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-border/50">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Added by {user?.name || "PCA"}</span>
                  <button onClick={() => setSavedNote(null)} className="text-[10px] font-bold text-primary uppercase tracking-widest">Edit</button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <textarea 
                  className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:outline-none focus:border-primary resize-none h-20 placeholder:text-muted-foreground/50"
                  placeholder="E.g., Second pass added due to late rain..."
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                />
                <Button 
                  size="sm" 
                  onClick={handleSaveNote}
                  disabled={!noteText.trim()}
                  className="w-full text-xs font-bold uppercase tracking-widest gap-2"
                >
                  <Save className="w-3 h-3" /> Save Note
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* C. Recommendation Impact Panel */}
      <h3 className="text-xl font-black uppercase tracking-tight text-foreground mb-4 mt-8">Recommendation Impact</h3>
      
      {budgetData.recommendationImpact ? (
        <div className="bg-[#111113] border border-primary/30 p-6 rounded-xl relative overflow-hidden shadow-[0_0_15px_rgba(234,153,61,0.05)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />
          
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Active Recommendation</p>
              <h4 className="text-lg font-bold text-foreground">{budgetData.recommendationImpact.recommendationName}</h4>
            </div>
            
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
              budgetData.recommendationImpact.projectedStatus === 'On Track' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
              budgetData.recommendationImpact.projectedStatus === 'Watch' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' :
              'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>
              {budgetData.recommendationImpact.projectedStatus === 'Over' && <AlertTriangle className="w-3 h-3" />}
              {budgetData.recommendationImpact.projectedStatus === 'Watch' && <TrendingUp className="w-3 h-3" />}
              {budgetData.recommendationImpact.projectedStatus === 'On Track' && <CheckCircle2 className="w-3 h-3" />}
              <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                Pushes to {budgetData.recommendationImpact.projectedStatus}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4 bg-background/50 border border-border/50 p-4 rounded-lg relative z-10">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Est. Cost / AC</p>
              <p className="text-xl font-bold text-foreground">${budgetData.recommendationImpact.costPerAcre.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Est. Block Total</p>
              <p className="text-xl font-black text-primary">${budgetData.recommendationImpact.blockTotal.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
            </div>
          </div>

          {budgetData.recommendationImpact.alternativeName && (
            <div className="border-t border-border/50 pt-4 mt-2 relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-green-400 mb-2">Lower-Cost Alternative Available</p>
              <div className="flex justify-between items-center bg-green-500/5 border border-green-500/20 p-3 rounded-lg">
                <div>
                  <p className="text-sm font-bold text-foreground">{budgetData.recommendationImpact.alternativeName}</p>
                  <p className="text-xs text-muted-foreground">${budgetData.recommendationImpact.alternativeCostPerAcre?.toFixed(2)} / ac</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black uppercase tracking-widest text-green-400">
                    Save ${budgetData.recommendationImpact.savingsDelta?.toLocaleString(undefined, {maximumFractionDigits: 0})}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-card border border-border border-dashed p-8 rounded-xl text-center">
          <FileText className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" />
          <p className="font-bold text-foreground mb-1">No Active Recommendations</p>
          <p className="text-xs text-muted-foreground">Draft a recommendation to see its budget impact.</p>
        </div>
      )}
    </div>
  );
}