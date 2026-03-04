import { Link } from "wouter";
import { useStore, Block } from "@/lib/store";
import { Map, Plus, X } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function Blocks() {
  const blocks = useStore(s => s.blocks);
  const addBlock = useStore(s => s.addBlock);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // New Block Form State
  const [name, setName] = useState("");
  const [crop, setCrop] = useState<"ALMONDS" | "PISTACHIOS" | "WALNUTS" | "PEACHES" | "PLUMS" | "NECTARINES" | "CHERRIES" | "CITRUS">("ALMONDS");
  const [variety, setVariety] = useState("");
  const [acreage, setAcreage] = useState("");
  const [yearPlanted, setYearPlanted] = useState("");
  const [spacing, setSpacing] = useState("20x20");
  const [seasonGroup, setSeasonGroup] = useState("");
  const [yieldTargetBins, setYieldTargetBins] = useState("");

  const handleSaveBlock = () => {
    if (!name || !acreage || !variety) return;
    
    const newBlock: Block = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      crop,
      variety,
      acreage: parseFloat(acreage) || 0,
      yearPlanted: parseInt(yearPlanted) || new Date().getFullYear(),
      spacing,
      seasonGroup: seasonGroup || "Standard",
      yieldTargetBins: parseFloat(yieldTargetBins) || 0,
      geometry: null
    };
    
    addBlock(newBlock);
    
    // Reset and close
    setName("");
    setVariety("");
    setAcreage("");
    setYearPlanted("");
    setYieldTargetBins("");
    setIsDialogOpen(false);
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Setup</p>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-foreground">Your Blocks</h1>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded font-bold uppercase tracking-widest text-sm transition-colors">
              <Plus className="w-4 h-4" /> New Block
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-card border-border text-foreground">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase tracking-tighter">Add New Block</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Block Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. North 40, Block A" className="bg-background border-border" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="crop" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Crop Type</Label>
                  <Select value={crop} onValueChange={(v: any) => setCrop(v)}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Select Crop" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALMONDS">Almonds</SelectItem>
                      <SelectItem value="PISTACHIOS">Pistachios</SelectItem>
                      <SelectItem value="WALNUTS">Walnuts</SelectItem>
                      <SelectItem value="PEACHES">Peaches</SelectItem>
                      <SelectItem value="PLUMS">Plums</SelectItem>
                      <SelectItem value="NECTARINES">Nectarines</SelectItem>
                      <SelectItem value="CHERRIES">Cherries</SelectItem>
                      <SelectItem value="CITRUS">Citrus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="variety" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Variety</Label>
                  <Input id="variety" value={variety} onChange={(e) => setVariety(e.target.value)} placeholder="e.g. Nonpareil" className="bg-background border-border" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="acreage" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Acreage</Label>
                  <Input id="acreage" type="number" value={acreage} onChange={(e) => setAcreage(e.target.value)} placeholder="e.g. 40" className="bg-background border-border" />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="yield" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Yield Target (Bins/Ac)</Label>
                  <Input id="yield" type="number" value={yieldTargetBins} onChange={(e) => setYieldTargetBins(e.target.value)} placeholder="e.g. 30" className="bg-background border-border" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="year" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Year Planted</Label>
                  <Input id="year" type="number" value={yearPlanted} onChange={(e) => setYearPlanted(e.target.value)} placeholder="e.g. 2015" className="bg-background border-border" />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="season" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Season Group</Label>
                  <Input id="season" value={seasonGroup} onChange={(e) => setSeasonGroup(e.target.value)} placeholder="e.g. Early, Mid, Late" className="bg-background border-border" />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-border hover:bg-background">
                Cancel
              </Button>
              <Button onClick={handleSaveBlock} disabled={!name || !acreage || !variety} className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase tracking-wider">
                Save Block
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {blocks.map(block => (
          <Link key={block.id} href={`/app/blocks/${block.id}`} className="bg-card border border-border p-6 rounded-lg hover:border-primary/50 transition-colors group block">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-background border border-border rounded">
                  <Map className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-xl font-black text-foreground">{block.name}</h3>
              </div>
              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold uppercase tracking-widest">
                {block.acreage} AC
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-6 border-t border-border pt-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Variety</p>
                <p className="text-sm font-medium text-foreground mt-1">{block.variety}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Season</p>
                <p className="text-sm font-medium text-foreground mt-1">{block.seasonGroup}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Target</p>
                <p className="text-sm font-medium text-foreground mt-1">{block.yieldTargetBins} b/ac</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
