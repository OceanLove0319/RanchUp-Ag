import { todayPacificISO } from '@/utils/dates';
import { Ranch, Block, FieldLog, ChemicalApp } from '@/lib/store';
import { format, subDays, subMonths } from 'date-fns';

const today = new Date();
const formatDate = (daysAgo: number) => format(subDays(today, daysAgo), 'yyyy-MM-dd');

export const pcaDemoUser = { name: 'Karl W.', org: 'Simplot Grower Solutions', role: 'PCA' };

export const pcaDemoRanches: Ranch[] = [
  { id: "ranch-neufeld", name: "Neufeld Farms", region: "Traver" },
  { id: "ranch-jackson", name: "Jackson Family Orchards", region: "Kingsburg" },
  { id: "ranch-valley", name: "Valley Crest Nut Co.", region: "Tulare" },
  { id: "ranch-reedley", name: "Reedley Ridge Farms", region: "Reedley" },
];

export const pcaDemoBlocks: Block[] = [
  // Neufeld Farms (Peaches, Nectarines)
  { id: "b-n1", ranchId: "ranch-neufeld", name: "East Ranch - Spring Flame", acreage: 20, variety: "Spring Flame Peach", seasonGroup: "Early", irrigationType: "Fanjet", yieldTargetBins: 30, waterTargetAcreFeet: 3.5 },
  { id: "b-n2", ranchId: "ranch-neufeld", name: "East Ranch - O'Henry", acreage: 25, variety: "O'Henry Peach", seasonGroup: "Late", irrigationType: "Fanjet", yieldTargetBins: 35, waterTargetAcreFeet: 3.5 },
  { id: "b-n3", ranchId: "ranch-neufeld", name: "Canal Ranch - Autumn Bright", acreage: 15, variety: "Autumn Bright Nectarine", seasonGroup: "Late", irrigationType: "Drip", yieldTargetBins: 25, waterTargetAcreFeet: 3.0 },
  { id: "b-n4", ranchId: "ranch-neufeld", name: "Canal Ranch - Honey Blaze", acreage: 18, variety: "Honey Blaze Nectarine", seasonGroup: "Mid", irrigationType: "Drip", yieldTargetBins: 28, waterTargetAcreFeet: 3.0 },
  { id: "b-n5", ranchId: "ranch-neufeld", name: "Canal Ranch - Summer Sweet", acreage: 22, variety: "Summer Sweet Peach", seasonGroup: "Mid", irrigationType: "Drip", yieldTargetBins: 32, waterTargetAcreFeet: 3.2 },
  
  // Jackson Family Orchards (Citrus)
  { id: "b-j1", ranchId: "ranch-jackson", name: "River Ranch - Tango", acreage: 40, variety: "Tango Mandarin", seasonGroup: "Mid", irrigationType: "Double-line Drip", yieldTargetBins: 25, waterTargetAcreFeet: 2.5 },
  { id: "b-j2", ranchId: "ranch-jackson", name: "River Ranch - Powell", acreage: 35, variety: "Powell Navel", seasonGroup: "Late", irrigationType: "Microsprinkler", yieldTargetBins: 30, waterTargetAcreFeet: 3.0 },
  { id: "b-j3", ranchId: "ranch-jackson", name: "Home Place - Cara Cara", acreage: 22, variety: "Cara Cara Navel", seasonGroup: "Mid", irrigationType: "Microsprinkler", yieldTargetBins: 28, waterTargetAcreFeet: 3.0 },
  { id: "b-j4", ranchId: "ranch-jackson", name: "Home Place - Washington", acreage: 18, variety: "Washington Navel", seasonGroup: "Mid", irrigationType: "Microsprinkler", yieldTargetBins: 25, waterTargetAcreFeet: 3.0 },
  
  // Valley Crest Nut Co (Almonds, Pistachios)
  { id: "b-v1", ranchId: "ranch-valley", name: "South Block - Nonpareil", acreage: 60, variety: "Nonpareil Almond", seasonGroup: "Mid", irrigationType: "Drip + Minis", yieldTargetBins: 3000, waterTargetAcreFeet: 4.0 },
  { id: "b-v2", ranchId: "ranch-valley", name: "South Block - Monterey", acreage: 60, variety: "Monterey Almond", seasonGroup: "Late", irrigationType: "Drip + Minis", yieldTargetBins: 2800, waterTargetAcreFeet: 4.0 },
  { id: "b-v3", ranchId: "ranch-valley", name: "Turner Ranch - Kerman", acreage: 80, variety: "Kerman Pistachio", seasonGroup: "Late", irrigationType: "Double-line Drip", yieldTargetBins: 3500, waterTargetAcreFeet: 3.8 },
  { id: "b-v4", ranchId: "ranch-valley", name: "Turner Ranch - Golden Hills", acreage: 40, variety: "Golden Hills Pistachio", seasonGroup: "Late", irrigationType: "Double-line Drip", yieldTargetBins: 3200, waterTargetAcreFeet: 3.8 },
  
  // Reedley Ridge Farms
  { id: "b-r1", ranchId: "ranch-reedley", name: "Ridge Ranch - Nonpareil", acreage: 45, variety: "Nonpareil Almond", seasonGroup: "Mid", irrigationType: "Fanjet", yieldTargetBins: 2900, waterTargetAcreFeet: 4.0 },
  { id: "b-r2", ranchId: "ranch-reedley", name: "Schoolhouse - Zee Lady", acreage: 20, variety: "Zee Lady Peach", seasonGroup: "Mid", irrigationType: "Fanjet", yieldTargetBins: 32, waterTargetAcreFeet: 3.5 },
  { id: "b-r3", ranchId: "ranch-reedley", name: "Schoolhouse - O'Henry", acreage: 25, variety: "O'Henry Peach", seasonGroup: "Late", irrigationType: "Fanjet", yieldTargetBins: 34, waterTargetAcreFeet: 3.5 },
];

