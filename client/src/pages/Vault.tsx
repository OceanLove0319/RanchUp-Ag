import { useStore } from "@/lib/store";
import { FileText, Download, Filter, Printer, ChevronDown } from "lucide-react";
import { useState } from "react";
import { getActiveSeasonWindow } from "@/utils/season";
import { isWithin } from "@/utils/dates";
import { Link, useLocation } from "wouter";

export default function Vault() {
  const logs = useStore(s => s.logs);
  const blocks = useStore(s => s.blocks);
  const chemApps = useStore(s => s.chemicalApps);
  const [, setLocation] = useLocation();

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

  // Split into categories
  const sprays = blockChemApps.filter(app => 
    ['FUNGICIDE', 'INSECTICIDE', 'HERBICIDE', 'ADJUVANT', 'OTHER'].includes(app.category)
  );
  const fertility = blockChemApps.filter(app => app.category === 'FERTILIZER');
  
  // Totals
  const seasonSpend = blockChemApps.reduce((sum, app) => sum + (app.estimatedCost || 0), 0);
  const totalApps = blockChemApps.length;

  const handleExportClick = () => {
    setLocation(`/app/vault/print/${selectedBlockId}`);
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
        
        <button 
          onClick={handleExportClick}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-3 rounded font-black uppercase tracking-widest text-sm transition-colors hover:bg-primary/90 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
        >
          <Printer className="w-4 h-4" /> Export Season Packet
        </button>
      </div>

      {/* Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border p-4 rounded-lg">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Season Spend</p>
          <p className="text-2xl font-black text-foreground">${seasonSpend.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-border p-4 rounded-lg">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Apps</p>
          <p className="text-2xl font-black text-foreground">{totalApps}</p>
        </div>
        <div className="bg-card border border-border p-4 rounded-lg">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Sprays</p>
          <p className="text-2xl font-black text-foreground">{sprays.length}</p>
        </div>
        <div className="bg-card border border-border p-4 rounded-lg">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Fertility</p>
          <p className="text-2xl font-black text-foreground">{fertility.length}</p>
        </div>
      </div>

      {/* Sprays Section */}
      <h2 className="text-xl font-black uppercase tracking-tight text-foreground mb-4 border-b border-border pb-2 mt-12">Sprays & Chemicals</h2>
      {sprays.length > 0 ? (
        <div className="space-y-3">
          {sprays.sort((a, b) => new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime()).map(app => (
            <div key={app.id} className="bg-card border border-border p-4 rounded-lg hover:border-primary/30 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest bg-purple-400/10 text-purple-400 px-2 py-1 rounded mr-3">
                    {app.category}
                  </span>
                  <span className="text-sm font-bold text-muted-foreground">{app.dateApplied}</span>
                </div>
                {app.estimatedCost && (
                  <span className="font-bold text-foreground">${app.estimatedCost.toLocaleString()}</span>
                )}
              </div>
              <h3 className="text-lg font-black text-foreground">{app.chemicalName}</h3>
              <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                <span>Method: <strong className="text-foreground">{app.method}</strong></span>
                {app.notes && <span>Notes: <strong className="text-foreground truncate max-w-[200px] inline-block align-bottom">{app.notes}</strong></span>}
              </div>
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
          {fertility.sort((a, b) => new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime()).map(app => (
            <div key={app.id} className="bg-card border border-border p-4 rounded-lg hover:border-primary/30 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest bg-orange-400/10 text-orange-400 px-2 py-1 rounded mr-3">
                    {app.category}
                  </span>
                  <span className="text-sm font-bold text-muted-foreground">{app.dateApplied}</span>
                </div>
                {app.estimatedCost && (
                  <span className="font-bold text-foreground">${app.estimatedCost.toLocaleString()}</span>
                )}
              </div>
              <h3 className="text-lg font-black text-foreground">{app.chemicalName}</h3>
              <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                <span>Method: <strong className="text-foreground">{app.method}</strong></span>
                {app.notes && <span>Notes: <strong className="text-foreground truncate max-w-[200px] inline-block align-bottom">{app.notes}</strong></span>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border border-dashed p-8 rounded-lg text-center text-muted-foreground font-bold uppercase tracking-widest text-sm">
          No fertility applications recorded this season
        </div>
      )}

      <h2 className="text-xl font-black uppercase tracking-tight text-foreground mb-4 border-b border-border pb-2 mt-16">Other Documents</h2>
      <div className="grid md:grid-cols-2 gap-4">
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
