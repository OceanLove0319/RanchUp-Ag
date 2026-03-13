import { useState, useMemo } from "react";
import { useRoute, useLocation, Link } from "wouter";
import { useStore } from "@/lib/store";
import { useBlocks, useTemplates, useProjections, useChemicals, useChemicalApps, useCreateProjection, ProgramTemplateLine } from "@/hooks/useData";
import { ArrowLeft, Copy, RotateCcw, AlertTriangle, ShieldAlert, Sprout, Droplets } from "lucide-react";
import { summarizeBlockProjection } from "@/utils/projections";

type ProgramLine = ProgramTemplateLine;

export default function BlockProjectionDetail() {
  const [, params] = useRoute("/app/projections/block/:id");
  const blockId = params?.id || "";
  const activeRanchId = useStore(s => s.activeRanchId);

  const { data: allBlocks = [] } = useBlocks(activeRanchId);
  const block = allBlocks.find(b => b.id === blockId);
  const { data: templates = [] } = useTemplates();
  const { data: projections = [] } = useProjections(blockId);
  const { data: chemicals = [] } = useChemicals();
  const { data: chemicalApps = [] } = useChemicalApps(activeRanchId);

  const createProjection = useCreateProjection();
  // TODO: updateProjectionLineOverride and resetProjectionOverrides need corresponding hooks in useData.ts
  const updateProjectionLineOverride = (_blockId: string, _lineId: string, _override: Record<string, any>) => { console.warn("updateProjectionLineOverride not yet migrated to API hook"); };
  const resetProjectionOverrides = (_blockId: string) => { console.warn("resetProjectionOverrides not yet migrated to API hook"); };

  const projection = projections.find(p => p.blockId === blockId);
  const activeTemplate = templates.find(t => t.id === projection?.templateId);

  const summary = useMemo(() => {
    if (!block) return null;
    return summarizeBlockProjection(block, projection, activeTemplate, chemicals, chemicalApps);
  }, [block, projection, activeTemplate, chemicals, chemicalApps]);

  if (!block || !summary) return <div>Block not found</div>;

  const handleTemplateSelect = (templateId: string) => {
    createProjection.mutate({ blockId, templateId });
  };

  const handleOverride = (lineId: string, field: keyof ProgramLine, value: string | number) => {
    updateProjectionLineOverride(blockId, lineId, { [field]: value });
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-6">
        <Link href="/app/projections" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
      </div>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white mb-2">{block.name}</h1>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {block.acreage} AC • {block.variety} • {block.irrigationType}
        </p>
      </header>

      <div className="bg-[#111113] border border-white/10 p-6 rounded-lg mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1">
          <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Program Template</label>
          <select 
            value={projection?.templateId || ""}
            onChange={e => handleTemplateSelect(e.target.value)}
            className="w-full bg-card border border-border text-sm font-bold text-white px-4 py-3 rounded focus:outline-none focus:border-primary appearance-none"
          >
            <option value="">-- Select Template --</option>
            {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        {projection && (
          <div className="flex items-center gap-3">
            <button 
              onClick={() => resetProjectionOverrides(blockId)}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-white hover:border-primary/50 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset Overrides
            </button>
          </div>
        )}
      </div>

      {/* Summary Footer at Top for easy reading */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border p-4 rounded-lg">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Planned Season</p>
          <p className="text-2xl font-black text-white">${summary.plannedSeasonTotal.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-border p-4 rounded-lg">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Actual To-Date</p>
          <p className="text-2xl font-black text-blue-400">${summary.actualToDate.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-border p-4 rounded-lg">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Remaining</p>
          <p className="text-2xl font-black text-white">${summary.remaining.toLocaleString()}</p>
        </div>
        <div className={`bg-card border border-border p-4 rounded-lg ${summary.overUnder > 0 ? 'bg-red-500/10 border-red-500/30' : ''}`}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Over/Under</p>
          <p className={`text-2xl font-black ${summary.overUnder > 0 ? 'text-red-400' : 'text-green-400'}`}>
            {summary.overUnder > 0 ? '+' : ''}{summary.overUnder.toLocaleString()}
          </p>
        </div>
      </div>

      <h3 className="text-xl font-black uppercase tracking-tight text-white mb-4 border-b border-border pb-2">Planned Passes</h3>
      
      {!activeTemplate ? (
        <div className="bg-card border border-border border-dashed p-12 rounded-lg text-center text-muted-foreground">
          <span className="font-bold uppercase tracking-widest text-sm">Select a template to generate passes.</span>
        </div>
      ) : (
        <div className="space-y-4">
          {summary.computedLines.map((cl, i) => {
            const hasOverrides = cl.overriddenRateValue !== cl.line.rateValue || 
                                 cl.overriddenRateUnit !== cl.line.rateUnit || 
                                 cl.overriddenPasses !== cl.line.passesPlanned;
            return (
              <div key={i} className="bg-card border border-border p-4 md:p-6 rounded-lg relative overflow-hidden">
                {hasOverrides && <div className="absolute top-0 right-0 border-t-0 border-r-0 border-[12px] border-transparent border-t-primary border-r-primary w-0 h-0" title="Has manual overrides"></div>}
                
                <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded text-white ${
                        cl.line.type === 'SPRAY' ? 'bg-purple-400/20 text-purple-400 border border-purple-400/30' :
                        cl.line.type === 'FERT' ? 'bg-orange-400/20 text-orange-400 border border-orange-400/30' :
                        'bg-blue-400/20 text-blue-400 border border-blue-400/30'
                      }`}>
                        {cl.line.type}
                      </span>
                      {cl.flags.includes("UNIT_MISMATCH") && (
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-orange-500/20 text-orange-500 border border-orange-500/30 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Unit Mismatch
                        </span>
                      )}
                      {cl.flags.includes("UNKNOWN_MATERIAL") && (
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-gray-500/20 text-gray-400 border border-gray-500/30">
                          Unknown Material
                        </span>
                      )}
                    </div>
                    <h4 className="text-xl font-black text-white">{cl.line.materialName}</h4>
                    {cl.matchedLibraryItem && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Library Match: {cl.matchedLibraryItem.name} 
                        (${cl.matchedLibraryItem.unitCostLow}-${cl.matchedLibraryItem.unitCostHigh}/{cl.matchedLibraryItem.unit})
                      </p>
                    )}
                  </div>
                  
                  <div className="text-left md:text-right">
                    {cl.flags.includes("UNIT_MISMATCH") || cl.flags.includes("UNKNOWN_MATERIAL") ? (
                      <div className="text-2xl font-black text-muted-foreground">$0</div>
                    ) : (
                      <div className="text-2xl font-black text-white">${cl.plannedCost.toLocaleString()}</div>
                    )}
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Est. Cost</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Rate</label>
                    <input 
                      type="number"
                      value={cl.overriddenRateValue}
                      onChange={e => handleOverride(cl.line.id, 'rateValue', Number(e.target.value))}
                      className={`w-full bg-background border rounded px-2 py-1.5 text-sm font-bold text-white focus:outline-none focus:border-primary ${cl.overriddenRateValue !== cl.line.rateValue ? 'border-primary' : 'border-border'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Unit</label>
                    <select 
                      value={cl.overriddenRateUnit}
                      onChange={e => handleOverride(cl.line.id, 'rateUnit', e.target.value)}
                      className={`w-full bg-background border rounded px-2 py-1.5 text-sm font-bold text-white focus:outline-none focus:border-primary appearance-none ${cl.overriddenRateUnit !== cl.line.rateUnit ? 'border-primary' : 'border-border'}`}
                    >
                      <option value="lb/ac">lb/ac</option>
                      <option value="oz/ac">oz/ac</option>
                      <option value="gal/ac">gal/ac</option>
                      <option value="pt/ac">pt/ac</option>
                      <option value="qt/ac">qt/ac</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Passes</label>
                    <input 
                      type="number"
                      value={cl.overriddenPasses}
                      onChange={e => handleOverride(cl.line.id, 'passesPlanned', Number(e.target.value))}
                      className={`w-full bg-background border rounded px-2 py-1.5 text-sm font-bold text-white focus:outline-none focus:border-primary ${cl.overriddenPasses !== cl.line.passesPlanned ? 'border-primary' : 'border-border'}`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
