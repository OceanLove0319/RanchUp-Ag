import { useState, useMemo } from "react";
import { Link } from "wouter";
import { useStore } from "@/lib/store";
import { GuidedStepRail, HomeStep } from "@/components/dashboard/GuidedStepRail";
import { TodayPanel } from "@/components/dashboard/TodayPanel";
import { LogPanel } from "@/components/dashboard/LogPanel";
import { ReviewPanel } from "@/components/dashboard/ReviewPanel";
import { PlanPanel } from "@/components/dashboard/PlanPanel";
import { SharePanel } from "@/components/dashboard/SharePanel";
import { format, subMonths } from "date-fns";

export default function Home() {
  const user = useStore(s => s.user);
  const activeRanchId = useStore(s => s.activeRanchId);
  const allRanches = useStore(s => s.ranches);
  
  // Extract specific ranch to avoid find() in selector
  const activeRanch = allRanches.find(r => r.id === activeRanchId);
  
  const [activeStep, setActiveStep] = useState<HomeStep>("TODAY");

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

  const renderActiveStep = () => {
    switch (activeStep) {
      case "TODAY": return <TodayPanel />;
      case "LOG": return <LogPanel />;
      case "REVIEW": return <ReviewPanel />;
      case "PLAN": return <PlanPanel />;
      case "SHARE": return <SharePanel />;
      default: return <TodayPanel />;
    }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-foreground mb-2">
          Run today without losing the season.
        </h1>
        <p className="text-muted-foreground font-medium">
          What needs attention, what to log, what to review, and what to share.
        </p>
      </header>

      <GuidedStepRail activeStep={activeStep} onStepChange={setActiveStep} />

      <div className="mb-12">
        {renderActiveStep()}
      </div>

      {/* Today's Work Widget */}
      {activeStep === "TODAY" && todayLogs.length > 0 && (
        <div className="mt-8 pt-8 border-t border-border animate-in fade-in duration-300">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-lg font-black uppercase tracking-tight">Today's Work</h2>
            <Link href="/app/share/today" className="text-xs font-bold text-primary hover:text-primary/80 uppercase tracking-widest">
              View Packet
            </Link>
          </div>
          
          <Link href="/app/share/today" className="block bg-card border border-border p-4 rounded-lg hover:border-primary/50 transition-colors group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4 text-sm font-bold">
                <span className="bg-background px-2 py-1 rounded border border-border">{todayBlocks.length} Blocks</span>
                <span className="text-muted-foreground">{todayTotals.acres.toFixed(1)} AC</span>
                <span className="text-primary">${todayTotals.spend.toLocaleString()} est</span>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">Details →</span>
            </div>
            
            <div className="flex gap-2 overflow-hidden">
              {todayBlocks.slice(0, 3).map(block => (
                <div key={block.id} className="bg-background border border-border px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap">
                  {block.name}
                </div>
              ))}
              {todayBlocks.length > 3 && (
                <div className="bg-background border border-border px-3 py-1.5 rounded-md text-xs font-medium text-muted-foreground">
                  +{todayBlocks.length - 3} more
                </div>
              )}
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
