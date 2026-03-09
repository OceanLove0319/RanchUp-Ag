import { useState, useEffect, useMemo } from "react";
import { useStore } from "@/lib/store";
import { Search, Plus, Check, FlaskConical, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PRODUCT_CATEGORIES } from "@/data/materialsSeed";

type TopTab = "ALL" | "CHEMICALS" | "MATERIALS";

export default function UnifiedInputPicker({ 
  selectedIds = [], 
  onSelectionChange,
  defaultTab = "ALL"
}: { 
  selectedIds?: string[], 
  onSelectionChange: (ids: string[]) => void,
  defaultTab?: TopTab
}) {
  const { chemicals, productLibrary } = useStore();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<TopTab>(defaultTab);
  const [recentIds, setRecentIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ranchup_recent_inputs");
      if (stored) setRecentIds(JSON.parse(stored));
    } catch (e) {}
  }, []);

  const updateRecent = (id: string) => {
    const next = [id, ...recentIds.filter(i => i !== id)].slice(0, 5);
    setRecentIds(next);
    localStorage.setItem("ranchup_recent_inputs", JSON.stringify(next));
  };

  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(i => i !== id));
    } else {
      updateRecent(id);
      onSelectionChange([...selectedIds, id]);
    }
  };

  const normalizedInputs = useMemo(() => {
    const chems = chemicals.map(c => ({
      id: c.id,
      itemType: "CHEMICAL" as const,
      name: c.name,
      category: c.category,
      type: "Chemical",
      brandFamily: "GENERIC"
    }));

    const mats = productLibrary.map(m => ({
      id: m.id,
      itemType: "MATERIAL" as const,
      name: m.name,
      category: m.category,
      type: m.type,
      brandFamily: m.brandFamily || "GENERIC"
    }));

    return [...chems, ...mats];
  }, [chemicals, productLibrary]);

  const filteredInputs = useMemo(() => {
    let result = normalizedInputs;
    
    if (activeTab === "CHEMICALS") result = result.filter(i => i.itemType === "CHEMICAL");
    if (activeTab === "MATERIALS") result = result.filter(i => i.itemType === "MATERIAL");

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(i => i.name.toLowerCase().includes(q));
    }
    
    return result;
  }, [normalizedInputs, activeTab, search]);

  const getCategoryColor = (cat: string) => {
    switch(cat) {
      case "NUTRITION": return "bg-green-500/20 text-green-500 border-green-500/30";
      case "AMENDMENT": return "bg-orange-500/20 text-orange-500 border-orange-500/30";
      case "FUNGICIDE": return "bg-purple-500/20 text-purple-500 border-purple-500/30";
      case "HERBICIDE": return "bg-red-500/20 text-red-500 border-red-500/30";
      case "INSECTICIDE_MITICIDE": return "bg-amber-500/20 text-amber-500 border-amber-500/30";
      case "ADJUVANT": return "bg-blue-400/20 text-blue-400 border-blue-400/30";
      case "WATER_TREATMENT": return "bg-cyan-500/20 text-cyan-500 border-cyan-500/30";
      case "BIOLOGICAL": return "bg-lime-500/20 text-lime-500 border-lime-500/30";
      default: return "bg-secondary text-foreground border-border";
    }
  };

  const renderItem = (item: any) => {
    const isSelected = selectedIds.includes(item.id);
    return (
      <button
        key={item.id}
        onClick={(e) => { e.preventDefault(); toggleSelection(item.id); }}
        className={`w-full text-left p-3 rounded-lg border transition-all flex justify-between items-center gap-2 ${
          isSelected ? 'bg-primary/10 border-primary/50' : 'bg-background border-border hover:border-primary/30'
        }`}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[9px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded border ${getCategoryColor(item.category)}`}>
              {item.category.replace("_", " ")}
            </span>
            {item.brandFamily === "INNVICTIS" && (
              <span className="text-[9px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-500 border border-orange-500/20">
                Innvictis®
              </span>
            )}
            {item.itemType === "CHEMICAL" && (
              <span className="text-[9px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center">
                <FlaskConical className="w-2.5 h-2.5 mr-1" /> Chem
              </span>
            )}
          </div>
          <div className="font-bold text-sm truncate">{item.name}</div>
        </div>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-primary text-primary-foreground' : 'border border-border'}`}>
          {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>
    );
  };

  const categoriesToRender = activeTab === "CHEMICALS" 
    ? Array.from(new Set(chemicals.map(c => c.category))).sort()
    : activeTab === "MATERIALS" 
      ? PRODUCT_CATEGORIES 
      : [...Array.from(new Set(chemicals.map(c => c.category))), ...PRODUCT_CATEGORIES].sort();

  return (
    <div className="space-y-4">
      {/* Top Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button onClick={() => setActiveTab("ALL")} className={`pb-2 px-3 text-[10px] font-black uppercase tracking-widest border-b-2 ${activeTab === "ALL" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-white"}`}>All</button>
        <button onClick={() => setActiveTab("CHEMICALS")} className={`pb-2 px-3 text-[10px] font-black uppercase tracking-widest border-b-2 ${activeTab === "CHEMICALS" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-white"}`}>Chemicals</button>
        <button onClick={() => setActiveTab("MATERIALS")} className={`pb-2 px-3 text-[10px] font-black uppercase tracking-widest border-b-2 ${activeTab === "MATERIALS" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-white"}`}>Materials</button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder={`Search ${activeTab.toLowerCase()}...`} 
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9 bg-background"
        />
      </div>

      {search ? (
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
          {filteredInputs.map(renderItem)}
          {filteredInputs.length === 0 && (
            <p className="text-muted-foreground text-sm text-center py-4">No items found.</p>
          )}
        </div>
      ) : (
        <div className="space-y-4 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
          {recentIds.length > 0 && activeTab === "ALL" && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Recent</h4>
              <div className="space-y-2">
                {recentIds
                  .map(id => normalizedInputs.find(i => i.id === id))
                  .filter(Boolean)
                  .map(renderItem)}
              </div>
            </div>
          )}

          <Accordion type="single" collapsible className="w-full">
            {categoriesToRender.map(category => {
              const items = filteredInputs.filter(i => i.category === category);
              if (items.length === 0) return null;
              
              return (
                <AccordionItem value={category} key={category} className="border-border">
                  <AccordionTrigger className="text-xs font-bold uppercase tracking-wider py-3 hover:no-underline text-left">
                    {category.replace("_", " ")} <span className="opacity-50 ml-2">({items.length})</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-2">
                      {items.map(renderItem)}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      )}
    </div>
  );
}
