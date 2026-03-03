import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Check, ChevronDown, ChevronUp, FileText, Lock, ArrowRight, Menu, X, Leaf, Target, Shield, Users, Clock, LayoutDashboard, Zap, Sprout, ShieldAlert, Award } from "lucide-react";
import MarketingNav from "@/components/layout/MarketingNav";

export default function GuildLanding() {
  const [, setLocation] = useLocation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    ranchCompany: "",
    town: "",
    townOther: "",
    phone: "",
    email: "",
    crops: [] as string[],
    acresBand: "",
    role: "",
    peakMonths: [] as string[],
    ranchCount: "",
    needsMultiRanch: "no",
    dailyLogger: "",
    commitPilot: false,
    commitProofPoints: false,
    commitIntroPerMonth: false,
    oneThingToStopDoing: "",
    honeypot: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const scrollToApply = () => {
    document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToKickbacks = () => {
    document.getElementById("kickbacks")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCropToggle = (crop: string) => {
    setFormData(prev => ({
      ...prev,
      crops: prev.crops.includes(crop) 
        ? prev.crops.filter(c => c !== crop)
        : [...prev.crops, crop]
    }));
  };

  const handleMonthToggle = (month: string) => {
    setFormData(prev => ({
      ...prev,
      peakMonths: prev.peakMonths.includes(month)
        ? prev.peakMonths.filter(m => m !== month)
        : [...prev.peakMonths, month]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.honeypot) return; // Anti-spam
    
    setIsSubmitting(true);
    // Mock submission
    setTimeout(() => {
      setIsSubmitting(false);
      setLocation("/guild/thanks");
    }, 1000);
  };

  const faqs = [
    {
      q: "Is this equity?",
      a: "No. Kickbacks are marketing/referral compensation only. You are being compensated for originating real adoption."
    },
    {
      q: "Are you locking me into a supplier or retailer?",
      a: "No. KEBB Ag™ is independent. You use whatever suppliers and PCAs you currently use."
    },
    {
      q: "What data gets shared?",
      a: "Only what you explicitly approve, and it is sanitized/redacted to protect your proprietary operational data."
    },
    {
      q: "How is “net profit” defined?",
      a: "Collected subscription revenue minus direct attributable costs (like onboarding and processing fees)."
    },
    {
      q: "What if someone I refer cancels quickly?",
      a: "Standard clawback/offset applies inside 60 days to prevent gaming the system."
    },
    {
      q: "How much time does this take?",
      a: "Foremen log in seconds from the truck. You commit to 1 intro/month. The goal is saving you time, not adding to your plate."
    },
    {
      q: "Is this only for certain crops?",
      a: "Currently restricted to permanent crops in the Central Valley (Almonds, Pistachios, Walnuts, Citrus, Stone Fruit, Vines)."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#E85D04] selection:text-white">
      <MarketingNav />

      {/* 1) Hero */}
      <section className="pt-40 pb-20 px-6 max-w-6xl mx-auto min-h-[90vh] flex flex-col justify-center">
        <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 rounded-full px-4 py-1.5 mb-8 w-fit">
          <Lock className="w-3.5 h-3.5 text-[#E85D04]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Not public. Not for everyone. Built on proof, not hype.</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
          The Grower's <br/><span className="text-[#E85D04]">Guild</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-400 font-medium max-w-3xl mb-12 leading-relaxed">
          A limited circle of Central Valley operators piloting KEBB Ag™ in-season—then getting paid for the adoption they help originate.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <button onClick={scrollToApply} className="bg-[#E85D04] hover:bg-[#ff6a00] text-white px-8 py-4 rounded font-black uppercase tracking-widest text-sm transition-colors flex items-center justify-center gap-2">
            Request an Invite <ArrowRight className="w-4 h-4" />
          </button>
          <button onClick={scrollToKickbacks} className="bg-transparent border border-white/20 hover:border-white/50 text-white px-8 py-4 rounded font-black uppercase tracking-widest text-sm transition-colors flex items-center justify-center">
            See How Kickbacks Work
          </button>
        </div>

        <div className="border-t border-white/10 pt-8">
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-4">Permanent crops only</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-gray-400">
            <span>Almonds</span>
            <span className="text-gray-700">•</span>
            <span>Pistachios</span>
            <span className="text-gray-700">•</span>
            <span>Walnuts</span>
            <span className="text-gray-700">•</span>
            <span>Citrus</span>
            <span className="text-gray-700">•</span>
            <span>Stone Fruit</span>
            <span className="text-gray-700">•</span>
            <span>Specialty</span>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#E85D04] mt-6">Foreman-first logs → clean packets → real spend visibility</p>
        </div>
      </section>

      {/* 2) The Reality (Problem) */}
      <section id="reality" className="py-24 px-6 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6">The same problems keep costing money</h2>
            <p className="text-lg text-gray-400 leading-relaxed mb-8">
              Most ranches don't have a record problem until they suddenly do. A packer asks. An auditor asks. A buyer asks. Or the office needs to explain why a block blew its budget.
            </p>
            <ul className="space-y-4 mb-8">
              {[
                "Records scattered across trucks, texts, and memory",
                "Substitutions and extra passes quietly inflate spend",
                "Unit mistakes happen—then show up later when it hurts",
                "“We'll find it later” doesn't survive audit week"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-[#E85D04] shrink-0 mt-0.5" />
                  <span className="text-gray-300 font-medium">{item}</span>
                </li>
              ))}
            </ul>
            <div className="p-6 bg-white/5 border border-[#E85D04]/30 rounded-lg">
              <p className="font-bold text-white">The Guild exists to prove a better way—on real ranches, during real pressure.</p>
            </div>
          </div>
          <div className="bg-black border border-white/10 rounded-2xl p-8 relative overflow-hidden h-[500px]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#E85D04]/10 to-transparent"></div>
            <div className="relative z-10 flex flex-col gap-4">
              <div className="bg-[#111113] border border-red-500/30 p-4 rounded-lg shadow-lg transform -rotate-2 opacity-80">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-gray-400">TEXT MESSAGE</span>
                  <span className="text-[10px] text-gray-500">Yesterday 4:32 PM</span>
                </div>
                <p className="text-sm text-gray-200">"Hey did we spray the north 40 with roundup or rely? Office is asking for the packet."</p>
              </div>
              <div className="bg-[#111113] border border-red-500/30 p-4 rounded-lg shadow-lg transform translate-x-8 opacity-90">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-gray-400">PCA EMAIL</span>
                  <span className="text-[10px] text-gray-500">This Morning 9:15 AM</span>
                </div>
                <p className="text-sm text-gray-200">"Looks like they applied 4 gallons instead of 4 quarts on Block 3. We're over budget by $4,200."</p>
              </div>
              <div className="bg-[#111113] border border-red-500/30 p-4 rounded-lg shadow-lg transform -rotate-1 translate-y-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-gray-400">AUDITOR</span>
                  <span className="text-[10px] text-gray-500">Pending</span>
                </div>
                <p className="text-sm text-gray-200">"Missing application records for the gap window between June 12 and July 4. Please advise."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3) What the Guild Is (and isn't) */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-10">
            <div className="flex items-center gap-3 mb-8">
              <Check className="w-8 h-8 text-green-500" />
              <h3 className="text-3xl font-black uppercase tracking-tighter">What this is</h3>
            </div>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2.5"></div>
                <p className="text-gray-300 font-medium text-lg">A small group piloting KEBB Ag™ during the season</p>
              </li>
              <li className="flex gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2.5"></div>
                <p className="text-gray-300 font-medium text-lg">A proof-driven program: time saved, errors caught, packets produced</p>
              </li>
              <li className="flex gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2.5"></div>
                <p className="text-gray-300 font-medium text-lg">A warm-intro distribution engine powered by trusted relationships</p>
              </li>
            </ul>
          </div>
          
          <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-10">
            <div className="flex items-center gap-3 mb-8">
              <X className="w-8 h-8 text-red-500" />
              <h3 className="text-3xl font-black uppercase tracking-tighter">What this isn't</h3>
            </div>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2.5"></div>
                <p className="text-gray-300 font-medium text-lg">Not an influencer program</p>
              </li>
              <li className="flex gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2.5"></div>
                <p className="text-gray-300 font-medium text-lg">Not pay-to-play</p>
              </li>
              <li className="flex gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2.5"></div>
                <p className="text-gray-300 font-medium text-lg">Not a supplier lock-in</p>
              </li>
              <li className="flex gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2.5"></div>
                <p className="text-gray-300 font-medium text-lg">Not "more office work" disguised as tech</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4) How It Works */}
      <section className="py-24 px-6 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Three steps. Real outcomes.</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-black border border-white/10 rounded-xl p-8 relative">
              <div className="text-6xl font-black text-white/5 absolute top-4 right-6">01</div>
              <LayoutDashboard className="w-10 h-10 text-[#E85D04] mb-6 relative z-10" />
              <h3 className="text-xl font-black uppercase tracking-tight mb-4 relative z-10">Pilot in-season</h3>
              <p className="text-gray-400 font-medium relative z-10">
                Foremen log sprays, fertigations, and irrigations at the block level in seconds—right from the truck.
              </p>
            </div>
            
            <div className="bg-black border border-white/10 rounded-xl p-8 relative">
              <div className="text-6xl font-black text-white/5 absolute top-4 right-6">02</div>
              <Target className="w-10 h-10 text-[#E85D04] mb-6 relative z-10" />
              <h3 className="text-xl font-black uppercase tracking-tight mb-4 relative z-10">Produce proof</h3>
              <p className="text-gray-400 font-medium relative z-10">
                Document time saved, fewer mistakes, faster compliance packets, and cost variance caught early.
              </p>
            </div>
            
            <div className="bg-black border border-white/10 rounded-xl p-8 relative">
              <div className="text-6xl font-black text-white/5 absolute top-4 right-6">03</div>
              <Users className="w-10 h-10 text-[#E85D04] mb-6 relative z-10" />
              <h3 className="text-xl font-black uppercase tracking-tight mb-4 relative z-10">Drive adoption</h3>
              <p className="text-gray-400 font-medium relative z-10">
                One warm intro per month—growers, PCAs, retail counters, packer QA circles. Clean tracking. No weirdness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5) What Members Get */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8">Membership has benefits <br/><span className="text-gray-500 text-3xl">(and expectations)</span></h2>
            
            <ul className="space-y-6 mb-10">
              <li className="flex items-start gap-4">
                <Check className="w-6 h-6 text-[#E85D04] shrink-0" />
                <p className="text-lg font-medium text-gray-300">Priority onboarding built around your blocks and crops</p>
              </li>
              <li className="flex items-start gap-4">
                <Check className="w-6 h-6 text-[#E85D04] shrink-0" />
                <p className="text-lg font-medium text-gray-300">Templates tuned for your seasonal reality (not generic software)</p>
              </li>
              <li className="flex items-start gap-4">
                <Check className="w-6 h-6 text-[#E85D04] shrink-0" />
                <p className="text-lg font-medium text-gray-300">Early access to Pro features (cost engine, projections, compliance packets)</p>
              </li>
              <li className="flex items-start gap-4">
                <Check className="w-6 h-6 text-[#E85D04] shrink-0" />
                <p className="text-lg font-medium text-gray-300">A direct line to influence what gets built next</p>
              </li>
              <li className="flex items-start gap-4">
                <Check className="w-6 h-6 text-[#E85D04] shrink-0" />
                <p className="text-lg font-medium text-white">Net-profit kickbacks tied to the business you originate</p>
              </li>
            </ul>
          </div>
          
          <div className="w-full md:w-[400px] shrink-0 bg-[#E85D04] p-8 rounded-2xl shadow-[0_0_50px_rgba(232,93,4,0.2)]">
            <Award className="w-12 h-12 text-white mb-6" />
            <p className="text-2xl font-black uppercase tracking-tight text-white leading-tight">
              Most programs pay you to talk. <br/><br/>This one pays you when adoption sticks.
            </p>
          </div>
        </div>
      </section>

      {/* 6) Kickbacks */}
      <section id="kickbacks" className="py-24 px-6 bg-[#0a0a0a] border-y border-white/5 relative overflow-hidden">
        {/* Abstract background shape */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#E85D04]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="mb-16 max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6">Net-profit kickbacks—kept clean</h2>
            <p className="text-xl text-gray-400 font-medium">
              If you help originate real adoption, you participate in the upside. Kickbacks apply only to guild-sourced accounts—tracked by referral code or recorded intro.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div className="bg-black border border-[#E85D04]/30 rounded-2xl p-10">
              <div className="inline-block bg-[#E85D04]/20 text-[#E85D04] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded mb-6">Option A: Direct</div>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <span className="text-2xl font-black text-[#E85D04]">10%</span>
                  <p className="text-lg font-medium text-gray-300 pt-1">of net profit from the accounts you originate</p>
                </li>
                <li className="flex gap-4">
                  <Clock className="w-6 h-6 text-gray-500" />
                  <p className="text-lg font-medium text-gray-300">Paid quarterly</p>
                </li>
                <li className="flex gap-4">
                  <Shield className="w-6 h-6 text-gray-500" />
                  <p className="text-lg font-medium text-gray-300">Applies for 24 months per referred account</p>
                </li>
              </ul>
            </div>
            
            <div className="bg-black border border-white/10 rounded-2xl p-10">
              <div className="inline-block bg-white/10 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded mb-6">Option B: Pooled</div>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <span className="text-2xl font-black text-white">Pool</span>
                  <p className="text-lg font-medium text-gray-300 pt-1">Quarterly pool equal to 10% of subscription net profit</p>
                </li>
                <li className="flex gap-4">
                  <Users className="w-6 h-6 text-gray-500" />
                  <p className="text-lg font-medium text-gray-300">Distributed by contribution points (intros, closes, case studies, demos)</p>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-xs text-gray-500 max-w-2xl font-medium">
              Caps may apply early. If churn occurs inside 60 days, clawback/offset applies. No exclusivity. No forced purchasing.
            </p>
            <button onClick={() => window.alert('Term sheet document will download here')} className="border border-white/20 hover:border-white/50 text-white px-6 py-3 rounded font-bold uppercase tracking-widest text-xs transition-colors whitespace-nowrap">
              Download Term Sheet
            </button>
          </div>
        </div>
      </section>

      {/* 7) Proof */}
      <section id="proof" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6">Proof the Valley respects</h2>
            <p className="text-xl text-gray-400 font-medium">
              We don't do vague testimonials. We track measurable outcomes that matter to operations.
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-black hover:bg-gray-200 px-6 py-3 rounded font-black uppercase tracking-widest text-xs transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <FileText className="w-4 h-4" /> See a Redacted Packet
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#111113] border border-white/5 p-6 rounded-xl text-center">
            <div className="text-4xl font-black text-white mb-2">12+</div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Hours saved per week <br/><span className="text-[9px]">(logging + compliance)</span></p>
          </div>
          <div className="bg-[#111113] border border-white/5 p-6 rounded-xl text-center">
            <div className="text-4xl font-black text-red-400 mb-2">100%</div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Errors caught <br/><span className="text-[9px]">(unit mismatches)</span></p>
          </div>
          <div className="bg-[#111113] border border-white/5 p-6 rounded-xl text-center">
            <div className="text-4xl font-black text-green-400 mb-2">2 min</div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Compliance turnaround <br/><span className="text-[9px]">(clean packet generation)</span></p>
          </div>
          <div className="bg-[#111113] border border-white/5 p-6 rounded-xl text-center">
            <div className="text-4xl font-black text-[#E85D04] mb-2">$0</div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Cost variance <br/><span className="text-[9px]">(caught early vs end-of-season)</span></p>
          </div>
        </div>
      </section>

      {/* 8) Who It's For */}
      <section className="py-24 px-6 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#E85D04] rounded-2xl p-10 md:p-16">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-4xl font-black uppercase tracking-tighter text-white mb-6">Who gets invited</h2>
                <p className="text-xl text-white/90 font-medium mb-8">
                  We're keeping this small on purpose. The Guild is for operators who will actually run it in-season and contribute proof.
                </p>
                
                <div className="inline-block bg-black/20 backdrop-blur border border-black/10 px-4 py-2 rounded-lg mb-8">
                  <p className="font-black text-white uppercase tracking-wider text-sm">
                    🔒 20 Seats Total
                  </p>
                  <p className="text-xs text-white/80 font-medium mt-1">Mixed commodity makeup. Renewed by contribution and conduct.</p>
                </div>
              </div>
              
              <div>
                <ul className="space-y-6 bg-black/10 p-8 rounded-xl border border-white/10">
                  <li className="flex items-start gap-4">
                    <Leaf className="w-6 h-6 text-black shrink-0" />
                    <p className="text-lg font-bold text-white">Permanent-crop operations in the Central Valley</p>
                  </li>
                  <li className="flex items-start gap-4">
                    <Clock className="w-6 h-6 text-black shrink-0" />
                    <p className="text-lg font-bold text-white">Pilot one season or 8–12 peak weeks</p>
                  </li>
                  <li className="flex items-start gap-4">
                    <Target className="w-6 h-6 text-black shrink-0" />
                    <p className="text-lg font-bold text-white">Provide two measurable proof points</p>
                  </li>
                  <li className="flex items-start gap-4">
                    <Users className="w-6 h-6 text-black shrink-0" />
                    <p className="text-lg font-bold text-white">Commit to one intro per month (grower/PCA/retail/QA)</p>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-white/20 text-center">
              <p className="text-xs font-black uppercase tracking-widest text-black/60 mb-3">Target Regions</p>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm font-bold text-white/90">
                <span>Kingsburg</span><span>·</span>
                <span>Reedley</span><span>·</span>
                <span>Traver</span><span>·</span>
                <span>Fowler</span><span>·</span>
                <span>Visalia</span><span>·</span>
                <span>Hanford</span><span>·</span>
                <span>Tulare</span><span>·</span>
                <span>Madera</span><span>·</span>
                <span>Fresno</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9) Distribution Lanes */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Built for how ag actually moves</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#111113] border border-white/5 p-8 rounded-xl hover:border-white/20 transition-colors">
            <h3 className="text-xl font-black uppercase tracking-tight mb-4 text-[#E85D04]">PCA Lane</h3>
            <p className="text-gray-400 font-medium text-sm">
              View access + program approval state = cleaner continuity and fewer chaotic calls.
            </p>
          </div>
          <div className="bg-[#111113] border border-white/5 p-8 rounded-xl hover:border-white/20 transition-colors">
            <h3 className="text-xl font-black uppercase tracking-tight mb-4 text-[#E85D04]">Retail Counter Lane</h3>
            <p className="text-gray-400 font-medium text-sm">
              QR starter packs + bundled onboarding through trusted dealers.
            </p>
          </div>
          <div className="bg-[#111113] border border-white/5 p-8 rounded-xl hover:border-white/20 transition-colors">
            <h3 className="text-xl font-black uppercase tracking-tight mb-4 text-[#E85D04]">Packer/Compliance Lane</h3>
            <p className="text-gray-400 font-medium text-sm">
              Weekly packet + season vault = audit readiness without scrambling.
            </p>
          </div>
          <div className="bg-[#111113] border border-white/5 p-8 rounded-xl hover:border-white/20 transition-colors">
            <h3 className="text-xl font-black uppercase tracking-tight mb-4 text-[#E85D04]">Irrigation/Service Lane</h3>
            <p className="text-gray-400 font-medium text-sm">
              Irrigation + fertigation records that crews can't quietly drift.
            </p>
          </div>
        </div>
      </section>

      {/* 10) FAQ Accordion */}
      <section className="py-24 px-6 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-10 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-white/10 rounded-lg overflow-hidden bg-black">
                <button 
                  className="w-full px-6 py-4 flex justify-between items-center text-left font-bold text-white hover:text-[#E85D04] transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {faq.q}
                  {openFaq === i ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 pt-0 text-gray-400 font-medium text-sm leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11) Apply (Form) */}
      <section id="apply" className="py-24 px-6 max-w-4xl mx-auto">
        <div className="bg-[#111113] border border-[#E85D04]/30 rounded-2xl p-8 md:p-12 shadow-[0_0_30px_rgba(232,93,4,0.05)]">
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Request an Invite</h2>
            <p className="text-gray-400 font-medium">Tell us what you run. If there's fit and seat availability, we'll reach out.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Hidden honeypot field for anti-spam */}
            <input 
              type="text" 
              name="honeypot" 
              style={{ display: 'none' }} 
              value={formData.honeypot}
              onChange={e => setFormData({...formData, honeypot: e.target.value})}
              tabIndex={-1} 
              autoComplete="off" 
            />

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Name *</label>
                <input 
                  required 
                  minLength={2} 
                  maxLength={80}
                  className="w-full bg-black border border-white/10 rounded px-4 py-3 text-white focus:border-[#E85D04] focus:outline-none transition-colors" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Ranch / Company *</label>
                <input 
                  required 
                  minLength={2} 
                  maxLength={120}
                  className="w-full bg-black border border-white/10 rounded px-4 py-3 text-white focus:border-[#E85D04] focus:outline-none transition-colors" 
                  value={formData.ranchCompany}
                  onChange={e => setFormData({...formData, ranchCompany: e.target.value})}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Town *</label>
                <select 
                  required
                  className="w-full bg-black border border-white/10 rounded px-4 py-3 text-white focus:border-[#E85D04] focus:outline-none transition-colors appearance-none"
                  value={formData.town}
                  onChange={e => setFormData({...formData, town: e.target.value})}
                >
                  <option value="">Select a town...</option>
                  <option value="Kingsburg">Kingsburg</option>
                  <option value="Reedley">Reedley</option>
                  <option value="Traver">Traver</option>
                  <option value="Fowler">Fowler</option>
                  <option value="Visalia">Visalia</option>
                  <option value="Hanford">Hanford</option>
                  <option value="Tulare">Tulare</option>
                  <option value="Madera">Madera</option>
                  <option value="Fresno">Fresno</option>
                  <option value="Other">Other</option>
                </select>
                {formData.town === "Other" && (
                  <input 
                    required
                    placeholder="Specify town"
                    className="w-full bg-black border border-white/10 rounded px-4 py-3 text-white focus:border-[#E85D04] focus:outline-none transition-colors mt-2" 
                    value={formData.townOther}
                    onChange={e => setFormData({...formData, townOther: e.target.value})}
                  />
                )}
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Role *</label>
                <select 
                  required
                  className="w-full bg-black border border-white/10 rounded px-4 py-3 text-white focus:border-[#E85D04] focus:outline-none transition-colors appearance-none"
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                >
                  <option value="">Select role...</option>
                  <option value="Owner">Owner</option>
                  <option value="Ranch Manager">Ranch Manager</option>
                  <option value="Foreman">Foreman</option>
                  <option value="PCA">PCA</option>
                  <option value="Office">Office / Admin</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email *</label>
                <input 
                  required 
                  type="email"
                  className="w-full bg-black border border-white/10 rounded px-4 py-3 text-white focus:border-[#E85D04] focus:outline-none transition-colors" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Phone *</label>
                <input 
                  required 
                  type="tel"
                  className="w-full bg-black border border-white/10 rounded px-4 py-3 text-white focus:border-[#E85D04] focus:outline-none transition-colors" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            <div className="border-t border-white/10 pt-8">
              <h3 className="text-xl font-black uppercase tracking-tight mb-6">Operation Details</h3>
              
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Crops (Select all that apply) *</label>
                <div className="flex flex-wrap gap-3">
                  {["Almonds", "Pistachios", "Walnuts", "Citrus", "Stone Fruit", "Vines", "Other"].map(crop => (
                    <button
                      key={crop}
                      type="button"
                      onClick={() => handleCropToggle(crop)}
                      className={`px-4 py-2 rounded-full text-sm font-bold transition-colors border ${
                        formData.crops.includes(crop) 
                          ? 'bg-[#E85D04] border-[#E85D04] text-white' 
                          : 'bg-black border-white/20 text-gray-400 hover:border-white/50'
                      }`}
                    >
                      {crop}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Acres Under Management *</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {["0-49", "50-199", "200-499", "500-999", "1000+"].map(band => (
                    <button
                      key={band}
                      type="button"
                      onClick={() => setFormData({...formData, acresBand: band})}
                      className={`px-3 py-2 rounded text-sm font-bold transition-colors border text-center ${
                        formData.acresBand === band 
                          ? 'bg-white text-black border-white' 
                          : 'bg-black border-white/20 text-gray-400 hover:border-white/50'
                      }`}
                    >
                      {band}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Number of Ranches/Locations</label>
                  <select 
                    className="w-full bg-black border border-white/10 rounded px-4 py-3 text-white focus:border-[#E85D04] focus:outline-none transition-colors appearance-none"
                    value={formData.ranchCount}
                    onChange={e => setFormData({...formData, ranchCount: e.target.value})}
                  >
                    <option value="">Select...</option>
                    <option value="1">1</option>
                    <option value="2-3">2-3</option>
                    <option value="4+">4+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Who will log daily? (Title/Role)</label>
                  <input 
                    className="w-full bg-black border border-white/10 rounded px-4 py-3 text-white focus:border-[#E85D04] focus:outline-none transition-colors" 
                    value={formData.dailyLogger}
                    onChange={e => setFormData({...formData, dailyLogger: e.target.value})}
                    placeholder="e.g. Foreman, Me, Tractor Driver"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-8">
              <h3 className="text-xl font-black uppercase tracking-tight mb-6">Pilot Readiness</h3>
              
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Expected Peak Months (Select 1+)</label>
                <div className="flex flex-wrap gap-2">
                  {["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"].map(month => (
                    <button
                      key={month}
                      type="button"
                      onClick={() => handleMonthToggle(month)}
                      className={`px-3 py-1.5 rounded text-xs font-bold transition-colors border ${
                        formData.peakMonths.includes(month) 
                          ? 'bg-white text-black border-white' 
                          : 'bg-black border-white/20 text-gray-400 hover:border-white/50'
                      }`}
                    >
                      {month}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-6 h-6 shrink-0 mt-0.5">
                    <input 
                      type="checkbox" 
                      required
                      className="peer sr-only"
                      checked={formData.commitPilot}
                      onChange={e => setFormData({...formData, commitPilot: e.target.checked})}
                    />
                    <div className="w-6 h-6 border-2 border-white/20 rounded peer-checked:bg-[#E85D04] peer-checked:border-[#E85D04] transition-colors"></div>
                    <Check className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-gray-300 font-medium select-none group-hover:text-white transition-colors">I can pilot the app for 8–12 weeks (or a full season) *</span>
                </label>
                
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-6 h-6 shrink-0 mt-0.5">
                    <input 
                      type="checkbox" 
                      required
                      className="peer sr-only"
                      checked={formData.commitProofPoints}
                      onChange={e => setFormData({...formData, commitProofPoints: e.target.checked})}
                    />
                    <div className="w-6 h-6 border-2 border-white/20 rounded peer-checked:bg-[#E85D04] peer-checked:border-[#E85D04] transition-colors"></div>
                    <Check className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-gray-300 font-medium select-none group-hover:text-white transition-colors">I can provide at least 2 measurable proof points (e.g. hours saved) *</span>
                </label>
                
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-6 h-6 shrink-0 mt-0.5">
                    <input 
                      type="checkbox" 
                      required
                      className="peer sr-only"
                      checked={formData.commitIntroPerMonth}
                      onChange={e => setFormData({...formData, commitIntroPerMonth: e.target.checked})}
                    />
                    <div className="w-6 h-6 border-2 border-white/20 rounded peer-checked:bg-[#E85D04] peer-checked:border-[#E85D04] transition-colors"></div>
                    <Check className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-gray-300 font-medium select-none group-hover:text-white transition-colors">I commit to making 1 intro per month to my network *</span>
                </label>
              </div>

              <div className="mb-8">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">What's the one thing you'd love to stop doing every week?</label>
                <textarea 
                  rows={3}
                  maxLength={180}
                  className="w-full bg-black border border-white/10 rounded px-4 py-3 text-white focus:border-[#E85D04] focus:outline-none transition-colors resize-none" 
                  value={formData.oneThingToStopDoing}
                  onChange={e => setFormData({...formData, oneThingToStopDoing: e.target.value})}
                  placeholder="e.g. Calling the foreman at 6PM to figure out what block got sprayed."
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting || formData.crops.length === 0}
                className="w-full bg-[#E85D04] hover:bg-[#ff6a00] text-white py-4 rounded font-black uppercase tracking-widest text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center font-black text-white text-xs">K</div>
            <span className="font-black tracking-tighter text-lg uppercase text-white/50">KEBB Ag™</span>
          </div>
          
          <p className="text-xs text-gray-600 mb-6 max-w-2xl mx-auto">
            Kickbacks subject to signed Guild Participation Agreement. Terms, eligibility, caps, and clawback provisions apply.
          </p>
          
          <div className="flex justify-center gap-6 text-xs font-bold uppercase tracking-widest text-gray-500">
            <button className="hover:text-white transition-colors">Privacy</button>
            <button className="hover:text-white transition-colors">Term Sheet</button>
            <a href="mailto:hello@kebbag.com" className="hover:text-white transition-colors">Contact</a>
          </div>
          <div className="mt-8">
            <Link href="/app" className="text-xs font-bold text-[#E85D04] hover:underline">Go to Application Prototype (Demo)</Link>
          </div>
        </div>
      </footer>

      {/* Redacted Packet Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-[#111113] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black">
              <h3 className="font-black uppercase tracking-tight text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#E85D04]" /> Sample Compliance Packet
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-[#0a0a0a]">
              <div className="bg-white p-8 rounded shadow-sm min-h-[500px] text-black">
                <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-end">
                  <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter">Weekly Application Report</h1>
                    <p className="font-bold text-gray-500">████████ Farms</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">Week of: May 12 - May 18, 2026</p>
                    <p className="text-sm text-gray-500">Generated by KEBB Ag</p>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h2 className="text-lg font-black uppercase tracking-tight bg-gray-200 px-3 py-1 mb-3">Block: North 40 (██████ Almonds)</h2>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-300">
                        <th className="text-left py-2">Date</th>
                        <th className="text-left py-2">Material</th>
                        <th className="text-right py-2">Rate/Ac</th>
                        <th className="text-right py-2">Total Applied</th>
                        <th className="text-left py-2 pl-4">Operator</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-3">05/12/26</td>
                        <td className="py-3 font-bold">Roundup PowerMAX</td>
                        <td className="text-right py-3">2.0 qt</td>
                        <td className="text-right py-3">80.0 qt</td>
                        <td className="pl-4 py-3">████████</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3">05/12/26</td>
                        <td className="py-3 font-bold">GoalTender</td>
                        <td className="text-right py-3">1.5 pt</td>
                        <td className="text-right py-3">60.0 pt</td>
                        <td className="pl-4 py-3">████████</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mb-8">
                  <h2 className="text-lg font-black uppercase tracking-tight bg-gray-200 px-3 py-1 mb-3">Block: River Bottom (██████ Walnuts)</h2>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-300">
                        <th className="text-left py-2">Date</th>
                        <th className="text-left py-2">Material</th>
                        <th className="text-right py-2">Rate/Ac</th>
                        <th className="text-right py-2">Total Applied</th>
                        <th className="text-left py-2 pl-4">Operator</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-3">05/14/26</td>
                        <td className="py-3 font-bold">UAN 32% (Fertigation)</td>
                        <td className="text-right py-3">15.0 gal</td>
                        <td className="text-right py-3">300.0 gal</td>
                        <td className="pl-4 py-3">████████</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-12 text-center p-4 bg-gray-100 rounded text-sm text-gray-600 font-bold">
                  All fields redacted to protect operational data. Real packets include EPA #s, REI, and PHI data automatically.
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-white/10 bg-black flex justify-end">
              <button onClick={() => setIsModalOpen(false)} className="bg-[#E85D04] text-white px-6 py-2 rounded font-black uppercase tracking-widest text-xs">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
