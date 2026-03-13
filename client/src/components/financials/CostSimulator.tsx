import { useState, useMemo } from "react";
import { Block, Recommendation } from "@/hooks/useData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, AlertTriangle, ArrowRight } from "lucide-react";

interface CostSimulatorProps {
  block: Block;
}

// Mock database of products for the simulator
const SIMULATOR_PRODUCTS = [
  { name: "Abamectin 0.15 EC (Generic)", type: "Insecticide", pricePerUnit: 45, unit: "gal", defaultRate: 0.5 },
  { name: "Agri-Mek SC (Brand)", type: "Insecticide", pricePerUnit: 280, unit: "gal", defaultRate: 0.5 },
  { name: "Rely 280 (Brand)", type: "Herbicide", pricePerUnit: 65, unit: "gal", defaultRate: 1.2 },
  { name: "Glufosinate 280 (Generic)", type: "Herbicide", pricePerUnit: 35, unit: "gal", defaultRate: 1.2 },
  { name: "Luna Sensation (Brand)", type: "Fungicide", pricePerUnit: 120, unit: "oz", defaultRate: 5 },
  { name: "Fluopyram 500 (Generic)", type: "Fungicide", pricePerUnit: 75, unit: "oz", defaultRate: 5 },
];

export function CostSimulator({ block }: CostSimulatorProps) {
  const [selectedProduct, setSelectedProduct] = useState(SIMULATOR_PRODUCTS[0]);
  const [rate, setRate] = useState<number>(SIMULATOR_PRODUCTS[0].defaultRate);
  
  // Find alternative (same type, different brand family)
  const isBrand = selectedProduct.name.includes("Brand");
  const alternative = SIMULATOR_PRODUCTS.find(p => p.type === selectedProduct.type && p.name !== selectedProduct.name);
  
  const currentCostPerAcre = selectedProduct.pricePerUnit * rate;
  const currentTotalCost = currentCostPerAcre * block.acreage;

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const prod = SIMULATOR_PRODUCTS.find(p => p.name === e.target.value);
    if (prod) {
      setSelectedProduct(prod);
      setRate(prod.defaultRate);
    }
  };

  const handleSwitchToAlt = () => {
    if (alternative) {
      setSelectedProduct(alternative);
      setRate(alternative.defaultRate);
    }
  };

  return (
    <div className="bg-[#111113] border border-border rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-black uppercase tracking-tight text-foreground">"What-If" Cost Simulator</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Select Application</label>
            <select 
              value={selectedProduct.name}
              onChange={handleProductChange}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:border-primary"
            >
              {SIMULATOR_PRODUCTS.map(p => (
                <option key={p.name} value={p.name}>{p.name} (${p.pricePerUnit}/{p.unit})</option>
              ))}
            </select>
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">Application Rate ({selectedProduct.unit}/ac)</label>
              <span className="text-xs font-bold text-primary">{rate.toFixed(2)}</span>
            </div>
            <input 
              type="range" 
              min={selectedProduct.defaultRate * 0.5} 
              max={selectedProduct.defaultRate * 2} 
              step={0.1}
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-muted-foreground">Light</span>
              <span className="text-[10px] text-muted-foreground">Heavy</span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setRate(selectedProduct.defaultRate)}
            className="w-full mt-2 text-xs font-bold uppercase tracking-widest gap-2"
          >
            <RotateCcw className="w-3 h-3" /> Reset to Label Rate
          </Button>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Estimated Impact</h4>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Cost Per Acre</p>
                <p className="text-2xl font-bold text-foreground">${currentCostPerAcre.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Block Total</p>
                <p className="text-2xl font-black text-primary">${currentTotalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              </div>
            </div>
          </div>
          
          {alternative && (
            <div className="bg-background/50 border border-border/50 rounded-lg p-4">
              <div className="flex items-start gap-2 mb-2">
                <AlertTriangle className={`w-4 h-4 mt-0.5 ${alternative.pricePerUnit < selectedProduct.pricePerUnit ? 'text-green-400' : 'text-orange-400'}`} />
                <div>
                  <p className="text-xs font-bold">Alternative Available</p>
                  <p className="text-xs text-muted-foreground">{alternative.name}</p>
                </div>
              </div>
              
              {alternative.pricePerUnit < selectedProduct.pricePerUnit ? (
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-green-400">Save ~${((currentCostPerAcre) - (alternative.pricePerUnit * alternative.defaultRate)).toFixed(2)}/ac</span>
                  <Button size="sm" onClick={handleSwitchToAlt} className="h-8 text-[10px] font-bold uppercase tracking-widest bg-green-500/20 text-green-400 hover:bg-green-500/30">
                    Compare <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              ) : (
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-orange-400">Premium ~+${((alternative.pricePerUnit * alternative.defaultRate) - currentCostPerAcre).toFixed(2)}/ac</span>
                  <Button size="sm" variant="outline" onClick={handleSwitchToAlt} className="h-8 text-[10px] font-bold uppercase tracking-widest">
                    Compare <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
