import { Block, FieldLog, ChemicalApp, Ranch } from "@/lib/store";

export type PacketLevel = "TODAY" | "MONTH" | "SEASON";

export interface PacketState {
  ranch?: Ranch;
  blocks: Block[];
  logs: FieldLog[];
  apps: ChemicalApp[];
  issuesCount: number;
  dateStart: Date;
  dateEnd: Date;
}

export type RenderBlockType = "HEADING" | "PARAGRAPH" | "TABLE" | "PAGE_BREAK" | "KEY_VALUE" | "TOC";

export interface RenderBlock {
  type: RenderBlockType;
  level?: number; // For Headings
  text?: string; // For Paragraphs/Headings
  columns?: string[]; // For Tables
  rows?: string[][]; // For Tables
  items?: { key: string; value: string }[]; // For KeyValueGrid
  tocItems?: { title: string; pageNumber?: number }[]; // For TOC
}

export interface PacketSection {
  id: string;
  title: string;
  description?: string;
  includeIf: (state: PacketState) => boolean;
  build: (state: PacketState) => RenderBlock[];
}

// RanchUp Season Packet TOC V1
export const RANCHUP_SEASON_TOC_V1: PacketSection[] = [
  {
    id: "cover",
    title: "RanchUp™ Season Packet",
    includeIf: () => true, // Always include
    build: (state) => [
      { type: "HEADING", level: 1, text: "RanchUp™ Season Packet" },
      { type: "PARAGRAPH", text: `Operation: ${state.ranch?.name || "All Ranches"}` },
      { type: "PARAGRAPH", text: `Season Year: ${state.dateStart.getFullYear()}` },
      { type: "PARAGRAPH", text: `Date Generated: ${new Date().toLocaleDateString()}` },
      { type: "PAGE_BREAK" }
    ]
  },
  {
    id: "scope",
    title: "1. PACKET SCOPE & CONTACTS",
    includeIf: () => true,
    build: (state) => [
      { type: "HEADING", level: 1, text: "1. PACKET SCOPE & CONTACTS" },
      { type: "KEY_VALUE", items: [
        { key: "Operation Name", value: state.ranch?.name || "All Ranches" },
        { key: "Primary Contacts", value: "Owner/Manager, Foreman, PCA, Applicator/QAL" },
        { key: "Data Coverage", value: `${state.blocks.length} Blocks, ${state.logs.length} Total Logs` }
      ]},
      { type: "PAGE_BREAK" }
    ]
  },
  {
    id: "block_register",
    title: "2. BLOCK REGISTER (FIELD INDEX)",
    includeIf: () => true,
    build: (state) => {
      if (state.blocks.length === 0) {
         return [
           { type: "HEADING", level: 1, text: "2. BLOCK REGISTER" },
           { type: "PARAGRAPH", text: "No blocks found." },
           { type: "PAGE_BREAK" }
         ];
      }
      return [
        { type: "HEADING", level: 1, text: "2. BLOCK REGISTER (FIELD INDEX)" },
        { type: "TABLE", 
          columns: ["Ranch", "Block", "Crop/Variety", "Acres", "Irrigation Method"],
          rows: state.blocks.map(b => [
            state.ranch?.name || "Unknown", 
            b.name || "—", 
            b.variety || "—", 
            b.acreage ? b.acreage.toString() : "0", 
            b.irrigationType || "—"
          ])
        },
        { type: "PAGE_BREAK" }
      ];
    }
  },
  {
    id: "field_history",
    title: "3. FIELD HISTORY SUMMARY (BY BLOCK)",
    includeIf: () => true,
    build: (state) => {
      const blocks: RenderBlock[] = [{ type: "HEADING", level: 1, text: "3. FIELD HISTORY SUMMARY (BY BLOCK)" }];
      
      if (state.blocks.length === 0 || state.logs.length === 0) {
        blocks.push({ type: "PARAGRAPH", text: "No logs recorded for the selected period." });
        blocks.push({ type: "PAGE_BREAK" });
        return blocks;
      }

      state.blocks.forEach(block => {
        const blockLogs = state.logs.filter(l => l.blockId === block.id).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        blocks.push({ type: "HEADING", level: 2, text: `Block: ${block.name} (${block.acreage} AC)` });
        
        if (blockLogs.length === 0) {
          blocks.push({ type: "PARAGRAPH", text: "No logs for this block." });
        } else {
          blocks.push({ 
            type: "TABLE", 
            columns: ["Date", "Activity", "Material", "Rate/Unit", "Acres", "Est Cost", "Actual Cost"],
            rows: blockLogs.map(l => {
              const app = state.apps.find(a => a.id === `app-${l.id}`);
              const estCostStr = app && app.estimatedCost ? `$${app.estimatedCost.toLocaleString()}` : '—';
              const actCostStr = l.cost ? `$${l.cost.toLocaleString()}` : '—';
              return [
                new Date(l.date).toLocaleDateString() || "—",
                l.actionType || "—",
                l.material || "—",
                `${l.amount || 0} ${l.unit || ""}`,
                block.acreage ? block.acreage.toString() : "0",
                estCostStr,
                actCostStr
              ];
            })
          });
        }
      });
      blocks.push({ type: "PAGE_BREAK" });
      return blocks;
    }
  },
  {
    id: "crop_protection",
    title: "4. CROP PROTECTION APPLICATION RECORDS",
    includeIf: (state) => state.logs.some(l => l.actionType === 'SPRAY'),
    build: (state) => {
      const sprays = state.logs.filter(l => l.actionType === 'SPRAY').sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      const blocks: RenderBlock[] = [{ type: "HEADING", level: 1, text: "4. CROP PROTECTION APPLICATION RECORDS" }];
      
      if (sprays.length === 0) {
        blocks.push({ type: "PARAGRAPH", text: "No records captured for this section." });
      } else {
        sprays.forEach(spray => {
           const block = state.blocks.find(b => b.id === spray.blockId);
           const app = state.apps.find(a => a.id === `app-${spray.id}`);
           blocks.push({ type: "HEADING", level: 2, text: `App Date: ${new Date(spray.date).toLocaleDateString()}` });
           blocks.push({ type: "KEY_VALUE", items: [
             { key: "Block", value: block?.name || "Unknown" },
             { key: "Acres Treated", value: block?.acreage ? block.acreage.toString() : "0" },
             { key: "Product", value: spray.material || "—" },
             { key: "Rate", value: `${spray.amount || 0} ${spray.unit || ""}` },
             { key: "Method", value: app?.method || spray.actionType || "—" },
             { key: "Notes", value: app?.notes || "None" },
           ]});
        });
      }
      blocks.push({ type: "PAGE_BREAK" });
      return blocks;
    }
  },
  {
    id: "phi_rei",
    title: "5. PHI / REI SUMMARY",
    includeIf: () => true, // Placeholder requires inclusion
    build: () => [
      { type: "HEADING", level: 1, text: "5. PHI / REI SUMMARY" },
      { type: "PARAGRAPH", text: "PHI/REI fields not captured in this build. See application records for timing." },
      { type: "PAGE_BREAK" }
    ]
  },
  {
    id: "fertility",
    title: "6. FERTILITY & AMENDMENT RECORDS",
    includeIf: (state) => state.logs.some(l => l.actionType === 'FERT'),
    build: (state) => {
      const ferts = state.logs.filter(l => l.actionType === 'FERT').sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      const blocks: RenderBlock[] = [{ type: "HEADING", level: 1, text: "6. FERTILITY & AMENDMENT RECORDS" }];
      
      if (ferts.length === 0) {
        blocks.push({ type: "PARAGRAPH", text: "No records captured for this section." });
      } else {
        blocks.push({ 
          type: "TABLE", 
          columns: ["Date", "Block", "Material", "Rate/Unit"],
          rows: ferts.map(f => {
            const block = state.blocks.find(b => b.id === f.blockId);
            return [
              new Date(f.date).toLocaleDateString() || "—",
              block?.name || "Unknown",
              f.material || "—",
              `${f.amount || 0} ${f.unit || ""}`
            ];
          })
        });
      }
      blocks.push({ type: "PAGE_BREAK" });
      return blocks;
    }
  },
  {
    id: "irrigation",
    title: "7. IRRIGATION & WATER SET LOG",
    includeIf: (state) => state.logs.some(l => l.actionType === 'IRRIGATE'),
    build: (state) => {
      const irrigs = state.logs.filter(l => l.actionType === 'IRRIGATE').sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      const blocks: RenderBlock[] = [{ type: "HEADING", level: 1, text: "7. IRRIGATION & WATER SET LOG" }];
      
      if (irrigs.length === 0) {
        blocks.push({ type: "PARAGRAPH", text: "No records captured for this section." });
      } else {
        blocks.push({ 
          type: "TABLE", 
          columns: ["Date", "Block", "Duration/Unit", "Notes"],
          rows: irrigs.map(i => {
            const block = state.blocks.find(b => b.id === i.blockId);
            return [
              new Date(i.date).toLocaleDateString() || "—",
              block?.name || "Unknown",
              `${i.amount || 0} ${i.unit || ""}`,
              i.notes || "—"
            ];
          })
        });
      }
      blocks.push({ type: "PAGE_BREAK" });
      return blocks;
    }
  },
  {
    id: "issues",
    title: "8. ISSUES, EXCEPTIONS & CORRECTIONS (TRUST SECTION)",
    includeIf: () => true, // Always include
    build: (state) => {
      const blocks: RenderBlock[] = [{ type: "HEADING", level: 1, text: "8. ISSUES, EXCEPTIONS & CORRECTIONS" }];
      
      const missingRates = state.logs.filter(l => !l.amount || l.amount <= 0);
      const unitMismatches = state.apps.filter(a => a.costStatus === 'UNIT_MISMATCH');
      
      if (missingRates.length === 0 && unitMismatches.length === 0) {
        blocks.push({ type: "PARAGRAPH", text: "No issues detected. All records clear." });
      } else {
        if (missingRates.length > 0) {
          blocks.push({ type: "HEADING", level: 2, text: "Missing Rate/Unit Information" });
          blocks.push({ 
            type: "TABLE", 
            columns: ["Date", "Material"],
            rows: missingRates.map(l => [new Date(l.date).toLocaleDateString() || "—", l.material || "—"])
          });
        }
        
        if (unitMismatches.length > 0) {
          blocks.push({ type: "HEADING", level: 2, text: "Unit Mismatches Detected" });
          blocks.push({ 
            type: "TABLE", 
            columns: ["Date", "Material", "Method"],
            rows: unitMismatches.map(a => [new Date(a.dateApplied).toLocaleDateString() || "—", a.chemicalName || "—", a.method || "—"])
          });
        }
      }
      blocks.push({ type: "PAGE_BREAK" });
      return blocks;
    }
  },
  {
    id: "rollups",
    title: "9. SEASON ROLLUPS (OWNER VIEW)",
    includeIf: (state) => state.logs.length > 0,
    build: (state) => {
      const blocks: RenderBlock[] = [{ type: "HEADING", level: 1, text: "9. SEASON ROLLUPS" }];
      
      // Calculate spend by block
      const blockSpendEst: Record<string, number> = {};
      const blockSpendAct: Record<string, number> = {};
      let totalSpendEst = 0;
      let totalSpendAct = 0;
      
      state.apps.forEach(app => {
         if (app.estimatedCost && app.costStatus !== 'UNIT_MISMATCH') {
            const blockName = state.blocks.find(b => b.id === app.blockId)?.name || "Unknown";
            blockSpendEst[blockName] = (blockSpendEst[blockName] || 0) + app.estimatedCost;
            totalSpendEst += app.estimatedCost;
         }
      });

      state.logs.forEach(log => {
        if (log.cost) {
          const blockName = state.blocks.find(b => b.id === log.blockId)?.name || "Unknown";
          blockSpendAct[blockName] = (blockSpendAct[blockName] || 0) + log.cost;
          totalSpendAct += log.cost;
        }
      });
      
      blocks.push({ type: "HEADING", level: 2, text: `Total Estimated Spend: $${totalSpendEst.toLocaleString()}` });
      blocks.push({ type: "HEADING", level: 2, text: `Total Actual Spend: $${totalSpendAct.toLocaleString()}` });
      
      const allBlocksSet = new Set([...Object.keys(blockSpendEst), ...Object.keys(blockSpendAct)]);
      
      if (allBlocksSet.size > 0) {
         blocks.push({ 
           type: "TABLE", 
           columns: ["Block", "Estimated Spend", "Actual Spend", "Variance"],
           rows: Array.from(allBlocksSet).map(b => {
             const est = blockSpendEst[b] || 0;
             const act = blockSpendAct[b] || 0;
             const variance = est - act;
             const varianceStr = variance === 0 ? "—" : (variance > 0 ? `-$${variance.toLocaleString()}` : `+$${Math.abs(variance).toLocaleString()}`);
             return [b, `$${est.toLocaleString()}`, act > 0 ? `$${act.toLocaleString()}` : '—', varianceStr];
           })
         });
      } else {
         blocks.push({ type: "PARAGRAPH", text: "No cost data available for rollups." });
      }

      blocks.push({ type: "PAGE_BREAK" });
      return blocks;
    }
  },
  {
    id: "appendix",
    title: "10. EXPORTS APPENDIX",
    includeIf: () => true, // Always include
    build: () => [
      { type: "HEADING", level: 1, text: "10. EXPORTS APPENDIX" },
      { type: "PARAGRAPH", text: "The following data exports are available from the system:" },
      { type: "KEY_VALUE", items: [
        { key: "PCA View CSV", value: "Available in Vault Export" },
        { key: "Block History Cards", value: "Available in Reports" },
        { key: "Vault Export (Filtered)", value: "Available in Dashboard" }
      ]},
      { type: "PAGE_BREAK" }
    ]
  }
];
