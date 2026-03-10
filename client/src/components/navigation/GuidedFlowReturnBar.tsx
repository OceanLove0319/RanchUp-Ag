import { useLocation } from "wouter";
import { useStore } from "@/lib/store";
import { ChevronRight, LayoutList, CheckCircle2, AlertCircle, FileText, SprayCan, Sprout, Map } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { GuideMeRail } from "./GuideMeRail";

export function GuidedFlowReturnBar() {
  const [location, setLocation] = useLocation();
  const isMobile = useIsMobile();
  
  // Don't show on Home dashboard since it has the full rail
  if (location === "/app" || location === "/app/") return null;

  if (isMobile) {
    return (
      <div className="bg-background border-b border-border shadow-sm">
        <GuideMeRail />
      </div>
    );
  }

  // Desktop top bar
  return (
    <div className="bg-background/95 backdrop-blur-sm border-b border-border shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center p-2">
        <div className="flex items-center gap-4 mr-6">
          <div className="flex items-center gap-2">
            <LayoutList className="w-4 h-4 text-primary" />
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Keep Me On Track</span>
          </div>
          <div className="h-6 w-px bg-border" />
        </div>
        
        <div className="flex-1 w-full max-w-4xl overflow-hidden">
          <div className="flex overflow-x-auto no-scrollbar gap-3 pb-1 pt-1 -mb-1">
             <GuideMeRail />
          </div>
        </div>
      </div>
    </div>
  );
}
