import { Link } from "wouter";
import { ArrowLeft, CheckCircle2, ShieldAlert, Sprout, Map, Calculator, Printer, DollarSign, FileText, BookOpen } from "lucide-react";
import MarketingNav from "@/components/layout/MarketingNav";

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <MarketingNav />

      <main className="max-w-4xl mx-auto p-6 pt-32 pb-24 animate-in fade-in duration-500">
        <header className="mb-12 md:mb-16 text-center">
          <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-4">How It Works</h1>
          <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto px-4">
            Everything included in the KEBB Ag™ platform to help you run your orchard.
          </p>
        </header>

        <div className="space-y-16 md:space-y-24">
          
          {/* Section 1 */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 md:mb-6">
                <Map className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-3 md:mb-4">1. Block-Level Planning</h2>
              <p className="text-muted-foreground text-base md:text-lg mb-6 leading-relaxed">
                Set up your ranch block by block. Define acreage, variety, season group, and irrigation type. The system automatically computes target fertility (N-P-K) and water requirements based on your specific yield targets.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 font-bold text-sm uppercase tracking-widest"><CheckCircle2 className="w-4 h-4 text-primary" /> Variety-specific targets</li>
                <li className="flex items-center gap-3 font-bold text-sm uppercase tracking-widest"><CheckCircle2 className="w-4 h-4 text-primary" /> Irrigation & Water Tracking</li>
                <li className="flex items-center gap-3 font-bold text-sm uppercase tracking-widest"><CheckCircle2 className="w-4 h-4 text-primary" /> Custom spray windows</li>
              </ul>
            </div>
            <div className="bg-card border border-border p-6 rounded-xl shadow-2xl relative overflow-hidden order-1 md:order-2">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent"></div>
              <div className="space-y-4 opacity-80">
                <div className="h-4 w-1/3 bg-muted rounded"></div>
                <div className="h-10 w-full bg-background border border-border rounded"></div>
                <div className="h-10 w-2/3 bg-background border border-border rounded"></div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="h-20 bg-background border border-border rounded"></div>
                  <div className="h-20 bg-background border border-border rounded"></div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="bg-card border border-border p-4 md:p-6 rounded-xl shadow-2xl order-1 md:order-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-orange-400 to-transparent"></div>
              <div className="space-y-4 opacity-80">
                <div className="flex gap-2">
                  <div className="h-12 flex-1 bg-background border border-border rounded"></div>
                  <div className="h-12 flex-1 bg-orange-400/10 border border-orange-400/50 rounded"></div>
                  <div className="h-12 flex-1 bg-background border border-border rounded"></div>
                </div>
                <div className="h-24 w-full bg-background border border-border rounded mt-4"></div>
                <div className="h-12 w-full bg-primary rounded mt-4"></div>
              </div>
            </div>
            <div className="order-2 md:order-2">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-400/10 rounded-lg flex items-center justify-center mb-4 md:mb-6">
                <Sprout className="w-5 h-5 md:w-6 md:h-6 text-orange-400" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-3 md:mb-4">2. The Quick Log</h2>
              <p className="text-muted-foreground text-base md:text-lg mb-6 leading-relaxed">
                Log sprays, fertigations, and irrigations from the cab of your truck. The Quick Log features smart templates that adapt to the block you select, remembering your most recent and pinned applications.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 font-bold text-sm uppercase tracking-widest"><CheckCircle2 className="w-4 h-4 text-orange-400" /> Smart crop-aware templates</li>
                <li className="flex items-center gap-3 font-bold text-sm uppercase tracking-widest"><CheckCircle2 className="w-4 h-4 text-orange-400" /> Built-in tank & load calculator</li>
                <li className="flex items-center gap-3 font-bold text-sm uppercase tracking-widest"><CheckCircle2 className="w-4 h-4 text-orange-400" /> Top-100 CV Chemical Library</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-400/10 rounded-lg flex items-center justify-center mb-4 md:mb-6">
                <ShieldAlert className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-3 md:mb-4">3. Cost Engine</h2>
              <p className="text-muted-foreground text-base md:text-lg mb-6 leading-relaxed">
                Stop guessing your season spend. The built-in cost engine automatically calculates application costs based on planning-grade chemical prices. It handles complex unit conversions (like 50LB bags vs OZ/AC) so your math is never silently wrong.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 font-bold text-sm uppercase tracking-widest"><CheckCircle2 className="w-4 h-4 text-purple-400" /> Auto-calculated season spend</li>
                <li className="flex items-center gap-3 font-bold text-sm uppercase tracking-widest"><CheckCircle2 className="w-4 h-4 text-purple-400" /> Strict unit-mismatch guardrails</li>
                <li className="flex items-center gap-3 font-bold text-sm uppercase tracking-widest"><CheckCircle2 className="w-4 h-4 text-purple-400" /> Live budget tracking</li>
              </ul>
            </div>
            <div className="bg-card border border-border p-4 md:p-6 rounded-xl shadow-2xl relative overflow-hidden order-1 md:order-2">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-transparent"></div>
               <div className="flex justify-between items-center mb-6">
                 <div className="h-4 w-24 bg-muted rounded"></div>
                 <div className="h-8 w-32 bg-background border border-border rounded"></div>
               </div>
               <div className="space-y-3">
                 <div className="h-16 w-full bg-background border border-border rounded flex items-center justify-between px-4">
                   <div className="h-3 w-32 bg-muted rounded"></div>
                   <div className="h-4 w-16 bg-foreground rounded"></div>
                 </div>
                 <div className="h-16 w-full bg-background border border-border rounded flex items-center justify-between px-4">
                   <div className="h-3 w-40 bg-muted rounded"></div>
                   <div className="h-4 w-20 bg-foreground rounded"></div>
                 </div>
               </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="bg-card border border-border p-4 md:p-6 rounded-xl shadow-2xl order-1 md:order-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-white to-transparent"></div>
              <div className="bg-white text-white p-4 rounded text-xs opacity-90 h-40 md:h-48 overflow-hidden">
                <h4 className="font-black border-b-2 border-black pb-2 mb-2 uppercase text-[10px] md:text-xs">KEBB Ag Season Packet</h4>
                <div className="flex justify-between mb-4 font-bold text-[10px] md:text-xs">
                  <span>North 40 Peaches</span>
                  <span>40 AC</span>
                </div>
                <div className="space-y-2 border-t border-gray-300 pt-2 text-[10px] md:text-xs">
                  <div className="flex justify-between"><span className="text-gray-500">Date</span><span>Product</span></div>
                  <div className="flex justify-between border-b border-gray-100 pb-1"><span>03-01</span><span className="font-bold">Pristine</span></div>
                  <div className="flex justify-between border-b border-gray-100 pb-1"><span>03-15</span><span className="font-bold">CAN-17</span></div>
                </div>
              </div>
            </div>
            <div className="order-2 md:order-2">
              <div className="w-10 h-10 md:w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-4 md:mb-6">
                <Printer className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-3 md:mb-4">4. The Season Vault</h2>
              <p className="text-muted-foreground text-base md:text-lg mb-6 leading-relaxed">
                At the end of the year, or right before an audit, you need clean records. The Season Vault deterministically sorts your logs, summarizes your coverage, and generates a print-ready PDF packet with one click.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 font-bold text-sm uppercase tracking-widest"><CheckCircle2 className="w-4 h-4 text-white" /> Print-ready audit packets</li>
                <li className="flex items-center gap-3 font-bold text-sm uppercase tracking-widest"><CheckCircle2 className="w-4 h-4 text-white" /> Deterministic sorting</li>
                <li className="flex items-center gap-3 font-bold text-sm uppercase tracking-widest"><CheckCircle2 className="w-4 h-4 text-white" /> Split spray vs. fert views</li>
              </ul>
            </div>
          </section>

        </div>

        <div className="mt-24 md:mt-32 text-center px-4">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-6">Ready to see it in action?</h2>
          <Link href="/login" className="inline-flex items-center gap-2 px-6 py-4 md:px-8 bg-primary text-primary-foreground font-black uppercase tracking-widest text-base md:text-lg rounded hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(212,175,55,0.4)] w-full sm:w-auto justify-center">
            Try The Demo
          </Link>
        </div>
      </main>
    </div>
  );
}
