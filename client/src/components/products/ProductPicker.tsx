import { useState, useEffect } from "react";
import { useProductLibrary } from "@/hooks/useData";
import { Search, Plus, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PRODUCT_CATEGORIES } from "@/data/materialsSeed";

export default function ProductPicker({ selectedProductIds = [], onSelectionChange }: { selectedProductIds?: string[], onSelectionChange: (ids: string[]) => void }) {
  const { data: productLibrary = [] } = useProductLibrary();
  const [search, setSearch] = useState("");
  const [recentIds, setRecentIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ranchup_recent_products");
      if (stored) setRecentIds(JSON.parse(stored));
    } catch (e) {}
  }, []);

  const updateRecent = (id: string) => {
    const next = [id, ...recentIds.filter(i => i !== id)].slice(0, 5);
    setRecentIds(next);
    localStorage.setItem("ranchup_recent_products", JSON.stringify(next));
  };

  const toggleSelection = (id: string) => {
    if (selectedProductIds.includes(id)) {
      onSelectionChange(selectedProductIds.filter(i => i !== id));
    } else {
      updateRecent(id);
      onSelectionChange([...selectedProductIds, id]);
    }
  };

  const filteredLibrary = productLibrary.filter((p: any) => {
    if (!search) return true;
    return p.name.toLowerCase().includes(search.toLowerCase()) || 
           (p.aliases && p.aliases.some((a: string) => a.toLowerCase().includes(search.toLowerCase())));
  });

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

  const renderProductItem = (p: any) => {
    const isSelected = selectedProductIds.includes(p.id);
    return (
      <button
        key={p.id}
        onClick={(e) => { e.preventDefault(); toggleSelection(p.id); }}
        className={`w-full text-left p-3 rounded-lg border transition-all flex justify-between items-center gap-2 ${
          isSelected ? 'bg-primary/10 border-primary/50' : 'bg-background border-border hover:border-primary/30'
        }`}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded border ${getCategoryColor(p.category)}`}>
              {p.category}
            </span>
            {p.brandFamily === "INNVICTIS" && (
              <span className="text-[10px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-500 border border-orange-500/20">
                Innvictis®
              </span>
            )}
          </div>
          <div className="font-bold text-sm truncate">{p.name}</div>
        </div>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-primary text-primary-foreground' : 'border border-border'}`}>
          {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>
    );
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search products..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9 bg-background"
        />
      </div>

      {search ? (
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
          {filteredLibrary.map(renderProductItem)}
          {filteredLibrary.length === 0 && (
            <p className="text-muted-foreground text-sm text-center py-4">No products found.</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {recentIds.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Recent</h4>
              <div className="space-y-2">
                {recentIds
                  .map(id => productLibrary.find((p: any) => p.id === id))
                  .filter(Boolean)
                  .map(renderProductItem)}
              </div>
            </div>
          )}

          <Accordion type="single" collapsible className="w-full">
            {PRODUCT_CATEGORIES.map(category => {
              const items = productLibrary.filter((p: any) => p.category === category);
              if (items.length === 0) return null;
              return (
                <AccordionItem value={category} key={category} className="border-border">
                  <AccordionTrigger className="text-sm font-bold uppercase tracking-wider py-3 hover:no-underline">
                    {category} ({items.length})
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-2">
                      {items.map(renderProductItem)}
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
