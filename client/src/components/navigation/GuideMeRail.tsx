import { Link } from "wouter";
import { CheckCircle2, AlertCircle, FileText, SprayCan, Sprout, Map } from "lucide-react";
import { useStore } from "@/lib/store";
import { isWithin } from "@/utils/dates";
import { getActiveSeasonWindow } from "@/utils/season";

export function GuideMeRail() {
  const activeRanchId = useStore(s => s.activeRanchId);
  const blocks = useStore(s => s.blocks.filter(b => b.ranchId === activeRanchId));
  const logs = useStore(s => s.logs.filter(l => l.ranchId === activeRanchId));
  const chemicalApps = useStore(s => s.chemicalApps.filter(a => a.ranchId === activeRanchId));
  
  // Find incomplete entries (missing rate or cost info)
  const incompleteApps = chemicalApps.filter(a => a.costStatus === "UNIT_MISMATCH" || !a.estimatedCost);
  
  // Tasks to show
  const tasks = [];
  
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

  return (
    <div className="bg-card border-y border-border overflow-hidden">
      <div className="px-4 py-2 bg-muted/30 border-b border-border">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Keep Me On Track</span>
      </div>
      <div className="flex overflow-x-auto no-scrollbar py-3 px-4 gap-3">
        {tasks.map(task => {
          const Icon = task.icon;
          return (
            <Link key={task.id} href={task.link} className="flex-shrink-0 flex items-center gap-3 bg-background border border-border p-3 rounded-lg hover:border-primary/50 transition-colors min-w-[200px]">
              <div className={`p-2 rounded-md ${task.bg} ${task.color}`}>
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
