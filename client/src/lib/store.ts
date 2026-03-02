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

type AppState = {
  user: { name: string; org: string } | null;
  blocks: Block[];
  logs: FieldLog[];
  login: () => void;
  logout: () => void;
  addBlock: (block: Block) => void;
  addLog: (log: FieldLog) => void;
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
  login: () => set({ user: { name: 'Demo User', org: 'KEBB Farms' } }),
  logout: () => set({ user: null }),
  addBlock: (block) => set((state) => ({ blocks: [...state.blocks, block] })),
  addLog: (log) => set((state) => ({ logs: [log, ...state.logs] })),
  setOnboarded: (data) => set({ user: { name: 'Grower', org: data.operationName } }),
}));
