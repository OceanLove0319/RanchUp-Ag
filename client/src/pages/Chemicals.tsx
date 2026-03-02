import { Link } from "wouter";
import { useStore } from "@/lib/store";
import { FlaskConical, Plus, TrendingUp, AlertTriangle } from "lucide-react";

export default function Chemicals() {
  const blocks = useStore(s => s.blocks);
  const chemicalApps = useStore(s => s.chemicalApps);

  const totalSpend = chemicalApps.reduce((sum, app) => sum + (app.estimatedCost || 0), 0);
  
  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Clarity</p>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-foreground">Chemicals</h1>
        </div>
        <Link href="/app/chemicals/new" className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded font-bold uppercase tracking-widest text-sm transition-colors shadow-[0_0_15px_rgba(212,175,55,0.3)]">
          <Plus className="w-4 h-4" /> Log Chem
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-10">
        <div className="bg-card border border-border p-6 rounded-lg">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Season Spend (Est)</h3>
          <p className="text-3xl font-black text-foreground">${totalSpend.toFixed(2)}</p>
          <div className="flex items-center gap-2 mt-4 text-xs font-bold uppercase tracking-widest text-primary">
            <TrendingUp className="w-4 h-4" /> +12% vs Last 30 Days
          </div>
        </div>
        <div className="bg-card border border-border p-6 rounded-lg">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Total Applications</h3>
          <p className="text-3xl font-black text-foreground">{chemicalApps.length}</p>
          <p className="mt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Across {blocks.length} blocks</p>
        </div>
        <div className="bg-card border border-orange-500/30 p-6 rounded-lg relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-orange-500/10">
            <AlertTriangle className="w-32 h-32" />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-2 relative z-10">Budget Status</h3>
          <p className="text-xl font-black text-foreground relative z-10 mb-1">Watch List</p>
          <p className="text-xs font-medium text-muted-foreground relative z-10">Spend is trending above your recent pace. Double-check rates.</p>
        </div>
      </div>

      <div className="space-y-6">
        {blocks.map(block => {
          const apps = chemicalApps.filter(a => a.blockId === block.id);
          if (apps.length === 0) return null;
          
          return (
            <div key={block.id} className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-background border-b border-border flex justify-between items-center">
                <h3 className="font-black text-foreground text-lg">{block.name}</h3>
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{apps.length} Apps</span>
              </div>
              <div className="divide-y divide-border">
                {apps.map(app => (
                  <div key={app.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-background/50 transition-colors">
                    <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <FlaskConical className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-lg">{app.chemicalName}</h4>
                        <div className="flex gap-2 items-center mt-1">
                          <span className="text-[10px] font-black uppercase tracking-widest bg-background border border-border text-muted-foreground px-2 py-0.5 rounded">
                            {app.category}
                          </span>
                          <span className="text-xs font-medium text-muted-foreground">{app.dateApplied} • {app.method}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-foreground text-lg">${app.estimatedCost?.toFixed(2) || '0.00'}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Estimated</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}