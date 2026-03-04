import { Check, ClipboardEdit, CalendarClock, Share2, ClipboardList } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";

export type HomeStep = "TODAY" | "LOG" | "REVIEW" | "PLAN" | "SHARE";

interface GuidedStepRailProps {
  activeStep: HomeStep;
  onStepChange: (step: HomeStep) => void;
}

export function GuidedStepRail({ activeStep, onStepChange }: GuidedStepRailProps) {
  const isMobile = useIsMobile();
  
  const steps: { id: HomeStep; label: string; icon: React.ElementType }[] = [
    { id: "TODAY", label: "Today", icon: Check },
    { id: "LOG", label: "Log", icon: ClipboardEdit },
    { id: "REVIEW", label: "Review", icon: ClipboardList },
    { id: "PLAN", label: "Plan", icon: CalendarClock },
    { id: "SHARE", label: "Share", icon: Share2 },
  ];

  if (isMobile) {
    return (
      <div className="flex overflow-x-auto gap-2 pb-4 no-scrollbar -mx-4 px-4 sticky top-[4.5rem] z-30 bg-background/95 backdrop-blur-sm pt-2">
        {steps.map((step) => {
          const isActive = activeStep === step.id;
          const Icon = step.icon;
          
          return (
            <button
              key={step.id}
              onClick={() => onStepChange(step.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-colors flex-shrink-0 ${
                isActive 
                  ? "bg-primary text-primary-foreground font-black uppercase tracking-widest shadow-[0_0_10px_rgba(212,175,55,0.3)]" 
                  : "bg-card border border-border text-muted-foreground font-bold uppercase tracking-widest hover:text-foreground hover:border-primary/50"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs">{step.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Desktop Rail
  return (
    <div className="flex bg-card border border-border rounded-lg overflow-hidden mb-8 shadow-sm">
      {steps.map((step, index) => {
        const isActive = activeStep === step.id;
        const Icon = step.icon;
        
        return (
          <button
            key={step.id}
            onClick={() => onStepChange(step.id)}
            className={`flex-1 flex flex-col items-center justify-center p-4 transition-colors relative ${
              isActive 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            }`}
          >
            {isActive && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
            )}
            <Icon className="w-6 h-6 mb-2" />
            <span className={`text-sm uppercase tracking-widest ${isActive ? 'font-black' : 'font-bold'}`}>
              {step.label}
            </span>
            {index < steps.length - 1 && (
              <div className="absolute right-0 top-1/4 bottom-1/4 w-px bg-border" />
            )}
          </button>
        );
      })}
    </div>
  );
}
