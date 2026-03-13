import { useState, useMemo } from "react";
import { useProductLibrary, ProductLibraryItem } from "@/hooks/useData";
import { Search, X, Check, Package, Zap, Clock } from "lucide-react";

interface UnifiedInputPickerProps {
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  maxSelection?: number;
}

export default function UnifiedInputPicker({ 
  selectedIds, 
  onSelectionChange,
  maxSelection = 5
}: UnifiedInputPickerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: productLibrary = [] } = useProductLibrary();
  
  // Basic search
  const filteredProducts = useMemo(() => {
    if (!searchTerm) {
      // Prioritize some common items if no search term
      return productLibrary.slice(0, 10);
    }
    
    const lowerTerm = searchTerm.toLowerCase();
    return productLibrary.filter(p => 
      p.name.toLowerCase().includes(lowerTerm) || 
      p.aliases?.some(a => a.toLowerCase().includes(lowerTerm)) ||
      p.type.toLowerCase().includes(lowerTerm)
    ).slice(0, 15);
  }, [productLibrary, searchTerm]);

  const toggleProduct = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(i => i !== id));
    } else {
      if (selectedIds.length < maxSelection) {
        onSelectionChange([...selectedIds, id]);
      }
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'NUTRITION': return 'text-orange-400 border-orange-400/30 bg-orange-400/10';
      case 'FUNGICIDE': return 'text-purple-400 border-purple-400/30 bg-purple-400/10';
      case 'INSECTICIDE_MITICIDE': return 'text-red-400 border-red-400/30 bg-red-400/10';
      case 'HERBICIDE': return 'text-green-400 border-green-400/30 bg-green-400/10';
      case 'ADJUVANT': return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
      default: return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products, common names..."
          className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary placeholder:text-muted-foreground/50 font-medium"
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto min-h-[150px] max-h-[300px] no-scrollbar">
        {filteredProducts.length > 0 ? (
          <div className="space-y-2">
            {filteredProducts.map(product => {
              const isSelected = selectedIds.includes(product.id);
              const catColor = getCategoryColor(product.category);
              
              return (
                <div 
                  key={product.id}
                  onClick={() => toggleProduct(product.id)}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border bg-background hover:border-primary/50'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className={`text-sm font-bold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                      {product.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-2 uppercase tracking-widest">
                      <span className={`px-1.5 py-0.5 rounded-sm border ${catColor} text-[8px] font-black`}>
                        {product.category.replace('_', ' ')}
                      </span>
                      {product.type}
                    </span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                    isSelected 
                      ? 'border-primary bg-primary text-primary-foreground' 
                      : 'border-muted-foreground/30'
                  }`}>
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground border border-dashed border-border rounded-lg">
            <Package className="w-8 h-8 mb-2 opacity-20" />
            <p className="text-sm font-medium">No products found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
