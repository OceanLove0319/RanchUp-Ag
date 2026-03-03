import { useRoute } from "wouter";
import { useStore } from "@/lib/store";
import { Droplets, Sprout, ShieldAlert, ArrowLeft, Info, Lock } from "lucide-react";
import { Link } from "wouter";
import { getActiveSeasonWindow } from "@/utils/season";
import { getSeasonSpendForBlock } from "@/utils/rollups";
import { isWithin } from "@/utils/dates";
import { computeStoneFruitFertTarget } from "@/utils/fertTargets";
import { getSprayChartWindows } from "@/utils/sprayTemplates";
import { useGating } from "@/utils/gating";

export default function BlockDetail() {
  const [, params] = useRoute("/app/blocks/:id");
  const block = useStore(s => s.blocks.find(b => b.id === params?.id));
  const chemicalApps = useStore(s => s.chemicalApps);
  const { requireCostEngine } = useGating();

  if (!block) return <div>Block not found</div>;

  const activeWindow = getActiveSeasonWindow(block);
  const activeSpend = getSeasonSpendForBlock(block.id, chemicalApps, activeWindow);
  
  const formattedSpend = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(activeSpend);
  
  const fertTarget = computeStoneFruitFertTarget(block.yieldTargetBins);
  const sprayWindows = getSprayChartWindows(block);
  const costEngine = requireCostEngine();

  return (
    <div className="animate-in fade-in duration-500">
      <Link href="/app/blocks" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blocks
      </Link>

      <header className="mb-10">
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">{block.name}</h1>
          <span className="bg-white/10 text-white px-3 py-1 rounded text-sm font-bold uppercase tracking-widest">
            {block.acreage} ACRES
          </span>
        </div>
        <p className="text-gray-400 font-medium">{block.variety} • {block.seasonGroup} Season • {block.irrigationType}</p>
      </header>

      <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">NEXT STEP: REVIEW THIS BLOCK'S TARGETS.</p>

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
        <div className="text-right">
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
        <div className="flex gap-3 w-full md:w-auto">
          <Link href={`/app/chemicals?blockId=${block.id}`} className="flex-1 md:flex-none text-center px-6 py-3 border border-border rounded font-bold uppercase tracking-wide text-sm hover:bg-white/5 transition-colors">
            View Details
          </Link>
          <Link href={`/app/chemicals/new?blockId=${block.id}`} className="flex-1 md:flex-none text-center px-6 py-3 bg-primary text-primary-foreground rounded font-bold uppercase tracking-wide text-sm hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            Log Chem
          </Link>
        </div>
      </div>
    </div>
  );
}
