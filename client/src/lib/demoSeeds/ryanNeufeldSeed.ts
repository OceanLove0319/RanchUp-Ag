import { todayPacificISO } from '@/utils/dates';
import { Block, FieldLog, ChemicalApp, ProgramTemplate, BillingState, Ranch } from '@/lib/store';

export const DEMO_RANCHES: Ranch[] = [
  { id: "ranch-traver", name: "Traver Ranch", region: "Central Valley" },
  { id: "ranch-dinuba", name: "Dinuba Home", region: "Central Valley" }
];

export const DEMO_BLOCKS: Block[] = [
  {
    id: "block-early-peach",
    ranchId: "ranch-traver",
    name: "Early Peach Block",
    acreage: 22.5,
    variety: "Spring Snow Peach",
    seasonGroup: "Early",
    irrigationType: "Micro",
    yieldTargetBins: 32,
    waterTargetAcreFeet: 3.2
  },
  {
    id: "block-late-peach",
    ranchId: "ranch-traver",
    name: "Late Peach Block",
    acreage: 35.0,
    variety: "O'Henry Peach",
    seasonGroup: "Late",
    irrigationType: "Drip",
    yieldTargetBins: 38,
    waterTargetAcreFeet: 3.5
  },
  {
    id: "block-nectarine",
    ranchId: "ranch-traver",
    name: "Nectarine Block",
    acreage: 18.0,
    variety: "Summer Fire Nectarine",
    seasonGroup: "Mid",
    irrigationType: "Micro",
    yieldTargetBins: 28,
    waterTargetAcreFeet: 3.2
  },
  {
    id: "block-black-plum",
    ranchId: "ranch-dinuba",
    name: "Black Plum Block",
    acreage: 28.0,
    variety: "Black Splendor Plum",
    seasonGroup: "Mid",
    irrigationType: "Drip",
    yieldTargetBins: 25,
    waterTargetAcreFeet: 3.0
  },
  {
    id: "block-apricot",
    ranchId: "ranch-dinuba",
    name: "Apricot Trial",
    acreage: 10.0,
    variety: "Patterson Apricot",
    seasonGroup: "Early",
    irrigationType: "Drip",
    yieldTargetBins: 20,
    waterTargetAcreFeet: 2.8
  }
];

export const DEMO_TEMPLATES: ProgramTemplate[] = [
  {
    id: "tpl-bloom-fungicide",
    name: "Bloom Fungicide Pass",
    cropTags: ["Stone Fruit"],
    lines: [
      { id: "l1", type: "SPRAY", materialName: "Rovral 4 Flowable", rateValue: 1, rateUnit: "pt/ac", passesPlanned: 1, monthHint: 2 },
      { id: "l2", type: "SPRAY", materialName: "Vangard WG", rateValue: 5, rateUnit: "oz/ac", passesPlanned: 1, monthHint: 2 }
    ]
  },
  {
    id: "tpl-shuck-split",
    name: "Shuck Split Protection",
    cropTags: ["Stone Fruit"],
    lines: [
      { id: "l1", type: "SPRAY", materialName: "Pristine", rateValue: 10.5, rateUnit: "oz/ac", passesPlanned: 1, monthHint: 3 },
      { id: "l2", type: "SPRAY", materialName: "Altacor", rateValue: 12, rateUnit: "oz/ac", passesPlanned: 1, monthHint: 3 }
    ]
  },
  {
    id: "tpl-spring-n",
    name: "Spring N Push",
    cropTags: ["Stone Fruit"],
    lines: [
      { id: "l1", type: "FERT", materialName: "CAN-17", rateValue: 15, rateUnit: "gal/ac", passesPlanned: 2, monthHint: 4 }
    ]
  },
  {
    id: "tpl-summer-mite",
    name: "Summer Mite Program",
    cropTags: ["Stone Fruit"],
    lines: [
      { id: "l1", type: "SPRAY", materialName: "Acramite 50WS", rateValue: 0.75, rateUnit: "lb/ac", passesPlanned: 1, monthHint: 6 },
      { id: "l2", type: "SPRAY", materialName: "Agri-Mek SC", rateValue: 2.25, rateUnit: "fl oz/ac", passesPlanned: 1, monthHint: 6 }
    ]
  },
  {
    id: "tpl-post-harvest",
    name: "Post-Harvest Rebuild",
    cropTags: ["Stone Fruit"],
    lines: [
      { id: "l1", type: "FERT", materialName: "Zinc Sulfate", rateValue: 10, rateUnit: "lb/ac", passesPlanned: 1, monthHint: 9 },
      { id: "l2", type: "FERT", materialName: "Solubor", rateValue: 5, rateUnit: "lb/ac", passesPlanned: 1, monthHint: 9 }
    ]
  }
];

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const yesterdayISO = yesterday.toISOString();

