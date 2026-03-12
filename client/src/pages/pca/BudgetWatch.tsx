import { useStore, Block } from "@/lib/store";
import { Link } from "wouter";
import { ArrowLeft, Search, Filter, AlertTriangle, TrendingUp, CheckCircle2, ChevronRight, MessageSquareText, DollarSign, ExternalLink, Lock } from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function BudgetWatch() {
  const user = useStore(s => s.user);
  const isPCA = user?.role === 'PCA';
  
  const blocks = useStore(s => s.blocks);
  const allApps = useStore(s => s.chemicalApps);
  const allLogs = useStore(s => s.logs);
  const ranches = useStore(s => s.ranches);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"All" | "On Track" | "Watch" | "Over" | "Missing Actuals" | "High Impact">("All");

  // Redirect if not PCA
  if (!isPCA) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <Lock className="w-12 h-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold text-foreground">Access Restricted</h2>
        <p className="text-muted-foreground">Budget Watch is a PCA-only tool.</p>
        <Link href="/app">
          <Button className="mt-4">Return Home</Button>
        </Link>
      </div>
    );
  }

  // --- Mock Budget Logic for Prototype ---
  // In a real app this would come from a backend or more complex state
  const budgetData = useMemo(() => {
    return blocks.map(block => {
      const ranch = ranches.find(r => r.id === block.ranchId);
      
      // Calculate Actual vs Est from store
      const blockApps = allApps.filter(a => a.blockId === block.id);
      const blockLogs = allLogs.filter(l => l.blockId === block.id);
      
      const actualSpend = blockLogs.reduce((sum, log) => sum + (log.cost || 0), 0) + Math.random() * 5000; // adding random padding to make demo data look rich
      
      // Base planned budget loosely on acreage with some variance for demo
      const basePlan = (block.acreage || 40) * 200; // $200/ac baseline
      const plannedBudget = basePlan + (Math.random() * 2000 - 1000); 
      
      const varianceAmount = actualSpend - plannedBudget;
      const variancePercent = plannedBudget > 0 ? (varianceAmount / plannedBudget) * 100 : 0;
      
      let status: "On Track" | "Watch" | "Over" = "On Track";
      if (variancePercent > 15) status = "Over";
      else if (variancePercent > 5) status = "Watch";

      // Mock missing actuals based on unit mismatch or missing log cost
      const missingActuals = blockApps.some(a => a.costStatus === 'UNIT_MISMATCH') || blockLogs.some(l => !l.cost);

      return {
        ...block,
        ranchName: ranch?.name || "Unknown Ranch",
        plannedBudget,
        actualSpend,
        varianceAmount,
        variancePercent,
        status,
        missingActuals,
        // Mock category splits
        categorySpend: {
          cropProtection: actualSpend * 0.4,
          fertilizer: actualSpend * 0.3,
          irrigation: actualSpend * 0.1,
          labor: actualSpend * 0.15,
          customOther: actualSpend * 0.05
        },
        hasHighImpactRec: Math.random() > 0.8 // Randomize some high impact alerts
      };
    });
  }, [blocks, allApps, allLogs, ranches]);

  // Filters
  const filteredBlocks = useMemo(() => {
    return budgetData.filter(block => {
      // Search
      const matchesSearch = 
        block.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        block.ranchName.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;

      // Status Filters
      switch (activeFilter) {
        case "On Track": return block.status === "On Track";
        case "Watch": return block.status === "Watch";
        case "Over": return block.status === "Over";
        case "Missing Actuals": return block.missingActuals;
        case "High Impact": return block.hasHighImpactRec;
        default: return true;
      }
    }).sort((a, b) => b.variancePercent - a.variancePercent); // Sort by highest variance by default
  }, [budgetData, searchQuery, activeFilter]);

  // Summary Stats
  const summary = useMemo(() => {
    return {
      onTrack: budgetData.filter(b => b.status === "On Track").length,
      watch: budgetData.filter(b => b.status === "Watch").length,
      over: budgetData.filter(b => b.status === "Over").length,
      review: budgetData.filter(b => b.missingActuals || b.hasHighImpactRec).length,
    };
  }, [budgetData]);

  const filters = ["All", "On Track", "Watch", "Over", "Missing Actuals", "High Impact"] as const;

  return (
    <div className="animate-in fade-in duration-500 pb-24 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Link href="/app" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Command Center
        </Link>
      </div>

      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <DollarSign className="w-8 h-8 text-primary" />
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-foreground">Budget Watch</h1>
        </div>
        <p className="text-muted-foreground font-medium text-lg">Season cost posture and recommendation impact monitoring.</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border p-5 rounded-xl flex flex-col justify-between cursor-pointer hover:border-green-500/50 transition-colors" onClick={() => setActiveFilter("On Track")}>
          <div className="flex items-center gap-2 mb-2 text-green-400">
            <CheckCircle2 className="w-4 h-4" />
            <h3 className="text-[10px] font-bold uppercase tracking-widest">On Track</h3>
          </div>
          <p className="text-3xl font-black text-foreground">{summary.onTrack}</p>
        </div>
        <div className="bg-card border border-border p-5 rounded-xl flex flex-col justify-between cursor-pointer hover:border-amber-500/50 transition-colors" onClick={() => setActiveFilter("Watch")}>
          <div className="flex items-center gap-2 mb-2 text-amber-500">
            <TrendingUp className="w-4 h-4" />
            <h3 className="text-[10px] font-bold uppercase tracking-widest">Watch</h3>
          </div>
          <p className="text-3xl font-black text-foreground">{summary.watch}</p>
        </div>
        <div className="bg-card border border-border p-5 rounded-xl flex flex-col justify-between cursor-pointer hover:border-red-500/50 transition-colors" onClick={() => setActiveFilter("Over")}>
          <div className="flex items-center gap-2 mb-2 text-red-400">
            <AlertTriangle className="w-4 h-4" />
            <h3 className="text-[10px] font-bold uppercase tracking-widest">Over Plan</h3>
          </div>
          <p className="text-3xl font-black text-foreground">{summary.over}</p>
        </div>
        <div className="bg-card border border-border p-5 rounded-xl flex flex-col justify-between cursor-pointer hover:border-blue-500/50 transition-colors" onClick={() => setActiveFilter("Missing Actuals")}>
          <div className="flex items-center gap-2 mb-2 text-blue-400">
            <Search className="w-4 h-4" />
            <h3 className="text-[10px] font-bold uppercase tracking-widest">Needs Review</h3>
          </div>
          <p className="text-3xl font-black text-foreground">{summary.review}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-card border border-border p-4 rounded-xl mb-6 flex flex-col md:flex-row gap-4 justify-between md:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search ranch or block..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${
                activeFilter === filter 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-background border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Data List */}
      <div className="space-y-4">
        {filteredBlocks.length === 0 ? (
          <div className="p-12 text-center bg-card border border-border border-dashed rounded-xl text-muted-foreground">
            No blocks found matching current filters.
          </div>
        ) : (
          filteredBlocks.map(block => (
            <div key={block.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{block.ranchName}</p>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-black text-foreground">{block.name}</h3>
                    <Badge variant="outline" className={`text-[10px] uppercase tracking-widest ${
                      block.status === 'On Track' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                      block.status === 'Watch' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' :
                      'bg-red-500/10 text-red-400 border-red-500/30'
                    }`}>
                      {block.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Link href={`/pca/budget-watch/${block.id}`}>
                    <Button variant="outline" className="text-xs font-bold uppercase tracking-widest gap-2">
                      View Detail <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-border/50 bg-background/30 rounded-lg px-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Plan</p>
                  <p className="font-medium text-foreground">${block.plannedBudget.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Actual</p>
                  <p className="font-medium text-foreground">${block.actualSpend.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Variance $</p>
                  <p className={`font-black ${block.varianceAmount > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {block.varianceAmount > 0 ? '+' : ''}${block.varianceAmount.toLocaleString(undefined, {maximumFractionDigits: 0})}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Variance %</p>
                  <p className={`font-black ${block.varianceAmount > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {block.varianceAmount > 0 ? '+' : ''}{block.variancePercent.toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {block.missingActuals && (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-blue-400 bg-blue-400/10 px-2 py-1 rounded border border-blue-400/20">
                    <Search className="w-3 h-3" /> Missing Actuals
                  </span>
                )}
                {block.hasHighImpactRec && (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-purple-400 bg-purple-400/10 px-2 py-1 rounded border border-purple-400/20">
                    <AlertTriangle className="w-3 h-3" /> High Rec Impact
                  </span>
                )}
                {Math.random() > 0.7 && ( // Mock notes indicator
                   <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-background px-2 py-1 rounded border border-border">
                     <MessageSquareText className="w-3 h-3" /> 1 Note
                   </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}