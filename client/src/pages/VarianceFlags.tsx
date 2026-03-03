import { useState } from "react";
import { useStore } from "@/lib/store";
import { Link } from "wouter";
import { ArrowLeft, AlertTriangle, TrendingUp, DollarSign } from "lucide-react";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

export default function VarianceFlags() {
  const activeRanchId = useStore(s => s.activeRanchId);
  const activeRanch = useStore(s => s.ranches.find(r => r.id === activeRanchId));
  const blocks = useStore(s => s.blocks.filter(b => b.ranchId === activeRanchId));
  
  const today = new Date();
  const currentMonthPrefix = format(today, 'yyyy-MM');
  const lastMonthPrefix = format(subMonths(today, 1), 'yyyy-MM');

  // Filter apps by ranch
  const ranchApps = useStore(s => s.chemicalApps.filter(a => a.ranchId === activeRanchId));

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
    a.costStatus === 'UNIT_MISMATCH'
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
        {/* Section 1: Cost Spikes */}
        <section>
          <div className="flex items-center gap-2 border-b border-border pb-2 mb-4">
            <TrendingUp className="w-5 h-5 text-red-400" />
            <h2 className="text-xl font-black uppercase tracking-tight text-white">Top Cost Spikes</h2>
          </div>
          
          {costSpikes.length > 0 ? (
            <div className="space-y-3">
              {costSpikes.map(spike => (
                <div key={spike.blockId} className="bg-card border border-red-500/30 p-4 rounded-lg flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-lg">{spike.blockName}</h3>
                    <p className="text-sm text-muted-foreground">
                      ${spike.currentSpend.toLocaleString()} this month (vs ${spike.lastSpend.toLocaleString()})
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-red-500/10 px-3 py-1.5 rounded text-red-400 border border-red-500/20">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-black">+{spike.percentChange.toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#111113] border border-white/10 p-8 rounded-lg text-center text-muted-foreground">
              <span className="font-bold uppercase tracking-widest text-sm">No significant cost spikes this month.</span>
            </div>
          )}
        </section>

        {/* Section 2: Data Integrity (Unit Mismatches) */}
        <section>
          <div className="flex items-center gap-2 border-b border-border pb-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            <h2 className="text-xl font-black uppercase tracking-tight text-white">Data Mismatches</h2>
          </div>

          {Object.keys(mismatchesByBlock).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(mismatchesByBlock).map(([blockId, count]) => {
                const block = blocks.find(b => b.id === blockId);
                return (
                  <div key={blockId} className="bg-card border border-orange-400/30 p-4 rounded-lg flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white text-lg">{block?.name || 'Unknown Block'}</h3>
                      <p className="text-sm text-muted-foreground">Log entries with incompatible units</p>
                    </div>
                    <div className="flex items-center gap-2 bg-orange-400/10 px-3 py-1.5 rounded text-orange-400 border border-orange-400/20">
                      <span className="font-black">{count} Error{count > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-[#111113] border border-white/10 p-8 rounded-lg text-center text-muted-foreground">
              <span className="font-bold uppercase tracking-widest text-sm">No unit mismatch errors this month.</span>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
