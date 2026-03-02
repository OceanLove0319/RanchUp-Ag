import { useRoute } from "wouter";
import { useStore } from "@/lib/store";
import { Droplets, Sprout, ShieldAlert, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function BlockDetail() {
  const [, params] = useRoute("/app/blocks/:id");
  const block = useStore(s => s.blocks.find(b => b.id === params?.id));

  if (!block) return <div>Block not found</div>;

  return (
    <div className="animate-in fade-in duration-500">
      <Link href="/app/blocks">
        <a className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blocks
        </a>
      </Link>

      <header className="mb-10">
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">{block.name}</h1>
          <span className="bg-white/10 text-white px-3 py-1 rounded text-sm font-bold uppercase tracking-widest">
            {block.acreage} ACRES
          </span>
        </div>
        <p className="text-gray-400 font-medium">{block.variety} • {block.seasonGroup} Season • {block.irrigationType}</p>
      </header>

      <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">NEXT STEP: REVIEW THIS BLOCK'S TARGETS.</p>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-[#111113] border border-white/10 p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-4 text-orange-400">
            <Sprout className="w-5 h-5" />
            <h3 className="font-black uppercase tracking-widest">Fertilizer Target</h3>
          </div>
          <p className="text-3xl font-black text-white mb-2">250-300 <span className="text-lg text-gray-500">lbs/ac</span></p>
          <p className="text-sm text-gray-400 leading-relaxed">Set your target. Adjust as you learn. Keep it consistent.</p>
        </div>

        <div className="bg-[#111113] border border-white/10 p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-4 text-blue-400">
            <Droplets className="w-5 h-5" />
            <h3 className="font-black uppercase tracking-widest">Water Target</h3>
          </div>
          <p className="text-3xl font-black text-white mb-2">{block.waterTargetAcreFeet.toFixed(1)} <span className="text-lg text-gray-500">ac-ft</span></p>
          <p className="text-sm text-gray-400 leading-relaxed">Track against target—less guesswork, tighter decisions.</p>
        </div>

        <div className="bg-[#111113] border border-white/10 p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-4 text-purple-400">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-black uppercase tracking-widest">Spray Windows</h3>
          </div>
          <ul className="space-y-2 text-sm font-bold uppercase tracking-wide text-gray-300 mb-4">
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Dormant</li>
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary"></div> Bloom</li>
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div> Fruit set</li>
          </ul>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-auto">Keep your program visible.</p>
        </div>
      </div>

      <div className="bg-[#111113] border border-white/10 p-6 md:p-8 rounded-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-black uppercase tracking-tight text-white mb-1">Season Spend</h3>
          <p className="text-gray-400 font-medium">Estimated cost per bin based on target yield ({block.yieldTargetBins} b/ac).</p>
        </div>
        <div className="text-right">
          <p className="text-4xl font-black text-white">$0.00</p>
          <p className="text-xs font-bold uppercase tracking-widest text-primary mt-1">Cost / Bin Target</p>
        </div>
      </div>
    </div>
  );
}
