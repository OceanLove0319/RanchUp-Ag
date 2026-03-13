import { Link } from "wouter";
import { useStore } from "@/lib/store";
import { useBlocks, useCreateBlock } from "@/hooks/useData";
import { Map, Plus, X } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function Blocks() {
  const activeRanchId = useStore(s => s.activeRanchId);
  const { data: blocks = [] } = useBlocks(activeRanchId);
  const createBlock = useCreateBlock();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [name, setName] = useState("");
  const [crop, setCrop] = useState("ALMONDS");
  const [variety, setVariety] = useState("");
  const [acreage, setAcreage] = useState("");
  const [yearPlanted, setYearPlanted] = useState("");
  const [seasonGroup, setSeasonGroup] = useState("");
  const [yieldTargetBins, setYieldTargetBins] = useState("");

  const handleSaveBlock = async () => {
    if (!name || !acreage || !variety || !activeRanchId) return;

    await createBlock.mutateAsync({
      ranchId: activeRanchId,
      name,
      crop,
      variety,
      acreage: parseFloat(acreage) || 0,
      seasonGroup: seasonGroup || "Standard",
      yieldTargetBins: parseFloat(yieldTargetBins) || 0,
      irrigationType: "Drip",
      waterTargetAcreFeet: 3.0,
    });

    setName("");
    setVariety("");
    setAcreage("");
    setYearPlanted("");
    setYieldTargetBins("");
    setIsDialogOpen(false);
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Setup</p>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-foreground">Your Blocks</h1>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-3 rounded font-bold uppercase tracking-widest text-sm transition-colors w-full md:w-auto justify-center">
              <Plus className="w-4 h-4" /> New Block
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-card border-border text-foreground">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase tracking-tighter">Add New Block</DialogTitle>
            </DialogHeader>

            <div className="grid gap-6 py-4 max-h-[60vh] overflow-y-auto no-scrollbar">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Block Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. North 40, Block A" className="bg-background border-border py-6 text-lg" />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="crop" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Crop Type</Label>
                  <Select value={crop} onValueChange={setCrop}>
                    <SelectTrigger className="bg-background border-border py-6 text-lg"><SelectValue placeholder="Select Crop" /></SelectTrigger>
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
                  <Input id="variety" value={variety} onChange={(e) => setVariety(e.target.value)} placeholder="e.g. Nonpareil" className="bg-background border-border py-6 text-lg" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="acreage" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Acreage</Label>
                  <Input id="acreage" type="number" inputMode="decimal" value={acreage} onChange={(e) => setAcreage(e.target.value)} placeholder="e.g. 40" className="bg-background border-border py-6 text-lg" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="yield" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Yield Target (Bins/Ac)</Label>
                  <Input id="yield" type="number" inputMode="decimal" value={yieldTargetBins} onChange={(e) => setYieldTargetBins(e.target.value)} placeholder="e.g. 30" className="bg-background border-border py-6 text-lg" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="year" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Year Planted</Label>
                  <Input id="year" type="number" inputMode="numeric" value={yearPlanted} onChange={(e) => setYearPlanted(e.target.value)} placeholder="e.g. 2015" className="bg-background border-border py-6 text-lg" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="season" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Season Group</Label>
                  <Input id="season" value={seasonGroup} onChange={(e) => setSeasonGroup(e.target.value)} placeholder="e.g. Early, Mid, Late" className="bg-background border-border py-6 text-lg" />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-border hover:bg-background py-6 w-full sm:w-auto">Cancel</Button>
              <Button onClick={handleSaveBlock} disabled={!name || !acreage || !variety || createBlock.isPending} className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase tracking-wider py-6 w-full sm:w-auto">
                {createBlock.isPending ? "Saving..." : "Save Block"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {blocks.map(block => (
          <Link key={block.id} href={`/app/blocks/${block.id}`} className="bg-card border border-border p-6 rounded-xl hover:border-primary/50 transition-colors group block relative overflow-hidden shadow-sm">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors" />
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg md:text-xl font-black text-foreground group-hover:text-primary transition-colors">{block.name}</h3>
              </div>
              <span className="bg-background border border-border text-foreground px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest whitespace-nowrap">{block.acreage} AC</span>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6 border-t border-border pt-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Crop / Variety</p>
                <p className="text-sm font-bold text-foreground">{block.variety}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Crop</p>
                <p className="text-sm font-black text-primary">{block.crop || '—'}</p>
              </div>
            </div>
          </Link>
        ))}
        {blocks.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground border border-border border-dashed rounded-xl">
            No blocks yet. Add your first block to get started.
          </div>
        )}
      </div>
    </div>
  );
}
