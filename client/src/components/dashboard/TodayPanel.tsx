import { useStore } from "@/lib/store";
import { Link } from "wouter";
import { Droplets, Sprout, ShieldAlert, ArrowRight, Play, CheckCircle2 } from "lucide-react";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import { BlockSuggestionsCard } from "@/components/blocks/BlockSuggestionsCard";
import { useState, useMemo } from "react";

export function TodayPanel() {
  const activeRanchId = useStore(s => s.activeRanchId);
  const allBlocks = useStore(s => s.blocks);
  const allLogs = useStore(s => s.logs);
  
  // Memoize filtered arrays to prevent infinite re-renders
  const blocks = useMemo(() => allBlocks.filter(b => b.ranchId === activeRanchId), [allBlocks, activeRanchId]);
  
  // Find blocks that need attention (e.g. no activity in a while, or specific season tags)
  // For MVP, just show top 3 blocks
  const priorityBlocks = useMemo(() => blocks.slice(0, 3), [blocks]);
  
  // Get very recent logs
  const recentLogs = useMemo(() => allLogs
    .filter(l => l.ranchId === activeRanchId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3), [allLogs, activeRanchId]);

  // Handle selected block safely to avoid loop
  const defaultBlockId = priorityBlocks.length > 0 ? priorityBlocks[0].id : null;
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(defaultBlockId);

  const formatLogDate = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      if (isToday(date)) return "Today";
      if (isYesterday(date)) return "Yesterday";
      return format(date, 'MMM d');
    } catch {
      return dateStr;
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'SPRAY': return <ShieldAlert className="w-4 h-4 text-purple-400" />;
      case 'FERT': return <Sprout className="w-4 h-4 text-orange-400" />;
      case 'IRRIGATE': return <Droplets className="w-4 h-4 text-blue-400" />;
      default: return <CheckCircle2 className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Priority Blocks */}
      <div>
        <h2 className="text-lg font-black uppercase tracking-tight mb-4 flex items-center gap-2">
          <Play className="w-5 h-5 text-primary fill-current" /> Active Blocks
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {priorityBlocks.map(block => (
            <div 
              key={block.id} 
              onClick={() => setSelectedBlockId(block.id)}
              className={`bg-card border p-4 rounded-lg cursor-pointer transition-all ${
                selectedBlockId === block.id 
                  ? "border-primary shadow-[0_0_15px_rgba(212,175,55,0.15)] ring-1 ring-primary/50" 
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg leading-tight">{block.name}</h3>
                <span className="text-xs font-bold bg-background border border-border px-1.5 py-0.5 rounded text-muted-foreground">
                  {block.acreage} AC
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{block.variety}</p>
              
              <div className="flex gap-2">
                <Link href={`/app/blocks/${block.id}`} className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded hover:bg-primary hover:text-primary-foreground transition-colors inline-block" onClick={e => e.stopPropagation()}>
                  Details
                </Link>
                <Link href={`/app/log?block=${block.id}`} className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-background border border-border px-2 py-1 rounded hover:text-foreground transition-colors inline-block" onClick={e => e.stopPropagation()}>
                  Log
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggestions for Selected Block */}
      {selectedBlockId && (
        <div className="bg-[#111113] border border-white/5 rounded-xl p-1 pb-4">
          <div className="px-4 py-3 border-b border-white/5 mb-4 flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Focus: {blocks.find(b => b.id === selectedBlockId)?.name}
            </span>
          </div>
          <div className="px-4">
            <BlockSuggestionsCard blockId={selectedBlockId} />
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div>
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-lg font-black uppercase tracking-tight">Recent Logs</h2>
          <Link href="/app/vault" className="text-xs font-bold text-primary hover:text-primary/80 uppercase tracking-widest flex items-center gap-1">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {recentLogs.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No recent activity on this ranch.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentLogs.map(log => {
                const block = blocks.find(b => b.id === log.blockId);
                return (
                  <div key={log.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-background rounded-md border border-border">
                        {getActionIcon(log.actionType)}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{log.material}</p>
                        <p className="text-xs text-muted-foreground">{block?.name || 'Unknown Block'} • {log.amount} {log.unit}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{formatLogDate(log.date)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
