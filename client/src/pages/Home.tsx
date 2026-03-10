import { useState, useMemo } from "react";
import { Link } from "wouter";
import { useStore } from "@/lib/store";
import { format } from "date-fns";
import { GuideMeRail } from "@/components/navigation/GuideMeRail";
import { Droplets, Sprout, ShieldAlert, Users, Printer, DollarSign, Calendar, Map, CheckCircle2, ClipboardList, AlertCircle, History, Package } from "lucide-react";

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
  const allRecommendations = useStore(s => s.recommendations) || [];

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

  const isPCA = user?.role === 'PCA';

  const pcaStats = useMemo(() => {
    if (!isPCA) return null;
    
    const ranchesCount = allRanches.length;
    const openRecs = allRecommendations.filter(r => r.status === 'DRAFT' || r.status === 'SENT' || r.status === 'PENDING').length;
    
    // blocks needing review based on missing info flags
    const blocksWithIssues = new Set<string>();
    allLogs.filter(l => l.amount === 0 || !l.unit).forEach(l => blocksWithIssues.add(l.blockId));
    allApps.filter(a => a.costStatus === 'UNIT_MISMATCH' || !a.estimatedCost).forEach(a => blocksWithIssues.add(a.blockId));
    
    return {
      ranches: ranchesCount,
      openRecs,
      blocksNeedingReview: blocksWithIssues.size
    };
  }, [isPCA, allRanches, allRecommendations, allLogs, allApps]);

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto flex flex-col min-h-[calc(100vh-100px)]">
      <header className="mb-4 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-foreground">
            {isPCA ? 'PCA Dashboard' : 'Ranch Dashboard'}
          </h1>
          <p className="text-muted-foreground font-medium text-sm flex items-center gap-2">
            {activeRanch?.name || 'Loading Ranch...'}
            {isPCA && <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded font-bold tracking-widest uppercase">PCA View</span>}
          </p>
        </div>
      </header>

      {/* PCA Summary Cards */}
      {isPCA && pcaStats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border p-6 rounded-xl flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black text-foreground">{pcaStats.ranches}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Ranches</span>
          </div>
          <div className="bg-card border border-border p-6 rounded-xl flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black text-blue-400">{pcaStats.openRecs}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Open Recs</span>
          </div>
          <div className="bg-card border border-amber-500/30 p-6 rounded-xl flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black text-amber-500">{pcaStats.blocksNeedingReview}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500/80 mt-1">Needs Review</span>
          </div>
        </div>
      )}

      {/* Primary Action Grid - Top */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {isPCA ? (
          <>
            <Link href="/app/recommendations" className="bg-[#1c2227] border border-[#2d4050] p-6 rounded-xl flex flex-col items-center justify-center gap-3 hover:bg-[#252f34] transition-colors shadow-sm">
              <div className="bg-blue-500/20 p-4 rounded-full text-blue-400">
                <ClipboardList className="w-8 h-8" />
              </div>
              <span className="font-black uppercase tracking-widest text-xs mt-1 text-center">Review Recommendations</span>
            </Link>
            
            <Link href="/app/reports/variance" className="bg-[#2a1a14] border border-[#503a2d] p-6 rounded-xl flex flex-col items-center justify-center gap-3 hover:bg-[#3a251b] transition-colors shadow-sm">
              <div className="bg-amber-500/20 p-4 rounded-full text-amber-500">
                <AlertCircle className="w-8 h-8" />
              </div>
              <span className="font-black uppercase tracking-widest text-xs mt-1 text-center">Blocks Needing Attention</span>
            </Link>

            <Link href="/app/log" className="bg-card border border-border p-6 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-primary/50 transition-colors shadow-sm">
              <div className="bg-muted p-4 rounded-full text-muted-foreground">
                <Map className="w-8 h-8" />
              </div>
              <span className="font-black uppercase tracking-widest text-xs mt-1 text-center">Log Field Observation</span>
            </Link>

            <Link href="/app/packets/season" className="bg-[#14271c] border border-[#2d503b] p-6 rounded-xl flex flex-col items-center justify-center gap-3 hover:bg-[#1b3425] transition-colors shadow-sm">
              <div className="bg-green-500/20 p-4 rounded-full text-green-400">
                <Printer className="w-8 h-8" />
              </div>
              <span className="font-black uppercase tracking-widest text-xs mt-1 text-center">Print PCA Packet</span>
            </Link>
          </>
        ) : (
          <>
            <Link href="/app/log?action=SPRAY" className="bg-[#1c1427] border border-[#3b2d50] p-6 rounded-xl flex flex-col items-center justify-center gap-3 hover:bg-[#251b34] transition-colors shadow-sm">
              <div className="bg-purple-500/20 p-4 rounded-full text-purple-400">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <span className="font-black uppercase tracking-widest text-sm mt-1">Log Spray</span>
            </Link>
            
            <Link href="/app/log?action=FERT" className="bg-[#271b14] border border-[#50352d] p-6 rounded-xl flex flex-col items-center justify-center gap-3 hover:bg-[#34241b] transition-colors shadow-sm">
              <div className="bg-orange-500/20 p-4 rounded-full text-orange-400">
                <Sprout className="w-8 h-8" />
              </div>
              <span className="font-black uppercase tracking-widest text-sm mt-1">Log Fert</span>
            </Link>

            <Link href="/app/log?action=IRRIGATE" className="bg-[#141b27] border border-[#2d3b50] p-6 rounded-xl flex flex-col items-center justify-center gap-3 hover:bg-[#1b2434] transition-colors shadow-sm">
              <div className="bg-blue-500/20 p-4 rounded-full text-blue-400">
                <Droplets className="w-8 h-8" />
              </div>
              <span className="font-black uppercase tracking-widest text-sm mt-1">Log Irrigate</span>
            </Link>

            <Link href="/app/log?action=LABOR" className="bg-card border border-border p-6 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-primary/50 transition-colors shadow-sm">
              <div className="bg-muted p-4 rounded-full text-muted-foreground">
                <Users className="w-8 h-8" />
              </div>
              <span className="font-black uppercase tracking-widest text-sm mt-1">Log Labor</span>
            </Link>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {isPCA ? (
          <>
            <Link href="/app/vault" className="bg-card border border-border p-5 rounded-xl flex items-center justify-center gap-3 hover:border-primary/50 transition-colors">
              <History className="w-6 h-6 text-foreground" />
              <span className="font-bold uppercase tracking-widest text-xs">View Spray History</span>
            </Link>
            <Link href="/app/inputs" className="bg-card border border-border p-5 rounded-xl flex items-center justify-center gap-3 hover:border-primary/50 transition-colors">
              <Package className="w-6 h-6 text-foreground" />
              <span className="font-bold uppercase tracking-widest text-xs">View Product Usage</span>
            </Link>
          </>
        ) : (
          <>
            <Link href="/app/blocks" className="bg-card border border-border p-5 rounded-xl flex items-center justify-center gap-3 hover:border-primary/50 transition-colors">
              <DollarSign className="w-6 h-6 text-green-400" />
              <span className="font-bold uppercase tracking-widest text-sm">Block Costs</span>
            </Link>
            <Link href="/app/packets/season" className="bg-card border border-border p-5 rounded-xl flex items-center justify-center gap-3 hover:border-primary/50 transition-colors">
              <Printer className="w-6 h-6 text-foreground" />
              <span className="font-bold uppercase tracking-widest text-sm">Print Packet</span>
            </Link>
          </>
        )}
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
            
            <div className="flex flex-wrap gap-2">
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
