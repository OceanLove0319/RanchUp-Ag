import { create } from 'zustand';
import { GuidedFlowState, GuidedStep } from '@/types/guidedFlow';
import { determineNextStep } from '@/lib/guidedFlow';

// Store is now LOCAL UI STATE ONLY.
// All data (ranches, blocks, logs, etc.) comes from API via useData hooks.
// All auth comes from AuthProvider via useAuth hook.

type AppState = GuidedFlowState & {
  activeRanchId: string | null;
  setActiveRanch: (id: string) => void;

  // Suggestion State
  dismissedSuggestions: string[];
  dismissSuggestion: (id: string) => void;
};

export const useStore = create<AppState>((set) => ({
  activeRanchId: null,
  setActiveRanch: (id) => set({ activeRanchId: id }),

  // Guided Flow State
  currentGuidedStep: "TODAY" as GuidedStep,
  recommendedNextStep: "LOG" as GuidedStep,
  lastGuidedStep: "TODAY" as GuidedStep,
  lastMeaningfulAction: undefined,
  guidedFlowDismissed: false,

  setCurrentGuidedStep: (step) => set(state => ({
    currentGuidedStep: step,
    lastGuidedStep: state.currentGuidedStep
  })),

  setRecommendedNextStep: (step) => set({ recommendedNextStep: step }),

  setLastMeaningfulAction: (action) => set({ lastMeaningfulAction: action }),

  setGuidedFlowDismissed: (dismissed) => set({ guidedFlowDismissed: dismissed }),

  deriveNextStepFromAction: (action) => set(state => {
    const nextStep = determineNextStep(state.currentGuidedStep, action);
    return {
      lastMeaningfulAction: action,
      recommendedNextStep: nextStep
    };
  }),

  // Suggestions
  dismissedSuggestions: [],
  dismissSuggestion: (id) => set(state => ({ dismissedSuggestions: [...state.dismissedSuggestions, id] })),
}));

// Re-export types from useData so old imports still work
export type { Ranch, Block, FieldLog, Chemical, ChemicalApp, ProductLibraryItem, Recommendation, BillingState } from '@/hooks/useData';
export type { ProgramTemplate, ProgramTemplateLine as ProgramLine, BlockProjection } from '@/hooks/useData';
