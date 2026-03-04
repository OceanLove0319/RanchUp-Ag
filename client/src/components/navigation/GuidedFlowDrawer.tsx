import { GuidedStep } from "@/types/guidedFlow";
import { Check, ChevronRight, X } from "lucide-react";
import { useLocation } from "wouter";
import { getNextStepPath } from "@/lib/guidedFlow";

interface GuidedFlowDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep: GuidedStep;
  nextStep: GuidedStep;
}

export function GuidedFlowDrawer({ isOpen, onClose, currentStep, nextStep }: GuidedFlowDrawerProps) {
  const [, setLocation] = useLocation();

  if (!isOpen) return null;

  const steps: { id: GuidedStep; label: string; desc: string; path: string }[] = [
    { id: "TODAY", label: "Today", desc: "View what needs attention", path: "/app" },
    { id: "LOG", label: "Log", desc: "Record field work", path: "/app/log" },
    { id: "REVIEW", label: "Review", desc: "Fix missing data", path: "/app/reports/variance" },
    { id: "PLAN", label: "Next Pass", desc: "Queue program passes", path: "/app/projections" },
    { id: "SHARE", label: "Share", desc: "Export compliance reports", path: "/app/vault" },
  ];

  const currentIndex = steps.findIndex(s => s.id === currentStep);

  const handleStepClick = (path: string) => {
    setLocation(path);
    onClose();
  };

  const handleContinue = () => {
    setLocation(getNextStepPath(nextStep));
    onClose();
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border rounded-t-2xl z-50 p-6 animate-in slide-in-from-bottom-full duration-300">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-black uppercase tracking-tight">Guided Flow</h2>
            <p className="text-xs text-muted-foreground">Pick up where you left off</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-1 mb-8 relative">
          {/* Vertical connection line */}
          <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-border -z-10" />
          
          {steps.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isActive = index === currentIndex;
            const isNext = step.id === nextStep;
            
            return (
              <div 
                key={step.id}
                onClick={() => handleStepClick(step.path)}
                className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors ${
                  isActive ? "bg-primary/10" : "hover:bg-white/5"
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 bg-background ${
                  isCompleted ? "border-primary text-primary" : 
                  isActive ? "border-primary bg-primary text-primary-foreground" : 
                  "border-border text-muted-foreground"
                }`}>
                  {isCompleted ? <Check className="w-5 h-5" /> : <span className="text-sm font-bold">{index + 1}</span>}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-bold text-sm uppercase tracking-widest ${
                      isActive ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
                    }`}>
                      {step.label}
                    </h3>
                    {isActive && <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Current</span>}
                    {isNext && !isActive && <span className="text-[10px] border border-primary/50 text-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Next</span>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
                </div>
                
                <ChevronRight className={`w-4 h-4 ${isActive || isNext ? "text-primary" : "text-muted-foreground opacity-50"}`} />
              </div>
            );
          })}
        </div>

        <button 
          onClick={handleContinue}
          className="w-full bg-primary text-primary-foreground font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          Continue to Next Step
        </button>
      </div>
    </>
  );
}
