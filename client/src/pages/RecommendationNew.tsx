import { useState, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { useStore } from "@/lib/store";
import { ArrowLeft, Check, Search, PlusCircle, AlertTriangle, Info, TrendingUp, DollarSign, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function RecommendationNew() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const addRecommendation = useStore(s => s.addRecommendation);
  
  const ranches = useStore(s => s.ranches);
  const blocks = useStore(s => s.blocks);
  const products = useStore(s => s.productLibrary);
  
  // PCA Context
  const activeRanchId = useStore(s => s.activeRanchId);
  const activeRanch = ranches.find(r => r.id === activeRanchId);
  const ranchBlocks = blocks.filter(b => b.ranchId === activeRanchId);
  
  // Form State
  const [selectedBlockId, setSelectedBlockId] = useState<string>("");
  const [targetPest, setTargetPest] = useState<string>("");
  const [cropStage, setCropStage] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  
  // Product Selection
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  
  // Cost Simulation State
  const [rates, setRates] = useState<Record<string, { value: number, unit: string }>>({});
  const [alternatives, setAlternatives] = useState<any[]>([]);

  // Derived Values
  const selectedBlock = blocks.find(b => b.id === selectedBlockId);
  const selectedProducts = products.filter(p => selectedProductIds.includes(p.id));

  // Handle Product Selection
  const toggleProduct = (productId: string) => {
    setSelectedProductIds(prev => {
      if (prev.includes(productId)) {
        const next = prev.filter(id => id !== productId);
        return next;
      }
      return [productId, ...prev];
    });
    
    // Initialize default rate if adding
    if (!selectedProductIds.includes(productId)) {
      const prod = products.find(p => p.id === productId);
      if (prod) {
        setRates(prev => ({
          ...prev,
          [productId]: { value: prod.defaultRate || 1, unit: prod.unit || 'gal' }
        }));
      }
    }
  };

  // Mock Budget Watch Impact Data
  const budgetImpact = useMemo(() => {
    if (!selectedBlock || selectedProducts.length === 0) return null;
    
    let totalEstCostPerAcre = 0;
    
    selectedProducts.forEach(prod => {
      const rate = rates[prod.id]?.value || 1;
      const unitCost = prod.pricePerUnit || 0;
      totalEstCostPerAcre += (rate * unitCost);
    });

    const blockAcres = selectedBlock.acreage || 0;
    const estTotalCost = totalEstCostPerAcre * blockAcres;

    // Very naive mock of budget status
    const mockSeasonBudget = blockAcres * 200; // $200/ac baseline
    const mockSpendToDate = blockAcres * 120; // Used $120/ac so far
    
    const newTotalSpend = mockSpendToDate + estTotalCost;
    const projectedVariancePercent = ((newTotalSpend - mockSeasonBudget) / mockSeasonBudget) * 100;

    let projectedStatus: "On Track" | "Watch" | "Over" = "On Track";
    if (projectedVariancePercent > 15) projectedStatus = "Over";
    else if (projectedVariancePercent > 5) projectedStatus = "Watch";

    return {
      costPerAcre: totalEstCostPerAcre,
      blockTotal: estTotalCost,
      projectedStatus,
      mockSeasonBudget,
      newTotalSpend
    };
  }, [selectedBlock, selectedProducts, rates]);

  const handleSubmit = () => {
    if (!selectedBlockId || selectedProducts.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select a block and at least one product.",
        variant: "destructive"
      });
      return;
    }

    const recId = `rec-${Date.now()}`;
    const primaryProduct = selectedProducts[0];
    const rateInfo = rates[primaryProduct.id];

    addRecommendation({
      id: recId,
      ranchId: activeRanchId!,
      blockId: selectedBlockId,
      title: `Treat ${targetPest || 'Block'}`,
      status: "SENT",
      date: new Date().toISOString(),
      notes,
      cropStage,
      product: primaryProduct.name,
      targetPest,
      rate: rateInfo?.value || 1,
      rateUnit: rateInfo?.unit || 'gal',
      estimatedPricePerUnit: primaryProduct.pricePerUnit,
      estimatedCostPerAcre: budgetImpact?.costPerAcre,
      estimatedTotalCost: budgetImpact?.blockTotal,
      alternatives: alternatives
    });

    toast({
      title: "Recommendation Sent",
      description: `Sent to ${selectedBlock?.name} grower.`,
    });
    
    setLocation("/app/recommendations");
  };

  return (
    <div className="animate-in fade-in duration-500 pb-24 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Link href="/app/recommendations" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Recs
        </Link>
      </div>

      <header className="mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tighter text-foreground mb-2">Write Recommendation</h1>
        <p className="text-muted-foreground font-medium">Draft a new chemical or cultural recommendation.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border p-6 rounded-xl space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Target Block</label>
              <select 
                value={selectedBlockId} 
                onChange={e => setSelectedBlockId(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:border-primary"
              >
                <option value="">Select a block on {activeRanch?.name}...</option>
                {ranchBlocks.map(b => (
                  <option key={b.id} value={b.id}>{b.name} ({b.acreage} ac)</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Target Pest / Issue</label>
                <input 
                  type="text"
                  placeholder="e.g. Navel Orangeworm"
                  value={targetPest}
                  onChange={e => setTargetPest(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Crop Stage (Optional)</label>
                <input 
                  type="text"
                  placeholder="e.g. Hull Split"
                  value={cropStage}
                  onChange={e => setCropStage(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Product Selection */}
          <div className="bg-card border border-border p-6 rounded-xl">
            <h3 className="text-sm font-black uppercase tracking-widest text-foreground mb-4">Select Products</h3>
            
            <div className="relative mb-4">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search materials library..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>

            {selectedProducts.length > 0 && (
              <div className="mb-6 space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary">Selected Mix</h4>
                {selectedProducts.map(prod => (
                  <div key={prod.id} className="bg-background/50 border border-border p-3 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-foreground">{prod.name}</p>
                      <p className="text-xs text-muted-foreground">${prod.pricePerUnit}/{prod.unit}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number"
                        min={0.1}
                        step={0.1}
                        value={rates[prod.id]?.value || 0}
                        onChange={e => setRates(prev => ({...prev, [prod.id]: { ...prev[prod.id], value: parseFloat(e.target.value) }}))}
                        className="w-20 bg-card border border-border rounded px-2 py-1 text-sm text-right"
                      />
                      <span className="text-xs text-muted-foreground w-8">{rates[prod.id]?.unit || prod.unit}/ac</span>
                      <button onClick={() => toggleProduct(prod.id)} className="p-1 text-muted-foreground hover:text-red-400">
                        <AlertTriangle className="w-4 h-4" /> {/* Should be X icon */}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="max-h-48 overflow-y-auto space-y-1 pr-2">
              {products
                .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !selectedProductIds.includes(p.id))
                .slice(0, 10)
                .map(prod => (
                  <div 
                    key={prod.id} 
                    onClick={() => toggleProduct(prod.id)}
                    className="flex items-center justify-between p-2 hover:bg-background rounded cursor-pointer group"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{prod.name}</span>
                      <span className="text-[10px] text-muted-foreground">{prod.category} • ${prod.pricePerUnit}/{prod.unit}</span>
                    </div>
                    <PlusCircle className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                  </div>
                ))
              }
            </div>
          </div>

          {/* Notes */}
          <div className="bg-card border border-border p-6 rounded-xl">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Instructions / Notes</label>
            <textarea 
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add any specific instructions for the applicator or grower..."
              className="w-full bg-background border border-border rounded-lg p-4 text-sm focus:outline-none focus:border-primary resize-none h-24"
            />
          </div>
        </div>

        {/* Right Column: Budget Watch Impact Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="bg-[#111113] border border-border rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border/50">
                <DollarSign className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Budget Impact</h3>
              </div>

              {!budgetImpact ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Select a block and products to see cost projections.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-background border border-border p-3 rounded-lg">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Cost / AC</p>
                      <p className="text-lg font-black text-foreground">${budgetImpact.costPerAcre.toFixed(2)}</p>
                    </div>
                    <div className="bg-background border border-border p-3 rounded-lg">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Block Total</p>
                      <p className="text-lg font-black text-primary">${budgetImpact.blockTotal.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg border ${
                    budgetImpact.projectedStatus === 'On Track' ? 'bg-green-500/10 border-green-500/30' :
                    budgetImpact.projectedStatus === 'Watch' ? 'bg-amber-500/10 border-amber-500/30' :
                    'bg-red-500/10 border-red-500/30'
                  }`}>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Projected Block Status</p>
                    <div className="flex items-center gap-2">
                      {budgetImpact.projectedStatus === 'Over' && <AlertTriangle className="w-4 h-4 text-red-400" />}
                      {budgetImpact.projectedStatus === 'Watch' && <TrendingUp className="w-4 h-4 text-amber-500" />}
                      {budgetImpact.projectedStatus === 'On Track' && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                      <span className={`font-bold ${
                        budgetImpact.projectedStatus === 'On Track' ? 'text-green-400' :
                        budgetImpact.projectedStatus === 'Watch' ? 'text-amber-500' :
                        'text-red-400'
                      }`}>
                        Pushes to {budgetImpact.projectedStatus}
                      </span>
                    </div>
                  </div>

                  <Button 
                    className="w-full font-black uppercase tracking-widest h-12 shadow-[0_0_15px_rgba(234,153,61,0.2)]"
                    onClick={handleSubmit}
                  >
                    Send Recommendation
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}