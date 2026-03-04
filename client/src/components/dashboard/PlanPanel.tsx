import { CalendarClock, FileText, Plus, ChevronRight, Activity, Beaker, CheckCircle2, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useMemo, useState } from "react";
import { format, addDays } from "date-fns";

export function PlanPanel() {
  const templates = useStore(s => s.templates);
  const blocks = useStore(s => s.blocks);
  const projections = useStore(s => s.projections);
  const activeRanchId = useStore(s => s.activeRanchId);
  const setProjection = useStore(s => s.setProjection);
  const deriveNextStepFromAction = useStore(s => (s as any).deriveNextStepFromAction);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [assigningTemplate, setAssigningTemplate] = useState<string | null>(null);

  const handleApply = (templateName: string) => {
    if (deriveNextStepFromAction) {
      deriveNextStepFromAction("APPLY_TEMPLATE");
    }
    
    toast({
      title: "Template Prepared",
      description: `"${templateName}" is ready to be applied. Select blocks to continue.`,
      action: (
        <button 
          onClick={() => setLocation("/app/log")}
          className="bg-primary text-primary-foreground px-3 py-1.5 rounded text-xs font-bold uppercase tracking-widest"
        >
          Next: Log
        </button>
      )
    });
  };

  const handleAssignTemplate = (templateId: string, blockId: string) => {
    setProjection(blockId, templateId);
    setAssigningTemplate(null);
    toast({
      title: "Template Assigned",
      description: "Schedule and budget updated for block.",
      duration: 3000
    });
  };

  const ranchBlocks = blocks.filter(b => b.ranchId === activeRanchId);

  // Mock upcoming schedule based on projected templates
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
              const mockDate = addDays(new Date(), (idx * 2) + 1);
              
              tasks.push({
                id: `${block.id}-${line.id}`,
                blockName: block.name,
                blockId: block.id,
                actionType: line.type,
                material: line.materialName,
                rate: `${line.rateValue} ${line.rateUnit}`,
                date: mockDate,
                templateName: template.name
              });
            }
          });
        }
      }
    });
    
    return tasks.sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 5);
  }, [ranchBlocks, projections, templates]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Upcoming Schedule */}
      <div>
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-primary" /> Coming Up
          </h2>
          <Link href="/app/projections" className="text-xs font-bold text-primary hover:text-primary/80 uppercase tracking-widest flex items-center gap-1">
            Budget Planner <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        
        {upcomingTasks.length > 0 ? (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="divide-y divide-border">
              {upcomingTasks.map(task => (
                <div key={task.id} className="p-4 hover:bg-white/5 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded bg-background border border-border flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">{format(task.date, 'MMM')}</span>
                      <span className="text-lg font-black leading-none text-foreground">{format(task.date, 'd')}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${
                          task.actionType === 'SPRAY' ? 'bg-purple-500/20 text-purple-400' :
                          task.actionType === 'FERT' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {task.actionType}
                        </span>
                        <span className="text-xs font-bold text-muted-foreground">{task.blockName}</span>
                      </div>
                      <p className="font-bold text-sm text-foreground">{task.material}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{task.rate} • via {task.templateName}</p>
                    </div>
                  </div>
                  
                  <Link href={`/app/log?input=${task.material}&type=MATERIAL`} className="text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded hover:bg-primary hover:text-primary-foreground transition-colors whitespace-nowrap">
                    Log Now
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg p-8 text-center flex flex-col items-center shadow-[0_0_15px_rgba(212,175,55,0.05)]">
            <Activity className="w-10 h-10 text-muted-foreground mb-3 opacity-30" />
            <p className="font-bold text-foreground mb-1 text-lg">No blocks are scheduled yet</p>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">Assign a program template to your blocks below to automatically generate tasks, schedules, and budgets.</p>
          </div>
        )}
      </div>

      {/* Ready Templates */}
      <div>
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" /> Assign Templates
          </h2>
          <Link href="/app/projections/templates" className="text-xs font-bold text-primary hover:text-primary/80 uppercase tracking-widest flex items-center gap-1">
            Manage <Plus className="w-3 h-3" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.slice(0, 4).map(template => (
            <div key={template.id} className={`bg-card border p-4 rounded-lg flex flex-col transition-all ${
              assigningTemplate === template.id ? 'border-primary shadow-[0_0_15px_rgba(212,175,55,0.15)] ring-1 ring-primary/50' : 'border-border hover:border-primary/50'
            }`}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-sm mb-1">{template.name}</h3>
                  <p className="text-xs text-muted-foreground">{template.lines.length} passes planned</p>
                </div>
                <div className="bg-background border border-border p-1.5 rounded">
                  <Beaker className="w-4 h-4 text-primary" />
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-4 overflow-hidden">
                {template.cropTags.map(tag => (
                  <span key={tag} className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground bg-background px-1.5 py-0.5 rounded border border-border">
                    {tag.replace('_', ' ')}
                  </span>
                ))}
              </div>

              {assigningTemplate === template.id ? (
                <div className="mt-auto pt-3 border-t border-border animate-in fade-in zoom-in-95 duration-200">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Select a block to assign:</p>
                  <div className="max-h-32 overflow-y-auto space-y-1 pr-1 no-scrollbar">
                    {ranchBlocks.map(block => {
                      const hasProjection = projections.some(p => p.blockId === block.id && p.templateId === template.id);
                      return (
                        <button
                          key={block.id}
                          onClick={() => handleAssignTemplate(template.id, block.id)}
                          className="w-full flex items-center justify-between p-2 rounded text-xs font-bold bg-background border border-border hover:border-primary/50 hover:bg-white/5 transition-colors text-left"
                        >
                          <span className="truncate pr-2">{block.name}</span>
                          {hasProjection ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                          ) : (
                            <span className="text-[9px] uppercase tracking-widest text-primary flex-shrink-0">Assign</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <button 
                    onClick={() => setAssigningTemplate(null)}
                    className="w-full mt-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-white p-2"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="mt-auto pt-3 border-t border-border flex gap-2">
                  <button 
                    onClick={() => handleApply(template.name)}
                    className="flex-1 text-[10px] font-bold uppercase tracking-widest bg-background border border-border text-foreground px-3 py-2 rounded hover:border-primary/50 hover:text-primary transition-colors text-center"
                  >
                    Quick Log
                  </button>
                  <button 
                    onClick={() => setAssigningTemplate(template.id)}
                    className="flex-1 text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 px-3 py-2 rounded hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center gap-1"
                  >
                    Assign <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
