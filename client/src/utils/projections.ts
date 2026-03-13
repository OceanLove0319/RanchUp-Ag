import { Block, ProgramTemplate, ProgramTemplateLine as ProgramLine, Chemical, BlockProjection, ChemicalApp } from "@/hooks/useData";
import { isPerAcreUnit, normalizeUnit, areUnitsCompatible } from "@/utils/mathHelpers";

export type ComputedLine = {
  line: ProgramLine;
  overriddenRateValue: number;
  overriddenRateUnit: string;
  overriddenPasses: number;
  plannedTotalMaterial: number;
  plannedCost: number;
  matchedLibraryItem?: Chemical;
  flags: ("UNKNOWN_MATERIAL" | "UNIT_MISMATCH")[];
};

export type BlockProjectionSummary = {
  block: Block;
  template?: ProgramTemplate;
  computedLines: ComputedLine[];
  plannedSeasonTotal: number;
  actualToDate: number;
  remaining: number;
  overUnder: number;
};

export function computeLineCost(
  block: Block, 
  line: ProgramLine, 
  overrides?: { rateValue?: number, passesPlanned?: number, rateUnit?: string },
  chemicals: Chemical[] = []
): ComputedLine {
  const flags: ("UNKNOWN_MATERIAL" | "UNIT_MISMATCH")[] = [];
  
  const rateValue = overrides?.rateValue ?? line.rateValue;
  const rateUnit = overrides?.rateUnit ?? line.rateUnit;
  const passesPlanned = overrides?.passesPlanned ?? line.passesPlanned;

  let plannedTotalMaterial = 0;
  if (block.acreage > 0 && isPerAcreUnit(rateUnit)) {
    plannedTotalMaterial = block.acreage * rateValue * passesPlanned;
  } else if (block.acreage > 0) {
    plannedTotalMaterial = rateValue * passesPlanned;
  }

  let plannedCost = 0;
  let matchedChem: Chemical | undefined;

  if (line.materialId) {
    matchedChem = chemicals.find(c => c.id === line.materialId);
  } else {
    matchedChem = chemicals.find(c => 
      c.name.toLowerCase() === line.materialName.toLowerCase() || 
      c.aliases?.some(alias => line.materialName.toLowerCase().includes(alias.toLowerCase()))
    );
  }

  if (!matchedChem) {
    flags.push("UNKNOWN_MATERIAL");
  } else {
    if (!areUnitsCompatible(matchedChem.unit, rateUnit)) {
      flags.push("UNIT_MISMATCH");
    } else if (matchedChem.unitCostLow && matchedChem.unitCostHigh) {
      const packPriceMid = (matchedChem.unitCostLow + matchedChem.unitCostHigh) / 2;
      const chemNorm = normalizeUnit(matchedChem.unit);
      const baseUnitCostMid = chemNorm.multiplier ? (packPriceMid / chemNorm.multiplier) : packPriceMid;
      
      plannedCost = Math.round(plannedTotalMaterial * baseUnitCostMid);
    }
  }

  return {
    line,
    overriddenRateValue: rateValue,
    overriddenRateUnit: rateUnit,
    overriddenPasses: passesPlanned,
    plannedTotalMaterial,
    plannedCost,
    matchedLibraryItem: matchedChem,
    flags
  };
}

export function summarizeBlockProjection(
  block: Block,
  projection: BlockProjection | undefined,
  template: ProgramTemplate | undefined,
  chemicals: Chemical[],
  actualApps: ChemicalApp[]
): BlockProjectionSummary {
  
  let computedLines: ComputedLine[] = [];
  let plannedSeasonTotal = 0;

  if (template) {
    computedLines = template.lines.map(line => {
      const overrides = projection?.overrides.lines?.[line.id];
      const cl = computeLineCost(block, line, overrides, chemicals);
      plannedSeasonTotal += cl.plannedCost;
      return cl;
    });
  }

  // Calculate actuals
  // Rule: sum valid costs, ignoring UNIT_MISMATCH
  const actualToDate = actualApps
    .filter(a => a.blockId === block.id && a.costStatus !== 'UNIT_MISMATCH' && (a.estimatedCost || 0) > 0)
    .reduce((sum, a) => sum + (a.estimatedCost || 0), 0);

  const remaining = Math.max(plannedSeasonTotal - actualToDate, 0);
  const overUnder = actualToDate - plannedSeasonTotal;

  return {
    block,
    template,
    computedLines,
    plannedSeasonTotal,
    actualToDate,
    remaining,
    overUnder
  };
}
