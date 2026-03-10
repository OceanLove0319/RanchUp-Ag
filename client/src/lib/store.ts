import { create } from 'zustand';
import { persist } from "zustand/middleware";
import { todayPacificISO } from '@/utils/dates';
import { CHEMICALS_SEED } from '@/data/chemicalsSeed';
import { TEMPLATES_SEED } from '@/data/templatesSeed';
import { GuidedFlowState, GuidedStep } from '@/types/guidedFlow';
import { determineNextStep } from '@/lib/guidedFlow';

export type ProductCategory = "NUTRITION" | "AMENDMENT" | "FUNGICIDE" | "HERBICIDE" | "INSECTICIDE_MITICIDE" | "ADJUVANT" | "BIOLOGICAL" | "WATER_TREATMENT";

export type ProductLibraryItem = {
  id: string;
  name: string;
  category: ProductCategory;
  type: string;
  unitDefault?: string;
  notes?: string;
  aliases?: string[];
  brandFamily?: "INNVICTIS" | "GENERIC";
};

export type Ranch = {
  id: string;
  name: string;
  region?: string;
};

export type Block = {
  id: string;
  ranchId: string;
  name: string;
  acreage: number;
  variety: string;
  seasonGroup: string;
  irrigationType: string;
  yieldTargetBins: number;
  waterTargetAcreFeet: number;
  crop?: string;
  geometry?: any;
};

export type FieldLog = {
  id: string;
  ranchId: string;
  blockId: string;
  date: string;
  actionType: 'SPRAY' | 'FERT' | 'IRRIGATE' | 'LABOR';
  material: string;
  amount: number;
  unit: string;
  notes?: string;
  cost?: number;
  productIds?: string[];
  productEntries?: Array<{
    productId?: string;
    nameSnapshot: string;
    category: ProductCategory;
    type: string;
    rate?: number;
    rateUnit?: string;
    totalApplied?: number;
    totalUnit?: string;
    notes?: string;
  }>;
};

export type Chemical = {
  id: string;
  name: string;
  category: string;
  unit: string;
  
  // Optional planning & meta fields
  unitCostLow?: number;
  unitCostHigh?: number;
  cropTags?: string[];
  aliases?: string[];
  notes?: string;
};

export type ProgramLine = {
  id: string;
  type: "SPRAY" | "FERT" | "IRRIGATE";
  materialId?: string;
  materialName: string;
  rateValue: number;
  rateUnit: string;
  passesPlanned: number;
  monthHint?: number;
  productIds?: string[];
};

export type ProgramTemplate = {
  id: string;
  name: string;
  cropTags: string[];
  notes?: string;
  lines: ProgramLine[];
};

export type BlockProjection = {
  blockId: string;
  templateId: string;
  overrides: { lines?: Record<string, { rateValue?: number; passesPlanned?: number; rateUnit?: string }> };
  updatedAt: string;
};

export type ChemicalApp = {
  id: string;
  ranchId: string;
  blockId: string;
  chemicalId: string;
  chemicalName: string;
  category: string;
  dateApplied: string;
  method: string;
  estimatedCost?: number;
  costStatus?: "ESTIMATED" | "UNIT_MISMATCH" | "INVOICE";
  notes?: string;
};

export type BillingState = {
  planId: "STARTER" | "PRO" | "OPS";
  isAnnual: boolean;
  addOns: Record<string, boolean | number>;
  onboardingPurchased: boolean;
};

type AppState = GuidedFlowState & {
  user: { name: string; org: string } | null;
  ranches: Ranch[];
  activeRanchId: string | null;
  blocks: Block[];
  logs: FieldLog[];
  chemicals: Chemical[];
  chemicalApps: ChemicalApp[];
  templates: ProgramTemplate[];
  projections: BlockProjection[];
  billing: BillingState;
  productLibrary: ProductLibraryItem[];
  
  login: () => void;
  logout: () => void;
  addRanch: (ranch: Ranch) => void;
  setActiveRanch: (id: string) => void;
  addBlock: (block: Block) => void;
  updateBlock: (id: string, block: Partial<Block>) => void;
  deleteBlock: (id: string) => void;
  
  addLog: (log: FieldLog) => void;
  deleteLog: (id: string) => void;
  addChemicalApp: (app: ChemicalApp) => void;
  deleteChemicalApp: (id: string) => void;
  setOnboarded: (data: any) => void;

  setProjection: (blockId: string, templateId: string) => void;
  updateProjectionLineOverride: (blockId: string, lineId: string, overrides: { rateValue?: number; passesPlanned?: number; rateUnit?: string }) => void;
  resetProjectionOverrides: (blockId: string) => void;
  addTemplate: (template: ProgramTemplate) => void;
  updateTemplateLine: (templateId: string, lineId: string, patch: Partial<ProgramLine>) => void;
  
  // Billing Actions
  setPlan: (planId: "STARTER" | "PRO" | "OPS", isAnnual: boolean) => void;
  toggleAnnual: (isAnnual: boolean) => void;
  setAddOn: (addOnId: string, value: boolean | number) => void;
  purchaseOnboarding: () => void;

  // Suggestion State
  dismissedSuggestions: string[];
  dismissSuggestion: (id: string) => void;

  // Product Library Actions
  addProductLibraryItem: (item: ProductLibraryItem) => void;
  updateProductLibraryItem: (id: string, patch: Partial<ProductLibraryItem>) => void;
  removeProductLibraryItem: (id: string) => void;
  seedDefaultProductLibrary: () => void;
};

