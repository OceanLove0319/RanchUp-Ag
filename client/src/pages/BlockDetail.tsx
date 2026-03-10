import { useRoute, useLocation } from "wouter";
import { useStore } from "@/lib/store";
import { Droplets, Sprout, ShieldAlert, ArrowLeft, Info, Lock, Edit2, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { getActiveSeasonWindow } from "@/utils/season";
import { getSeasonSpendForBlock } from "@/utils/rollups";
import { isWithin } from "@/utils/dates";
import { computeStoneFruitFertTarget } from "@/utils/fertTargets";
import { getSprayChartWindows } from "@/utils/sprayTemplates";
import { useGating } from "@/utils/gating";
import { useToast } from "@/hooks/use-toast";
import BlockLogs from "@/components/BlockLogs";
import { BlockSuggestionsCard } from "@/components/blocks/BlockSuggestionsCard";

export default function BlockDetail() {
  const [, params] = useRoute("/app/blocks/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const block = useStore(s => s.blocks.find(b => b.id === params?.id));
  const updateBlock = useStore(s => s.updateBlock);
  const deleteBlock = useStore(s => s.deleteBlock);
  const chemicalApps = useStore(s => s.chemicalApps);
  const { requireCostEngine } = useGating();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<typeof block>>(block || {});

  if (!block) return <div>Block not found</div>;

  const handleSaveEdit = () => {
    updateBlock(block.id, editForm);
    setIsEditing(false);
    toast({
      title: "Block Updated",
      description: "Your changes have been saved.",
    });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this block and all its records? This cannot be undone.")) {
      deleteBlock(block.id);
      toast({
        title: "Block Deleted",
        description: "The block has been removed.",
      });
      setLocation("/app/blocks");
    }
  };

  const activeWindow = getActiveSeasonWindow(block);
  const activeSpend = getSeasonSpendForBlock(block.id, chemicalApps, activeWindow);
  
  const formattedSpend = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(activeSpend);
  
  const fertTarget = computeStoneFruitFertTarget(block.yieldTargetBins);
  const sprayWindows = getSprayChartWindows(block);
  const costEngine = requireCostEngine();

  if (isEditing) {
    return (
      <div className="animate-in fade-in duration-300 max-w-2xl mx-auto pb-20">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => setIsEditing(false)} className="flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Cancel Edit
          </button>
          <button onClick={handleDelete} className="flex items-center text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors">
            <Trash2 className="w-4 h-4 mr-1" /> Delete Block
          </button>
        </div>

        <div className="bg-card border border-border p-6 rounded-lg">
          <h2 className="text-xl font-black uppercase tracking-tight text-foreground mb-6">Edit Block</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Block Name</label>
              <input 
                type="text" 
                value={editForm.name || ""}
                onChange={e => setEditForm({...editForm, name: e.target.value})}
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground focus:outline-none focus:border-primary"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Acreage</label>
                <input 
                  type="number" 
                  value={editForm.acreage || ""}
                  onChange={e => setEditForm({...editForm, acreage: Number(e.target.value)})}
                  className="w-full bg-background border border-border rounded px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Variety</label>
                <input 
                  type="text" 
                  value={editForm.variety || ""}
                  onChange={e => setEditForm({...editForm, variety: e.target.value})}
                  className="w-full bg-background border border-border rounded px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Season Group</label>
                <select 
                  value={editForm.seasonGroup || ""}
                  onChange={e => setEditForm({...editForm, seasonGroup: e.target.value})}
                  className="w-full bg-background border border-border rounded px-3 py-2 text-foreground focus:outline-none focus:border-primary appearance-none"
                >
                  <option value="Early">Early</option>
                  <option value="Mid">Mid</option>
                  <option value="Late">Late</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Irrigation Type</label>
                <select 
                  value={editForm.irrigationType || ""}
                  onChange={e => setEditForm({...editForm, irrigationType: e.target.value})}
                  className="w-full bg-background border border-border rounded px-3 py-2 text-foreground focus:outline-none focus:border-primary appearance-none"
                >
                  <option value="Drip">Drip</option>
                  <option value="Fanjet">Fanjet</option>
                  <option value="Flood">Flood</option>
                  <option value="Sprinkler">Sprinkler</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Yield Target (bins/ac)</label>
                <input 
                  type="number" 
                  value={editForm.yieldTargetBins || ""}
                  onChange={e => setEditForm({...editForm, yieldTargetBins: Number(e.target.value)})}
                  className="w-full bg-background border border-border rounded px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Water Target (ac-ft)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={editForm.waterTargetAcreFeet || ""}
                  onChange={e => setEditForm({...editForm, waterTargetAcreFeet: Number(e.target.value)})}
                  className="w-full bg-background border border-border rounded px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          <button 
            onClick={handleSaveEdit}
            className="w-full mt-8 bg-primary text-primary-foreground font-black uppercase tracking-widest py-3 rounded hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(234,153,61,0.3)]"
          >
            Save Changes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <Link href="/app/blocks" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blocks
        </Link>
        <button 
          onClick={() => setIsEditing(true)}
          className="flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
        >
          <Edit2 className="w-3 h-3 mr-1" /> Edit Block
        </button>
      </div>

      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-4 mb-2">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">{block.name}</h1>
          <span className="bg-white/10 text-white px-3 py-1 rounded text-sm font-bold uppercase tracking-widest">
            {block.acreage} ACRES
          </span>
        </div>
        <p className="text-gray-400 font-medium">{block.variety} • {block.seasonGroup} Season • {block.irrigationType}</p>
      </header>

      <BlockSuggestionsCard blockId={block.id} />

      <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4 mt-8">NEXT STEP: REVIEW THIS BLOCK'S TARGETS.</p>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-[#111113] border border-white/10 p-6 rounded-lg flex flex-col">
          <div className="flex items-center gap-3 mb-4 text-orange-400">
            <Sprout className="w-5 h-5" />
            <h3 className="font-black uppercase tracking-widest">Fertility Target</h3>
          </div>
          <p className="text-3xl font-black text-white mb-2">{fertTarget.minLbsAc}-{fertTarget.maxLbsAc} <span className="text-lg text-gray-500">lbs/ac</span></p>
          <p className="text-sm text-gray-400 leading-relaxed mb-4">{fertTarget.basis}</p>
          
          <div className="mt-auto pt-4 border-t border-white/10">
            <p className="text-[10px] uppercase tracking-widest text-gray-500">
              {block.irrigationType === "Drip" || block.irrigationType === "Fanjet" 
                ? "Drip/Fanjet: target converts to fertigation schedule in v2." 
                : block.irrigationType === "Flood" 
                  ? "Flood: aligns with granular programs (furrow/ranchero)."
                  : "Program varies by method; target is a planning guide."}
            </p>
          </div>
        </div>

        <div className="bg-[#111113] border border-white/10 p-6 rounded-lg flex flex-col">
          <div className="flex items-center gap-3 mb-4 text-blue-400">
            <Droplets className="w-5 h-5" />
            <h3 className="font-black uppercase tracking-widest">Water Target</h3>
          </div>
          <p className="text-3xl font-black text-white mb-2">{block.waterTargetAcreFeet.toFixed(1)} <span className="text-lg text-gray-500">ac-ft</span></p>
          <p className="text-sm text-gray-400 leading-relaxed">Track against target—less guesswork, tighter decisions.</p>
        </div>

        <div className="bg-[#111113] border border-white/10 p-6 rounded-lg flex flex-col">
          <div className="flex items-center gap-3 mb-4 text-purple-400">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-black uppercase tracking-widest">Spray Windows</h3>
          </div>
          <ul className="space-y-3 mb-4">
            {sprayWindows.map((w, i) => (
              <li key={w.key} className="flex gap-3">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-gray-300">{w.title}</p>
                  {w.description && <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">{w.description}</p>}
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-4 border-t border-white/10">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-1">
              <Info className="w-3 h-3" /> Window guide aligned to active season: {activeWindow.label}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#111113] border border-white/10 p-6 md:p-8 rounded-lg flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
        <div>
          <h3 className="text-xl font-black uppercase tracking-tight text-white mb-1">Season Spend</h3>
          <p className="text-gray-400 font-medium mb-1">Total estimated cost based on active season window logs.</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1"><Info className="w-3 h-3" /> Totals reflect this block's active season window based on Early/Mid/Late timing.</p>
        </div>
        <div className="text-left w-full md:text-right md:w-auto">
          {costEngine.allowed ? (
            <>
              <p className="text-4xl font-black text-white">{formattedSpend}</p>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mt-1">Total Spend</p>
            </>
          ) : (
            <div className="bg-black/50 border border-border p-4 rounded-lg text-center min-w-[200px]">
              <Lock className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Cost Engine Locked</p>
              <Link href={costEngine.upgradePath} className="text-[10px] bg-primary text-primary-foreground px-3 py-1.5 rounded font-black uppercase tracking-widest hover:bg-primary/90 transition-colors block w-full">
                View Pricing
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Missing Info Flags Section (Mocked for UX) */}
      <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-bold text-amber-500 flex items-center gap-2 text-sm uppercase tracking-widest">
            <Info className="w-4 h-4" /> Almost Complete
          </h3>
          <p className="text-xs text-amber-500/80 mt-1">1 recent log is missing an application rate.</p>
        </div>
        <Link href={`/app/reports/variance?blockId=${block.id}`}>
          <button className="bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 border border-amber-500/30 w-full sm:w-auto text-xs uppercase tracking-widest px-4 py-3 rounded font-bold transition-colors">
            Fix Info
          </button>
        </Link>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <Link href={`/app/packets/season?blockId=${block.id}`} className="w-full bg-card border border-border hover:border-primary/50 text-foreground p-5 rounded-lg flex items-center justify-center gap-2 font-bold uppercase tracking-widest transition-colors text-sm">
           Print Block Packet
        </Link>
      </div>

      <BlockLogs blockId={block.id} />

      {/* Chemical Clarity Integration */}
      <div className="bg-card border border-border p-6 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h3 className="text-xl font-black uppercase tracking-tight text-foreground mb-2 flex items-center gap-2">
            <Droplets className="w-5 h-5 text-primary" /> Chemical Plan & Spend
          </h3>
          <p className="text-muted-foreground font-medium mb-1">
            This season window: {chemicalApps.filter(a => a.blockId === block.id && isWithin(a.dateApplied, activeWindow.startISO, activeWindow.endISO)).length} applications
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1"><Info className="w-3 h-3" /> Dates and season totals are computed in Pacific time (CA).</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Link href={`/app/chemicals?blockId=${block.id}`} className="w-full sm:w-auto text-center px-6 py-4 border border-border rounded-lg font-bold uppercase tracking-wide text-sm hover:bg-white/5 transition-colors">
            View Details
          </Link>
          <Link href={`/app/chemicals/new?blockId=${block.id}`} className="w-full sm:w-auto text-center px-6 py-4 bg-primary text-primary-foreground rounded-lg font-bold uppercase tracking-wide text-sm hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(234,153,61,0.3)]">
            Log Chem
          </Link>
        </div>
      </div>
    </div>
  );
}
