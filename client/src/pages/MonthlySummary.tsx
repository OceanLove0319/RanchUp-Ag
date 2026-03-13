import { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { useRanches, useBlocks, useChemicalApps } from "@/hooks/useData";
import { Link } from "wouter";
import { ArrowLeft, BarChart, DollarSign, Activity, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

export default function MonthlySummary() {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  
  const activeRanchId = useStore(s => s.activeRanchId);
  const { data: allRanches = [] } = useRanches();
  const activeRanch = allRanches.find(r => r.id === activeRanchId);
  const { data: allBlocks = [] } = useBlocks(activeRanchId);
  const { data: allApps = [] } = useChemicalApps(activeRanchId);
  
  const blocks = useMemo(() => allBlocks.filter(b => b.ranchId === activeRanchId), [allBlocks, activeRanchId]);
  
  const monthPrefix = selectedMonth; // "YYYY-MM"
  
  const apps = useMemo(() => allApps.filter(a => 
      a.ranchId === activeRanchId && 
      a.dateApplied.startsWith(monthPrefix)
    ), [allApps, activeRanchId, monthPrefix]);

  const totalLogs = apps.length;
  const totalSpend = apps.reduce((sum, app) => sum + (app.estimatedCost || 0), 0);
  const mismatchedFlags = apps.filter(a => a.costStatus === 'UNIT_MISMATCH').length;

  // Spend by Block
  const spendByBlock = blocks.map(block => {
    const blockApps = apps.filter(a => a.blockId === block.id);
    const spend = blockApps.reduce((sum, app) => sum + (app.estimatedCost || 0), 0);
    return { name: block.name, acreage: block.acreage, spend, logs: blockApps.length };
  }).sort((a, b) => b.spend - a.spend);

  // Spend by Type
  const spendByType = apps.reduce((acc, app) => {
    const method = app.method ?? "Unknown";
    acc[method] = (acc[method] || 0) + (app.estimatedCost || 0);
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-6">
        <Link href="/app" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
      </div>

      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 text-primary mb-2">
            <BarChart className="w-6 h-6" />
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white">Monthly Summary</h1>
          </div>
          <p className="text-gray-400 font-medium">Aggregated spend and activity for {activeRanch?.name || "Ranch"}</p>
        </div>
        
        <div className="bg-[#111113] border border-white/10 p-4 rounded-lg">
          <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Select Month</label>
          <input 
            type="month" 
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="bg-transparent border-b border-border text-sm font-bold text-foreground focus:outline-none focus:border-primary w-full"
          />
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-card border border-border p-6 rounded-lg flex flex-col">
          <div className="flex items-center gap-3 mb-4 text-white">
            <DollarSign className="w-5 h-5" />
            <h3 className="font-bold uppercase tracking-widest text-sm">Total Spend</h3>
          </div>
          <p className="text-4xl font-black text-white">${totalSpend.toLocaleString()}</p>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-2">Estimated cost this month</p>
        </div>

        <div className="bg-card border border-border p-6 rounded-lg flex flex-col">
          <div className="flex items-center gap-3 mb-4 text-blue-400">
            <Activity className="w-5 h-5" />
            <h3 className="font-bold uppercase tracking-widest text-sm">Total Logs</h3>
          </div>
          <p className="text-4xl font-black text-white">{totalLogs}</p>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-2">Recorded applications</p>
        </div>

        <div className="bg-card border border-border p-6 rounded-lg flex flex-col">
          <div className="flex items-center gap-3 mb-4 text-orange-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-bold uppercase tracking-widest text-sm">Error Flags</h3>
          </div>
          <p className="text-4xl font-black text-white">{mismatchedFlags}</p>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-2">Unit mismatches to review</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Spend by Block */}
        <div className="bg-[#111113] border border-white/10 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="font-black uppercase tracking-tight text-lg text-white">Spend by Block</h3>
          </div>
          <div className="divide-y divide-border/50">
            {spendByBlock.map((block, i) => (
              <div key={i} className="px-6 py-4 flex justify-between items-center">
                <div>
                  <p className="font-bold text-white">{block.name}</p>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{block.acreage} AC • {block.logs} Logs</p>
                </div>
                <div className="text-right font-black text-primary">
                  ${block.spend.toLocaleString()}
                </div>
              </div>
            ))}
            {spendByBlock.length === 0 && (
              <div className="px-6 py-8 text-center text-muted-foreground text-sm font-bold uppercase tracking-widest">No data</div>
            )}
          </div>
        </div>

        {/* Spend by Type */}
        <div className="bg-[#111113] border border-white/10 rounded-lg overflow-hidden h-fit">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="font-black uppercase tracking-tight text-lg text-white">Spend by Type</h3>
          </div>
          <div className="divide-y divide-border/50">
            {Object.entries(spendByType).map(([type, spend]) => (
              <div key={type} className="px-6 py-4 flex justify-between items-center">
                <p className="font-bold uppercase tracking-widest text-sm text-white">{type}</p>
                <div className="text-right font-black text-primary">
                  ${spend.toLocaleString()}
                </div>
              </div>
            ))}
            {Object.keys(spendByType).length === 0 && (
              <div className="px-6 py-8 text-center text-muted-foreground text-sm font-bold uppercase tracking-widest">No data</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
