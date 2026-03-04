const fs = require('fs');

const file = 'client/src/lib/store.ts';
let code = fs.readFileSync(file, 'utf8');

// Add the import
if (!code.includes('import { GuidedFlowState }')) {
  code = code.replace(
    "import { TEMPLATES_SEED } from '@/data/templatesSeed';",
    "import { TEMPLATES_SEED } from '@/data/templatesSeed';\nimport { GuidedFlowState, GuidedStep } from '@/types/guidedFlow';\nimport { determineNextStep } from '@/lib/guidedFlow';"
  );
}

// Update AppState type
if (!code.includes('type AppState = GuidedFlowState & {')) {
  code = code.replace(
    'type AppState = {',
    'type AppState = GuidedFlowState & {'
  );
}

// Add state implementation
if (!code.includes('currentGuidedStep:')) {
  const stateImpl = `
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
`;

  code = code.replace('// Suggestions', stateImpl);
}

fs.writeFileSync(file, code);
