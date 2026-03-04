import { useState } from "react";
import { Link } from "wouter";
import { useStore } from "@/lib/store";
import { GuidedStepRail, HomeStep } from "@/components/dashboard/GuidedStepRail";
import { TodayPanel } from "@/components/dashboard/TodayPanel";
import { LogPanel } from "@/components/dashboard/LogPanel";
import { ReviewPanel } from "@/components/dashboard/ReviewPanel";
import { PlanPanel } from "@/components/dashboard/PlanPanel";
import { SharePanel } from "@/components/dashboard/SharePanel";
import { ManagementNav } from "@/components/dashboard/ManagementNav";

export default function Home() {
  const user = useStore(s => s.user);
  const activeRanchId = useStore(s => s.activeRanchId);
  const activeRanch = useStore(s => s.ranches.find(r => r.id === activeRanchId));
  
  const [activeStep, setActiveStep] = useState<HomeStep>("TODAY");

  const renderActiveStep = () => {
    switch (activeStep) {
      case "TODAY": return <TodayPanel />;
      case "LOG": return <LogPanel />;
      case "REVIEW": return <ReviewPanel />;
      case "PLAN": return <PlanPanel />;
      case "SHARE": return <SharePanel />;
      default: return <TodayPanel />;
    }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-foreground mb-2">
          Run today without losing the season.
        </h1>
        <p className="text-muted-foreground font-medium">
          What needs attention, what to log, what to review, and what to share.
        </p>
      </header>

      <GuidedStepRail activeStep={activeStep} onStepChange={setActiveStep} />

      <div className="mb-12">
        {renderActiveStep()}
      </div>

      <ManagementNav />
    </div>
  );
}
