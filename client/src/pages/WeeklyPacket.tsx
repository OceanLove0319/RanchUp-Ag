import { useState } from "react";
import { useStore } from "@/lib/store";
import { Link } from "wouter";
import { ArrowLeft, Printer, FileText, AlertTriangle } from "lucide-react";
import { format, subDays } from "date-fns";

export default function WeeklyPacket() {
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 7), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  
  const activeRanchId = useStore(s => s.activeRanchId);
  const activeRanch = useStore(s => s.ranches.find(r => r.id === activeRanchId));
  const blocks = useStore(s => s.blocks.filter(b => b.ranchId === activeRanchId));
  
  // Combine logs and chem apps for a full picture (or just use chem apps for cost, logs for generic)
  // For the pilot, let's use Chemical Apps since they have the computed cost and status.
  const apps = useStore(s => 
    s.chemicalApps.filter(a => 
      a.ranchId === activeRanchId && 
      a.dateApplied >= startDate && 
      a.dateApplied <= endDate
    ).sort((a, b) => new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime())
  );

  const groupedByBlock = blocks.reduce((acc, block) => {
    const blockApps = apps.filter(a => a.blockId === block.id);
    if (blockApps.length > 0) acc[block.id] = blockApps;
    return acc;
  }, {} as Record<string, typeof apps>);

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-6">
        <Link href="/app" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
        <button 
          onClick={() => window.print()}
          className="flex items-center text-xs font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
        >
          <Printer className="w-4 h-4 mr-2" /> Print Packet
        </button>
      </div>

      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 text-primary mb-2">
            <FileText className="w-6 h-6" />
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white">Weekly Packet</h1>
          </div>
          <p className="text-gray-400 font-medium">Compliance and activity report for {activeRanch?.name || "Ranch"}</p>
        </div>
        
        <div className="flex items-center gap-4 bg-[#111113] border border-white/10 p-4 rounded-lg">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Start Date</label>
            <input 
              type="date" 
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="bg-transparent border-b border-border text-sm text-foreground focus:outline-none focus:border-primary"
            />
          </div>
          <span className="text-muted-foreground">to</span>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">End Date</label>
            <input 
              type="date" 
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="bg-transparent border-b border-border text-sm text-foreground focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </header>

      {Object.keys(groupedByBlock).length === 0 ? (
        <div className="bg-card border border-border border-dashed p-12 rounded-lg text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-black uppercase tracking-tight text-white mb-2">No Records Found</h3>
          <p className="text-muted-foreground font-medium">Try adjusting your date range or log some new activity.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedByBlock).map(([blockId, blockApps]) => {
            const block = blocks.find(b => b.id === blockId);
            if (!block) return null;
            
            return (
              <div key={blockId} className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="bg-[#111113] border-b border-border px-6 py-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tight text-white">{block.name}</h2>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">{block.acreage} ACRES • {block.variety}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-white">{blockApps.length} Logs</span>
                  </div>
                </div>
                
                <div className="divide-y divide-border/50">
                  {blockApps.map(app => (
                    <div key={app.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="mt-1">
                          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground block w-16">
                            {format(new Date(app.dateApplied), 'MMM d')}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded text-white">
                              {app.method}
                            </span>
                            {app.costStatus === 'UNIT_MISMATCH' && (
                              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded border border-orange-400/30">
                                <AlertTriangle className="w-3 h-3" /> Mismatch
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-black text-white">{app.chemicalName}</h3>
                          {app.notes && <p className="text-sm text-gray-400 mt-1">{app.notes}</p>}
                        </div>
                      </div>
                      <div className="text-left md:text-right pl-20 md:pl-0">
                        {app.estimatedCost ? (
                          <div className="text-lg font-black text-white">${app.estimatedCost.toLocaleString()}</div>
                        ) : (
                          <div className="text-lg font-black text-muted-foreground">—</div>
                        )}
                        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Est. Cost</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
