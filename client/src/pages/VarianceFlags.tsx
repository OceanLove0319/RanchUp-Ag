import { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { Link, useLocation } from "wouter";
import { ArrowLeft, AlertTriangle, TrendingUp, DollarSign, CheckCircle2, ChevronRight } from "lucide-react";
import { format, subMonths } from "date-fns";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function VarianceFlags() {
  const user = useStore(s => s.user);
  const isPCA = user?.role === 'PCA';
  const allRanches = useStore(s => s.ranches);
  const activeRanchId = useStore(s => s.activeRanchId);
  const allBlocks = useStore(s => s.blocks);
  const allApps = useStore(s => s.chemicalApps);
  const allLogs = useStore(s => s.logs);
  
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const deriveNextStepFromAction = useStore(s => (s as any).deriveNextStepFromAction);

  const [resolvedIssues, setResolvedIssues] = useState<string[]>([]);
  
  const today = new Date();
  const currentMonthPrefix = format(today, 'yyyy-MM');
  const lastMonthPrefix = format(subMonths(today, 1), 'yyyy-MM');

  const handleResolveIssue = (blockId: string) => {
    // Basic mock resolution
    setResolvedIssues(prev => [...prev, blockId]);
    
    if (deriveNextStepFromAction) {
      deriveNextStepFromAction("FIX_ISSUE");
    }
    
    toast({
      title: "Issue Addressed",
      description: "Record has been updated.",
    });
  };

  // --------------------------------------------------------------------------------
  // PCA VIEW (All Ranches Exception Queue)
  // --------------------------------------------------------------------------------
  if (isPCA) {
    const issuesByRanch = useMemo(() => {
      const issues: Record<string, any[]> = {};
      
      allRanches.forEach(ranch => {
        issues[ranch.id] = [];
        
        const ranchApps = allApps.filter(a => a.ranchId === ranch.id);
        const ranchLogs = allLogs.filter(l => l.ranchId === ranch.id);

        ranchApps.forEach(app => {
          if (app.costStatus === 'UNIT_MISMATCH' || !app.estimatedCost || !app.rateValue) {
            const block = allBlocks.find(b => b.id === app.blockId);
            issues[ranch.id].push({
              id: app.id,
              blockId: block?.id,
              blockName: block?.name || 'Unknown Block',
              date: app.dateApplied,
              type: 'Missing Information',
              desc: `Application record for ${app.productName} is missing unit or cost data.`,
              severity: 'high'
            });
          }
        });

        ranchLogs.forEach(log => {
          if (!log.amount || !log.unit) {
            const block = allBlocks.find(b => b.id === log.blockId);
            issues[ranch.id].push({
              id: log.id,
              blockId: block?.id,
              blockName: block?.name || 'Unknown Block',
              date: log.date,
              type: 'Incomplete Log',
              desc: `Log for ${log.material} is missing amount or units.`,
              severity: 'medium'
            });
          }
        });
      });

      return issues;
    }, [allRanches, allApps, allLogs, allBlocks]);

    return (
      <div className="animate-in fade-in duration-500 max-w-4xl mx-auto pb-20">
        <div className="flex justify-between items-center mb-6">
          <Link href="/app" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" /> Command Center
          </Link>
        </div>

        <header className="mb-8">
          <div className="flex items-center gap-3 text-red-400 mb-2">
            <AlertTriangle className="w-8 h-8" />
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-foreground">Records Review</h1>
          </div>
          <p className="text-muted-foreground font-medium text-lg">Clean up exceptions and missing data before exporting.</p>
        </header>

        <div className="space-y-8">
          {allRanches.map(ranch => {
            const ranchIssues = issuesByRanch[ranch.id]?.filter(issue => !resolvedIssues.includes(issue.blockId)) || [];
            if (ranchIssues.length === 0) return null;

            return (
              <div key={ranch.id} className="space-y-3">
                <h2 className="text-lg font-black uppercase tracking-widest text-foreground border-b border-border pb-2">
                  {ranch.name} <span className="text-red-400 ml-2">({ranchIssues.length})</span>
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  {ranchIssues.map(issue => (
                    <div key={issue.id} className="bg-card border border-red-500/20 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-red-500/50 transition-colors">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-[10px] uppercase tracking-widest border-red-500/30 text-red-400 bg-red-500/10">
                            {issue.type}
                          </Badge>
                          <span className="text-xs font-bold text-muted-foreground">{format(new Date(issue.date), 'MMM d')}</span>
                        </div>
                        <h3 className="font-bold text-foreground text-base">Block: {issue.blockName}</h3>
                        <p className="text-sm text-muted-foreground">{issue.desc}</p>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                        <Button 
                          variant="outline" 
                          className="w-full sm:w-auto text-xs font-black uppercase tracking-widest"
                          onClick={() => handleResolveIssue(issue.blockId)}
                        >
                          Mark Reviewed
                        </Button>
                        <Button 
                          className="w-full sm:w-auto text-xs font-black uppercase tracking-widest bg-background border border-border hover:border-primary/50 text-foreground"
                          onClick={() => handleResolveIssue(issue.blockId)}
                        >
                          Fix Issue
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {Object.values(issuesByRanch).flat().filter(issue => !resolvedIssues.includes(issue.blockId)).length === 0 && (
            <div className="text-center p-12 bg-card border border-border border-dashed rounded-xl">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4 opacity-80" />
              <h3 className="text-lg font-bold text-foreground mb-1">All Records Clean</h3>
              <p className="text-muted-foreground text-sm">No data issues found across your managed ranches.</p>
            </div>
          )}
        </div>
      </div>
    );
  }


  // --------------------------------------------------------------------------------
  // GROWER VIEW (Active Ranch Variances)
  // --------------------------------------------------------------------------------
  const activeRanch = allRanches.find(r => r.id === activeRanchId);
  const blocks = useMemo(() => allBlocks.filter(b => b.ranchId === activeRanchId), [allBlocks, activeRanchId]);
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
    !resolvedIssues.includes(a.blockId)
  );

  const mismatchesByBlock = unitMismatches.reduce((acc, app) => {
    acc[app.blockId] = (acc[app.blockId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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
