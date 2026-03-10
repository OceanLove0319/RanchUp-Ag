import { Link } from "wouter";
import { CheckCircle2, AlertCircle, FileText, SprayCan, Sprout, Map, ClipboardList } from "lucide-react";
import { useStore } from "@/lib/store";
import { isWithin } from "@/utils/dates";
import { getActiveSeasonWindow } from "@/utils/season";
import { useMemo } from "react";

export function GuideMeRail() {
  const activeRanchId = useStore(s => s.activeRanchId);
  const user = useStore(s => s.user);
  const allBlocks = useStore(s => s.blocks);
  const allLogs = useStore(s => s.logs);
  const allChemicalApps = useStore(s => s.chemicalApps);
  const allRecommendations = useStore(s => s.recommendations) || [];

  const blocks = useMemo(() => allBlocks.filter(b => b.ranchId === activeRanchId), [allBlocks, activeRanchId]);
  const logs = useMemo(() => allLogs.filter(l => l.ranchId === activeRanchId), [allLogs, activeRanchId]);
  const chemicalApps = useMemo(() => allChemicalApps.filter(a => a.ranchId === activeRanchId), [allChemicalApps, activeRanchId]);
  const recs = useMemo(() => allRecommendations.filter(r => r.ranchId === activeRanchId), [allRecommendations, activeRanchId]);
  
  // Find incomplete entries (missing rate or cost info)
  const incompleteApps = useMemo(() => chemicalApps.filter(a => a.costStatus === "UNIT_MISMATCH" || !a.estimatedCost), [chemicalApps]);
  
  const isPCA = user?.role === 'PCA';

  // Tasks to show
  const tasks = [];
  
  if (isPCA) {
    // PCA Tasks
    const pendingRecs = recs.filter(r => r.status === 'DRAFT' || r.status === 'SENT' || r.status === 'PENDING');
    if (pendingRecs.length > 0) {
       tasks.push({
          id: "review-recs",
          title: `${pendingRecs.length} Pending Recs`,
          icon: ClipboardList,
          link: "/app/recommendations",
          color: "text-blue-400",
          bg: "bg-blue-400/10"
       });
    }
    
    // If there are incomplete apps, suggest fixing them
    if (incompleteApps.length > 0) {
      tasks.push({
        id: "fix-missing",
        title: `${incompleteApps.length} Missing Info Flags`,
        icon: AlertCircle,
        link: "/app/reports/variance",
        color: "text-amber-400",
        bg: "bg-amber-400/10"
      });
    }

    // Packet printing task
    tasks.push({
      id: "print-packet",
      title: "Print PCA Packet",
      icon: FileText,
      link: "/app/packets/season",
      color: "text-green-400",
      bg: "bg-green-400/10"
    });
  } else {
    // Grower Tasks
    
    // Always show today's work task
    tasks.push({
      id: "log-today",
      title: "Log Today's Work",
      icon: SprayCan,
      link: "/app/log",
      color: "text-purple-400",
      bg: "bg-purple-400/10"
    });

    // If there are incomplete apps, suggest fixing them
    if (incompleteApps.length > 0) {
      tasks.push({
        id: "fix-missing",
        title: `${incompleteApps.length} Missing Info Flags`,
        icon: AlertCircle,
        link: "/app/reports/variance",
        color: "text-amber-400",
        bg: "bg-amber-400/10"
      });
    }

    // Find blocks with recent activity for review
    if (blocks.length > 0 && chemicalApps.length > 0) {
      const recentBlock = blocks[0]; // Just demo logic
      tasks.push({
        id: "review-block",
        title: `Review ${recentBlock.name} Cost`,
        icon: Map,
        link: `/app/blocks/${recentBlock.id}`,
        color: "text-blue-400",
        bg: "bg-blue-400/10"
      });
    }

    // Packet printing task
    tasks.push({
      id: "print-packet",
      title: "Print Season Packet",
      icon: FileText,
      link: "/app/packets/season",
      color: "text-green-400",
      bg: "bg-green-400/10"
    });
  }

  return (
    <div className="bg-card border-y border-border overflow-hidden">
      <div className="px-4 py-2 bg-muted/30 border-b border-border">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{isPCA ? 'PCA Priorities' : 'Keep Me On Track'}</span>
      </div>
      <div className="flex flex-col sm:flex-row py-3 px-4 gap-3">
        {tasks.map(task => {
          const Icon = task.icon;
          return (
            <Link key={task.id} href={task.link} className="flex items-center gap-3 bg-background border border-border p-3 rounded-lg hover:border-primary/50 transition-colors w-full sm:w-auto">
              <div className={`p-2 rounded-md ${task.bg} ${task.color} flex-shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold tracking-tight">{task.title}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
