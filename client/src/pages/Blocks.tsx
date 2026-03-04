import { Link } from "wouter";
import { useStore } from "@/lib/store";
import { Map, Plus } from "lucide-react";

export default function Blocks() {
  const blocks = useStore(s => s.blocks);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Setup</p>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-foreground">Your Blocks</h1>
        </div>
        <button className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded font-bold uppercase tracking-widest text-sm transition-colors">
          <Plus className="w-4 h-4" /> New Block
        </button>
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
