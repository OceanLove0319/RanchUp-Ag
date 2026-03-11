import { useState, useMemo } from "react";
import { Link } from "wouter";
import { useStore } from "@/lib/store";
import { format } from "date-fns";
import { GuideMeRail } from "@/components/navigation/GuideMeRail";
import { Droplets, Sprout, ShieldAlert, Users, Printer, DollarSign, Calendar, Map, CheckCircle2, ClipboardList, AlertCircle, History, Package, Clock, Activity, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
    const openRecs = allRecommendations.filter(r => r.status === 'DRAFT' || r.status === 'SENT').length;
    const awaitingFollowThrough = allRecommendations.filter(r => r.status === 'PENDING' || r.status === 'ACKNOWLEDGED').length;
    
    // blocks needing review based on missing info flags
    const appsNeedingReview = allApps.filter(a => 
      a.costStatus === 'UNIT_MISMATCH' || 
      !a.estimatedCost || 
      !a.rateValue || 
      !a.targetPest
    );
    
    return {
      ranches: ranchesCount,
      openRecs,
      awaitingFollowThrough,
      recordsNeedingReview: appsNeedingReview.length,
      recentRecs: allRecommendations.slice(0, 3),
      recentFlags: appsNeedingReview.slice(0, 3)
    };
  }, [isPCA, allRanches, allRecommendations, allLogs, allApps]);

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto flex flex-col min-h-[calc(100vh-100px)] pb-12">
      <header className="mb-4 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-foreground">
            {isPCA ? 'Command Center' : 'Ranch Dashboard'}
          </h1>
          <p className="text-muted-foreground font-medium text-sm flex items-center gap-2">
            {activeRanch?.name || 'Loading Ranch...'}
            {isPCA && <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded font-bold tracking-widest uppercase">PCA View</span>}
          </p>
        </div>
      </header>

      {/* Guide Me Rail */}
      <div className="-mx-4 md:mx-0 mb-6">
        <GuideMeRail />
      </div>

      {/* PCA Summary Cards */}
      {isPCA && pcaStats && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <div className="bg-card border border-border p-4 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
              <span className="text-2xl font-black text-foreground">{pcaStats.ranches}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1 text-balance">Ranches Managed</span>
            </div>
            <div className="bg-card border border-blue-500/20 p-4 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
              <span className="text-2xl font-black text-blue-400">{pcaStats.openRecs}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400/80 mt-1 text-balance">Open Recs</span>
            </div>
            <div className="bg-card border border-purple-500/20 p-4 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
              <span className="text-2xl font-black text-purple-400">{pcaStats.awaitingFollowThrough}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400/80 mt-1 text-balance">Awaiting Grower</span>
            </div>
            <div className="bg-card border border-amber-500/30 p-4 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
              <span className="text-2xl font-black text-amber-500">{pcaStats.recordsNeedingReview}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500/80 mt-1 text-balance">Records to Review</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Recent Recommendations */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <ClipboardList className="w-4 h-4" /> Recent Recommendations
                </h2>
                <Link href="/app/recommendations" className="text-xs font-bold text-primary hover:underline">View All</Link>
              </div>
              
              {pcaStats.recentRecs.length > 0 ? (
                <div className="space-y-2">
                  {pcaStats.recentRecs.map(rec => {
                    const block = allBlocks.find(b => b.id === rec.blockId);
                    return (
                      <Link key={rec.id} href="/app/recommendations" className="block bg-card border border-border p-4 rounded-xl hover:border-primary/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-sm">{rec.title}</h3>
                          <Badge variant="outline" className={`text-[10px] ${rec.status === 'APPLIED' ? 'text-green-400 border-green-400/30' : 'text-blue-400 border-blue-400/30'}`}>
                            {rec.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Map className="w-3 h-3" /> {block?.name || 'Unknown Block'}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <div className="bg-card/50 border border-border border-dashed p-6 rounded-xl text-center">
                  <p className="text-xs text-muted-foreground">No recent recommendations.</p>
                </div>
              )}
            </div>

            {/* Recent Record Flags */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Recent Record Flags
                </h2>
                <Link href="/app/reports/variance" className="text-xs font-bold text-primary hover:underline">Review All</Link>
              </div>
              
              {pcaStats.recentFlags.length > 0 ? (
                <div className="space-y-2">
                  {pcaStats.recentFlags.map(app => {
                    const block = allBlocks.find(b => b.id === app.blockId);
                    return (
                      <Link key={app.id} href="/app/reports/variance" className="block bg-card border border-amber-500/20 p-4 rounded-xl hover:border-amber-500/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-sm text-amber-500">Missing Information</h3>
                          <span className="text-[10px] text-muted-foreground">{format(new Date(app.dateApplied), 'MMM d')}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">
                          {app.productName} applied without complete data.
                        </p>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Map className="w-3 h-3" /> {block?.name || 'Unknown Block'}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <div className="bg-card/50 border border-border border-dashed p-6 rounded-xl text-center flex flex-col items-center justify-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-green-500/50" />
                  <p className="text-xs text-muted-foreground">No records currently flagged for review.</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-3">
            <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Activity className="w-4 h-4" /> Ranch Status Summary
            </h2>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="divide-y divide-border">
                {allRanches.map(ranch => {
                  const ranchRecs = allRecommendations.filter(r => r.ranchId === ranch.id);
                  const openRanchRecs = ranchRecs.filter(r => r.status === 'SENT' || r.status === 'PENDING').length;
                  const ranchFlags = allApps.filter(a => a.ranchId === ranch.id && (!a.estimatedCost || a.costStatus === 'UNIT_MISMATCH')).length;
                  
                  return (
                    <div key={ranch.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                      <div>
                        <h3 className="font-bold text-sm">{ranch.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {openRanchRecs} pending recs • {ranchFlags} flags
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {ranchFlags === 0 && openRanchRecs === 0 ? (
                          <Badge variant="outline" className="text-green-400 border-green-400/30 bg-green-400/10 text-[10px]">Clean</Badge>
                        ) : (
                          <Badge variant="outline" className="text-amber-400 border-amber-400/30 bg-amber-400/10 text-[10px]">Action Needed</Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Primary Action Grid - Top (Grower Only) */}
      {!isPCA && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
        </div>
      )}

      {!isPCA && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Link href="/app/blocks" className="bg-card border border-border p-5 rounded-xl flex items-center justify-center gap-3 hover:border-primary/50 transition-colors">
            <DollarSign className="w-6 h-6 text-green-400" />
            <span className="font-bold uppercase tracking-widest text-sm">Block Costs</span>
          </Link>
          <Link href="/app/packets/season" className="bg-card border border-border p-5 rounded-xl flex items-center justify-center gap-3 hover:border-primary/50 transition-colors">
            <Printer className="w-6 h-6 text-foreground" />
            <span className="font-bold uppercase tracking-widest text-sm">Print Packet</span>
          </Link>
        </div>
      )}

      {/* Today's Work Widget (Grower Only) */}
      {!isPCA && todayLogs.length > 0 && (
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
      
      {!isPCA && todayLogs.length === 0 && (
        <div className="mt-2 animate-in fade-in duration-300 bg-card/50 border border-border border-dashed p-8 rounded-xl text-center flex flex-col items-center justify-center">
          <Calendar className="w-10 h-10 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-bold text-muted-foreground">No work logged today yet.</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Use the buttons above to log your first pass.</p>
        </div>
      )}
    </div>
  );
}
