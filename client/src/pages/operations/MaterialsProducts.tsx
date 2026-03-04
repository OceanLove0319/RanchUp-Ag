import { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { Plus, Search, Filter, Edit2, Trash2, Package } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PRODUCT_CATEGORIES, PRODUCT_TYPES_BY_CATEGORY } from "@/data/materialsSeed";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function MaterialsProducts() {
  const { productLibrary, addProductLibraryItem, updateProductLibraryItem, removeProductLibraryItem } = useStore();
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState("NUTRITION");
  const [type, setType] = useState(PRODUCT_TYPES_BY_CATEGORY["NUTRITION"][0]);
  const [unitDefault, setUnitDefault] = useState("GAL");
  const [aliases, setAliases] = useState("");
  const [brandFamily, setBrandFamily] = useState("GENERIC");

  const filteredProducts = useMemo(() => {
    return productLibrary.filter((p: any) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          (p.aliases && p.aliases.some((a: string) => a.toLowerCase().includes(search.toLowerCase())));
      const matchCategory = filterCategory === "ALL" || p.category === filterCategory;
      return matchSearch && matchCategory;
    });
  }, [productLibrary, search, filterCategory]);

  const openAdd = () => {
    setEditingProduct(null);
    setName("");
    setCategory("NUTRITION");
    setType(PRODUCT_TYPES_BY_CATEGORY["NUTRITION"][0]);
    setUnitDefault("GAL");
    setAliases("");
    setBrandFamily("GENERIC");
    setIsAddOpen(true);
  };

  const openEdit = (product: any) => {
    setEditingProduct(product);
    setName(product.name);
    setCategory(product.category);
    setType(product.type);
    setUnitDefault(product.unitDefault || "");
    setAliases(product.aliases ? product.aliases.join(", ") : "");
    setBrandFamily(product.brandFamily || "GENERIC");
    setIsAddOpen(true);
  };

  const handleSave = () => {
    if (!name) return;
    const newItem = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name,
      category,
      type,
      unitDefault,
      aliases: aliases.split(",").map(a => a.trim()).filter(Boolean),
      brandFamily
    };

    if (editingProduct) {
      updateProductLibraryItem(editingProduct.id, newItem);
    } else {
      addProductLibraryItem(newItem);
    }
    setIsAddOpen(false);
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
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-1">Materials & Products</h1>
          <p className="text-muted-foreground text-sm font-medium">Manage your product library and inputs.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd} className="font-bold uppercase tracking-wider text-xs shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              <Plus className="w-4 h-4 mr-2" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-black uppercase tracking-tight text-xl">
                {editingProduct ? "Edit Product" : "Add Product"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Product Name *</Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Pristine Fungicide" className="bg-background" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category *</Label>
                  <Select value={category} onValueChange={(val) => {
                    setCategory(val);
                    setType(PRODUCT_TYPES_BY_CATEGORY[val][0]);
                  }}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCT_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Type *</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCT_TYPES_BY_CATEGORY[category]?.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Default Unit</Label>
                  <Input value={unitDefault} onChange={e => setUnitDefault(e.target.value)} placeholder="GAL, LB, OZ" className="bg-background" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Brand Family</Label>
                  <Select value={brandFamily} onValueChange={setBrandFamily}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GENERIC">Generic</SelectItem>
                      <SelectItem value="INNVICTIS">Innvictis®</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Aliases (Comma separated)</Label>
                <Input value={aliases} onChange={e => setAliases(e.target.value)} placeholder="e.g. CAN17, Calcium Nitrate" className="bg-background" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => setIsAddOpen(false)} className="font-bold uppercase tracking-wider text-xs">Cancel</Button>
              <Button onClick={handleSave} disabled={!name} className="font-bold uppercase tracking-wider text-xs">Save Product</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search products or aliases..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-card border-border"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[140px] bg-card border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Categories</SelectItem>
            {PRODUCT_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-3">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-lg border-dashed">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-20" />
            <p className="text-muted-foreground font-medium">No products found.</p>
          </div>
        ) : (
          filteredProducts.map((p: any) => (
            <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-card border border-border rounded-lg gap-4 group">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded border ${getCategoryColor(p.category)}`}>
                    {p.category}
                  </span>
                  {p.brandFamily === "INNVICTIS" && (
                    <span className="text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded bg-orange-500/10 text-orange-500 border border-orange-500/20">
                      Innvictis®
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-lg">{p.name}</h3>
                <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                  <span>Type: {p.type}</span>
                  {p.unitDefault && <span>• Default Unit: {p.unitDefault}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => openEdit(p)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="icon" className="h-8 w-8 bg-red-500/10 text-red-500 hover:bg-red-500/20" onClick={() => removeProductLibraryItem(p.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