export const pcaDemoLogs: FieldLog[] = [
  // Neufeld (Good spray history, some missing labor notes)
  { id: "log-n1", ranchId: "ranch-neufeld", blockId: "b-n1", date: formatDate(45), actionType: "SPRAY", material: "Pristine", amount: 1, unit: "lb/ac", notes: "Bloom fungicide pass" },
  { id: "log-n2", ranchId: "ranch-neufeld", blockId: "b-n2", date: formatDate(30), actionType: "SPRAY", material: "Rovral", amount: 2, unit: "pt/ac", notes: "Petal fall spray" },
  { id: "log-n3", ranchId: "ranch-neufeld", blockId: "b-n3", date: formatDate(15), actionType: "FERT", material: "UN-32", amount: 10, unit: "gal/ac", notes: "Spring push" },
  { id: "log-n4", ranchId: "ranch-neufeld", blockId: "b-n1", date: formatDate(5), actionType: "LABOR", material: "Thinning", amount: 1, unit: "pass", notes: "" }, // Missing labor notes

  // Jackson (Strong irrigation, fertigation, 1 compliance issue)
  { id: "log-j1", ranchId: "ranch-jackson", blockId: "b-j1", date: formatDate(60), actionType: "IRRIGATE", material: "Water", amount: 12, unit: "hrs", notes: "Frost-protection irrigation note for citrus" },
  { id: "log-j2", ranchId: "ranch-jackson", blockId: "b-j2", date: formatDate(40), actionType: "FERT", material: "Calcium Nitrate", amount: 25, unit: "lb/ac", notes: "Fertigation event" },
  { id: "log-j3", ranchId: "ranch-jackson", blockId: "b-j1", date: formatDate(20), actionType: "IRRIGATE", material: "Water", amount: 24, unit: "hrs", notes: "Heavy set week adjustment" },
  { id: "log-j4", ranchId: "ranch-jackson", blockId: "b-j3", date: formatDate(10), actionType: "SPRAY", material: "Success", amount: 6, unit: "oz/ac", notes: "Citrus thrips control. Missing operator name." }, // Compliance issue

  // Valley Crest (Multiple fungicide/insecticide, nutrient, 1 missing restricted detail)
  { id: "log-v1", ranchId: "ranch-valley", blockId: "b-v1", date: formatDate(50), actionType: "SPRAY", material: "Merivon", amount: 6.5, unit: "oz/ac", notes: "Dormant spray" },
  { id: "log-v2", ranchId: "ranch-valley", blockId: "b-v2", date: formatDate(35), actionType: "FERT", material: "Solution-grade Gypsum", amount: 100, unit: "lb/ac", notes: "Gypsum injection for infiltration" },
  { id: "log-v3", ranchId: "ranch-valley", blockId: "b-v3", date: formatDate(15), actionType: "SPRAY", material: "Intrepid 2F", amount: 16, unit: "oz/ac", notes: "Missing restricted-material attachment" }, // Missing info
  
  // Reedley Ridge (Mixed record quality, incomplete product rate)
  { id: "log-r1", ranchId: "ranch-reedley", blockId: "b-r1", date: formatDate(25), actionType: "SPRAY", material: "Abamectin", amount: 0, unit: "", notes: "Miticide pass - NEED RATE" }, // Missing info flag
  { id: "log-r2", ranchId: "ranch-reedley", blockId: "b-r2", date: formatDate(12), actionType: "FERT", material: "Foliar Zinc", amount: 5, unit: "lb/ac", notes: "Foliar zinc pass" },
  { id: "log-r3", ranchId: "ranch-reedley", blockId: "b-r3", date: formatDate(2), actionType: "IRRIGATE", material: "Water", amount: 12, unit: "hrs", notes: "Microsprinkler repair on line 4" },
];