const getInitialBilling = (): BillingState => {
  try {
    const saved = localStorage.getItem('ranchup_billing');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  
  return {
    planId: "PRO", // Default to PRO for demo
    isAnnual: false,
    addOns: { "COST_ENGINE": true }, // Default Cost engine on
    onboardingPurchased: false
  };
};

const demoRanches: Ranch[] = [
  { id: "ranch-1", name: "Kingsburg Home Ranch", region: "Kingsburg" },
  { id: "ranch-2", name: "Tulare Almonds", region: "Tulare" },
  { id: "ranch-3", name: "Reedley Citrus", region: "Reedley" },
];

export const useStore = create<AppState>((set) => ({
  user: { name: 'Demo User', org: 'Central Valley Ag' },
  billing: getInitialBilling(),
  
  ranches: demoRanches,
  activeRanchId: demoRanches[0].id,

  blocks: [
    {
      id: 'demo-almond-1',
      ranchId: 'ranch-2',
      name: 'Block 1 - Nonpareil',
      acreage: 40,
      variety: 'Nonpareil Almond',
      seasonGroup: 'Mid',
      irrigationType: 'Drip',
      yieldTargetBins: 3000, // lbs
      waterTargetAcreFeet: 4.0
    },
    {
      id: 'demo-almond-2',
      ranchId: 'ranch-2',
      name: 'Block 2 - Monterey',
      acreage: 40,
      variety: 'Monterey Almond',
      seasonGroup: 'Mid',
      irrigationType: 'Drip',
      yieldTargetBins: 2800, // lbs
      waterTargetAcreFeet: 4.0
    },
    {
      id: 'demo-peach-1',
      ranchId: 'ranch-1',
      name: 'Block 7 - O\'Henry',
      acreage: 20,
      variety: 'O\'Henry Peach',
      seasonGroup: 'Mid',
      irrigationType: 'Fanjet',
      yieldTargetBins: 35,
      waterTargetAcreFeet: 3.5
    },
    {
      id: 'demo-citrus-1',
      ranchId: 'ranch-3',
      name: 'Block 12 - Navels',
      acreage: 35,
      variety: 'Washington Navel',
      seasonGroup: 'Late',
      irrigationType: 'Fanjet',
      yieldTargetBins: 25,
      waterTargetAcreFeet: 3.0
    }
  ],
  logs: [
    {
      id: 'l1',
      ranchId: 'ranch-1',
      blockId: 'demo-peach-1',
      date: todayPacificISO(),
      actionType: 'SPRAY',
      material: 'Pristine Fungicide',
      amount: 1,
      unit: 'lb/ac',
      cost: 450,
      notes: 'Bloom spray'
    },
    {
      id: 'l2',
      ranchId: 'ranch-2',
      blockId: 'demo-almond-1',
      date: todayPacificISO(),
      actionType: 'FERT',
      material: 'CAN-17',
      amount: 10,
      unit: 'gal/ac',
      cost: 500,
      notes: 'Spring N push'
    }
  ],
  chemicals: CHEMICALS_SEED,
  chemicalApps: [
    {
      id: 'a1',
      ranchId: 'ranch-1',
      blockId: 'demo-peach-1',
      chemicalId: 'cv-022',
      chemicalName: 'Pristine Fungicide',
      category: 'FUNGICIDE',
      dateApplied: todayPacificISO(),
      method: 'SPRAY',
      estimatedCost: 450,
      costStatus: "ESTIMATED",
      notes: 'Bloom spray'
    },
    {
      id: 'a2',
      ranchId: 'ranch-2',
      blockId: 'demo-almond-1',
      chemicalId: 'cv-093',
      chemicalName: 'CAN-17',
      category: 'FERTILIZER',
      dateApplied: todayPacificISO(),
      method: 'FERTIGATION',
      estimatedCost: 500,
      costStatus: "ESTIMATED",
      notes: 'Spring N push'
    }
  ],
  templates: TEMPLATES_SEED as ProgramTemplate[],
  projections: [],
  
  productLibrary: [],
  
  login: () => set({ 
    user: { name: 'Demo User', org: 'RanchUp Farms' },
    ranches: demoRanches,
    activeRanchId: demoRanches[0].id
  }),
  logout: () => set({ 
    user: null,
    ranches: [],
    activeRanchId: null,
    blocks: [],
    logs: [],
    chemicalApps: []
  }),
  
  addRanch: (ranch) => set((state) => ({ ranches: [...state.ranches, ranch] })),
  setActiveRanch: (id) => set({ activeRanchId: id }),
  
  addBlock: (block) => set((state) => ({ blocks: [...state.blocks, block] })),
  updateBlock: (id, updatedFields) => set((state) => ({
    blocks: state.blocks.map(b => b.id === id ? { ...b, ...updatedFields } : b)
  })),
  deleteBlock: (id) => set((state) => ({
    blocks: state.blocks.filter(b => b.id !== id),
    // Also clean up associated logs
    logs: state.logs.filter(l => l.blockId !== id),
    chemicalApps: state.chemicalApps.filter(c => c.blockId !== id)
  })),
  
  addLog: (log) => set((state) => ({ logs: [log, ...state.logs] })),
  deleteLog: (id) => set((state) => ({ logs: state.logs.filter(l => l.id !== id) })),
  addChemicalApp: (app) => set((state) => ({ chemicalApps: [app, ...state.chemicalApps] })),
  deleteChemicalApp: (id) => set((state) => ({ chemicalApps: state.chemicalApps.filter(c => c.id !== id) })),
  setOnboarded: (data) => set({ user: { name: 'Grower', org: data.operationName } }),

  setProjection: (blockId, templateId) => set((state) => {
    const existing = state.projections.filter(p => p.blockId !== blockId);
    return {
      projections: [...existing, {
        blockId,
        templateId,
        overrides: {},
        updatedAt: new Date().toISOString()
      }]
    };
  }),

  updateProjectionLineOverride: (blockId, lineId, overrides) => set((state) => {
    return {
      projections: state.projections.map(p => {
        if (p.blockId !== blockId) return p;
        const existingOverrides = p.overrides.lines || {};
        return {
          ...p,
          overrides: {
            ...p.overrides,
            lines: {
              ...existingOverrides,
              [lineId]: { ...(existingOverrides[lineId] || {}), ...overrides }
            }
          },
          updatedAt: new Date().toISOString()
        };
      })
    };
  }),

  resetProjectionOverrides: (blockId) => set((state) => {
    return {
      projections: state.projections.map(p => {
        if (p.blockId !== blockId) return p;
        return { ...p, overrides: {}, updatedAt: new Date().toISOString() };
      })
    };
  }),

  addTemplate: (template) => set((state) => ({ templates: [...state.templates, template] })),
  
  updateTemplateLine: (templateId, lineId, patch) => set((state) => ({
    templates: state.templates.map(t => {
      if (t.id !== templateId) return t;
      return {
        ...t,
        lines: t.lines.map(l => l.id === lineId ? { ...l, ...patch } : l)
      };
    })
  })),
  
  setPlan: (planId, isAnnual) => set(state => {
    const newBilling = { ...state.billing, planId, isAnnual };
    localStorage.setItem('ranchup_billing', JSON.stringify(newBilling));
    return { billing: newBilling };
  }),
  
  toggleAnnual: (isAnnual) => set(state => {
    const newBilling = { ...state.billing, isAnnual };
    localStorage.setItem('ranchup_billing', JSON.stringify(newBilling));
    return { billing: newBilling };
  }),
  
  setAddOn: (addOnId, value) => set(state => {
    const newBilling = { 
      ...state.billing, 
      addOns: { ...state.billing.addOns, [addOnId]: value } 
    };
    localStorage.setItem('ranchup_billing', JSON.stringify(newBilling));
    return { billing: newBilling };
  }),
  
  purchaseOnboarding: () => set(state => {
    const newBilling = { ...state.billing, onboardingPurchased: true };
    localStorage.setItem('ranchup_billing', JSON.stringify(newBilling));
    return { billing: newBilling };
  }),

  
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

  // Product Library Actions
  addProductLibraryItem: (item) => set((state) => {
    const newLib = [...state.productLibrary, item];
    localStorage.setItem('ranchup_product_library', JSON.stringify(newLib));
    return { productLibrary: newLib };
  }),
  
  updateProductLibraryItem: (id, patch) => set((state) => {
    const newLib = state.productLibrary.map(p => p.id === id ? { ...p, ...patch } : p);
    localStorage.setItem('ranchup_product_library', JSON.stringify(newLib));
    return { productLibrary: newLib };
  }),
  
  removeProductLibraryItem: (id) => set((state) => {
    const newLib = state.productLibrary.filter(p => p.id !== id);
    localStorage.setItem('ranchup_product_library', JSON.stringify(newLib));
    return { productLibrary: newLib };
  }),
  
  seedDefaultProductLibrary: () => set((state) => {
    // Only seed if empty
    if (state.productLibrary.length > 0) return state;
    import('@/data/materialsSeed').then(({ TOP_100_MATERIALS }) => {
      const seeded = TOP_100_MATERIALS.map((m, i) => ({ ...m, id: `seed-${i}` }));
      localStorage.setItem('ranchup_product_library', JSON.stringify(seeded));
      useStore.setState({ productLibrary: seeded as any });
    });
    return state;
  })
}));

// Initialize LocalStorage loaded state
try {
  const savedProducts = localStorage.getItem('ranchup_product_library');
  if (savedProducts) {
    useStore.setState({ productLibrary: JSON.parse(savedProducts) });
  } else {
    // Auto-seed on first load
    setTimeout(() => useStore.getState().seedDefaultProductLibrary(), 500);
  }
} catch (e) {
  console.error("Failed to load product library from localStorage", e);
}
