import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useStore } from "@/lib/store";
import { ArrowLeft, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { todayPacificISO } from "@/utils/dates";

export default function ChemicalNew() {
  const [, setLocation] = useLocation();
  const blocks = useStore(s => s.blocks);
  const chemicals = useStore(s => s.chemicals);
  const addChemicalApp = useStore(s => s.addChemicalApp);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    blockId: blocks[0]?.id || "",
    chemicalId: "",
    category: "FERTILIZER",
    method: "SPRAY",
    dateApplied: todayPacificISO(),
    estimatedCost: "",
    notes: ""
  });

  const handleSave = () => {
    if (!formData.blockId || !formData.chemicalId) return;

    const chemical = chemicals.find(c => c.id === formData.chemicalId);
    
    addChemicalApp({
      id: Date.now().toString(),
      blockId: formData.blockId,
      chemicalId: formData.chemicalId,
      chemicalName: chemical?.name || "Unknown",
      category: chemical?.category || formData.category,
      dateApplied: formData.dateApplied,
      method: formData.method,
      estimatedCost: formData.estimatedCost ? Number(formData.estimatedCost) : undefined,
      notes: formData.notes
    });

    toast({
      title: "Application Saved",
      description: "Chemical record added to block history.",
      duration: 3000,
    });

    setLocation("/app/chemicals");
  };

  return (
    <div className="animate-in fade-in duration-300 pb-20 max-w-2xl mx-auto">
      <Link href="/app/chemicals" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Chemicals
      </Link>

      <h1 className="text-3xl font-black uppercase tracking-tight text-foreground mb-8">Log Chemical</h1>

      <div className="bg-card border border-border p-6 md:p-8 rounded-lg space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">1. Select Block</label>
          <select 
            value={formData.blockId}
            onChange={e => setFormData({...formData, blockId: e.target.value})}
            className="w-full bg-background border border-border rounded px-4 py-3 text-foreground focus:outline-none focus:border-primary appearance-none font-bold"
          >
            <option value="">Select Block...</option>
            {blocks.map(b => <option key={b.id} value={b.id}>{b.name} ({b.acreage} AC)</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">2. Chemical Name</label>
          <select 
            value={formData.chemicalId}
            onChange={e => setFormData({...formData, chemicalId: e.target.value})}
            className="w-full bg-background border border-border rounded px-4 py-3 text-foreground focus:outline-none focus:border-primary appearance-none font-bold"
          >
            <option value="">Select Chemical...</option>
            {chemicals.map(c => <option key={c.id} value={c.id}>{c.name} ({c.category})</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Method</label>
            <select 
              value={formData.method}
              onChange={e => setFormData({...formData, method: e.target.value})}
              className="w-full bg-background border border-border rounded px-4 py-3 text-foreground focus:outline-none focus:border-primary appearance-none"
            >
              <option value="SPRAY">Spray</option>
              <option value="FERTIGATION">Fertigation</option>
              <option value="SOIL">Soil Applied</option>
              <option value="FOLIAR">Foliar</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Date Applied</label>
            <input 
              type="date" 
              value={formData.dateApplied}
              onChange={e => setFormData({...formData, dateApplied: e.target.value})}
              className="w-full bg-background border border-border rounded px-4 py-3 text-foreground focus:outline-none focus:border-primary"
            />
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-2">Default date uses Pacific time.</p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Estimated Cost ($)</label>
          <input 
            type="number" 
            value={formData.estimatedCost}
            onChange={e => setFormData({...formData, estimatedCost: e.target.value})}
            placeholder="0.00"
            className="w-full bg-background border border-border rounded px-4 py-3 text-foreground focus:outline-none focus:border-primary font-bold text-lg"
          />
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-2">Optional. Helps track budget limits.</p>
        </div>

        <button 
          onClick={handleSave}
          disabled={!formData.blockId || !formData.chemicalId}
          className="w-full mt-8 bg-primary text-primary-foreground font-black uppercase tracking-widest py-4 rounded disabled:opacity-50 hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.3)]"
        >
          <Check className="w-5 h-5" /> Save Application
        </button>
      </div>
    </div>
  );
}