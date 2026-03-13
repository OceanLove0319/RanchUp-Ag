import { useLocation } from "wouter";
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
      <div className="bg-[#111113]/90 backdrop-blur-md border-b border-white/5">
        <GuideMeRail compact />
      </div>
    );
  }

  // Desktop top bar
  return (
    <div className="bg-[#111113] border-b border-white/5 sticky top-0 z-40 py-2 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center px-4">
        <div className="flex items-center gap-4 mr-6">
          <div className="flex items-center gap-2">
            <LayoutList className="w-4 h-4 text-[#ea993d]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#ea993d]">Keep Me On Track</span>
          </div>
          <div className="h-6 w-px bg-white/10" />
        </div>
        
        <div className="flex-1 w-full max-w-4xl overflow-hidden">
          <div className="flex overflow-x-auto no-scrollbar gap-2 -mx-1 px-1">
             <GuideMeRail compact />
          </div>
        </div>
      </div>
    </div>
  );
}
