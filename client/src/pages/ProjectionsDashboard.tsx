import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { Link, useLocation } from "wouter";
import { BarChart3, AlertCircle, ArrowRight, Settings } from "lucide-react";
import { summarizeBlockProjection } from "@/utils/projections";

export default function ProjectionsDashboard() {
  const [, setLocation] = useLocation();
  const activeRanchId = useStore(s => s.activeRanchId);
  const ranches = useStore(s => s.ranches);
  const allBlocks = useStore(s => s.blocks);
  const templates = useStore(s => s.templates);
  const projections = useStore(s => s.projections);
  const chemicals = useStore(s => s.chemicals);
  const chemicalApps = useStore(s => s.chemicalApps);

  const [selectedRanch, setSelectedRanch] = useState<string | "ALL">(activeRanchId || "ALL");
  const [needsSetupFilter, setNeedsSetupFilter] = useState(false);

  // Filter blocks
  const filteredBlocks = useMemo(() => {
    return allBlocks.filter(b => selectedRanch === "ALL" || b.ranchId === selectedRanch);
  }, [allBlocks, selectedRanch]);

  // Compute all summaries
  const summaries = useMemo(() => {
    return filteredBlocks.map(block => {
      const proj = projections.find(p => p.blockId === block.id);
      const temp = templates.find(t => t.id === proj?.templateId);
      return summarizeBlockProjection(block, proj, temp, chemicals, chemicalApps);
    });
  }, [filteredBlocks, projections, templates, chemicals, chemicalApps]);

  // KPI Math
  let totalPlanned = 0;
  let totalActual = 0;
  let setupCount = 0;

  const costDriversMap: Record<string, number> = {};

  summaries.forEach(s => {
    totalPlanned += s.plannedSeasonTotal;
    totalActual += s.actualToDate;
    if (s.template) setupCount++;

    s.computedLines.forEach(cl => {
      if (cl.plannedCost > 0) {
        costDriversMap[cl.line.materialName] = (costDriversMap[cl.line.materialName] || 0) + cl.plannedCost;
      }
    });
  });

  const totalRemaining = Math.max(totalPlanned - totalActual, 0);
  const totalOverUnder = totalActual - totalPlanned;

  const topDrivers = Object.entries(costDriversMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const displaySummaries = needsSetupFilter ? summaries.filter(s => !s.template) : summaries;

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white mb-4">Season Budget</h1>
        
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <select 
            value={selectedRanch}
            onChange={e => setSelectedRanch(e.target.value)}
            className="bg-[#111113] border border-border text-sm font-bold uppercase tracking-widest text-white px-4 py-2 rounded focus:outline-none focus:border-primary"
          >
            <option value="ALL">All Ranches</option>
            {ranches.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>

          <Link href="/app/projections/templates" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-white transition-colors border border-border px-4 py-2 rounded bg-card hover:bg-white/5">
            <Settings className="w-4 h-4" /> Manage Templates
          </Link>
        </div>
      </header>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border p-4 rounded-lg">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Planned Season</p>
          <p className="text-2xl font-black text-white">${totalPlanned.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-border p-4 rounded-lg">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Actual To-Date</p>
          <p className="text-2xl font-black text-blue-400">${totalActual.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-border p-4 rounded-lg">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Remaining</p>
          <p className="text-2xl font-black text-white">${totalRemaining.toLocaleString()}</p>
        </div>
        <div className={`bg-card border border-border p-4 rounded-lg ${totalOverUnder > 0 ? 'bg-red-500/10 border-red-500/30' : ''}`}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Over/Under</p>
          <p className={`text-2xl font-black ${totalOverUnder > 0 ? 'text-red-400' : 'text-green-400'}`}>
            {totalOverUnder > 0 ? '+' : ''}{totalOverUnder.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-8">
        <div className="bg-[#111113] border border-white/10 p-6 rounded-lg md:col-span-1">
          <h3 className="font-black uppercase tracking-tight text-white mb-4 border-b border-border pb-2">Setup Coverage</h3>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full border-4 border-primary flex items-center justify-center">
              <span className="text-xl font-black text-white">{Math.round((setupCount/Math.max(filteredBlocks.length,1))*100)}%</span>
            </div>
            <div>
              <p className="font-bold text-white">{setupCount} of {filteredBlocks.length}</p>
              <p className="text-xs text-muted-foreground">Blocks have a template</p>
            </div>
          </div>
        </div>

        <div className="bg-[#111113] border border-white/10 p-6 rounded-lg md:col-span-2">
          <h3 className="font-black uppercase tracking-tight text-white mb-4 border-b border-border pb-2">Top Cost Drivers (Planned)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            {topDrivers.length > 0 ? topDrivers.map(([mat, cost], i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-medium">{i+1}. {mat}</span>
                <span className="font-black text-white">${cost.toLocaleString()}</span>
              </div>
            )) : <p className="text-xs text-muted-foreground">Assign templates to calculate costs.</p>}
          </div>
        </div>
      </div>

      {/* Blocks Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border flex justify-between items-center bg-[#111113]">
          <h2 className="font-black uppercase tracking-tight text-white">Block Budgets</h2>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={needsSetupFilter} onChange={e => setNeedsSetupFilter(e.target.checked)} className="accent-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-orange-400">Needs Setup ({filteredBlocks.length - setupCount})</span>
          </label>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <th className="p-4">Block</th>
                <th className="p-4">Template</th>
                <th className="p-4 text-right">Planned</th>
                <th className="p-4 text-right">Actual</th>
                <th className="p-4 text-right">Remaining</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {displaySummaries.map((s) => (
                <tr 
                  key={s.block.id} 
                  onClick={() => setLocation(`/app/projections/block/${s.block.id}`)}
                  className="hover:bg-white/5 cursor-pointer transition-colors group"
                >
                  <td className="p-4">
                    <p className="font-bold text-white text-sm">{s.block.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{s.block.acreage} AC • {s.block.variety}</p>
                  </td>
                  <td className="p-4">
                    {s.template ? (
                      <span className="text-xs bg-white/10 px-2 py-1 rounded text-white">{s.template.name}</span>
                    ) : (
                      <span className="text-xs font-bold text-orange-400 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Setup Required</span>
                    )}
                  </td>
                  <td className="p-4 text-right font-medium text-white">${s.plannedSeasonTotal.toLocaleString()}</td>
                  <td className="p-4 text-right font-medium text-blue-400">${s.actualToDate.toLocaleString()}</td>
                  <td className="p-4 text-right font-medium text-white">${s.remaining.toLocaleString()}</td>
                  <td className="p-4 text-right">
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors ml-auto" />
                  </td>
                </tr>
              ))}
              {displaySummaries.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground font-bold uppercase tracking-widest">No blocks match criteria</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
