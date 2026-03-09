import { CalendarClock, Plus, Activity, CheckCircle2, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useMemo, useState } from "react";
import { format, addDays } from "date-fns";
import { Button } from "@/components/ui/button";

export function PlanPanel() {
  const templates = useStore(s => s.templates);
  const blocks = useStore(s => s.blocks);
  const projections = useStore(s => s.projections);
  const activeRanchId = useStore(s => s.activeRanchId);
  const setProjection = useStore(s => s.setProjection);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [isQueueing, setIsQueueing] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const ranchBlocks = blocks.filter(b => b.ranchId === activeRanchId);

  // Compute Next Passes using the new logic rules
  const upcomingTasks = useMemo(() => {
    const tasks: any[] = [];
    
    ranchBlocks.forEach(block => {
      const proj = projections.find(p => p.blockId === block.id);
      if (proj && proj.templateId) {
        const template = templates.find(t => t.id === proj.templateId);
        if (template) {
          const currentMonth = new Date().getMonth() + 1;
          
          template.lines.forEach((line, idx) => {
            // Include lines meant for this month or next month
            if (line.monthHint === currentMonth || line.monthHint === currentMonth + 1 || !line.monthHint) {
              // Create a mocked "scheduled" date
              // Some are overdue, some are due soon
              const offset = idx === 0 ? -2 : (idx * 2) + 1; 
              const mockDate = addDays(new Date(), offset);
              
              tasks.push({
                id: `${block.id}-${line.id}`,
                blockName: block.name,
                blockId: block.id,
                actionType: line.type,
                material: line.materialName,
                rate: `${line.rateValue} ${line.rateUnit}`,
                date: mockDate,
                templateName: template.name,
                isOverdue: mockDate < new Date()
              });
            }
          });
        }
      }
    });
    
    return tasks.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [ranchBlocks, projections, templates]);

  const top3Actions = upcomingTasks.slice(0, 3);
  const overdueCount = upcomingTasks.filter(t => t.isOverdue).length;
  const dueThisWeekCount = upcomingTasks.filter(t => !t.isOverdue).length;

  const handleQueuePass = (templateId: string) => {
    // In a real app we'd open a modal to select blocks. For mockup, apply to all applicable blocks
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    let appliedCount = 0;
    ranchBlocks.forEach(block => {
      // Basic matching on crop tags if they exist
      const blockCrop = block.variety.toLowerCase();
      const matchesCrop = template.cropTags.some(tag => blockCrop.includes(tag.toLowerCase().replace('_', ' ')));
      
      if (matchesCrop || template.cropTags.length === 0) {
        setProjection(block.id, templateId);
        appliedCount++;
      }
    });

    toast({
      title: "Pass Queued",
      description: `"${template.name}" applied to ${appliedCount} blocks. Forecast updated.`,
    });
    setIsQueueing(false);
  };

  const seedStandardPlan = () => {
    // Find the standard stone fruit templates
    const fungicide = templates.find(t => t.name.includes("Fungicide"));
    const sizing = templates.find(t => t.name.includes("Sizing"));
    
    if (fungicide) handleQueuePass(fungicide.id);
    setTimeout(() => {
      if (sizing) handleQueuePass(sizing.id);
      toast({
        title: "Standard Plan Added",
        description: "Standard Stone Fruit passes queued. Season Budget updated."
      });
    }, 500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20">
      
      {/* Top Bar Counters */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#111113] border border-border rounded-lg p-3 text-center">
          <p className="text-2xl font-black text-white">{dueThisWeekCount}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Due This Week</p>
        </div>
        <div className={`border rounded-lg p-3 text-center ${overdueCount > 0 ? 'bg-red-500/10 border-red-500/30' : 'bg-[#111113] border-border'}`}>
          <p className={`text-2xl font-black ${overdueCount > 0 ? 'text-red-400' : 'text-white'}`}>{overdueCount}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Overdue</p>
        </div>
        <Link href="/app/reports/variance" className="block">
          <div className="bg-[#111113] border border-border rounded-lg p-3 text-center hover:bg-white/5 transition-colors relative">
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500"></div>
            <p className="text-2xl font-black text-white">2</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Issues</p>
          </div>
        </Link>
      </div>

      <div className="flex gap-2">
        <Button onClick={seedStandardPlan} variant="outline" className="flex-1 text-xs font-bold uppercase tracking-widest border-primary/30 text-primary hover:bg-primary/10">
          Add Standard Stone Fruit Plan
        </Button>
      </div>

      {/* Your Next 3 Actions */}
      <div>
        <h2 className="text-lg font-black uppercase tracking-tight mb-3">Your Next 3 Actions</h2>
        
        {top3Actions.length > 0 ? (
          <div className="space-y-3">
            {top3Actions.map(task => (
              <button 
                key={task.id}
                onClick={() => setLocation(`/app/log?input=${encodeURIComponent(task.material)}&type=MATERIAL`)}
                className={`w-full text-left bg-card border p-4 rounded-xl flex items-center justify-between transition-all hover:scale-[1.01] active:scale-[0.99] ${
                  task.isOverdue ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-primary/30 shadow-[0_0_15px_rgba(234,153,61,0.05)]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                      task.isOverdue ? 'bg-red-500/20 text-red-400' : 'bg-primary/20 text-primary'
                    }`}>
                      {task.isOverdue ? 'Overdue' : 'Due Soon'}
                    </span>
                    <span className="text-xs font-bold text-muted-foreground">{task.blockName}</span>
                  </div>
                  <h3 className="text-xl font-black text-white">{task.templateName}</h3>
                  <p className="text-sm text-muted-foreground mt-1">Includes {task.material}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center shrink-0">
                  <ArrowRight className="w-5 h-5 text-primary" />
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <Activity className="w-10 h-10 text-muted-foreground mb-3 opacity-30 mx-auto" />
            <p className="font-bold text-foreground mb-1 text-lg">No actions queued</p>
            <p className="text-sm text-muted-foreground mb-4">Add a standard plan or queue a pass to populate your board.</p>
          </div>
        )}
      </div>

      {/* Block Cards List */}
      <div>
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-lg font-black uppercase tracking-tight">Block Status</h2>
        </div>
        
        <div className="space-y-3">
          {ranchBlocks.map(block => {
            const blockTasks = upcomingTasks.filter(t => t.blockId === block.id);
            const nextTask = blockTasks[0];
            
            return (
              <div key={block.id} className="bg-[#111113] border border-border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-base text-white">{block.name}</h3>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">{block.acreage} AC • {block.variety}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Last Pass</p>
                    <p className="text-sm font-medium text-white">Irrigation (3d ago)</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Next Pass</p>
                    {nextTask ? (
                      <p className={`text-sm font-bold ${nextTask.isOverdue ? 'text-red-400' : 'text-primary'}`}>
                        {nextTask.templateName}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">None queued</p>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setLocation(`/app/log?blockId=${block.id}`)}
                    className="flex-1 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest"
                  >
                    Start Pass
                  </Button>
                  <Button 
                    onClick={() => setIsQueueing(true)}
                    variant="outline"
                    className="flex-1 text-xs font-bold uppercase tracking-widest"
                  >
                    Queue Pass
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Queue Pass Bottom Sheet */}
      {isQueueing && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setIsQueueing(false)} />
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border rounded-t-2xl z-50 p-6 animate-in slide-in-from-bottom-full duration-300">
            <h2 className="text-lg font-black uppercase tracking-tight mb-4">Queue Pass</h2>
            <div className="space-y-2 mb-6 max-h-[40vh] overflow-y-auto no-scrollbar">
              {templates.map(template => (
                <button
                  key={template.id}
                  onClick={() => handleQueuePass(template.id)}
                  className="w-full p-3 rounded-lg border border-border bg-card text-left hover:border-primary/50 transition-colors"
                >
                  <h3 className="font-bold text-sm text-white mb-1">{template.name}</h3>
                  <div className="flex gap-2 flex-wrap">
                    {template.lines.map(l => (
                      <span key={l.id} className="text-[10px] text-muted-foreground bg-background px-1.5 py-0.5 rounded border border-border">
                        {l.materialName}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
            <Button onClick={() => setIsQueueing(false)} variant="ghost" className="w-full text-xs font-bold uppercase tracking-widest">
              Cancel
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
