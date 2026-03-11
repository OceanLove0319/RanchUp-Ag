import { useRoute, useLocation } from "wouter";
import { useStore, Block } from "@/lib/store";
import { Droplets, Sprout, ShieldAlert, ArrowLeft, Info, Lock, Edit2, Trash2, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { useState, useMemo } from "react";
import { getActiveSeasonWindow } from "@/utils/season";
import { getSeasonSpendForBlock } from "@/utils/rollups";
import { isWithin } from "@/utils/dates";
import { computeStoneFruitFertTarget } from "@/utils/fertTargets";
import { getSprayChartWindows } from "@/utils/sprayTemplates";
import { useGating } from "@/utils/gating";
import { useToast } from "@/hooks/use-toast";
import BlockLogs from "@/components/BlockLogs";
import { BlockSuggestionsCard } from "@/components/blocks/BlockSuggestionsCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function BlockDetail() {
  const [, params] = useRoute("/app/blocks/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const user = useStore(s => s.user);
  const isPCA = user?.role === 'PCA';
  
  const block = useStore(s => s.blocks.find(b => b.id === params?.id));
  const ranch = useStore(s => s.ranches.find(r => r.id === block?.ranchId));
  const updateBlock = useStore(s => s.updateBlock);
  const deleteBlock = useStore(s => s.deleteBlock);
  const chemicalApps = useStore(s => s.chemicalApps);
  const recommendations = useStore(s => s.recommendations);
  const { requireCostEngine } = useGating();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Block>>(block || {});

  const blockRecs = useMemo(() => recommendations?.filter(r => r.blockId === block?.id) || [], [recommendations, block?.id]);
  const latestRec = useMemo(() => [...blockRecs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0], [blockRecs]);
  const blockApps = useMemo(() => chemicalApps.filter(a => a.blockId === block?.id), [chemicalApps, block?.id]);
  const missingInfoApps = useMemo(() => blockApps.filter(a => a.costStatus === 'UNIT_MISMATCH' || !a.estimatedCost), [blockApps]);

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
                value={editForm?.name || ""}
                onChange={e => setEditForm({...editForm, name: e.target.value})}
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground focus:outline-none focus:border-primary"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Acreage</label>
                <input 
                  type="number" 
                  value={editForm?.acreage || ""}
                  onChange={e => setEditForm({...editForm, acreage: Number(e.target.value)})}
                  className="w-full bg-background border border-border rounded px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Variety</label>
                <input 
                  type="text" 
                  value={editForm?.variety || ""}
                  onChange={e => setEditForm({...editForm, variety: e.target.value})}
                  className="w-full bg-background border border-border rounded px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Season Group</label>
                <select 
                  value={editForm?.seasonGroup || ""}
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
                  value={editForm?.irrigationType || ""}
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
                  value={editForm?.yieldTargetBins || ""}
                  onChange={e => setEditForm({...editForm, yieldTargetBins: Number(e.target.value)})}
                  className="w-full bg-background border border-border rounded px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Water Target (ac-ft)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={editForm?.waterTargetAcreFeet || ""}
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

  // PCA Block Workspace View
  if (isPCA) {
    return (
      <div className="animate-in fade-in duration-500 max-w-4xl mx-auto pb-20">
        <div className="flex justify-between items-center mb-6">
          <Link href="/app" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Ranch
          </Link>
        </div>

        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-4 mb-2">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground">{block.name}</h1>
            <span className="bg-primary/20 text-primary px-3 py-1 rounded text-sm font-bold uppercase tracking-widest">
              {block.acreage} ACRES
            </span>
          </div>
          <p className="text-muted-foreground font-medium text-lg">{ranch?.name} • {block.variety} • {block.seasonGroup} Season</p>
        </header>

        {/* Action Priority Section */}
        <div className="mb-8">
          <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4 border-b border-border pb-2">Status & Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recommendation Status */}
            <div className={`p-6 rounded-xl border ${latestRec && latestRec.status === 'PENDING' ? 'bg-purple-500/10 border-purple-500/30' : latestRec && latestRec.status === 'APPLIED' ? 'bg-green-500/10 border-green-500/30' : 'bg-card border-border'} flex flex-col`}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-sm uppercase tracking-widest text-foreground">Recommendation</h3>
                {latestRec ? (
                  <Badge variant="outline" className={`text-[10px] ${latestRec.status === 'PENDING' ? 'text-purple-400 border-purple-400/30' : latestRec.status === 'APPLIED' ? 'text-green-400 border-green-400/30' : 'text-blue-400 border-blue-400/30'}`}>
                    {latestRec.status}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px] text-muted-foreground">None Active</Badge>
                )}
              </div>
              
              {latestRec ? (
                <div className="mb-6 flex-1">
                  <p className="font-bold text-lg text-foreground mb-1">{latestRec.product}</p>
                  <p className="text-sm text-muted-foreground">{(latestRec as any).rate} {(latestRec as any).rateUnit} • Target: {(latestRec as any).targetPest || 'N/A'}</p>
                  
                  {latestRec.estimatedCostPerAcre && (
                    <div className="mt-4 bg-background/50 border border-border rounded-lg p-3 grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Est. Cost / Ac</p>
                        <p className="text-sm font-bold">${latestRec.estimatedCostPerAcre.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Est. Total</p>
                        <p className="text-sm font-bold text-primary">${latestRec.estimatedTotalCost?.toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                  
                  {latestRec.alternatives && latestRec.alternatives.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Approved Alternatives</p>
                      <div className="space-y-2">
                        {latestRec.alternatives.map((alt: any, idx: number) => {
                          const savings = (latestRec.estimatedCostPerAcre || 0) - alt.estimatedCostPerAcre;
                          return (
                            <div key={idx} className="bg-background/30 border border-border/50 rounded-lg p-3 text-sm">
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-bold">{alt.productName}</span>
                                <span className={`text-xs font-bold ${savings > 0 ? 'text-green-400' : 'text-muted-foreground'}`}>
                                  {savings > 0 ? `Save $${savings.toFixed(2)}/ac` : `+$${Math.abs(savings).toFixed(2)}/ac`}
                                </span>
                              </div>
                              {alt.note && <p className="text-xs text-muted-foreground">{alt.note}</p>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mb-6 flex-1 flex items-center justify-center border border-dashed border-border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">No recent recommendations.</p>
                </div>
              )}
              
              <div className="mt-auto">
                {latestRec?.status === 'PENDING' && (
                  <Link href="/app/recommendations">
                    <Button className="w-full py-6 font-bold uppercase tracking-widest">Review Grower Progress</Button>
                  </Link>
                )}
                {latestRec?.status === 'APPLIED' && (
                  <Link href="/app/recommendations">
                    <Button className="w-full py-6 bg-green-600/20 text-green-500 hover:bg-green-600/30 font-bold uppercase tracking-widest">Close Recommendation</Button>
                  </Link>
                )}
                {(!latestRec || latestRec.status === 'CLOSED') && (
                  <Link href="/app/recommendations">
                    <Button variant="outline" className="w-full py-6 font-bold uppercase tracking-widest">Create New Rec</Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Record Status */}
            <div className={`p-6 rounded-xl border ${missingInfoApps.length > 0 ? 'bg-red-500/10 border-red-500/30' : 'bg-card border-border'} flex flex-col`}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-sm uppercase tracking-widest text-foreground">Record Status</h3>
                {missingInfoApps.length > 0 ? (
                  <Badge variant="outline" className="text-[10px] text-red-400 border-red-400/30 bg-red-400/10">Needs Cleanup</Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px] text-green-400 border-green-400/30 bg-green-400/10">Clean</Badge>
                )}
              </div>

              <div className="mb-6 flex-1">
                {missingInfoApps.length > 0 ? (
                  <>
                    <p className="font-bold text-red-400 text-lg mb-1">{missingInfoApps.length} Flagged Record{missingInfoApps.length !== 1 ? 's' : ''}</p>
                    <p className="text-sm text-muted-foreground">Missing application rates or unit mismatches are blocking a clean export.</p>
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4">
                    <CheckCircle2 className="w-8 h-8 text-green-500/50 mb-2" />
                    <p className="text-sm text-muted-foreground">All application records for this block are fully detailed and ready for export.</p>
                  </div>
                )}
              </div>

              <div className="mt-auto">
                {missingInfoApps.length > 0 ? (
                  <Link href="/app/reports/variance">
                    <Button className="w-full py-6 bg-red-500/20 text-red-500 hover:bg-red-500/30 font-bold uppercase tracking-widest">Fix Missing Info</Button>
                  </Link>
                ) : (
                  <Button disabled variant="outline" className="w-full py-6 font-bold uppercase tracking-widest opacity-50">Records Clean</Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4 border-b border-border pb-2">Block Logs</h2>
        <BlockLogs blockId={block.id} />
      </div>
    );
  }

  // Grower Block View (Original)
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
      
      {/* Latest Recommendation Cost Info (Grower View) */}
      {latestRec && latestRec.status !== 'CLOSED' && (
        <div className="bg-[#111113] border border-white/10 p-6 rounded-lg mb-6">
          <div className="flex justify-between items-start mb-4">
             <h3 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
               <ShieldAlert className="w-5 h-5 text-purple-400" /> Latest Recommendation
             </h3>
             <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 uppercase tracking-widest text-[10px]">
               {latestRec.status}
             </Badge>
          </div>
          
          <div className="mb-4">
             <p className="text-2xl font-bold text-white mb-1">{latestRec.product}</p>
             <p className="text-sm text-gray-400">{latestRec.rate} {latestRec.rateUnit} • Target: {latestRec.targetPest || 'N/A'}</p>
             {latestRec.notes && <p className="text-sm text-gray-300 mt-2 p-3 bg-white/5 rounded italic">"{latestRec.notes}"</p>}
          </div>

          {(latestRec.estimatedCostPerAcre || (latestRec.alternatives && latestRec.alternatives.length > 0)) && (
            <div className="border-t border-white/10 pt-4 mt-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Cost Visibility</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Primary Cost */}
                {latestRec.estimatedCostPerAcre && (
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Estimated Cost</p>
                    <p className="text-lg font-black text-white">${latestRec.estimatedCostPerAcre.toFixed(2)}<span className="text-xs font-normal text-gray-500 ml-1">/ac</span></p>
                    {latestRec.estimatedTotalCost && (
                      <p className="text-xs text-primary font-bold mt-1">${latestRec.estimatedTotalCost.toLocaleString()} Block Total</p>
                    )}
                  </div>
                )}
                
                {/* Alternatives */}
                {latestRec.alternatives && latestRec.alternatives.map((alt: any, idx: number) => {
                  const savings = (latestRec.estimatedCostPerAcre || 0) - alt.estimatedCostPerAcre;
                  return (
                    <div key={idx} className="bg-white/5 p-4 rounded-lg border border-white/10">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-[10px] uppercase tracking-widest text-gray-400">Alternative</p>
                        <span className={`text-[10px] font-bold ${savings > 0 ? 'text-green-400' : 'text-gray-500'}`}>
                          {savings > 0 ? `Save $${savings.toFixed(2)}/ac` : `+$${Math.abs(savings).toFixed(2)}/ac`}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-white mb-1">{alt.productName}</p>
                      {alt.note && <p className="text-[10px] text-gray-400 leading-tight">{alt.note}</p>}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      
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
