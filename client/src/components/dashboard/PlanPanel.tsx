import { CalendarClock, FileText, Plus } from "lucide-react";
import { useStore } from "@/lib/store";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export function PlanPanel() {
  const templates = useStore(s => s.templates);
  const blocks = useStore(s => s.blocks);
  const deriveNextStepFromAction = useStore(s => (s as any).deriveNextStepFromAction);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

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

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      <div>
        <h2 className="text-lg font-black uppercase tracking-tight mb-4 flex items-center gap-2">
          <CalendarClock className="w-5 h-5 text-primary" /> Coming Up This Week
        </h2>
        
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">No specific applications scheduled for the next 7 days.</p>
          <Link href="/app/projections" className="inline-flex items-center justify-center bg-primary/10 text-primary px-4 py-2 rounded text-xs font-bold uppercase tracking-widest hover:bg-primary/20 transition-colors">
            Open Budget & Planner
          </Link>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" /> Ready Templates
          </h2>
          <Link href="/app/projections/templates" className="text-xs font-bold text-primary hover:text-primary/80 uppercase tracking-widest flex items-center gap-1">
            Manage <Plus className="w-3 h-3" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.slice(0, 4).map(template => (
            <div key={template.id} className="bg-card border border-border p-4 rounded-lg flex justify-between items-center group hover:border-primary/50 transition-colors">
              <div>
                <h3 className="font-bold text-sm mb-1">{template.name}</h3>
                <p className="text-xs text-muted-foreground">{template.lines.length} passes planned</p>
              </div>
              <button 
                onClick={() => handleApply(template.name)}
                className="text-[10px] font-bold uppercase tracking-widest bg-background border border-border px-3 py-1.5 rounded hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-colors"
              >
                Apply
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
