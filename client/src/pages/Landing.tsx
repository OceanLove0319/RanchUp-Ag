import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import MarketingNav from "@/components/layout/MarketingNav";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground flex flex-col">
      <MarketingNav />
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto pt-32 pb-20">
        <h1 className="md:text-[77px] font-black uppercase tracking-tighter mb-6 text-foreground text-[42px] leading-tight">
          Track the work.<br/>Protect the profit.
        </h1>
        <p className="md:text-2xl mb-10 max-w-2xl text-[#bababa] font-semibold text-lg md:text-[21px]">
          Block-level plans, fast field logging, and clean season records—built for tree fruit.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-16 md:mb-24 w-full sm:w-auto">
          <Link href="/login" className="px-8 py-4 bg-primary text-primary-foreground font-black uppercase tracking-widest text-lg rounded hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(234,153,61,0.4)]">
            Try Demo <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="bg-card border border-border p-6 rounded-lg">
            <h3 className="text-lg font-bold uppercase tracking-widest mb-3 text-primary">Ingredients Plan</h3>
            <p className="text-muted-foreground font-medium">Dial in fert + water targets by variety and yield goal.</p>
          </div>
          <div className="bg-card border border-border p-6 rounded-lg">
            <h3 className="text-lg font-bold uppercase tracking-widest mb-3 text-primary">Field Log</h3>
            <p className="text-muted-foreground font-medium">Log spray, fert, irrigation in seconds—while you're in the orchard.</p>
          </div>
          <div className="bg-card border border-border p-6 rounded-lg">
            <h3 className="text-lg font-bold uppercase tracking-widest mb-3 text-primary">Season Vault</h3>
            <p className="text-muted-foreground font-medium">Your records, organized by block and season. No paper hunts.</p>
          </div>
        </div>
        
        <div className="mt-20 text-muted-foreground/50 font-semibold uppercase tracking-widest text-sm">
          Made for Central Valley tree fruit, nut, and citrus growers.
        </div>
      </main>
    </div>
  );
}
