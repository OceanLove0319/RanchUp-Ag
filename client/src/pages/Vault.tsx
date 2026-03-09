import { useStore } from "@/lib/store";
import { FileText, Download, Filter, Printer, ChevronDown, Lock, Trash2 } from "lucide-react";
import { useState } from "react";
import { getActiveSeasonWindow } from "@/utils/season";
import { isWithin } from "@/utils/dates";
import { Link, useLocation } from "wouter";
import { useGating } from "@/utils/gating";
import { useToast } from "@/hooks/use-toast";

// Deterministic Sort
const sortLogsDeterministic = (logs: any[]) => {
  return [...logs].sort((a, b) => {
    if (a.dateApplied !== b.dateApplied) return a.dateApplied.localeCompare(b.dateApplied);
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    return a.chemicalName.localeCompare(b.chemicalName);
  });
};

export default function Vault() {
  const logs = useStore(s => s.logs);
  const blocks = useStore(s => s.blocks);
  const chemApps = useStore(s => s.chemicalApps);
  const deleteChemicalApp = useStore(s => s.deleteChemicalApp);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});
  const { requirePro } = useGating();

  // Default to first block if none selected
  const [selectedBlockId, setSelectedBlockId] = useState<string>(blocks[0]?.id || "");
  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  if (!selectedBlock) {
    return <div className="p-8 text-center text-muted-foreground">No blocks found. Create a block first.</div>;
  }

  const seasonWindow = getActiveSeasonWindow(selectedBlock);

  // Filter logs for the selected block within the active season window
  const blockChemApps = chemApps.filter(app => 
    app.blockId === selectedBlockId && isWithin(app.dateApplied, seasonWindow.startISO, seasonWindow.endISO)
  );

  // Split into categories and sort deterministically
  const sprays = sortLogsDeterministic(blockChemApps.filter(app => 
    ['FUNGICIDE', 'INSECTICIDE', 'HERBICIDE', 'ADJUVANT', 'OTHER'].includes(app.category)
  ));
  
  const fertility = sortLogsDeterministic(blockChemApps.filter(app => app.category === 'FERTILIZER'));
  
  // Totals - only sum finite estimatedCosts
  const sumCosts = (apps: any[]) => apps.reduce((sum, app) => sum + (Number.isFinite(app.estimatedCost) ? app.estimatedCost : 0), 0);
  
  const seasonSpend = sumCosts(blockChemApps);
  const spraySpend = sumCosts(sprays);
  const fertSpend = sumCosts(fertility);
  
  const totalApps = blockChemApps.length;
  const logsWithCost = blockChemApps.filter(app => Number.isFinite(app.estimatedCost)).length;

  const handleExportClick = () => {
    setLocation(`/app/vault/print/${selectedBlockId}`);
  };

  const toggleNote = (id: string) => {
    setExpandedNotes(prev => ({...prev, [id]: !prev[id]}));
  };

  const renderNote = (app: any) => {
    if (!app.notes) return null;
    const isExpanded = expandedNotes[app.id || `${app.dateApplied}-${app.chemicalName}`];
    const shouldTruncate = app.notes.length > 80;

    return (
      <div className="text-sm mt-2 text-muted-foreground">
        Notes: <strong className="text-foreground ml-1">
          {shouldTruncate && !isExpanded ? `${app.notes.substring(0, 80)}...` : app.notes}
        </strong>
        {shouldTruncate && (
          <button 
            onClick={() => toggleNote(app.id || `${app.dateApplied}-${app.chemicalName}`)}
            className="ml-2 text-primary hover:underline text-xs uppercase tracking-widest font-bold"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20 max-w-4xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Archive</p>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-foreground mb-4">Season Vault</h1>
          
          <div className="relative inline-block">
            <select 
              value={selectedBlockId}
              onChange={(e) => setSelectedBlockId(e.target.value)}
              className="appearance-none bg-card border border-border rounded-lg pl-4 pr-10 py-2 text-foreground font-bold focus:outline-none focus:border-primary"
            >
              {blocks.map(b => (
                <option key={b.id} value={b.id}>{b.name} ({b.acreage} AC)</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-3">
            Active Season: <span className="text-primary">{seasonWindow.label}</span>
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <button 
            onClick={handleExportClick}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-3 rounded font-black uppercase tracking-widest text-sm transition-colors hover:bg-primary/90 shadow-[0_0_15px_rgba(234,153,61,0.2)]"
          >
            <Printer className="w-4 h-4" /> Export Season Packet
          </button>
          {!requirePro("Advanced Export").allowed && (
            <Link href="/app/pricing" className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
              <Lock className="w-3 h-3" /> Upgrade to Pro for Audit Bundles
            </Link>
          )}
        </div>
      </div>

      {/* Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-card border border-border p-4 rounded-lg">
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Season Spend</p>
          <p className="text-xl md:text-2xl font-black text-foreground">${seasonSpend.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-border p-4 rounded-lg">
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Apps</p>
          <p className="text-xl md:text-2xl font-black text-foreground">{totalApps}</p>
        </div>
        <div className="bg-card border border-border p-4 rounded-lg">
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Sprays</p>
          <p className="text-lg md:text-xl font-black text-foreground mb-1">${spraySpend.toLocaleString()}</p>
          <p className="text-[10px] md:text-xs font-bold text-muted-foreground">{sprays.length} apps</p>
        </div>
        <div className="bg-card border border-border p-4 rounded-lg">
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Fertility</p>
          <p className="text-lg md:text-xl font-black text-foreground mb-1">${fertSpend.toLocaleString()}</p>
          <p className="text-[10px] md:text-xs font-bold text-muted-foreground">{fertility.length} apps</p>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-8 px-2">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Cost Coverage: <span className="text-foreground">{logsWithCost}/{totalApps}</span> 
          {totalApps > 0 ? ` (${Math.round((logsWithCost/totalApps)*100)}%)` : ''}
        </p>
        <p className="text-xs italic text-muted-foreground">Some applications may not have costs entered.</p>
      </div>

      {/* Sprays Section */}
      <h2 className="text-xl font-black uppercase tracking-tight text-foreground mb-4 border-b border-border pb-2 mt-12">Sprays & Chemicals</h2>
      {sprays.length > 0 ? (
        <div className="space-y-3">
          {sprays.map(app => (
            <div key={app.id || `${app.dateApplied}-${app.chemicalName}`} className="bg-card border border-border p-4 rounded-lg hover:border-primary/30 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-muted-foreground">{app.dateApplied}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-purple-400/10 text-purple-400 px-2 py-0.5 rounded">
                    {app.category}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-background border border-border text-muted-foreground px-2 py-0.5 rounded">
                    {app.method}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="font-bold text-foreground">
                    {Number.isFinite(app.estimatedCost) ? `$${app.estimatedCost.toLocaleString()}` : '—'}
                  </span>
                  {app.costStatus === 'UNIT_MISMATCH' && (
                    <span className="text-[9px] font-bold uppercase tracking-widest text-orange-400 bg-orange-400/10 px-1.5 py-0.5 rounded border border-orange-400/30">
                      Unit Mismatch
                    </span>
                  )}
                </div>
              </div>
              <h3 className="text-lg font-black text-foreground">{app.chemicalName}</h3>
              {renderNote(app)}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border border-dashed p-8 rounded-lg text-center text-muted-foreground font-bold uppercase tracking-widest text-sm">
          No sprays recorded this season
        </div>
      )}

      {/* Fertility Section */}
      <h2 className="text-xl font-black uppercase tracking-tight text-foreground mb-4 border-b border-border pb-2 mt-12">Fertility Program</h2>
      {fertility.length > 0 ? (
        <div className="space-y-3">
          {fertility.map(app => (
            <div key={app.id || `${app.dateApplied}-${app.chemicalName}`} className="bg-card border border-border p-4 rounded-lg hover:border-primary/30 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-muted-foreground">{app.dateApplied}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-orange-400/10 text-orange-400 px-2 py-0.5 rounded">
                    {app.category}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-background border border-border text-muted-foreground px-2 py-0.5 rounded">
                    {app.method}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="font-bold text-foreground">
                    {Number.isFinite(app.estimatedCost) ? `$${app.estimatedCost.toLocaleString()}` : '—'}
                  </span>
                  {app.costStatus === 'UNIT_MISMATCH' && (
                    <span className="text-[9px] font-bold uppercase tracking-widest text-orange-400 bg-orange-400/10 px-1.5 py-0.5 rounded border border-orange-400/30">
                      Unit Mismatch
                    </span>
                  )}
                </div>
              </div>
              <h3 className="text-lg font-black text-foreground">{app.chemicalName}</h3>
              {renderNote(app)}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border border-dashed p-8 rounded-lg text-center text-muted-foreground font-bold uppercase tracking-widest text-sm">
          No fertility applications recorded this season
        </div>
      )}

      <h2 className="text-xl font-black uppercase tracking-tight text-foreground mb-4 border-b border-border pb-2 mt-16">Other Documents</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-border p-4 rounded-lg flex items-center justify-between group cursor-pointer hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-background rounded text-muted-foreground group-hover:text-primary transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-foreground">Soil Analysis 2026.pdf</p>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Added Mar 1</p>
            </div>
          </div>
          <Download className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </div>
        
        <div className="bg-card border border-border border-dashed p-4 rounded-lg flex items-center justify-center cursor-pointer hover:bg-background/50 transition-colors text-muted-foreground hover:text-foreground">
          <p className="font-bold uppercase tracking-widest text-sm">+ Upload Document</p>
        </div>
      </div>
    </div>
  );
}
