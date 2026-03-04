export type GuidedStep = "TODAY" | "LOG" | "REVIEW" | "PLAN" | "SHARE";

export interface GuidedFlowState {
  currentGuidedStep: GuidedStep;
  recommendedNextStep: GuidedStep;
  lastGuidedStep: GuidedStep;
  lastMeaningfulAction?: string;
  guidedFlowDismissed: boolean;
  
  setCurrentGuidedStep: (step: GuidedStep) => void;
  setRecommendedNextStep: (step: GuidedStep) => void;
  setLastMeaningfulAction: (action: string) => void;
  setGuidedFlowDismissed: (dismissed: boolean) => void;
  deriveNextStepFromAction: (action: string) => void;
}
