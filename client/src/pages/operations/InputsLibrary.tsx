import { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { Plus, Search, Package, FlaskConical, Filter, Edit2, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PRODUCT_CATEGORIES, PRODUCT_TYPES_BY_CATEGORY } from "@/data/materialsSeed";

import { useLocation } from "wouter";

type TopTab = "ALL" | "CHEMICALS" | "MATERIALS";

export default function InputsLibrary() {
  const [, setLocation] = useLocation();
  const { chemicals, productLibrary, addProductLibraryItem, updateProductLibraryItem, removeProductLibraryItem } = useStore();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<TopTab>("ALL");
  const [activeTypeTab, setActiveTypeTab] = useState<string>("ALL");
  
  // Normalized view model for the list
  const normalizedInputs = useMemo(() => {
    const chems = chemicals.map(c => ({
      ...c,
      itemType: "CHEMICAL" as const,
      displayName: c.name,
      displayCategory: c.category,
      displayType: "Chemical",
      displayUnit: c.unit,
      displayAliases: c.aliases || []
    }));

    const mats = productLibrary.map(m => ({
      ...m,
      itemType: "MATERIAL" as const,
      displayName: m.name,
      displayCategory: m.category,
      displayType: m.type,
      displayUnit: m.unitDefault || "—",
      displayAliases: m.aliases || []
    }));

    return [...chems, ...mats];
  }, [chemicals, productLibrary]);

  const allTypes = useMemo(() => {
    if (activeTab === "CHEMICALS") {
      const types = new Set(chemicals.map(c => c.category));
      return ["ALL", ...Array.from(types).sort()];
    } else if (activeTab === "MATERIALS") {
      return ["ALL", ...PRODUCT_CATEGORIES];
    }
    return ["ALL"];
  }, [activeTab, chemicals]);

  const filteredInputs = useMemo(() => {
    let result = normalizedInputs;

    // Top Level Tab Filter
    if (activeTab === "CHEMICALS") {
      result = result.filter(i => i.itemType === "CHEMICAL");
    } else if (activeTab === "MATERIALS") {
      result = result.filter(i => i.itemType === "MATERIAL");
    }

    // Type Filter
    if (activeTypeTab !== "ALL") {
      result = result.filter(i => i.displayCategory === activeTypeTab);
    }

    // Search Filter
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(i => 
        i.displayName.toLowerCase().includes(q) || 
        i.displayAliases.some(a => a.toLowerCase().includes(q))
      );
    }

    return result;
  }, [normalizedInputs, activeTab, activeTypeTab, search]);

  const handleTabChange = (tab: TopTab) => {
    setActiveTab(tab);
    setActiveTypeTab("ALL"); // Reset type filter when switching major tabs
  };

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
      default: return "bg-gray-500/20 text-gray-500 border-gray-500/30";
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-1">Inputs Library</h1>
          <p className="text-muted-foreground text-sm font-medium">Browse and manage all farm chemicals and materials.</p>
        </div>
      </div>

      {/* Top Level Tabs */}
      <div className="flex gap-2 border-b border-border mb-4">
        <button
          onClick={() => handleTabChange("ALL")}
          className={`pb-3 px-4 font-bold uppercase tracking-wider text-xs border-b-2 transition-colors ${
            activeTab === "ALL" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-white"
          }`}
        >
          All Inputs ({normalizedInputs.length})
        </button>
        <button
          onClick={() => handleTabChange("CHEMICALS")}
          className={`pb-3 px-4 font-bold uppercase tracking-wider text-xs border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "CHEMICALS" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-white"
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5" /> Chemicals ({chemicals.length})
        </button>
        <button
          onClick={() => handleTabChange("MATERIALS")}
          className={`pb-3 px-4 font-bold uppercase tracking-wider text-xs border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "MATERIALS" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-white"
          }`}
        >
          <Package className="w-3.5 h-3.5" /> Materials ({productLibrary.length})
        </button>
      </div>

      {/* Search & Action Bar */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder={`Search ${activeTab === "ALL" ? "all inputs" : activeTab.toLowerCase()}...`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-card border-border"
          />
        </div>
        <Button className="font-bold uppercase tracking-wider text-xs shadow-[0_0_15px_rgba(212,175,55,0.2)]">
          <Plus className="w-4 h-4 mr-2" /> Add {activeTab === "CHEMICALS" ? "Chemical" : activeTab === "MATERIALS" ? "Material" : "Item"}
        </Button>
      </div>

      {/* Type Tabs (Sub-navigation) */}
      {(activeTab === "CHEMICALS" || activeTab === "MATERIALS") && allTypes.length > 1 && (
        <div className="flex flex-wrap gap-2 pb-2">
          {allTypes.map(type => {
            const count = type === "ALL" 
              ? normalizedInputs.filter(i => activeTab === "CHEMICALS" ? i.itemType === "CHEMICAL" : i.itemType === "MATERIAL").length
              : normalizedInputs.filter(i => i.displayCategory === type && (activeTab === "CHEMICALS" ? i.itemType === "CHEMICAL" : i.itemType === "MATERIAL")).length;
              
            return (
              <button
                key={type}
                onClick={() => setActiveTypeTab(type)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all border ${
                  activeTypeTab === type 
                    ? "bg-primary text-primary-foreground border-primary" 
                    : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {type.replace("_", " ")} <span className="opacity-70 ml-1">({count})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Item List */}
      <div className="grid gap-3">
        {filteredInputs.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-lg border-dashed">
            {activeTab === "CHEMICALS" ? <FlaskConical className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-20" /> : <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-20" />}
            <p className="text-muted-foreground font-medium uppercase tracking-wider text-sm">No items found.</p>
          </div>
        ) : (
          filteredInputs.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-card border border-border rounded-lg gap-4 group transition-colors hover:border-primary/30">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {item.itemType === "CHEMICAL" ? (
                    <div className="w-8 h-8 rounded bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                      <FlaskConical className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500">
                      <Package className="w-4 h-4" />
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[9px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded border ${item.itemType === "MATERIAL" ? getCategoryColor(item.displayCategory) : 'bg-secondary text-foreground border-border'}`}>
                      {item.displayCategory.replace("_", " ")}
                    </span>
                    {(item as any).brandFamily === "INNVICTIS" && (
                      <span className="text-[9px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-500 border border-orange-500/20">
                        Innvictis®
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-bold text-base">{item.displayName}</h3>
                  
                  <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                    {item.displayType && <span>{item.displayType}</span>}
                    <span>•</span>
                    <span>Default: <strong className="text-foreground">{item.displayUnit}</strong></span>
                  </div>
                  
                  {item.displayAliases.length > 0 && (
                    <p className="text-[10px] text-muted-foreground mt-1.5">
                      <span className="uppercase tracking-widest mr-1 opacity-70">Aliases:</span> 
                      {item.displayAliases.join(", ")}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2 justify-end sm:opacity-0 sm:group-hover:opacity-100 transition-opacity mt-2 sm:mt-0">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="h-8 text-xs font-bold uppercase tracking-wider"
                  onClick={() => setLocation(`/app/log?input=${encodeURIComponent(item.id)}&type=${item.itemType}`)}
                >
                  Log Use
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Edit2 className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
