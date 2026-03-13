import { useMemo } from "react";
import { Link, useLocation } from "wouter";
import { useStore } from "@/lib/store";
import { useFieldLogs, useChemicalApps } from "@/hooks/useData";
import { Copy, PlusCircle } from "lucide-react";
import { format } from "date-fns";

export default function BlockLogs({ blockId }: { blockId: string }) {
  const [, setLocation] = useLocation();
  const activeRanchId = useStore(s => s.activeRanchId);
  const { data: allLogs = [] } = useFieldLogs(activeRanchId);
  const { data: chemicalApps = [] } = useChemicalApps(activeRanchId);
  
  const logs = useMemo(() => 
    allLogs
      .filter(l => l.blockId === blockId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10),
    [allLogs, blockId]
  );
  
  const handleLogAgain = (log: any) => {
    // Navigate to quick log with query params to pre-fill
    setLocation(`/app/log?blockId=${blockId}&action=${log.actionType}&material=${encodeURIComponent(log.material)}&amount=${log.amount}&unit=${log.unit}`);
  };

  return (
    <div className="bg-[#111113] border border-white/10 p-6 md:p-8 rounded-lg mb-6 relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-black uppercase tracking-tight text-white mb-1">Block Timeline</h3>
          <p className="text-gray-400 font-medium text-sm">Recent activity log</p>
        </div>
      </div>

      {logs.length > 0 ? (
        <div className="relative border-l-2 border-border ml-3 pl-6 space-y-8">
          {logs.map(log => (
            <div key={log.id} className="relative group">
              <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-4 border-[#111113] ${
                  log.actionType === 'SPRAY' ? 'bg-purple-400' : 
                  log.actionType === 'FERT' ? 'bg-orange-400' : 
                  log.actionType === 'LABOR' ? 'bg-muted-foreground' : 'bg-blue-400'
                }`} 
              />
              
              <div className="bg-card border border-border p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/50 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      {format(new Date(log.date), 'MMM d, yyyy')}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded text-white border border-white/10">
                      {log.actionType}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-black text-lg text-white">{log.material}</span>
                    <span className="text-sm font-medium text-gray-400">@ {log.amount} {log.unit}</span>
                  </div>
                  {log.notes && (
                    <p className="text-sm text-gray-400 mt-2 italic">"{log.notes}"</p>
                  )}
                  {log.cost && (
                    <div className="mt-2 flex gap-3">
                      <p className="text-xs font-bold text-primary uppercase tracking-widest">${log.cost} Actual</p>
                      {chemicalApps.find(a => a.id === `app-${log.id}`)?.estimatedCost && (
                         <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">${chemicalApps.find(a => a.id === `app-${log.id}`)?.estimatedCost} Est</p>
                      )}
                    </div>
                  )}
                  {!log.cost && chemicalApps.find(a => a.id === `app-${log.id}`)?.estimatedCost && (
                     <p className="text-xs font-bold text-muted-foreground mt-2 uppercase tracking-widest">${chemicalApps.find(a => a.id === `app-${log.id}`)?.estimatedCost} Est</p>
                  )}
                </div>
                
                <div className="flex items-center gap-2 mt-2 md:mt-0">
                  <button 
                    onClick={() => handleLogAgain(log)}
                    className="flex items-center gap-2 px-3 py-2 bg-background border border-border rounded font-bold uppercase tracking-widest text-[10px] hover:bg-white/5 hover:text-primary transition-colors text-muted-foreground"
                  >
                    <Copy className="w-3 h-3" /> Log Again
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border border-dashed p-8 rounded-lg text-center text-muted-foreground font-bold uppercase tracking-widest text-sm">
          No recent activity for this block.
        </div>
      )}
    </div>
  );
}
