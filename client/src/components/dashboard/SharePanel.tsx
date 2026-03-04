import { Share2, FileText, Printer, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SharePanel() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      <div>
        <h2 className="text-lg font-black uppercase tracking-tight mb-4 flex items-center gap-2">
          <Share2 className="w-5 h-5 text-primary" /> Reports & Proof
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="bg-card border border-border rounded-lg p-5 flex items-start gap-4 hover:border-primary/50 transition-colors">
            <div className="p-3 bg-primary/10 rounded-md">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-sm mb-1">Monthly Log Export</h3>
              <p className="text-xs text-muted-foreground mb-3">County compliance ready CSV/PDF.</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-[10px] font-bold uppercase tracking-widest border-border hover:bg-background">
                  <Download className="w-3 h-3 mr-1" /> PDF
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-[10px] font-bold uppercase tracking-widest border-border hover:bg-background">
                  <Download className="w-3 h-3 mr-1" /> CSV
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-5 flex items-start gap-4 hover:border-primary/50 transition-colors">
            <div className="p-3 bg-blue-500/10 rounded-md">
              <Printer className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm mb-1">Block History Card</h3>
              <p className="text-xs text-muted-foreground mb-3">Printable summary for PCA/Partner review.</p>
              <Button size="sm" variant="outline" className="h-8 text-[10px] font-bold uppercase tracking-widest border-border hover:bg-background">
                Select Block
              </Button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}