const lastMonth = new Date();
lastMonth.setMonth(lastMonth.getMonth() - 1);
const lastMonthISO = lastMonth.toISOString();

export const DEMO_LOGS: FieldLog[] = [
  // Today's Logs
  {
    id: "log-today-1",
    ranchId: "ranch-traver",
    blockId: "block-early-peach",
    date: todayPacificISO(),
    actionType: "IRRIGATE",
    material: "Water",
    amount: 12,
    unit: "hrs"
  },
  {
    id: "log-today-2",
    ranchId: "ranch-traver",
    blockId: "block-late-peach",
    date: todayPacificISO(),
    actionType: "SPRAY",
    material: "Acramite 50WS",
    amount: 0.75,
    unit: "lb/ac",
    cost: 45
  },
  {
    id: "log-today-3",
    ranchId: "ranch-dinuba",
    blockId: "block-black-plum",
    date: todayPacificISO(),
    actionType: "FERT",
    material: "CAN-17",
    amount: 15,
    unit: "gal/ac",
    cost: 65
  },
  
  // Missing Rate / Unit Issues (Today)
  {
    id: "log-issue-1",
    ranchId: "ranch-dinuba",
    blockId: "block-apricot",
    date: todayPacificISO(),
    actionType: "SPRAY",
    material: "Pristine",
    amount: 0, // Missing rate
    unit: "oz/ac"
  },
  
  // Historical Logs
  {
    id: "log-hist-1",
    ranchId: "ranch-traver",
    blockId: "block-nectarine",
    date: yesterdayISO,
    actionType: "FERT",
    material: "Zinc Sulfate",
    amount: 10,
    unit: "lb/ac",
    cost: 25
  },
  {
    id: "log-hist-2",
    ranchId: "ranch-traver",
    blockId: "block-early-peach",
    date: lastMonthISO,
    actionType: "SPRAY",
    material: "Rovral 4 Flowable",
    amount: 1,
    unit: "pt/ac",
    cost: 35
  }
];

export const DEMO_CHEMICAL_APPS: ChemicalApp[] = [
  {
    id: "app-1",
    ranchId: "ranch-traver",
    blockId: "block-late-peach",
    chemicalId: "cv-022", // Pristine
    chemicalName: "Boscalid + Pyraclostrobin (Pristine)",
    category: "FUNGICIDE",
    dateApplied: lastMonthISO,
    method: "SPRAY",
    estimatedCost: 1200,
    costStatus: "ESTIMATED",
    notes: "Variance spike > 20% compared to last year" // intentional variance flag
  },
  {
    id: "app-2",
    ranchId: "ranch-traver",
    blockId: "block-nectarine",
    chemicalId: "cv-093", // CAN-17
    chemicalName: "CAN-17 (calcium ammonium nitrate)",
    category: "FERTILIZER",
    dateApplied: yesterdayISO,
    method: "FERTIGATION",
    estimatedCost: 0,
    costStatus: "UNIT_MISMATCH", // Unit mismatch issue
    notes: "Logged in lbs, but library expects gal"
  },
  {
    id: "app-3",
    ranchId: "ranch-dinuba",
    blockId: "block-apricot",
    chemicalId: "cv-055", // Acramite
    chemicalName: "Bifenazate (Acramite)",
    category: "INSECTICIDE_MITICIDE",
    dateApplied: todayPacificISO(),
    method: "SPRAY",
    estimatedCost: 0,
    costStatus: "UNIT_MISMATCH", // Another unit mismatch
    notes: "Logged in fl oz, but library expects lbs"
  }
];

export const DEMO_USER = {
  name: "Ryan Neufeld",
  org: "Neufeld Farms"
};

export const DEMO_BILLING: BillingState = {
  planId: "PRO",
  isAnnual: true,
  addOns: { "COST_ENGINE": true },
  onboardingPurchased: true
};

export function seedDemoData(store: any) {
  store.setState({
    user: DEMO_USER,
    ranches: DEMO_RANCHES,
    activeRanchId: DEMO_RANCHES[0].id,
    blocks: DEMO_BLOCKS,
    templates: DEMO_TEMPLATES,
    logs: DEMO_LOGS,
    chemicalApps: DEMO_CHEMICAL_APPS,
    billing: DEMO_BILLING
  });
  
  // Force a localStorage sync for critical parts by executing their standard set functions if needed,
  // but Zustand persist middleware should catch the setState. Just in case, we do billing manually:
  localStorage.setItem('kebb_billing', JSON.stringify(DEMO_BILLING));
  
  // Also seed projections based on templates
  DEMO_BLOCKS.forEach(block => {
    // Assign a couple templates to each block
    store.getState().setProjection(block.id, "tpl-spring-n");
    if (block.variety.includes("Peach") || block.variety.includes("Nectarine")) {
        store.getState().setProjection(block.id, "tpl-shuck-split");
    }
  });
}
