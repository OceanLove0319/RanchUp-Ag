import { Share2, FileText, Printer, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { useStore } from "@/lib/store";

export function SharePanel() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const deriveNextStepFromAction = useStore(s => (s as any).deriveNextStepFromAction);

  const handleDownload = (format: string) => {
    if (deriveNextStepFromAction) {
      deriveNextStepFromAction("GENERATE_REPORT");
    }
    
    toast({
      title: `Preparing ${format} Export`,
      description: "Your monthly log export is generating. It will download automatically when ready.",
      action: (
        <button 
          onClick={() => setLocation("/app")}
          className="bg-primary text-primary-foreground px-3 py-1.5 rounded text-xs font-bold uppercase tracking-widest whitespace-nowrap"
        >
          Return to Today
        </button>
      )
    });
  };

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
                <Button onClick={() => handleDownload("PDF")} size="sm" variant="outline" className="h-8 text-[10px] font-bold uppercase tracking-widest border-border hover:bg-primary/10 hover:text-primary hover:border-primary/30">
                  <Download className="w-3 h-3 mr-1" /> PDF
                </Button>
                <Button onClick={() => handleDownload("CSV")} size="sm" variant="outline" className="h-8 text-[10px] font-bold uppercase tracking-widest border-border hover:bg-primary/10 hover:text-primary hover:border-primary/30">
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
              <Link href="/app/blocks">
                <Button size="sm" variant="outline" className="h-8 text-[10px] font-bold uppercase tracking-widest border-border hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/30">
                  Select Block
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}