export const pcaDemoApps: ChemicalApp[] = [
  // Neufeld (Overspending block example: b-n1 has 3 expensive fungicide passes)
  { id: "app-n1", ranchId: "ranch-neufeld", blockId: "b-n1", chemicalId: "c-1", chemicalName: "Pristine", category: "FUNGICIDE", dateApplied: formatDate(45), method: "SPRAY", estimatedCost: 1850, costStatus: "ESTIMATED" },
  { id: "app-n2", ranchId: "ranch-neufeld", blockId: "b-n1", chemicalId: "c-2", chemicalName: "Merivon", category: "FUNGICIDE", dateApplied: formatDate(30), method: "SPRAY", estimatedCost: 2100, costStatus: "ESTIMATED" },
  { id: "app-n3", ranchId: "ranch-neufeld", blockId: "b-n1", chemicalId: "c-3", chemicalName: "Luna Sensation", category: "FUNGICIDE", dateApplied: formatDate(15), method: "SPRAY", estimatedCost: 1950, costStatus: "ESTIMATED" }, // High spend
  { id: "app-n4", ranchId: "ranch-neufeld", blockId: "b-n2", chemicalId: "c-4", chemicalName: "Rovral", category: "FUNGICIDE", dateApplied: formatDate(30), method: "SPRAY", estimatedCost: 900, costStatus: "INVOICE" },
  { id: "app-n5", ranchId: "ranch-neufeld", blockId: "b-n3", chemicalId: "c-5", chemicalName: "UN-32", category: "NUTRITION", dateApplied: formatDate(15), method: "FERT", estimatedCost: 600, costStatus: "INVOICE" },

  // Jackson
  { id: "app-j1", ranchId: "ranch-jackson", blockId: "b-j2", chemicalId: "c-6", chemicalName: "Calcium Nitrate", category: "NUTRITION", dateApplied: formatDate(40), method: "FERT", estimatedCost: 850, costStatus: "INVOICE" },
  { id: "app-j2", ranchId: "ranch-jackson", blockId: "b-j3", chemicalId: "c-7", chemicalName: "Success", category: "INSECTICIDE_MITICIDE", dateApplied: formatDate(10), method: "SPRAY", estimatedCost: 1200, costStatus: "ESTIMATED" },

  // Valley Crest
  { id: "app-v1", ranchId: "ranch-valley", blockId: "b-v1", chemicalId: "c-8", chemicalName: "Merivon", category: "FUNGICIDE", dateApplied: formatDate(50), method: "SPRAY", estimatedCost: 1500, costStatus: "ESTIMATED" },
  { id: "app-v2", ranchId: "ranch-valley", blockId: "b-v2", chemicalId: "c-9", chemicalName: "Solution-grade Gypsum", category: "AMENDMENT", dateApplied: formatDate(35), method: "FERT", estimatedCost: 750, costStatus: "INVOICE" },
  { id: "app-v3", ranchId: "ranch-valley", blockId: "b-v3", chemicalId: "c-10", chemicalName: "Intrepid 2F", category: "INSECTICIDE_MITICIDE", dateApplied: formatDate(15), method: "SPRAY", estimatedCost: 2200, costStatus: "ESTIMATED" },

  // Reedley Ridge
  { id: "app-r1", ranchId: "ranch-reedley", blockId: "b-r1", chemicalId: "c-11", chemicalName: "Abamectin", category: "INSECTICIDE_MITICIDE", dateApplied: formatDate(25), method: "SPRAY", costStatus: "UNIT_MISMATCH" }, // Unit mismatch flag
  { id: "app-r2", ranchId: "ranch-reedley", blockId: "b-r2", chemicalId: "c-12", chemicalName: "Foliar Zinc", category: "NUTRITION", dateApplied: formatDate(12), method: "SPRAY", estimatedCost: 400, costStatus: "ESTIMATED" },
];

export const pcaDemoRecommendations = [
  { id: "rec-1", ranchId: "ranch-neufeld", blockId: "b-n2", title: "Bloom protection", status: "ACKNOWLEDGED", date: formatDate(5), notes: "Grower asked whether second zinc pass is necessary.", cropStage: "Bloom", product: "Pristine" },
  { id: "rec-2", ranchId: "ranch-valley", blockId: "b-v1", title: "Hull split fungicide + insect", status: "PENDING", date: formatDate(2), notes: "Waiting on confirmation before applying hull split pass.", cropStage: "Hull Split", product: "Merivon + Intrepid" },
  { id: "rec-3", ranchId: "ranch-jackson", blockId: "b-j2", title: "Scale pressure monitoring", status: "DRAFT", date: formatDate(0), notes: "Need updated observation after rain event.", cropStage: "Fruit Development", product: "Movento" },
  { id: "rec-4", ranchId: "ranch-valley", blockId: "b-v2", title: "Mite threshold watch", status: "SENT", date: formatDate(1), notes: "Watch threshold carefully this week.", cropStage: "Nut Fill", product: "Acramite" },
  { id: "rec-5", ranchId: "ranch-reedley", blockId: "b-r3", title: "Post-rain disease prevention", status: "PENDING", date: formatDate(3), notes: "Apply within 48h of next rain.", cropStage: "Pre-harvest", product: "Luna Sensation" },
];
