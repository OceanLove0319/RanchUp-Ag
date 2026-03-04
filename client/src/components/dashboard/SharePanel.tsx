import { Share2, FileText, Printer, Download, BookOpen, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { useStore } from "@/lib/store";

export function SharePanel() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const deriveNextStepFromAction = useStore(s => (s as any).deriveNextStepFromAction);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      <div>
        <h2 className="text-lg font-black uppercase tracking-tight mb-4 flex items-center gap-2">
          <Share2 className="w-5 h-5 text-primary" /> Reports & Packets
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <Link href="/app/packets/today">
            <div className="bg-card border border-border rounded-lg p-5 flex items-start gap-4 hover:border-primary/50 transition-colors cursor-pointer group">
              <div className="p-3 bg-primary/10 rounded-md">
                <Clock className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h3 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">Today Packet</h3>
                <p className="text-xs text-muted-foreground">Daily artifact to send in 15 seconds. Grouped by block with issue lists.</p>
              </div>
            </div>
          </Link>

          <Link href="/app/packets/monthly">
            <div className="bg-card border border-border rounded-lg p-5 flex items-start gap-4 hover:border-primary/50 transition-colors cursor-pointer group">
              <div className="p-3 bg-blue-500/10 rounded-md">
                <Calendar className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h3 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">Monthly Packet</h3>
                <p className="text-xs text-muted-foreground">Monthly cleanup & review bundle for your manager or PCA.</p>
              </div>
            </div>
          </Link>
          
          <Link href="/app/packets/season">
            <div className="bg-card border border-border rounded-lg p-5 flex items-start gap-4 hover:border-primary/50 transition-colors cursor-pointer group md:col-span-2">
              <div className="p-3 bg-green-500/10 rounded-md">
                <BookOpen className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h3 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">Season Packet (Audit Binder)</h3>
                <p className="text-xs text-muted-foreground">Packer-shipper audited season-long documentation with full TOC, exception history, and block register.</p>
              </div>
            </div>
          </Link>

        </div>
      </div>

    </div>
  );
}