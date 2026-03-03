import { useMemo } from "react";
import { Link, useLocation } from "wouter";
import { useStore } from "@/lib/store";
import { Copy, PlusCircle } from "lucide-react";
import { format } from "date-fns";

export default function BlockLogs({ blockId }: { blockId: string }) {
  const [, setLocation] = useLocation();
  const allLogs = useStore(s => s.logs);
  
  const logs = useMemo(() => 
    allLogs
      .filter(l => l.blockId === blockId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5),
    [allLogs, blockId]
  );
  
  const handleLogAgain = (log: any) => {
    // Navigate to quick log with query params to pre-fill
    setLocation(`/app/logs/new?blockId=${blockId}&action=${log.actionType}&material=${encodeURIComponent(log.material)}&amount=${log.amount}&unit=${log.unit}`);
  };

  return (
    <div className="bg-[#111113] border border-white/10 p-6 md:p-8 rounded-lg mb-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-black uppercase tracking-tight text-white mb-1">Recent Activity</h3>
          <p className="text-gray-400 font-medium">Last 5 logs for this block.</p>
        </div>
        <Link href={`/app/logs/new?blockId=${blockId}`} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-xs rounded hover:bg-primary/90 transition-colors">
          <PlusCircle className="w-4 h-4" /> Log New
        </Link>
      </div>

      {logs.length > 0 ? (
        <div className="space-y-3">
          {logs.map(log => (
            <div key={log.id} className="bg-card border border-border p-4 rounded-lg flex items-center justify-between group hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-10 rounded-full ${
                  log.actionType === 'SPRAY' ? 'bg-purple-400' : 
                  log.actionType === 'FERT' ? 'bg-orange-400' : 'bg-blue-400'
                }`} />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      {format(new Date(log.date), 'MMM d, yyyy')}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded text-white">
                      {log.actionType}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-black text-lg text-white">{log.material}</span>
                    <span className="text-sm font-medium text-gray-400">@ {log.amount} {log.unit}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => handleLogAgain(log)}
                className="flex items-center gap-2 px-3 py-2 border border-border rounded font-bold uppercase tracking-widest text-[10px] hover:bg-white/5 hover:text-primary transition-colors text-muted-foreground"
              >
                <Copy className="w-3 h-3" /> Log Again
              </button>
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
