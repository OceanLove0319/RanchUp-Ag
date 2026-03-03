import { create } from 'zustand';
import { todayPacificISO } from '@/utils/dates';

export type Block = {
  id: string;
  name: string;
  acreage: number;
  variety: string;
  seasonGroup: string;
  irrigationType: string;
  yieldTargetBins: number;
  waterTargetAcreFeet: number;
};

export type FieldLog = {
  id: string;
  blockId: string;
  date: string;
  actionType: 'SPRAY' | 'FERT' | 'IRRIGATE';
  material: string;
  amount: number;
  unit: string;
  notes?: string;
  cost?: number;
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

export type ChemicalApp = {
  id: string;
  blockId: string;
  chemicalId: string;
  chemicalName: string;
  category: string;
  dateApplied: string;
  method: string;
  estimatedCost?: number;
  notes?: string;
};

export type BillingState = {
  planId: "STARTER" | "PRO" | "OPS";
  isAnnual: boolean;
  addOns: Record<string, boolean | number>;
  onboardingPurchased: boolean;
};

type AppState = {
  user: { name: string; org: string } | null;
  blocks: Block[];
  logs: FieldLog[];
  chemicals: Chemical[];
  chemicalApps: ChemicalApp[];
  billing: BillingState;
  
  login: () => void;
  logout: () => void;
  addBlock: (block: Block) => void;
  updateBlock: (id: string, block: Partial<Block>) => void;
  deleteBlock: (id: string) => void;
  
  addLog: (log: FieldLog) => void;
  deleteLog: (id: string) => void;
  addChemicalApp: (app: ChemicalApp) => void;
  deleteChemicalApp: (id: string) => void;
  setOnboarded: (data: any) => void;
  
  // Billing Actions
  setPlan: (planId: "STARTER" | "PRO" | "OPS", isAnnual: boolean) => void;
  toggleAnnual: (isAnnual: boolean) => void;
  setAddOn: (addOnId: string, value: boolean | number) => void;
  purchaseOnboarding: () => void;
};

const getInitialBilling = (): BillingState => {
  try {
    const saved = localStorage.getItem('kebb_billing');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  
  return {
    planId: "STARTER",
    isAnnual: false,
    addOns: {},
    onboardingPurchased: false
  };
};

export const useStore = create<AppState>((set) => ({
  user: null,
  billing: getInitialBilling(),
  
  blocks: [
    {
      id: '1',
      name: 'North 20',
      acreage: 20,
      variety: 'Peach',
      seasonGroup: 'Early',
      irrigationType: 'Drip',
      yieldTargetBins: 30,
      waterTargetAcreFeet: 3.0
    },
    {
      id: '2',
      name: 'South 15',
      acreage: 15,
      variety: 'Nectarine',
      seasonGroup: 'Mid',
      irrigationType: 'Fanjet',
      yieldTargetBins: 35,
      waterTargetAcreFeet: 3.2
    }
  ],
  logs: [
    {
      id: '1',
      blockId: '1',
      date: todayPacificISO(),
      actionType: 'IRRIGATE',
      material: 'Water',
      amount: 1.5,
      unit: 'acre-feet'
    }
  ],
  chemicals: [
    { id: 'c1', name: 'Nitrogen 32%', category: 'FERTILIZER', unit: 'GAL' },
    { id: 'c2', name: 'Copper Sulfate', category: 'FUNGICIDE', unit: 'LB' },
    { id: 'c3', name: 'Glyphosate 41%', category: 'HERBICIDE', unit: 'GAL' },
  ],
  chemicalApps: [
    {
      id: 'a1',
      blockId: '1',
      chemicalId: 'c1',
      chemicalName: 'Nitrogen 32%',
      category: 'FERTILIZER',
      dateApplied: todayPacificISO(),
      method: 'FERTIGATION',
      estimatedCost: 250,
      notes: 'Early season push'
    },
    {
      id: 'a2',
      blockId: '2',
      chemicalId: 'c2',
      chemicalName: 'Copper Sulfate',
      category: 'FUNGICIDE',
      dateApplied: todayPacificISO(),
      method: 'SPRAY',
      estimatedCost: 120,
    }
  ],
  login: () => set({ user: { name: 'Demo User', org: 'KEBB Farms' } }),
  logout: () => set({ user: null }),
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
  
  setPlan: (planId, isAnnual) => set(state => {
    const newBilling = { ...state.billing, planId, isAnnual };
    localStorage.setItem('kebb_billing', JSON.stringify(newBilling));
    return { billing: newBilling };
  }),
  
  toggleAnnual: (isAnnual) => set(state => {
    const newBilling = { ...state.billing, isAnnual };
    localStorage.setItem('kebb_billing', JSON.stringify(newBilling));
    return { billing: newBilling };
  }),
  
  setAddOn: (addOnId, value) => set(state => {
    const newBilling = { 
      ...state.billing, 
      addOns: { ...state.billing.addOns, [addOnId]: value } 
    };
    localStorage.setItem('kebb_billing', JSON.stringify(newBilling));
    return { billing: newBilling };
  }),
  
  purchaseOnboarding: () => set(state => {
    const newBilling = { ...state.billing, onboardingPurchased: true };
    localStorage.setItem('kebb_billing', JSON.stringify(newBilling));
    return { billing: newBilling };
  })
}));
