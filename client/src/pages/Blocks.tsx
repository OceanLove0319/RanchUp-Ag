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
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">Your Blocks</h1>
        </div>
        <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded font-bold uppercase tracking-widest text-sm transition-colors">
          <Plus className="w-4 h-4" /> New Block
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {blocks.map(block => (
          <Link key={block.id} href={`/app/blocks/${block.id}`} className="bg-[#111113] border border-white/10 p-6 rounded-lg hover:border-primary/50 transition-colors group block">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded">
                  <Map className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-xl font-black text-white">{block.name}</h3>
              </div>
              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold uppercase tracking-widest">
                {block.acreage} AC
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-6 border-t border-white/5 pt-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Variety</p>
                <p className="text-sm font-medium text-gray-300 mt-1">{block.variety}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Season</p>
                <p className="text-sm font-medium text-gray-300 mt-1">{block.seasonGroup}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Target</p>
                <p className="text-sm font-medium text-gray-300 mt-1">{block.yieldTargetBins} b/ac</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
