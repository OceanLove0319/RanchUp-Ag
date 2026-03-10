import { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { Link, useLocation } from "wouter";
import { ArrowLeft, AlertTriangle, TrendingUp, DollarSign, CheckCircle2 } from "lucide-react";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function VarianceFlags() {
  const activeRanchId = useStore(s => s.activeRanchId);
  const activeRanch = useStore(s => s.ranches.find(r => r.id === activeRanchId));
  const allBlocks = useStore(s => s.blocks);
  const blocks = useMemo(() => allBlocks.filter(b => b.ranchId === activeRanchId), [allBlocks, activeRanchId]);
  
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const deriveNextStepFromAction = useStore(s => (s as any).deriveNextStepFromAction);

  const [resolvedIssues, setResolvedIssues] = useState<string[]>([]);
  
  const today = new Date();
  const currentMonthPrefix = format(today, 'yyyy-MM');
  const lastMonthPrefix = format(subMonths(today, 1), 'yyyy-MM');

  const allApps = useStore(s => s.chemicalApps);
  const ranchApps = useMemo(() => allApps.filter(a => a.ranchId === activeRanchId), [allApps, activeRanchId]);

  // 1. Calculate Month-over-Month Cost Spikes per Block
  const blockVariances = blocks.map(block => {
    const blockApps = ranchApps.filter(a => a.blockId === block.id);
    
    const currentSpend = blockApps
      .filter(a => a.dateApplied.startsWith(currentMonthPrefix))
      .reduce((sum, app) => sum + (app.estimatedCost || 0), 0);
      
    const lastSpend = blockApps
      .filter(a => a.dateApplied.startsWith(lastMonthPrefix))
      .reduce((sum, app) => sum + (app.estimatedCost || 0), 0);

    let percentChange = 0;
    if (lastSpend > 0) {
      percentChange = ((currentSpend - lastSpend) / lastSpend) * 100;
    } else if (currentSpend > 0) {
      percentChange = 100; // Infinite increase if last month was 0
    }

    return {
      blockId: block.id,
      blockName: block.name,
      currentSpend,
      lastSpend,
      percentChange,
      isSpike: percentChange > 20 && currentSpend > 500 // Arbitrary heuristic: >20% increase and meaningful dollars
    };
  }).sort((a, b) => b.percentChange - a.percentChange);

  // Top 10 Cost Spikes
  const costSpikes = blockVariances.filter(b => b.isSpike).slice(0, 10);

  // 2. Tally Unit Mismatches (current month)
  const unitMismatches = ranchApps.filter(a => 
    a.dateApplied.startsWith(currentMonthPrefix) && 
    a.costStatus === 'UNIT_MISMATCH' &&
    !resolvedIssues.includes(a.id)
  );

  const mismatchesByBlock = unitMismatches.reduce((acc, app) => {
    acc[app.blockId] = (acc[app.blockId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleResolveIssue = (blockId: string) => {
    // Find apps in this block to "resolve"
    const appsToResolve = unitMismatches.filter(a => a.blockId === blockId);
    setResolvedIssues(prev => [...prev, ...appsToResolve.map(a => a.id)]);
    
    if (deriveNextStepFromAction) {
      deriveNextStepFromAction("FIX_ISSUE");
    }
    
    // Check if there are other issues remaining after this
    const remainingIssues = Object.keys(mismatchesByBlock).length - 1;
    
    toast({
      title: "Issue Resolved",
      description: remainingIssues > 0 ? `${remainingIssues} blocks still need review.` : "All data issues resolved.",
      action: (
        <button 
          onClick={() => remainingIssues > 0 ? null : setLocation("/app/projections")}
          className="bg-primary text-primary-foreground px-3 py-1.5 rounded text-xs font-bold uppercase tracking-widest whitespace-nowrap"
        >
          {remainingIssues > 0 ? "Continue Review" : "Next: Plan"}
        </button>
      )
    });
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-6">
        <Link href="/app" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
      </div>

      <header className="mb-10">
        <div className="flex items-center gap-3 text-orange-400 mb-2">
          <AlertTriangle className="w-6 h-6" />
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white">Variance Flags</h1>
        </div>
        <p className="text-gray-400 font-medium">Actionable cost spikes and data errors for {activeRanch?.name || "Ranch"}</p>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-2">
          Comparing {format(today, 'MMMM')} vs {format(subMonths(today, 1), 'MMMM')}
        </p>
      </header>

      <div className="space-y-8">
        {/* Section 2: Data Integrity (Unit Mismatches) */}
        <section>
          <div className="flex items-center gap-2 border-b border-border pb-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            <h2 className="text-xl font-black uppercase tracking-tight text-white">Data Mismatches</h2>
          </div>

          {Object.keys(mismatchesByBlock).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(mismatchesByBlock).map(([blockId, count]) => {
                const block = blocks.find(b => b.id === blockId);
                return (
                  <div key={blockId} className="bg-card border border-orange-400/30 p-5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                    <div>
                      <h3 className="font-bold text-white text-lg">{block?.name || 'Unknown Block'}</h3>
                      <p className="text-sm text-muted-foreground">Log entries with incompatible units</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                      <div className="flex items-center justify-center gap-2 bg-orange-400/10 px-3 py-2 rounded-lg text-orange-400 border border-orange-400/20 w-full sm:w-auto">
                        <span className="font-black">{count} Error{count > 1 ? 's' : ''}</span>
                      </div>
                      <Button onClick={() => handleResolveIssue(blockId)} className="font-bold uppercase tracking-widest text-sm w-full sm:w-auto py-6">
                        Fix Issue
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-[#111113] border border-white/10 p-8 rounded-xl text-center flex flex-col items-center">
              <CheckCircle2 className="w-12 h-12 text-primary mb-4" />
              <span className="font-bold uppercase tracking-widest text-base text-white mb-2">No data issues to fix</span>
              <p className="text-sm text-muted-foreground">All logs and unit matches look good.</p>
            </div>
          )}
        </section>

        {/* Section 1: Cost Spikes */}
        <section>
          <div className="flex items-center gap-2 border-b border-border pb-2 mb-4">
            <TrendingUp className="w-5 h-5 text-red-400" />
            <h2 className="text-xl font-black uppercase tracking-tight text-white">Top Cost Spikes</h2>
          </div>
          
          {costSpikes.length > 0 ? (
            <div className="space-y-4">
              {costSpikes.map(spike => (
                <div key={spike.blockId} className="bg-card border border-red-500/30 p-5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                  <div>
                    <h3 className="font-bold text-white text-lg">{spike.blockName}</h3>
                    <p className="text-sm text-muted-foreground">
                      ${spike.currentSpend.toLocaleString()} this month (vs ${spike.lastSpend.toLocaleString()})
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 bg-red-500/10 px-4 py-3 rounded-lg text-red-400 border border-red-500/20 w-full sm:w-auto">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-black text-lg">+{spike.percentChange.toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#111113] border border-white/10 p-8 rounded-xl text-center text-muted-foreground">
              <span className="font-bold uppercase tracking-widest text-base">No significant cost spikes this month.</span>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
