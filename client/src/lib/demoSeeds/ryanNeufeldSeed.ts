import { todayPacificISO } from '@/utils/dates';
// Legacy demo seed — loose typing since this data is no longer used in production
type Ranch = any; type Block = any; type FieldLog = any; type ChemicalApp = any; type ProgramTemplate = any; type BillingState = any;

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

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const lastWeek = new Date(today);
lastWeek.setDate(lastWeek.getDate() - 7);
const lastMonth = new Date(today);
lastMonth.setMonth(lastMonth.getMonth() - 1);
const twoMonthsAgo = new Date(today);
twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

const todayISO = todayPacificISO();
const yesterdayISO = yesterday.toISOString();
const lastWeekISO = lastWeek.toISOString();
const lastMonthISO = lastMonth.toISOString();
const twoMonthsAgoISO = twoMonthsAgo.toISOString();

// Helper to generate IDs
let logIdCounter = 1;
let appIdCounter = 1;

function createDemoLogs() {
  const logs: FieldLog[] = [];
  const apps: ChemicalApp[] = [];

  DEMO_BLOCKS.forEach(block => {
    // 1. Two Months Ago: Bloom Fungicide
    logs.push({
      id: `log-auto-${logIdCounter++}`,
      ranchId: block.ranchId,
      blockId: block.id,
      date: twoMonthsAgoISO,
      actionType: "SPRAY",
      material: "Rovral 4 Flowable",
      amount: 1,
      unit: "pt/ac",
      cost: 35
    });
    apps.push({
      id: `app-auto-${appIdCounter++}`,
      ranchId: block.ranchId,
      blockId: block.id,
      chemicalId: "cv-015", // Mock ID
      chemicalName: "Iprodione (Rovral)",
      category: "FUNGICIDE",
      dateApplied: twoMonthsAgoISO,
      method: "SPRAY",
      estimatedCost: 35 * block.acreage,
      costStatus: "ESTIMATED"
    });

    logs.push({
      id: `log-auto-${logIdCounter++}`,
      ranchId: block.ranchId,
      blockId: block.id,
      date: twoMonthsAgoISO,
      actionType: "SPRAY",
      material: "Vangard WG",
      amount: 5,
      unit: "oz/ac",
      cost: 15
    });
    apps.push({
      id: `app-auto-${appIdCounter++}`,
      ranchId: block.ranchId,
      blockId: block.id,
      chemicalId: "cv-016", // Mock ID
      chemicalName: "Cyprodinil (Vangard)",
      category: "FUNGICIDE",
      dateApplied: twoMonthsAgoISO,
      method: "SPRAY",
      estimatedCost: 15 * 5 * block.acreage,
      costStatus: "ESTIMATED"
    });

    // 2. Last Month: Shuck Split & Spring N
    logs.push({
      id: `log-auto-${logIdCounter++}`,
      ranchId: block.ranchId,
      blockId: block.id,
      date: lastMonthISO,
      actionType: "SPRAY",
      material: "Pristine",
      amount: 10.5,
      unit: "oz/ac",
      cost: 42
    });
    apps.push({
      id: `app-auto-${appIdCounter++}`,
      ranchId: block.ranchId,
      blockId: block.id,
      chemicalId: "cv-022",
      chemicalName: "Boscalid + Pyraclostrobin (Pristine)",
      category: "FUNGICIDE",
      dateApplied: lastMonthISO,
      method: "SPRAY",
      estimatedCost: 42 * 10.5 * block.acreage,
      costStatus: "ESTIMATED"
    });

    logs.push({
      id: `log-auto-${logIdCounter++}`,
      ranchId: block.ranchId,
      blockId: block.id,
      date: lastMonthISO,
      actionType: "FERT",
      material: "CAN-17",
      amount: 15,
      unit: "gal/ac",
      cost: 2.5
    });
    apps.push({
      id: `app-auto-${appIdCounter++}`,
      ranchId: block.ranchId,
      blockId: block.id,
      chemicalId: "cv-093",
      chemicalName: "CAN-17 (calcium ammonium nitrate)",
      category: "FERTILIZER",
      dateApplied: lastMonthISO,
      method: "FERTIGATION",
      estimatedCost: 2.5 * 15 * block.acreage,
      costStatus: "ESTIMATED"
    });

    // 3. Last Week: Irrigation
    logs.push({
      id: `log-auto-${logIdCounter++}`,
      ranchId: block.ranchId,
      blockId: block.id,
      date: lastWeekISO,
      actionType: "IRRIGATE",
      material: "Water",
      amount: 24,
      unit: "hrs",
      cost: 150
    });

    // 4. Yesterday: Summer Mite Prep (Partial)
    if (block.id !== "block-apricot") {
      logs.push({
        id: `log-auto-${logIdCounter++}`,
        ranchId: block.ranchId,
        blockId: block.id,
        date: yesterdayISO,
        actionType: "SPRAY",
        material: "Acramite 50WS",
        amount: 0.75,
        unit: "lb/ac",
        cost: 65
      });
      apps.push({
        id: `app-auto-${appIdCounter++}`,
        ranchId: block.ranchId,
        blockId: block.id,
        chemicalId: "cv-055",
        chemicalName: "Bifenazate (Acramite)",
        category: "INSECTICIDE_MITICIDE",
        dateApplied: yesterdayISO,
        method: "SPRAY",
        estimatedCost: 65 * 0.75 * block.acreage,
        costStatus: "ESTIMATED"
      });
    } else {
      // Intentional error for apricot block
      logs.push({
        id: `log-issue-auto-${logIdCounter++}`,
        ranchId: block.ranchId,
        blockId: block.id,
        date: yesterdayISO,
        actionType: "SPRAY",
        material: "Acramite 50WS",
        amount: 0, // Missing rate
        unit: "lb/ac",
        cost: 0
      });
      apps.push({
        id: `app-issue-auto-${appIdCounter++}`,
        ranchId: block.ranchId,
        blockId: block.id,
        chemicalId: "cv-055",
        chemicalName: "Bifenazate (Acramite)",
        category: "INSECTICIDE_MITICIDE",
        dateApplied: yesterdayISO,
        method: "SPRAY",
        estimatedCost: 0,
        costStatus: "UNIT_MISMATCH",
        notes: "Missing applied rate in logs"
      });
    }

    // 5. Today: Irrigation or spot spray
    logs.push({
      id: `log-auto-${logIdCounter++}`,
      ranchId: block.ranchId,
      blockId: block.id,
      date: todayISO,
      actionType: "IRRIGATE",
      material: "Water",
      amount: 12,
      unit: "hrs"
    });
  });

  return { logs, apps };
}

const autoData = createDemoLogs();
export const DEMO_LOGS: FieldLog[] = autoData.logs;
export const DEMO_CHEMICAL_APPS: ChemicalApp[] = autoData.apps;

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
  localStorage.setItem('ranchup_billing', JSON.stringify(DEMO_BILLING));
  
  // Assign templates to all blocks to fully populate the plan & budget features
  DEMO_BLOCKS.forEach(block => {
    store.getState().setProjection(block.id, "tpl-bloom-fungicide");
    store.getState().setProjection(block.id, "tpl-shuck-split");
    store.getState().setProjection(block.id, "tpl-spring-n");
    store.getState().setProjection(block.id, "tpl-summer-mite");
    store.getState().setProjection(block.id, "tpl-post-harvest");
  });
}

