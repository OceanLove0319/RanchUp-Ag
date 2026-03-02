import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0B0B0C] text-white selection:bg-primary selection:text-white flex flex-col">
      <nav className="p-6 flex justify-between items-center max-w-6xl mx-auto w-full">
        <div className="font-black text-2xl tracking-tighter">KEBB AG™</div>
        <div className="flex gap-4">
          <Link href="/login">
            <a className="px-6 py-2 border border-white/20 rounded font-bold uppercase tracking-wide text-sm hover:bg-white/5 transition-colors">
              Sign In
            </a>
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
          Run your orchard.<br/>Not your notebook.
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl font-medium">
          Block-level plans, fast field logging, and clean season records—built for tree fruit.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-24 w-full sm:w-auto">
          <Link href="/login">
            <a className="px-8 py-4 bg-[#FD5A1E] text-white font-black uppercase tracking-widest text-lg rounded hover:bg-[#FD5A1E]/90 transition-colors flex items-center justify-center gap-2">
              Try Demo <ArrowRight className="w-5 h-5" />
            </a>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 w-full text-left">
          <div className="bg-[#111113] border border-white/10 p-6 rounded-lg">
            <h3 className="text-lg font-bold uppercase tracking-widest mb-3 text-primary">Ingredients Plan</h3>
            <p className="text-gray-400 font-medium">Dial in fert + water targets by variety and yield goal.</p>
          </div>
          <div className="bg-[#111113] border border-white/10 p-6 rounded-lg">
            <h3 className="text-lg font-bold uppercase tracking-widest mb-3 text-primary">Field Log</h3>
            <p className="text-gray-400 font-medium">Log spray, fert, irrigation in seconds—while you're in the orchard.</p>
          </div>
          <div className="bg-[#111113] border border-white/10 p-6 rounded-lg">
            <h3 className="text-lg font-bold uppercase tracking-widest mb-3 text-primary">Season Vault</h3>
            <p className="text-gray-400 font-medium">Your records, organized by block and season. No paper hunts.</p>
          </div>
        </div>
        
        <div className="mt-20 text-gray-500 font-semibold uppercase tracking-widest text-sm">
          Made for Central Valley stone fruit growers.
        </div>
      </main>
    </div>
  );
}
