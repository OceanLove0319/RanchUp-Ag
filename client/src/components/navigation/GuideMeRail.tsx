import { Link } from "wouter";
import { CheckCircle2, AlertCircle, FileText, SprayCan, Sprout, Map, ClipboardList, ChevronDown, ChevronUp } from "lucide-react";
import { useStore } from "@/lib/store";
import { isWithin } from "@/utils/dates";
import { getActiveSeasonWindow } from "@/utils/season";
import { useMemo, useState } from "react";

interface GuideMeRailProps {
  compact?: boolean;
}

export function GuideMeRail({ compact = false }: GuideMeRailProps) {
  const activeRanchId = useStore(s => s.activeRanchId);
  const user = useStore(s => s.user);
  const allBlocks = useStore(s => s.blocks);
  const allLogs = useStore(s => s.logs);
  const allChemicalApps = useStore(s => s.chemicalApps);
  const allRecommendations = useStore(s => s.recommendations) || [];
  
  const [isExpanded, setIsExpanded] = useState(true);

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
          title: `Review Approvals`,
          subtitle: `${pendingRecs.length} Pending Recs Across Ranches`,
          icon: ClipboardList,
          link: "/app/recommendations",
          color: "text-blue-400",
          bg: "bg-blue-400/10",
          border: "border-blue-400/20"
       });
    }
    
    // If there are incomplete apps, suggest fixing them
    if (incompleteApps.length > 0) {
      tasks.push({
        id: "fix-missing",
        title: `Fix Missing Info`,
        subtitle: `${incompleteApps.length} Flagged Records`,
        icon: AlertCircle,
        link: "/app/reports/variance",
        color: "text-amber-400",
        bg: "bg-amber-400/10",
        border: "border-amber-400/20"
      });
    }

    // Packet printing task
    tasks.push({
      id: "print-packet",
      title: "Print PCA Packet",
      subtitle: "Ready for Export",
      icon: FileText,
      link: "/app/packets/season",
      color: "text-green-400",
      bg: "bg-green-400/10",
      border: "border-green-400/20"
    });
  } else {
    // Grower Tasks
    
    // Always show today's work task
    tasks.push({
      id: "log-today",
      title: "Log Today's Work",
      subtitle: "Pending Entry",
      icon: SprayCan,
      link: "/app/log",
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      border: "border-purple-400/20"
    });

    // If there are incomplete apps, suggest fixing them
    if (incompleteApps.length > 0) {
      tasks.push({
        id: "fix-missing",
        title: `Fix Missing Info`,
        subtitle: `${incompleteApps.length} Flagged Records`,
        icon: AlertCircle,
        link: "/app/reports/variance",
        color: "text-amber-400",
        bg: "bg-amber-400/10",
        border: "border-amber-400/20"
      });
    }

    // Find blocks with recent activity for review
    if (blocks.length > 0 && chemicalApps.length > 0) {
      const recentBlock = blocks[0]; // Just demo logic
      tasks.push({
        id: "review-block",
        title: `Review Block Cost`,
        subtitle: `${recentBlock.name} • ${recentBlock.seasonGroup} Season`,
        icon: Map,
        link: `/app/blocks/${recentBlock.id}`,
        color: "text-blue-400",
        bg: "bg-blue-400/10",
        border: "border-blue-400/20"
      });
    }

    // Packet printing task
    tasks.push({
      id: "print-packet",
      title: "Print Season Packet",
      subtitle: "Ready for Export",
      icon: FileText,
      link: "/app/packets/season",
      color: "text-green-400",
      bg: "bg-green-400/10",
      border: "border-green-400/20"
    });
  }

  if (compact) {
    return (
      <div className="flex items-center gap-4 relative py-1 px-2">
        {/* Timeline connector line behind items */}
        <div className="absolute left-6 right-6 h-px bg-white/10 top-1/2 -translate-y-1/2 z-0" />
        
        {tasks.map((task, i) => {
          const Icon = task.icon;
          const isCompleted = i === 0 && !isPCA; // Mock completion for the first item for grower
          
          if (isCompleted && task.id === 'log-today') {
            task.subtitle = "Completed at 10:42 AM";
          }
          
          return (
            <div key={task.id} className="relative z-10 flex items-center group">
              <Link href={task.link} className={`flex items-center gap-3 bg-[#111113] border ${isCompleted ? 'border-green-500/30' : task.border} px-4 py-2.5 rounded-xl hover:border-white/30 hover:bg-[#1A1A1C] transition-all shadow-sm shrink-0 min-w-[220px]`}>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border ${isCompleted ? 'bg-green-500/10 text-green-500 border-green-500/20' : `${task.bg} ${task.color} ${task.border}`}`}>
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <div className="flex flex-col">
                  <span className={`text-sm font-bold ${isCompleted ? 'text-gray-400' : 'text-gray-100'} whitespace-nowrap leading-tight`}>{task.title}</span>
                  <span className={`text-[10px] uppercase tracking-widest leading-tight mt-1 ${isCompleted ? 'text-green-500/70' : 'text-muted-foreground'}`}>
                    {task.subtitle}
                  </span>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="bg-transparent mb-8">
      <div 
        className="flex items-center gap-3 mb-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{isPCA ? 'PCA Priorities' : 'Keep Me On Track'}</span>
        <div className="h-px bg-white/5 flex-1" />
      </div>
      
      <div className={`md:block ${isExpanded ? 'block' : 'hidden'}`}>
        <div className="flex flex-col sm:flex-row gap-3">
          {tasks.map(task => {
            const Icon = task.icon;
            return (
              <Link key={task.id} href={task.link} className={`flex items-center gap-3 bg-[#111113] border ${task.border} p-3 rounded-lg hover:bg-white/5 transition-colors w-full sm:w-auto shrink-0 shadow-sm group`}>
                <div className={`p-2 rounded-md ${task.bg} ${task.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">{task.title}</span>
                  {task.subtitle && <span className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">{task.subtitle}</span>}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
