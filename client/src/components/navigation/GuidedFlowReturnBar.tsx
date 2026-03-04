import { useLocation } from "wouter";
import { useStore } from "@/lib/store";
import { useState, useEffect } from "react";
import { deriveStepFromRoute, getNextStepLabel, getNextStepPath } from "@/lib/guidedFlow";
import { GuidedFlowDrawer } from "./GuidedFlowDrawer";
import { ChevronRight, LayoutList } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";

export function GuidedFlowReturnBar() {
  const [location, setLocation] = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const currentGuidedStep = useStore(s => (s as any).currentGuidedStep);
  const recommendedNextStep = useStore(s => (s as any).recommendedNextStep);
  const setCurrentGuidedStep = useStore(s => (s as any).setCurrentGuidedStep);

  // Update current step based on route
  useEffect(() => {
    const step = deriveStepFromRoute(location);
    if (step && step !== currentGuidedStep) {
      if (setCurrentGuidedStep) setCurrentGuidedStep(step);
    }
  }, [location, currentGuidedStep, setCurrentGuidedStep]);

  // Don't show on Home dashboard since it has the full rail
  if (location === "/app" || location === "/app/") return null;
  
  // Also don't show if step isn't matched and user dismissed it, though we don't have dismiss logic fully mapped
  // Fallback
  if (!currentGuidedStep) return null;

  const nextStepLabel = getNextStepLabel(recommendedNextStep || currentGuidedStep);
  const nextStepPath = getNextStepPath(recommendedNextStep || currentGuidedStep);

  if (isMobile) {
    return (
      <div className="bg-primary/5 border-b border-primary/20 py-2 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutList className="w-3.5 h-3.5 text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
            {currentGuidedStep}
          </span>
        </div>
        <div 
          onClick={() => setLocation(nextStepPath)}
          className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-foreground bg-primary/20 px-2 py-1 rounded cursor-pointer"
        >
          Next: {nextStepLabel} <ChevronRight className="w-3 h-3" />
        </div>
      </div>
    );
  }

  // Desktop top bar
  return (
    <div className="bg-background/95 backdrop-blur-sm border-b border-border py-2 px-4 md:px-8 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <LayoutList className="w-4 h-4 text-primary" />
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Guided Flow</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <p className="text-sm font-medium">
            <span className="text-muted-foreground">You're on: </span>
            <span className="font-bold text-foreground">{currentGuidedStep}</span>
          </p>
          <div className="flex items-center gap-2 ml-4">
            {["TODAY", "LOG", "REVIEW", "PLAN", "SHARE"].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  step === currentGuidedStep ? "bg-primary" : 
                  step === recommendedNextStep ? "bg-primary/50" : "bg-white/10"
                }`} />
                {i < 4 && <div className="w-4 h-px bg-white/10" />}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Next: <span className="text-foreground">{nextStepLabel}</span>
          </p>
          <button 
            onClick={() => setLocation(nextStepPath)}
            className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-1"
          >
            Continue <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
