import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { Droplets, Sprout, ShieldAlert, Check, Zap, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { todayPacificISO } from "@/utils/dates";

type ActionType = 'SPRAY' | 'FERT' | 'IRRIGATE';

type CropType = "STONE_FRUIT" | "CITRUS" | "NUT" | "OTHER";
type SeasonGroup = "Early" | "Mid" | "Late";
type IrrigationType = "Flood" | "Drip" | "Fanjet" | "Sprinkler" | string;

type QuickTemplate = {
  id: string;
  name: string;
  material: string;
  amount: string;
  unit: string;
  cropTypes?: CropType[];
  seasonGroups?: SeasonGroup[];
  irrigationTypes?: IrrigationType[];
};

const inferCropType = (variety: string): CropType => {
  const v = variety.toLowerCase();
  if (v.includes('peach') || v.includes('nectarine') || v.includes('plum') || v.includes('apricot') || v.includes('cherry')) return 'STONE_FRUIT';
  if (v.includes('citrus') || v.includes('orange') || v.includes('mandarin') || v.includes('lemon') || v.includes('lime') || v.includes('grapefruit')) return 'CITRUS';
  if (v.includes('almond') || v.includes('pistachio') || v.includes('walnut')) return 'NUT';
  return 'OTHER';
};

const QUICK_TEMPLATES: Record<ActionType, QuickTemplate[]> = {
  SPRAY: [
    { id: "spray-bloom-brownrot-1", name: "Bloom — Brown Rot", material: "Pristine", amount: "1", unit: "lb/ac", cropTypes: ["STONE_FRUIT"] },
    { id: "spray-bloom-brownrot-2", name: "Bloom — Brown Rot (Alt)", material: "Rovral", amount: "2", unit: "pt/ac", cropTypes: ["STONE_FRUIT"] },
    { id: "spray-summer-mites", name: "Summer Mites", material: "Acramite", amount: "16", unit: "oz/ac", cropTypes: ["STONE_FRUIT"], seasonGroups: ["Mid", "Late"] },
    { id: "spray-preharvest-fungicide", name: "Pre-Harvest Fungicide", material: "Pristine", amount: "1", unit: "lb/ac", cropTypes: ["STONE_FRUIT"], seasonGroups: ["Late"] },
    { id: "spray-citrus-thrips", name: "Thrips Control", material: "Success", amount: "6", unit: "oz/ac", cropTypes: ["CITRUS"] },
    { id: "spray-nut-now", name: "NOW Control", material: "Intrepid", amount: "8", unit: "oz/ac", cropTypes: ["NUT"] },
  ],
  FERT: [
    { id: "fert-spring-push-gran", name: "Spring N Push", material: "CAN-17 (granular)", amount: "200", unit: "lb/ac", cropTypes: ["STONE_FRUIT"], irrigationTypes: ["Flood"] },
    { id: "fert-spring-push-fert", name: "Spring N Push", material: "UN-32", amount: "10", unit: "gal/ac", cropTypes: ["STONE_FRUIT", "CITRUS", "NUT"], irrigationTypes: ["Drip", "Fanjet"] },
    { id: "fert-foliar-zinc", name: "Foliar Zinc", material: "Zinc Sulfate 36%", amount: "5", unit: "lb/ac", cropTypes: ["STONE_FRUIT"] },
    { id: "fert-post-harvest", name: "Post-Harvest Mix", material: "Potassium Nitrate", amount: "25", unit: "lb/ac" },
  ],
  IRRIGATE: [
    { id: "irrig-standard-flood", name: "Standard Set", material: "Water", amount: "24", unit: "hrs", irrigationTypes: ["Flood"] },
    { id: "irrig-standard-drip", name: "Standard Runtime", material: "Water", amount: "12", unit: "hrs", irrigationTypes: ["Drip", "Fanjet"] },
    { id: "irrig-heat-bump", name: "Heat Week Bump", material: "Water", amount: "6", unit: "hrs" },
  ]
};

const ALLOWED_UNITS: Record<ActionType, string[]> = {
  SPRAY: ["oz/ac", "pt/ac", "qt/ac", "gal/ac", "lb/ac", "gal", "lbs", "oz"],
  FERT: ["lb/ac", "gal/ac", "lbs", "gal"],
  IRRIGATE: ["hrs", "in"]
};

const getFallbackUnit = (action: ActionType) => {
  if (action === 'SPRAY') return 'lb/ac';
  if (action === 'FERT') return 'lb/ac';
  return 'hrs';
};

export default function Log() {
  const blocks = useStore(s => s.blocks);
  const addLog = useStore(s => s.addLog);
  const { toast } = useToast();

  const [selectedBlock, setSelectedBlock] = useState(blocks[0]?.id || "");
  const [action, setAction] = useState<ActionType | null>(null);
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  
  // LocalStorage state
  const [pinnedTemplates, setPinnedTemplates] = useState<Record<string, string>>(() => {
    try { return JSON.parse(localStorage.getItem('kebb_quicklog_pins') || '{}'); } catch { return {}; }
  });
  const [recentTemplates, setRecentTemplates] = useState<Record<string, Record<string, string>>>(() => {
    try { return JSON.parse(localStorage.getItem('kebb_quicklog_recent') || '{}'); } catch { return {}; }
  });
  
  const [formData, setFormData] = useState({
    date: todayPacificISO(),
    material: "",
    amount: "",
    unit: ""
  });

  const block = blocks.find(b => b.id === selectedBlock);
  const blockContext = block ? {
    cropType: inferCropType(block.variety),
    seasonGroup: block.seasonGroup as SeasonGroup,
    irrigationType: block.irrigationType
  } : null;

  // Reset form when action changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      material: "",
      amount: "",
      unit: ""
    }));
    setActiveTemplate(null);
  }, [action]);

  // Persist pins/recents
  useEffect(() => {
    localStorage.setItem('kebb_quicklog_pins', JSON.stringify(pinnedTemplates));
  }, [pinnedTemplates]);

  useEffect(() => {
    localStorage.setItem('kebb_quicklog_recent', JSON.stringify(recentTemplates));
  }, [recentTemplates]);

  const applyTemplate = (template: QuickTemplate) => {
    let finalUnit = template.unit;
    if (action && !ALLOWED_UNITS[action].includes(template.unit)) {
      finalUnit = getFallbackUnit(action);
      toast({
        description: "Adjusted unit to match this action.",
        duration: 2000,
      });
    }

    setFormData(prev => ({
      ...prev,
      material: template.material,
      amount: template.amount,
      unit: finalUnit
    }));
    setActiveTemplate(template.name);

    if (action && selectedBlock) {
      setRecentTemplates(prev => ({
        ...prev,
        [selectedBlock]: {
          ...(prev[selectedBlock] || {}),
          [action]: template.id
        }
      }));
    }
  };

  const togglePin = (e: React.MouseEvent, actionKey: ActionType, templateId: string) => {
    e.stopPropagation();
    setPinnedTemplates(prev => {
      const isPinned = prev[actionKey] === templateId;
      if (isPinned) {
        const copy = { ...prev };
        delete copy[actionKey];
        return copy;
      }
      return { ...prev, [actionKey]: templateId };
    });
  };

  const getFilteredTemplates = () => {
    if (!action || !blockContext) return [];

    const allTemplates = QUICK_TEMPLATES[action];
    
    // 1. Filter by context
    const contextual = allTemplates.filter(t => {
      if (t.cropTypes && !t.cropTypes.includes(blockContext.cropType)) return false;
      if (t.seasonGroups && !t.seasonGroups.includes(blockContext.seasonGroup)) return false;
      if (t.irrigationTypes && !t.irrigationTypes.includes(blockContext.irrigationType)) return false;
      return true;
    });

    const fallback = allTemplates.filter(t => !t.cropTypes && !t.seasonGroups && !t.irrigationTypes);
    const available = contextual.length > 0 ? contextual : fallback;

    // 2. Select top 3 (Pinned -> Recent -> Rest)
    const pinnedId = pinnedTemplates[action];
    const recentId = recentTemplates[selectedBlock]?.[action];

    const result: (QuickTemplate & { labelType?: 'Pinned' | 'Recent' })[] = [];
    
    // Add Pinned
    const pinned = allTemplates.find(t => t.id === pinnedId);
    if (pinned) result.push({ ...pinned, labelType: 'Pinned' });

    // Add Recent (if not pinned)
    if (recentId && recentId !== pinnedId) {
      const recent = allTemplates.find(t => t.id === recentId);
      if (recent) result.push({ ...recent, labelType: 'Recent' });
    }

    // Fill remaining slots
    for (const t of available) {
      if (result.length >= 3) break;
      if (!result.find(r => r.id === t.id)) {
        result.push(t);
      }
    }

    // If still less than 3, grab from generic fallbacks
    if (result.length < 3) {
      for (const t of allTemplates) {
         if (result.length >= 3) break;
         if (!result.find(r => r.id === t.id)) {
           result.push(t);
         }
      }
    }

    return result;
  };

  const handleSave = () => {
    if (!action || !formData.amount) return;
    
    addLog({
      id: Date.now().toString(),
      blockId: selectedBlock,
      date: formData.date,
      actionType: action,
      material: formData.material || action,
      amount: Number(formData.amount),
      unit: formData.unit || (action === 'IRRIGATE' ? 'hrs' : 'lbs')
    });

    toast({
      title: "Log Saved",
      description: "Field action recorded successfully.",
      duration: 3000,
    });

    // Reset form
    setAction(null);
    setFormData({ ...formData, material: "", amount: "", unit: "" });
    setActiveTemplate(null);
  };

  const actionConfig = {
    SPRAY: { icon: ShieldAlert, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/50" },
    FERT: { icon: Sprout, color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/50" },
    IRRIGATE: { icon: Droplets, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/50" }
  };

  return (
    <div className="animate-in fade-in duration-300 pb-20 max-w-2xl mx-auto">
      <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">NEXT STEP: LOG WHAT YOU DID TODAY.</p>
      
      <div className="mb-8">
        <label className="block text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">1. Select Block</label>
        <select 
          value={selectedBlock}
          onChange={(e) => setSelectedBlock(e.target.value)}
          className="w-full bg-card border border-border rounded-lg px-4 py-4 text-foreground text-lg font-bold focus:outline-none focus:border-primary appearance-none"
        >
          {blocks.map(b => <option key={b.id} value={b.id}>{b.name} ({b.acreage} AC)</option>)}
        </select>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">2. Select Action</label>
        <div className="grid grid-cols-3 gap-3">
          {(['SPRAY', 'FERT', 'IRRIGATE'] as ActionType[]).map(a => {
            const config = actionConfig[a];
            const Icon = config.icon;
            const isSelected = action === a;
            
            return (
              <button
                key={a}
                onClick={() => setAction(a)}
                className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-all ${
                  isSelected 
                    ? `${config.border} ${config.bg}` 
                    : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                <Icon className={`w-8 h-8 mb-3 ${isSelected ? config.color : 'text-muted-foreground'}`} />
                <span className={`text-xs md:text-sm font-black uppercase tracking-widest ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {a}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {action && (
        <div className="animate-in slide-in-from-bottom-4 fade-in duration-300 bg-card border border-border p-6 rounded-lg">
          <div className="flex flex-col mb-6 gap-3 border-b border-border pb-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-bold uppercase tracking-widest text-muted-foreground">3. Details</label>
              {action && getFilteredTemplates().length > 0 && (
                <div className="flex flex-wrap gap-2 justify-end">
                  {getFilteredTemplates().map(t => {
                    const isPinned = t.labelType === 'Pinned';
                    const isRecent = t.labelType === 'Recent';
                    return (
                      <div key={t.id} className="relative group">
                        <button
                          onClick={() => applyTemplate(t)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-widest transition-colors ${
                            activeTemplate === t.name 
                              ? 'bg-primary text-primary-foreground' 
                              : isPinned
                                ? 'bg-primary/20 text-primary border border-primary/50'
                                : isRecent
                                  ? 'bg-accent border border-border text-foreground'
                                  : 'bg-background border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                          }`}
                        >
                          {isPinned ? <Star className="w-3 h-3 fill-current" /> : <Zap className="w-3 h-3" />}
                          {t.name}
                          {(isPinned || isRecent) && (
                            <span className="ml-1 text-[9px] opacity-70">({t.labelType})</span>
                          )}
                        </button>
                        <button 
                          onClick={(e) => togglePin(e, action, t.id)}
                          className={`absolute -top-2 -right-2 p-1 rounded-full bg-background border transition-opacity ${
                            isPinned ? 'border-primary text-primary opacity-100' : 'border-border text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-primary hover:border-primary'
                          }`}
                          title={isPinned ? "Unpin template" : "Pin template"}
                        >
                          <Star className={`w-3 h-3 ${isPinned ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {action && getFilteredTemplates().length > 0 && (
              <p className="text-[10px] text-muted-foreground italic text-right">Templates are starting points — adjust rate and notes as needed.</p>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Date</label>
              <input 
                type="date" 
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
                className="w-full bg-background border border-border rounded px-3 py-3 text-foreground focus:outline-none focus:border-primary"
              />
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-2">Default date uses Pacific time.</p>
            </div>
            
            {action !== 'IRRIGATE' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Material / Product</label>
                <input 
                  type="text" 
                  value={formData.material}
                  onChange={e => setFormData({...formData, material: e.target.value})}
                  placeholder={action === 'FERT' ? "e.g. CAN 17" : "e.g. Oil"}
                  className="w-full bg-background border border-border rounded px-3 py-3 text-foreground focus:outline-none focus:border-primary"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Amount</label>
                <input 
                  type="number" 
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                  placeholder="0.0"
                  className="w-full bg-background border border-border rounded px-3 py-3 text-foreground focus:outline-none focus:border-primary text-lg font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Unit</label>
                <select 
                  value={formData.unit}
                  onChange={e => setFormData({...formData, unit: e.target.value})}
                  className="w-full bg-background border border-border rounded px-3 py-3 text-foreground focus:outline-none focus:border-primary appearance-none"
                >
                  <option value="">Select...</option>
                  {action === 'IRRIGATE' ? (
                    <><option value="hrs">Hours</option><option value="in">Inches</option></>
                  ) : (
                    <>
                      <option value="lb/ac">lb/ac</option>
                      <option value="oz/ac">oz/ac</option>
                      <option value="gal/ac">gal/ac</option>
                      <option value="pt/ac">pt/ac</option>
                      <option value="qt/ac">qt/ac</option>
                      <option disabled>──────</option>
                      <option value="lbs">Lbs</option>
                      <option value="gal">Gal</option>
                      <option value="oz">Oz</option>
                    </>
                  )}
                </select>
                <p className="text-[10px] text-muted-foreground mt-2 italic">Rates are entered per acre (typical).</p>
              </div>
            </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={!formData.amount}
            className="w-full mt-8 bg-primary text-primary-foreground font-black uppercase tracking-widest py-4 rounded disabled:opacity-50 hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.3)]"
          >
            <Check className="w-5 h-5" /> Save Action
          </button>
        </div>
      )}
    </div>
  );
}
