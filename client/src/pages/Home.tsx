import { useState, useMemo } from "react";
import { Link } from "wouter";
import { useStore } from "@/lib/store";
import { format } from "date-fns";
import { GuideMeRail } from "@/components/navigation/GuideMeRail";
import { Droplets, Sprout, ShieldAlert, Users, Printer, DollarSign, Calendar, Map } from "lucide-react";

export default function Home() {
  const user = useStore(s => s.user);
  const activeRanchId = useStore(s => s.activeRanchId);
  const allRanches = useStore(s => s.ranches);
  
  const activeRanch = allRanches.find(r => r.id === activeRanchId);
  
  // Get Today's Work Data
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const allLogs = useStore(s => s.logs);
  const allBlocks = useStore(s => s.blocks);
  const allApps = useStore(s => s.chemicalApps);

  const todayLogs = useMemo(() => 
    allLogs.filter(l => l.ranchId === activeRanchId && l.date.startsWith(todayStr))
  , [allLogs, activeRanchId, todayStr]);

  const todayBlockIds = Array.from(new Set(todayLogs.map(l => l.blockId)));
  const todayBlocks = allBlocks.filter(b => todayBlockIds.includes(b.id));

  const todayApps = useMemo(() => 
    allApps.filter(a => a.ranchId === activeRanchId && a.dateApplied.startsWith(todayStr))
  , [allApps, activeRanchId, todayStr]);

  const todayTotals = useMemo(() => {
    let acres = 0;
    let spend = 0;
    todayBlocks.forEach(b => acres += b.acreage);
    todayLogs.forEach(log => {
      const app = todayApps.find(a => a.id === `app-${log.id}`);
      if (app && app.estimatedCost && app.costStatus !== 'UNIT_MISMATCH') {
        spend += app.estimatedCost;
      }
    });
    return { acres, spend };
  }, [todayBlocks, todayLogs, todayApps]);

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto flex flex-col min-h-[calc(100vh-100px)]">
      <header className="mb-4">
        <h1 className="text-3xl font-black uppercase tracking-tighter text-foreground">
          Ranch Dashboard
        </h1>
        <p className="text-muted-foreground font-medium text-sm">
          {activeRanch?.name || 'Loading Ranch...'}
        </p>
      </header>

      {/* Primary Action Grid - Top */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Link href="/app/log?action=SPRAY" className="bg-[#1c1427] border border-[#3b2d50] p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-[#251b34] transition-colors shadow-sm">
          <div className="bg-purple-500/20 p-3 rounded-full text-purple-400">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <span className="font-black uppercase tracking-widest text-xs mt-1">Log Spray</span>
        </Link>
        
        <Link href="/app/log?action=FERT" className="bg-[#271b14] border border-[#50352d] p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-[#34241b] transition-colors shadow-sm">
          <div className="bg-orange-500/20 p-3 rounded-full text-orange-400">
            <Sprout className="w-8 h-8" />
          </div>
          <span className="font-black uppercase tracking-widest text-xs mt-1">Log Fert</span>
        </Link>

        <Link href="/app/log?action=IRRIGATE" className="bg-[#141b27] border border-[#2d3b50] p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-[#1b2434] transition-colors shadow-sm">
          <div className="bg-blue-500/20 p-3 rounded-full text-blue-400">
            <Droplets className="w-8 h-8" />
          </div>
          <span className="font-black uppercase tracking-widest text-xs mt-1">Log Irrigate</span>
        </Link>

        <Link href="/app/log?action=LABOR" className="bg-card border border-border p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors shadow-sm">
          <div className="bg-muted p-3 rounded-full text-muted-foreground">
            <Users className="w-8 h-8" />
          </div>
          <span className="font-black uppercase tracking-widest text-xs mt-1">Log Labor</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <Link href="/app/blocks" className="bg-card border border-border p-4 rounded-xl flex items-center justify-center gap-3 hover:border-primary/50 transition-colors">
          <DollarSign className="w-6 h-6 text-green-400" />
          <span className="font-bold uppercase tracking-widest text-sm">Block Costs</span>
        </Link>
        <Link href="/app/packets/season" className="bg-card border border-border p-4 rounded-xl flex items-center justify-center gap-3 hover:border-primary/50 transition-colors">
          <Printer className="w-6 h-6 text-foreground" />
          <span className="font-bold uppercase tracking-widest text-sm">Print Packet</span>
        </Link>
      </div>

      {/* Guide Me Rail */}
      <div className="-mx-4 md:mx-0 mb-6">
        <GuideMeRail />
      </div>

      {/* Today's Work Widget */}
      {todayLogs.length > 0 && (
        <div className="mt-2 animate-in fade-in duration-300">
          <div className="flex justify-between items-end mb-3">
            <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Today's Work</h2>
            <Link href="/app/packets/today" className="text-[10px] font-bold text-primary hover:text-primary/80 uppercase tracking-widest">
              View Packet
            </Link>
          </div>
          
          <Link href="/app/packets/today" className="block bg-card border border-border p-4 rounded-xl hover:border-primary/50 transition-colors group shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 text-sm font-bold">
                <span className="bg-background px-2 py-1 rounded border border-border">{todayBlocks.length} Blocks</span>
                <span className="text-muted-foreground">{todayTotals.acres.toFixed(1)} AC</span>
                <span className="text-primary">${todayTotals.spend.toLocaleString()} est</span>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">Details →</span>
            </div>
            
            <div className="flex gap-2 overflow-hidden">
              {todayBlocks.slice(0, 3).map(block => (
                <div key={block.id} className="bg-background border border-border px-3 py-1.5 rounded-md text-xs font-bold whitespace-nowrap">
                  {block.name}
                </div>
              ))}
              {todayBlocks.length > 3 && (
                <div className="bg-background border border-border px-3 py-1.5 rounded-md text-xs font-bold text-muted-foreground">
                  +{todayBlocks.length - 3} more
                </div>
              )}
            </div>
          </Link>
        </div>
      )}
      
      {todayLogs.length === 0 && (
        <div className="mt-2 animate-in fade-in duration-300 bg-card/50 border border-border border-dashed p-8 rounded-xl text-center flex flex-col items-center justify-center">
          <Calendar className="w-10 h-10 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-bold text-muted-foreground">No work logged today yet.</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Use the buttons above to log your first pass.</p>
        </div>
      )}
    </div>
  );
}
