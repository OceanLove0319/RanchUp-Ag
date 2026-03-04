import { AlertTriangle, CheckCircle2, ChevronRight, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function ReviewPanel() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-bold text-orange-400 uppercase tracking-wider mb-1">2 Items Need Review</h3>
          <p className="text-xs text-orange-400/80">Catching issues early prevents compliance and billing errors.</p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Mock Review Item 1 */}
        <div className="bg-card border border-border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Log Issue</span>
                <span className="text-[10px] bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Missing Rate</span>
              </div>
              <p className="font-medium text-sm">North 40 Peaches • Pristine Application</p>
              <p className="text-xs text-muted-foreground mt-1">Logged yesterday without an application rate.</p>
            </div>
          </div>
          <Link href="/app/log" className="w-full md:w-auto">
            <Button size="sm" variant="outline" className="border-border w-full text-xs uppercase tracking-widest font-bold hover:bg-primary/10 hover:text-primary hover:border-primary/30">
              Fix Log <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Mock Review Item 2 */}
        <div className="bg-card border border-border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-orange-400 mt-1.5 shrink-0" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Inventory Warning</span>
                <span className="text-[10px] bg-orange-500/10 text-orange-400 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Low Stock</span>
              </div>
              <p className="font-medium text-sm">CAN-17 (calcium ammonium nitrate)</p>
              <p className="text-xs text-muted-foreground mt-1">Planned applications exceed current recorded inventory.</p>
            </div>
          </div>
          <Link href="/app/inputs" className="w-full md:w-auto">
            <Button size="sm" variant="outline" className="border-border w-full text-xs uppercase tracking-widest font-bold hover:bg-orange-500/10 hover:text-orange-400 hover:border-orange-500/30">
              Update Stock <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-8 text-center p-8 border border-dashed border-border rounded-lg">
        <CheckCircle2 className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-50" />
        <p className="text-sm font-medium text-muted-foreground">All other logs look good.</p>
      </div>
    </div>
  );
}
