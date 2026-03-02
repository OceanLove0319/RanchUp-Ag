import { create } from 'zustand';

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

type AppState = {
  user: { name: string; org: string } | null;
  blocks: Block[];
  logs: FieldLog[];
  chemicals: Chemical[];
  chemicalApps: ChemicalApp[];
  login: () => void;
  logout: () => void;
  addBlock: (block: Block) => void;
  addLog: (log: FieldLog) => void;
  addChemicalApp: (app: ChemicalApp) => void;
  setOnboarded: (data: any) => void;
};

export const useStore = create<AppState>((set) => ({
  user: null,
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
      date: new Date().toISOString().split('T')[0],
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
      dateApplied: new Date().toISOString().split('T')[0],
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
      dateApplied: new Date().toISOString().split('T')[0],
      method: 'SPRAY',
      estimatedCost: 120,
    }
  ],
  login: () => set({ user: { name: 'Demo User', org: 'KEBB Farms' } }),
  logout: () => set({ user: null }),
  addBlock: (block) => set((state) => ({ blocks: [...state.blocks, block] })),
  addLog: (log) => set((state) => ({ logs: [log, ...state.logs] })),
  addChemicalApp: (app) => set((state) => ({ chemicalApps: [app, ...state.chemicalApps] })),
  setOnboarded: (data) => set({ user: { name: 'Grower', org: data.operationName } }),
}));
