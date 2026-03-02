import { useState } from "react";
import { useStore } from "@/lib/store";
import { Droplets, Sprout, ShieldAlert, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ActionType = 'SPRAY' | 'FERT' | 'IRRIGATE';

export default function Log() {
  const blocks = useStore(s => s.blocks);
  const addLog = useStore(s => s.addLog);
  const { toast } = useToast();

  const [selectedBlock, setSelectedBlock] = useState(blocks[0]?.id || "");
  const [action, setAction] = useState<ActionType | null>(null);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    material: "",
    amount: "",
    unit: ""
  });

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
          <label className="block text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">3. Details</label>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Date</label>
              <input 
                type="date" 
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
                className="w-full bg-background border border-border rounded px-3 py-3 text-foreground focus:outline-none focus:border-primary"
              />
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
                    <><option value="lbs">Lbs</option><option value="gal">Gal</option><option value="oz">Oz</option></>
                  )}
                </select>
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
