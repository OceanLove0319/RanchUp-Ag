import { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useStore } from "@/lib/store";
import { format } from "date-fns";
import { GuideMeRail } from "@/components/navigation/GuideMeRail";
import { Droplets, Sprout, ShieldAlert, Users, Printer, DollarSign, Calendar, Map as MapIcon, CheckCircle2, ClipboardList, AlertCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const user = useStore(s => s.user);
  const activeRanchId = useStore(s => s.activeRanchId);
  const setActiveRanchId = useStore(s => s.setActiveRanch);
  const allRanches = useStore(s => s.ranches);
  const [, setLocation] = useLocation();
  
  const activeRanch = allRanches.find(r => r.id === activeRanchId);
  
  // Get Today's Work Data
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const allLogs = useStore(s => s.logs);
  const allBlocks = useStore(s => s.blocks);
  const allApps = useStore(s => s.chemicalApps);
  const allRecommendations = useStore(s => s.recommendations) || [];

  const isPCA = user?.role === 'PCA';
  const [pcaView, setPcaView] = useState<'ALL' | 'RANCH'>('ALL');

  // If ranch changes externally (via shell nav), switch to ranch view
  useEffect(() => {
    if (isPCA && activeRanchId) {
      // We don't auto-switch here because it prevents going back to ALL if the global state remains.
      // But we need a way to go back.
    }
  }, [activeRanchId, isPCA]);

  const pcaStats = useMemo(() => {
    if (!isPCA) return null;
    
    let needsAttentionRanches = 0;
    let pendingFollowThroughTotal = 0;
    let recordsBlockingTotal = 0;
    
    const ranchesWithStats = allRanches.map(ranch => {
      const ranchBlocks = allBlocks.filter(b => b.ranchId === ranch.id);
      const ranchRecs = allRecommendations.filter(r => r.ranchId === ranch.id);
      const ranchApps = allApps.filter(a => a.ranchId === ranch.id);
      const ranchLogs = allLogs.filter(l => l.ranchId === ranch.id);

      const openRecs = ranchRecs.filter(r => r.status === 'DRAFT' || r.status === 'SENT').length;
      const pendingFollowThrough = ranchRecs.filter(r => r.status === 'PENDING' || r.status === 'ACKNOWLEDGED').length;
      
      const missingInfoApps = ranchApps.filter(a => a.costStatus === 'UNIT_MISMATCH' || !a.estimatedCost || !a.rateValue || !a.targetPest).length;
      const missingInfoLogs = ranchLogs.filter(l => !l.amount || !l.unit).length;
      const recordIssues = missingInfoApps + missingInfoLogs;

      const isClean = pendingFollowThrough === 0 && recordIssues === 0 && openRecs === 0;
      if (!isClean) needsAttentionRanches++;
      
      pendingFollowThroughTotal += pendingFollowThrough;
      recordsBlockingTotal += recordIssues;

      let overallStatus = "Clean";
      if (recordIssues > 0) overallStatus = "Needs Record Cleanup";
      else if (pendingFollowThrough > 0) overallStatus = "Needs Follow-Up";
      else if (openRecs > 0) overallStatus = "Has Open Recs";

      return {
        ...ranch,
        openRecs,
        pendingFollowThrough,
        recordIssues,
        isClean,
        overallStatus,
        ranchBlocks
      };
    });
    
    return {
      ranchesCount: allRanches.length,
      needsAttentionRanches,
      pendingFollowThroughTotal,
      recordsBlockingTotal,
      ranches: ranchesWithStats
    };
  }, [isPCA, allRanches, allRecommendations, allLogs, allApps, allBlocks]);

  const handleOpenRanch = (id: string) => {
    setActiveRanchId(id);
    setPcaView('RANCH');
  };

  // --------------------------------------------------------------------------------
  // PCA: ALL RANCHES VIEW
  // --------------------------------------------------------------------------------
  if (isPCA && pcaView === 'ALL' && pcaStats) {
    return (
      <div className="animate-in fade-in duration-500 max-w-4xl mx-auto pb-20">
        <header className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-foreground">
              PCA Command Center
            </h1>
            <p className="text-muted-foreground font-medium text-sm flex items-center gap-2">
              {user?.name} • {user?.org}
            </p>
          </div>
          <Link href="/app/packets/season">
            <button className="bg-card border border-border text-foreground px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:border-primary/50 transition-colors">
              Export
            </button>
          </Link>
        </header>

        {/* Top Summary Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <div className="bg-card border border-border p-4 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
            <span className="text-2xl font-black text-foreground">{pcaStats.ranchesCount}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1 text-balance">Ranches Managed</span>
          </div>
          <div className="bg-card border border-border p-4 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
            <span className="text-2xl font-black text-amber-500">{pcaStats.needsAttentionRanches}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500/80 mt-1 text-balance">Needs Attention</span>
          </div>
          <div className="bg-card border border-border p-4 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
            <span className="text-2xl font-black text-purple-400">{pcaStats.pendingFollowThroughTotal}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400/80 mt-1 text-balance">Pending Follow-Through</span>
          </div>
          <div className="bg-card border border-border p-4 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
            <span className="text-2xl font-black text-red-400">{pcaStats.recordsBlockingTotal}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-red-400/80 mt-1 text-balance">Records Blocking Export</span>
          </div>
        </div>

        {/* Ranch List */}
        <div className="space-y-4">
          <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-2">All Ranches</h2>
          {pcaStats.ranches.map(ranch => (
            <button 
              key={ranch.id}
              onClick={() => handleOpenRanch(ranch.id)}
              className="w-full bg-card border border-border p-5 rounded-xl hover:border-primary/50 transition-colors text-left flex flex-col md:flex-row justify-between gap-4 shadow-sm group"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-xl text-foreground">{ranch.name}</h3>
                  <Badge variant="outline" className={`text-[10px] uppercase tracking-widest ${ranch.isClean ? 'text-green-400 border-green-400/30' : ranch.recordIssues > 0 ? 'text-red-400 border-red-400/30' : 'text-amber-400 border-amber-400/30'}`}>
                    {ranch.overallStatus}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground font-medium flex gap-3">
                  <span>{ranch.ranchBlocks.length} Blocks</span>
                  <span>{ranch.openRecs} Open Recs</span>
                  <span className={ranch.pendingFollowThrough > 0 ? "text-purple-400" : ""}>{ranch.pendingFollowThrough} Pending</span>
                  <span className={ranch.recordIssues > 0 ? "text-red-400 font-bold" : ""}>{ranch.recordIssues} Record Issues</span>
                </p>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {ranch.isClean ? <span className="text-green-400">Packet Ready</span> : <span className="text-muted-foreground/50">Not Ready</span>}
                </div>
                <div className="bg-primary/10 text-primary px-4 py-3 rounded-lg text-xs font-black uppercase tracking-widest group-hover:bg-primary group-hover:text-primary-foreground transition-colors flex items-center gap-2">
                  Open <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------------
  // PCA: SELECTED RANCH FOCUS VIEW
  // --------------------------------------------------------------------------------
  if (isPCA && pcaView === 'RANCH' && activeRanch) {
    const ranchStat = pcaStats?.ranches.find(r => r.id === activeRanch.id);
    const activeRanchRecs = allRecommendations.filter(r => r.ranchId === activeRanch.id);
    const activeRanchApps = allApps.filter(a => a.ranchId === activeRanch.id);
    
    const priorities = [];
    
    // Build priority list
    activeRanchRecs.filter(r => r.status === 'PENDING').forEach(rec => {
      const block = allBlocks.find(b => b.id === rec.blockId);
      priorities.push({
        id: `rec-${rec.id}`,
        type: 'follow-through',
        title: `${block?.name}: Rec pending`,
        desc: `Recommendation for ${rec.product} is waiting on grower.`,
        action: 'Review',
        link: `/app/blocks/${rec.blockId}`,
        color: 'text-purple-400',
        bg: 'bg-purple-400/10'
      });
    });

    activeRanchApps.filter(a => a.costStatus === 'UNIT_MISMATCH' || !a.estimatedCost).forEach(app => {
      const block = allBlocks.find(b => b.id === app.blockId);
      priorities.push({
        id: `app-${app.id}`,
        type: 'record-issue',
        title: `${block?.name}: Record Issue`,
        desc: `Application record for ${app.productName} is missing data.`,
        action: 'Fix',
        link: `/app/reports/variance`,
        color: 'text-red-400',
        bg: 'bg-red-400/10'
      });
    });

    return (
      <div className="animate-in fade-in duration-500 max-w-4xl mx-auto pb-20">
        <button 
          onClick={() => setPcaView('ALL')}
          className="flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> All Ranches
        </button>

        <header className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-foreground">
              {activeRanch.name}
            </h1>
            {ranchStat?.isClean && (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs py-1">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Packet Ready
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground font-medium text-sm flex gap-4">
            <span>{ranchStat?.ranchBlocks.length} Blocks</span>
            <span>{ranchStat?.openRecs} Open Recs</span>
            <span>{ranchStat?.pendingFollowThrough} Pending</span>
            <span>{ranchStat?.recordIssues} Record Issues</span>
          </p>
          <p className="mt-4 text-lg font-bold text-foreground">
            {ranchStat?.isClean 
              ? "This ranch is clean and packet-ready." 
              : `${ranchStat?.recordIssues} record issues are blocking a clean export.`}
          </p>
        </header>

        {priorities.length > 0 && (
          <div className="mb-10">
            <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> What needs attention
            </h2>
            <div className="space-y-3">
              {priorities.slice(0, 5).map(priority => (
                <div key={priority.id} className="bg-card border border-border p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-primary/30 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-md ${priority.bg} ${priority.color} shrink-0 mt-1`}>
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-foreground">{priority.title}</h3>
                      <p className="text-xs text-muted-foreground">{priority.desc}</p>
                    </div>
                  </div>
                  <Link href={priority.link} className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto bg-background border border-border px-6 py-3 rounded-lg text-xs font-black uppercase tracking-widest hover:border-primary hover:text-primary transition-colors">
                      {priority.action}
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Blocks</h2>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {ranchStat?.ranchBlocks.map(block => {
              const blockRecs = activeRanchRecs.filter(r => r.blockId === block.id);
              const latestRec = blockRecs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
              const blockApps = activeRanchApps.filter(a => a.blockId === block.id);
              const flagCount = blockApps.filter(a => a.costStatus === 'UNIT_MISMATCH' || !a.estimatedCost).length;

              return (
                <div key={block.id} className="bg-card border border-border p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-primary/50 transition-colors group">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{block.name}</h3>
                    <p className="text-xs text-muted-foreground">{block.variety} • {block.acreage} ac</p>
                  </div>
                  
                  <div className="flex flex-wrap md:flex-nowrap items-center gap-4 text-xs font-medium w-full md:w-auto flex-1 md:justify-end">
                    {latestRec ? (
                      <div className="flex flex-col">
                        <span className="text-muted-foreground/60 uppercase tracking-widest text-[10px] mb-0.5">Latest Rec</span>
                        <span className="text-blue-400">{latestRec.status}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <span className="text-muted-foreground/60 uppercase tracking-widest text-[10px] mb-0.5">Latest Rec</span>
                        <span className="text-muted-foreground">None</span>
                      </div>
                    )}
                    
                    <div className="flex flex-col ml-4">
                      <span className="text-muted-foreground/60 uppercase tracking-widest text-[10px] mb-0.5">Record Status</span>
                      <span className={flagCount > 0 ? "text-red-400 font-bold" : "text-green-400"}>
                        {flagCount > 0 ? `${flagCount} Flags` : 'Clean'}
                      </span>
                    </div>
                  </div>

                  <div className="w-full md:w-auto mt-2 md:mt-0">
                    <Link href={`/app/blocks/${block.id}`}>
                      <button className="w-full md:w-auto bg-background border border-border px-6 py-3 rounded-lg text-xs font-black uppercase tracking-widest group-hover:border-primary group-hover:text-primary transition-colors text-center">
                        Open
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------------
  // GROWER VIEW
  // --------------------------------------------------------------------------------
  
  const todayLogsGrower = allLogs.filter(l => l.ranchId === activeRanchId && l.date.startsWith(todayStr));
  const todayBlockIdsGrower = Array.from(new Set(todayLogsGrower.map(l => l.blockId)));
  const todayBlocksGrower = allBlocks.filter(b => todayBlockIdsGrower.includes(b.id));

  const todayTotalsGrower = useMemo(() => {
    let acres = 0;
    let spend = 0;
    todayBlocksGrower.forEach(b => acres += b.acreage);
    todayLogsGrower.forEach(log => {
      const app = allApps.find(a => a.id === `app-${log.id}`);
      if (app && app.estimatedCost && app.costStatus !== 'UNIT_MISMATCH') {
        spend += app.estimatedCost;
      }
    });
    return { acres, spend };
  }, [todayBlocksGrower, todayLogsGrower, allApps]);

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto flex flex-col min-h-[calc(100vh-100px)] pb-12">
      <header className="mb-4 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-foreground">
            Ranch Dashboard
          </h1>
          <p className="text-muted-foreground font-medium text-sm flex items-center gap-2">
            {activeRanch?.name || 'Loading Ranch...'}
          </p>
        </div>
      </header>

      {/* Guide Me Rail */}
      <div className="-mx-4 md:mx-0 mb-6">
        <GuideMeRail />
      </div>

      {/* Primary Action Grid - Top (Grower Only) */}
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

      {/* Today's Work Widget (Grower Only) */}
      {todayLogsGrower.length > 0 && (
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
                <span className="bg-background px-2 py-1 rounded border border-border">{todayBlocksGrower.length} Blocks</span>
                <span className="text-muted-foreground">{todayTotalsGrower.acres.toFixed(1)} AC</span>
                <span className="text-primary">${todayTotalsGrower.spend.toLocaleString()} est</span>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">Details →</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {todayBlocksGrower.slice(0, 3).map(block => (
                <div key={block.id} className="bg-background border border-border px-3 py-1.5 rounded-md text-xs font-bold whitespace-nowrap">
                  {block.name}
                </div>
              ))}
              {todayBlocksGrower.length > 3 && (
                <div className="bg-background border border-border px-3 py-1.5 rounded-md text-xs font-bold text-muted-foreground">
                  +{todayBlocksGrower.length - 3} more
                </div>
              )}
            </div>
          </Link>
        </div>
      )}
      
      {todayLogsGrower.length === 0 && (
        <div className="mt-2 animate-in fade-in duration-300 bg-card/50 border border-border border-dashed p-8 rounded-xl text-center flex flex-col items-center justify-center">
          <Calendar className="w-10 h-10 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-bold text-muted-foreground">No work logged today yet.</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Use the buttons above to log your first pass.</p>
        </div>
      )}
    </div>
  );
}
