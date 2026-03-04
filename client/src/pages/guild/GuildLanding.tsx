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
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      <MarketingNav />

      {/* 1) Hero */}
      <section className="pt-32 md:pt-40 pb-16 md:pb-20 px-4 md:px-6 max-w-6xl mx-auto min-h-[85vh] flex flex-col justify-center">
        <div className="inline-flex items-center gap-2 border border-border bg-white/5 rounded-full px-3 md:px-4 py-1.5 mb-6 md:mb-8 w-fit">
          <Lock className="w-3 md:w-3.5 h-3 md:h-3.5 text-primary" />
          <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Not public. Not for everyone. Built on proof, not hype.</span>
        </div>
        
        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-6 md:mb-8 text-foreground">
          The Grower's <br/><span className="text-primary">Guild</span>
        </h1>
        
        <p className="text-lg md:text-2xl text-muted-foreground font-medium max-w-3xl mb-10 md:mb-12 leading-relaxed">
          A limited circle of Central Valley operators piloting KEBB Ag™ in-season—then getting paid for the adoption they help originate.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-12 md:mb-16">
          <button onClick={scrollToApply} className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 md:px-8 py-4 rounded font-black uppercase tracking-widest text-sm transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.4)] w-full sm:w-auto">
            Request an Invite <ArrowRight className="w-4 h-4" />
          </button>
          <button onClick={scrollToKickbacks} className="bg-transparent border border-primary/50 hover:bg-primary/10 text-primary px-6 md:px-8 py-4 rounded font-black uppercase tracking-widest text-sm transition-colors flex items-center justify-center w-full sm:w-auto">
            See How Kickbacks Work
          </button>
        </div>

        <div className="border-t border-border pt-8">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/50 mb-4">Permanent crops only</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-muted-foreground">
            <span>Almonds</span>
            <span className="text-muted-foreground/30">•</span>
            <span>Pistachios</span>
            <span className="text-muted-foreground/30">•</span>
            <span>Walnuts</span>
            <span className="text-muted-foreground/30">•</span>
            <span>Citrus</span>
            <span className="text-muted-foreground/30">•</span>
            <span>Stone Fruit</span>
            <span className="text-muted-foreground/30">•</span>
            <span>Specialty</span>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary mt-6">Foreman-first logs → clean packets → real spend visibility</p>
        </div>
      </section>

      {/* 2) The Reality (Problem) */}
      <section id="reality" className="py-16 md:py-24 px-4 md:px-6 bg-card border-y border-border">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4 md:mb-6 text-foreground">The same problems keep costing money</h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6 md:mb-8">
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
                  <ShieldAlert className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground font-medium text-sm md:text-base">{item}</span>
                </li>
              ))}
            </ul>
            <div className="p-4 md:p-6 bg-primary/10 border border-primary/30 rounded-lg">
              <p className="font-bold text-foreground text-sm md:text-base">The Guild exists to prove a better way—on real ranches, during real pressure.</p>
            </div>
          </div>
          <div className="bg-background border border-border rounded-2xl p-4 md:p-8 relative overflow-hidden h-[400px] md:h-[500px] shadow-2xl order-1 md:order-2">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
            <div className="relative z-10 flex flex-col gap-4">
              <div className="bg-card border border-red-500/30 p-3 md:p-4 rounded-lg shadow-lg transform -rotate-2 opacity-80">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] md:text-xs font-bold text-muted-foreground">TEXT MESSAGE</span>
                  <span className="text-[9px] md:text-[10px] text-muted-foreground">Yesterday 4:32 PM</span>
                </div>
                <p className="text-xs md:text-sm text-gray-200">"Hey did we spray the north 40 with roundup or rely? Office is asking for the packet."</p>
              </div>
              <div className="bg-card border border-red-500/30 p-3 md:p-4 rounded-lg shadow-lg transform translate-x-4 md:translate-x-8 opacity-90">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] md:text-xs font-bold text-muted-foreground">PCA EMAIL</span>
                  <span className="text-[9px] md:text-[10px] text-muted-foreground">This Morning 9:15 AM</span>
                </div>
                <p className="text-xs md:text-sm text-gray-200">"Looks like they applied 4 gallons instead of 4 quarts on Block 3. We're over budget by $4,200."</p>
              </div>
              <div className="bg-card border border-red-500/30 p-3 md:p-4 rounded-lg shadow-lg transform -rotate-1 translate-y-2 md:translate-y-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] md:text-xs font-bold text-muted-foreground">AUDITOR</span>
                  <span className="text-[9px] md:text-[10px] text-muted-foreground">Pending</span>
                </div>
                <p className="text-xs md:text-sm text-gray-200">"Missing application records for the gap window between June 12 and July 4. Please advise."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3) What the Guild Is (and isn't) */}
      <section className="py-16 md:py-24 px-4 md:px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="bg-white/5 border border-border rounded-2xl p-6 md:p-10">
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <Check className="w-6 h-6 md:w-8 md:h-8 text-green-500" />
              <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">What this is</h3>
            </div>
            <ul className="space-y-4 md:space-y-6">
              <li className="flex gap-3 md:gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2"></div>
                <p className="text-muted-foreground font-medium text-base md:text-lg leading-snug">A small group piloting KEBB Ag™ during the season</p>
              </li>
              <li className="flex gap-3 md:gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2"></div>
                <p className="text-muted-foreground font-medium text-base md:text-lg leading-snug">A proof-driven program: time saved, errors caught, packets produced</p>
              </li>
              <li className="flex gap-3 md:gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2"></div>
                <p className="text-muted-foreground font-medium text-base md:text-lg leading-snug">A warm-intro distribution engine powered by trusted relationships</p>
              </li>
            </ul>
          </div>
          
          <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6 md:p-10">
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <X className="w-6 h-6 md:w-8 md:h-8 text-red-500" />
              <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">What this isn't</h3>
            </div>
            <ul className="space-y-4 md:space-y-6">
              <li className="flex gap-3 md:gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2"></div>
                <p className="text-muted-foreground font-medium text-base md:text-lg leading-snug">Not an influencer program</p>
              </li>
              <li className="flex gap-3 md:gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2"></div>
                <p className="text-muted-foreground font-medium text-base md:text-lg leading-snug">Not pay-to-play</p>
              </li>
              <li className="flex gap-3 md:gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2"></div>
                <p className="text-muted-foreground font-medium text-base md:text-lg leading-snug">Not a supplier lock-in</p>
              </li>
              <li className="flex gap-3 md:gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2"></div>
                <p className="text-muted-foreground font-medium text-base md:text-lg leading-snug">Not "more office work" disguised as tech</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4) How It Works */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-card border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-foreground">Three steps. Real outcomes.</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-background border border-border rounded-xl p-6 md:p-8 relative shadow-lg">
              <div className="text-5xl md:text-6xl font-black text-muted/20 absolute top-4 right-6">01</div>
              <LayoutDashboard className="w-8 h-8 md:w-10 md:h-10 text-primary mb-4 md:mb-6 relative z-10" />
              <h3 className="text-lg md:text-xl font-black uppercase tracking-tight mb-3 md:mb-4 relative z-10 text-foreground">Pilot in-season</h3>
              <p className="text-sm md:text-base text-muted-foreground font-medium relative z-10">
                Foremen log sprays, fertigations, and irrigations at the block level in seconds—right from the truck.
              </p>
            </div>
            
            <div className="bg-background border border-border rounded-xl p-6 md:p-8 relative shadow-lg">
              <div className="text-5xl md:text-6xl font-black text-muted/20 absolute top-4 right-6">02</div>
              <Target className="w-8 h-8 md:w-10 md:h-10 text-primary mb-4 md:mb-6 relative z-10" />
              <h3 className="text-lg md:text-xl font-black uppercase tracking-tight mb-3 md:mb-4 relative z-10 text-foreground">Produce proof</h3>
              <p className="text-sm md:text-base text-muted-foreground font-medium relative z-10">
                Document time saved, fewer mistakes, faster compliance packets, and cost variance caught early.
              </p>
            </div>
            
            <div className="bg-background border border-border rounded-xl p-6 md:p-8 relative shadow-lg">
              <div className="text-5xl md:text-6xl font-black text-muted/20 absolute top-4 right-6">03</div>
              <Users className="w-8 h-8 md:w-10 md:h-10 text-primary mb-4 md:mb-6 relative z-10" />
              <h3 className="text-lg md:text-xl font-black uppercase tracking-tight mb-3 md:mb-4 relative z-10 text-foreground">Drive adoption</h3>
              <p className="text-sm md:text-base text-muted-foreground font-medium relative z-10">
                One warm intro per month—growers, PCAs, retail counters, packer QA circles. Clean tracking. No weirdness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5) What Members Get */}
      <section className="py-16 md:py-24 px-4 md:px-6 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
          <div className="flex-1 w-full">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6 md:mb-8 leading-tight">
              Membership has benefits <br className="hidden md:block"/><span className="text-muted-foreground text-2xl md:text-3xl">(and expectations)</span>
            </h2>
            
            <ul className="space-y-4 md:space-y-6 mb-8 md:mb-10">
              <li className="flex items-start gap-3 md:gap-4">
                <Check className="w-5 h-5 md:w-6 md:h-6 text-primary shrink-0 mt-0.5" />
                <p className="text-base md:text-lg font-medium text-muted-foreground">Priority onboarding built around your blocks and crops</p>
              </li>
              <li className="flex items-start gap-3 md:gap-4">
                <Check className="w-5 h-5 md:w-6 md:h-6 text-primary shrink-0 mt-0.5" />
                <p className="text-base md:text-lg font-medium text-muted-foreground">Templates tuned for your seasonal reality (not generic software)</p>
              </li>
              <li className="flex items-start gap-3 md:gap-4">
                <Check className="w-5 h-5 md:w-6 md:h-6 text-primary shrink-0 mt-0.5" />
                <p className="text-base md:text-lg font-medium text-muted-foreground">Early access to Pro features (cost engine, projections, compliance packets)</p>
              </li>
              <li className="flex items-start gap-3 md:gap-4">
                <Check className="w-5 h-5 md:w-6 md:h-6 text-primary shrink-0 mt-0.5" />
                <p className="text-base md:text-lg font-medium text-muted-foreground">A direct line to influence what gets built next</p>
              </li>
              <li className="flex items-start gap-3 md:gap-4">
                <Check className="w-5 h-5 md:w-6 md:h-6 text-primary shrink-0 mt-0.5" />
                <p className="text-base md:text-lg font-medium text-foreground">Net-profit kickbacks tied to the business you originate</p>
              </li>
            </ul>
          </div>
          
          <div className="w-full lg:w-[400px] shrink-0 bg-primary p-6 md:p-8 rounded-2xl shadow-[0_0_50px_rgba(232,93,4,0.2)]">
            <Award className="w-10 h-10 md:w-12 md:h-12 text-primary-foreground mb-4 md:mb-6" />
            <p className="text-xl md:text-2xl font-black uppercase tracking-tight text-primary-foreground leading-tight">
              Most programs pay you to talk. <br/><br/>This one pays you when adoption sticks.
            </p>
          </div>
        </div>
      </section>

      {/* 6) Kickbacks */}
      <section id="kickbacks" className="py-16 md:py-24 px-4 md:px-6 bg-card border-y border-border relative overflow-hidden">
        {/* Abstract background shape */}
        <div className="absolute top-0 right-0 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-primary/5 rounded-full blur-[50px] md:blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="mb-10 md:mb-16 max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4 md:mb-6">Net-profit kickbacks—kept clean</h2>
            <p className="text-lg md:text-xl text-muted-foreground font-medium">
              If you help originate real adoption, you participate in the upside. Kickbacks apply only to guild-sourced accounts—tracked by referral code or recorded intro.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-10">
            <div className="bg-background border border-primary/30 rounded-2xl p-6 md:p-10">
              <div className="inline-block bg-primary/20 text-primary text-[10px] md:text-xs font-bold uppercase tracking-widest px-3 py-1 rounded mb-4 md:mb-6">Option A: Direct</div>
              <ul className="space-y-4 md:space-y-6">
                <li className="flex gap-3 md:gap-4">
                  <span className="text-2xl font-black text-primary">10%</span>
                  <p className="text-base md:text-lg font-medium text-muted-foreground pt-1">of net profit from the accounts you originate</p>
                </li>
                <li className="flex gap-3 md:gap-4">
                  <Clock className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground shrink-0" />
                  <p className="text-base md:text-lg font-medium text-muted-foreground">Paid quarterly</p>
                </li>
                <li className="flex gap-3 md:gap-4">
                  <Shield className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground shrink-0" />
                  <p className="text-base md:text-lg font-medium text-muted-foreground">Applies for 24 months per referred account</p>
                </li>
              </ul>
            </div>
            
            <div className="bg-background border border-border rounded-2xl p-6 md:p-10">
              <div className="inline-block bg-white/10 text-foreground text-[10px] md:text-xs font-bold uppercase tracking-widest px-3 py-1 rounded mb-4 md:mb-6">Option B: Pooled</div>
              <ul className="space-y-4 md:space-y-6">
                <li className="flex gap-3 md:gap-4">
                  <span className="text-2xl font-black text-foreground">Pool</span>
                  <p className="text-base md:text-lg font-medium text-muted-foreground pt-1">Quarterly pool equal to 10% of subscription net profit</p>
                </li>
                <li className="flex gap-3 md:gap-4">
                  <Users className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground shrink-0" />
                  <p className="text-base md:text-lg font-medium text-muted-foreground">Distributed by contribution points (intros, closes, case studies, demos)</p>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <p className="text-[10px] md:text-xs text-muted-foreground max-w-2xl font-medium">
              Caps may apply early. If churn occurs inside 60 days, clawback/offset applies. No exclusivity. No forced purchasing.
            </p>
            <button onClick={() => window.alert('Term sheet document will download here')} className="w-full md:w-auto border border-white/20 hover:border-border text-foreground px-6 py-3 rounded font-bold uppercase tracking-widest text-xs transition-colors whitespace-nowrap text-center">
              Download Term Sheet
            </button>
          </div>
        </div>
      </section>

      {/* 7) Proof */}
      <section id="proof" className="py-16 md:py-24 px-4 md:px-6 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 md:gap-8 mb-10 md:mb-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4 md:mb-6">Proof the Valley respects</h2>
            <p className="text-base md:text-xl text-muted-foreground font-medium">
              We don't do vague testimonials. We track measurable outcomes that matter to operations.
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto bg-white text-black hover:bg-gray-200 px-6 py-4 md:py-3 rounded font-black uppercase tracking-widest text-xs transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <FileText className="w-4 h-4" /> See a Redacted Packet
          </button>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-card border border-border p-4 md:p-6 rounded-xl text-center">
            <div className="text-3xl md:text-4xl font-black text-foreground mb-1 md:mb-2">12+</div>
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground leading-tight">Hours saved per week <br/><span className="text-[8px] md:text-[9px] opacity-70">(logging + compliance)</span></p>
          </div>
          <div className="bg-card border border-border p-4 md:p-6 rounded-xl text-center">
            <div className="text-3xl md:text-4xl font-black text-red-400 mb-1 md:mb-2">100%</div>
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground leading-tight">Errors caught <br/><span className="text-[8px] md:text-[9px] opacity-70">(unit mismatches)</span></p>
          </div>
          <div className="bg-card border border-border p-4 md:p-6 rounded-xl text-center">
            <div className="text-3xl md:text-4xl font-black text-green-400 mb-1 md:mb-2">2 min</div>
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground leading-tight">Compliance turnaround <br/><span className="text-[8px] md:text-[9px] opacity-70">(clean packet generation)</span></p>
          </div>
          <div className="bg-card border border-border p-4 md:p-6 rounded-xl text-center">
            <div className="text-3xl md:text-4xl font-black text-primary mb-1 md:mb-2">$0</div>
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground leading-tight">Cost variance <br/><span className="text-[8px] md:text-[9px] opacity-70">(caught early vs end-of-season)</span></p>
          </div>
        </div>
      </section>

      {/* 8) Who It's For */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-[#0a0a0a] border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="bg-primary rounded-2xl p-6 md:p-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-primary-foreground mb-4 md:mb-6">Who gets invited</h2>
                <p className="text-base md:text-xl text-primary-foreground/90 font-medium mb-6 md:mb-8">
                  We're keeping this small on purpose. The Guild is for operators who will actually run it in-season and contribute proof.
                </p>
                
                <div className="inline-block bg-background/20 backdrop-blur border border-black/10 px-3 md:px-4 py-2 rounded-lg mb-8">
                  <p className="font-black text-primary-foreground uppercase tracking-wider text-xs md:text-sm">
                    🔒 20 Seats Total
                  </p>
                  <p className="text-[10px] md:text-xs text-primary-foreground/80 font-medium mt-1">Mixed commodity makeup. Renewed by contribution and conduct.</p>
                </div>
              </div>
              
              <div>
                <ul className="space-y-4 md:space-y-6 bg-background/10 p-5 md:p-8 rounded-xl border border-border">
                  <li className="flex items-start gap-3 md:gap-4">
                    <Leaf className="w-5 h-5 md:w-6 md:h-6 text-black shrink-0 mt-0.5" />
                    <p className="text-base md:text-lg font-bold text-primary-foreground">Permanent-crop operations in the Central Valley</p>
                  </li>
                  <li className="flex items-start gap-3 md:gap-4">
                    <Clock className="w-5 h-5 md:w-6 md:h-6 text-black shrink-0 mt-0.5" />
                    <p className="text-base md:text-lg font-bold text-primary-foreground">Pilot one season or 8–12 peak weeks</p>
                  </li>
                  <li className="flex items-start gap-3 md:gap-4">
                    <Target className="w-5 h-5 md:w-6 md:h-6 text-black shrink-0 mt-0.5" />
                    <p className="text-base md:text-lg font-bold text-primary-foreground">Provide two measurable proof points</p>
                  </li>
                  <li className="flex items-start gap-3 md:gap-4">
                    <Users className="w-5 h-5 md:w-6 md:h-6 text-black shrink-0 mt-0.5" />
                    <p className="text-base md:text-lg font-bold text-primary-foreground">Commit to one intro per month (grower/PCA/retail/QA)</p>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-10 md:mt-12 pt-6 md:pt-8 border-t border-white/20 text-center">
              <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-black/60 mb-3">Target Regions</p>
              <div className="flex flex-wrap justify-center gap-x-3 md:gap-x-4 gap-y-2 text-xs md:text-sm font-bold text-primary-foreground/90">
                <span>Kingsburg</span><span className="hidden sm:inline">·</span>
                <span>Reedley</span><span className="hidden sm:inline">·</span>
                <span>Traver</span><span className="hidden sm:inline">·</span>
                <span>Orange Cove</span><span className="hidden sm:inline">·</span>
                <span>Fowler</span><span className="hidden sm:inline">·</span>
                <span>Visalia</span><span className="hidden sm:inline">·</span>
                <span>Hanford</span><span className="hidden sm:inline">·</span>
                <span>Tulare</span><span className="hidden sm:inline">·</span>
                <span>Madera</span><span className="hidden sm:inline">·</span>
                <span>Fresno</span><span className="hidden sm:inline">·</span>
                <span>Bakersfield</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9) Distribution Lanes */}
      <section className="py-16 md:py-24 px-4 md:px-6 max-w-6xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">Built for how ag actually moves</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-card border border-border p-6 md:p-8 rounded-xl hover:border-white/20 transition-colors">
            <h3 className="text-lg md:text-xl font-black uppercase tracking-tight mb-3 md:mb-4 text-primary">PCA Lane</h3>
            <p className="text-muted-foreground font-medium text-xs md:text-sm">
              View access + program approval state = cleaner continuity and fewer chaotic calls.
            </p>
          </div>
          <div className="bg-card border border-border p-6 md:p-8 rounded-xl hover:border-white/20 transition-colors">
            <h3 className="text-lg md:text-xl font-black uppercase tracking-tight mb-3 md:mb-4 text-primary">Retail Counter Lane</h3>
            <p className="text-muted-foreground font-medium text-xs md:text-sm">
              QR starter packs + bundled onboarding through trusted dealers.
            </p>
          </div>
          <div className="bg-card border border-border p-6 md:p-8 rounded-xl hover:border-white/20 transition-colors">
            <h3 className="text-lg md:text-xl font-black uppercase tracking-tight mb-3 md:mb-4 text-primary">Packer/Compliance Lane</h3>
            <p className="text-muted-foreground font-medium text-xs md:text-sm">
              Weekly packet + season vault = audit readiness without scrambling.
            </p>
          </div>
          <div className="bg-card border border-border p-6 md:p-8 rounded-xl hover:border-white/20 transition-colors">
            <h3 className="text-lg md:text-xl font-black uppercase tracking-tight mb-3 md:mb-4 text-primary">Irrigation/Service Lane</h3>
            <p className="text-muted-foreground font-medium text-xs md:text-sm">
              Irrigation + fertigation records that crews can't quietly drift.
            </p>
          </div>
        </div>
      </section>

      {/* 10) FAQ Accordion */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-[#0a0a0a] border-y border-border">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-8 md:mb-10 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-3 md:space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-border rounded-lg overflow-hidden bg-background">
                <button 
                  className="w-full px-4 md:px-6 py-3 md:py-4 flex justify-between items-center text-left font-bold text-foreground hover:text-primary transition-colors text-sm md:text-base"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="pr-4">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="w-5 h-5 shrink-0" /> : <ChevronDown className="w-5 h-5 shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-4 md:px-6 pb-4 pt-0 text-muted-foreground font-medium text-xs md:text-sm leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11) Apply (Form) */}
      <section id="apply" className="py-16 md:py-24 px-4 md:px-6 max-w-4xl mx-auto">
        <div className="bg-card border border-primary/30 rounded-2xl p-6 md:p-12 shadow-[0_0_30px_rgba(232,93,4,0.05)]">
          <div className="mb-8 md:mb-10 text-center">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-3 md:mb-4">Request an Invite</h2>
            <p className="text-sm md:text-base text-muted-foreground font-medium">Tell us what you run. If there's fit and seat availability, we'll reach out.</p>
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
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Name *</label>
                <input 
                  required 
                  minLength={2} 
                  maxLength={80}
                  className="w-full bg-background border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:outline-none transition-colors" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Ranch / Company *</label>
                <input 
                  required 
                  minLength={2} 
                  maxLength={120}
                  className="w-full bg-background border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:outline-none transition-colors" 
                  value={formData.ranchCompany}
                  onChange={e => setFormData({...formData, ranchCompany: e.target.value})}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Town *</label>
                <select 
                  required
                  className="w-full bg-background border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:outline-none transition-colors appearance-none"
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
                    className="w-full bg-background border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:outline-none transition-colors mt-2" 
                    value={formData.townOther}
                    onChange={e => setFormData({...formData, townOther: e.target.value})}
                  />
                )}
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Role *</label>
                <select 
                  required
                  className="w-full bg-background border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:outline-none transition-colors appearance-none"
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
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Email *</label>
                <input 
                  required 
                  type="email"
                  className="w-full bg-background border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:outline-none transition-colors" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Phone *</label>
                <input 
                  required 
                  type="tel"
                  className="w-full bg-background border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:outline-none transition-colors" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            <div className="border-t border-border pt-8">
              <h3 className="text-xl font-black uppercase tracking-tight mb-6">Operation Details</h3>
              
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Crops (Select all that apply) *</label>
                <div className="flex flex-wrap gap-3">
                  {["Almonds", "Pistachios", "Walnuts", "Citrus", "Stone Fruit", "Vines", "Other"].map(crop => (
                    <button
                      key={crop}
                      type="button"
                      onClick={() => handleCropToggle(crop)}
                      className={`px-4 py-2 rounded-full text-sm font-bold transition-colors border ${
                        formData.crops.includes(crop) 
                          ? 'bg-primary border-primary text-foreground' 
                          : 'bg-background border-white/20 text-muted-foreground hover:border-border0'
                      }`}
                    >
                      {crop}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Acres Under Management *</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {["0-49", "50-199", "200-499", "500-999", "1000+"].map(band => (
                    <button
                      key={band}
                      type="button"
                      onClick={() => setFormData({...formData, acresBand: band})}
                      className={`px-3 py-2 rounded text-sm font-bold transition-colors border text-center ${
                        formData.acresBand === band 
                          ? 'bg-white text-black border-white' 
                          : 'bg-background border-white/20 text-muted-foreground hover:border-border0'
                      }`}
                    >
                      {band}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Number of Ranches/Locations</label>
                  <select 
                    className="w-full bg-background border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:outline-none transition-colors appearance-none"
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
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Who will log daily? (Title/Role)</label>
                  <input 
                    className="w-full bg-background border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:outline-none transition-colors" 
                    value={formData.dailyLogger}
                    onChange={e => setFormData({...formData, dailyLogger: e.target.value})}
                    placeholder="e.g. Foreman, Me, Tractor Driver"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-8">
              <h3 className="text-xl font-black uppercase tracking-tight mb-6">Pilot Readiness</h3>
              
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Expected Peak Months (Select 1+)</label>
                <div className="flex flex-wrap gap-2">
                  {["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"].map(month => (
                    <button
                      key={month}
                      type="button"
                      onClick={() => handleMonthToggle(month)}
                      className={`px-3 py-1.5 rounded text-xs font-bold transition-colors border ${
                        formData.peakMonths.includes(month) 
                          ? 'bg-white text-black border-white' 
                          : 'bg-background border-white/20 text-muted-foreground hover:border-border0'
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
                    <div className="w-6 h-6 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors"></div>
                    <Check className="absolute w-4 h-4 text-foreground opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-muted-foreground font-medium select-none group-hover:text-foreground transition-colors">I can pilot the app for 8–12 weeks (or a full season) *</span>
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
                    <div className="w-6 h-6 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors"></div>
                    <Check className="absolute w-4 h-4 text-foreground opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-muted-foreground font-medium select-none group-hover:text-foreground transition-colors">I can provide at least 2 measurable proof points (e.g. hours saved) *</span>
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
                    <div className="w-6 h-6 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors"></div>
                    <Check className="absolute w-4 h-4 text-foreground opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-muted-foreground font-medium select-none group-hover:text-foreground transition-colors">I commit to making 1 intro per month to my network *</span>
                </label>
              </div>

              <div className="mb-8">
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">What's the one thing you'd love to stop doing every week?</label>
                <textarea 
                  rows={3}
                  maxLength={180}
                  className="w-full bg-background border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:outline-none transition-colors resize-none" 
                  value={formData.oneThingToStopDoing}
                  onChange={e => setFormData({...formData, oneThingToStopDoing: e.target.value})}
                  placeholder="e.g. Calling the foreman at 6PM to figure out what block got sprayed."
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting || formData.crops.length === 0}
                className="w-full bg-primary hover:bg-primary/90 text-foreground py-4 rounded font-black uppercase tracking-widest text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center font-black text-foreground text-xs">K</div>
            <span className="font-black tracking-tighter text-lg uppercase text-foreground/50">KEBB Ag™</span>
          </div>
          
          <p className="text-xs text-gray-600 mb-6 max-w-2xl mx-auto">
            Kickbacks subject to signed Guild Participation Agreement. Terms, eligibility, caps, and clawback provisions apply.
          </p>
          
          <div className="flex justify-center gap-6 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <button className="hover:text-foreground transition-colors">Privacy</button>
            <button className="hover:text-foreground transition-colors">Term Sheet</button>
            <a href="mailto:hello@kebbag.com" className="hover:text-foreground transition-colors">Contact</a>
          </div>
          <div className="mt-8">
            <Link href="/app" className="text-xs font-bold text-primary hover:underline">Go to Application Prototype (Demo)</Link>
          </div>
        </div>
      </footer>

      {/* Redacted Packet Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/90 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 border-b border-border flex justify-between items-center bg-background">
              <h3 className="font-black uppercase tracking-tight text-foreground flex items-center gap-2 text-sm md:text-base">
                <Shield className="w-4 h-4 text-primary shrink-0" /> Sample Compliance Packet
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors p-1">
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 md:p-6 bg-[#0a0a0a]">
              <div className="bg-white p-4 md:p-8 rounded shadow-sm min-h-[500px] text-black">
                <div className="border-b-2 border-black pb-4 mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                  <div>
                    <h1 className="text-xl md:text-3xl font-black uppercase tracking-tighter">Weekly Application Report</h1>
                    <p className="font-bold text-muted-foreground text-sm md:text-base">████████ Farms</p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="font-bold text-sm md:text-base">Week of: May 12 - May 18, 2026</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Generated by KEBB Ag</p>
                  </div>
                </div>
                
                <div className="mb-8 overflow-x-auto">
                  <h2 className="text-sm md:text-lg font-black uppercase tracking-tight bg-gray-200 px-3 py-1 mb-3 whitespace-nowrap">Block: North 40 (██████ Almonds)</h2>
                  <div className="min-w-[600px]">
                    <table className="w-full text-xs md:text-sm">
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
                </div>

                <div className="mb-8 overflow-x-auto">
                  <h2 className="text-sm md:text-lg font-black uppercase tracking-tight bg-gray-200 px-3 py-1 mb-3 whitespace-nowrap">Block: River Bottom (██████ Walnuts)</h2>
                  <div className="min-w-[600px]">
                    <table className="w-full text-xs md:text-sm">
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
                </div>

                <div className="mt-12 text-center p-4 bg-gray-100 rounded text-xs md:text-sm text-gray-600 font-bold">
                  All fields redacted to protect operational data. Real packets include EPA #s, REI, and PHI data automatically.
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-border bg-background flex justify-end">
              <button onClick={() => setIsModalOpen(false)} className="bg-primary text-foreground px-6 py-3 md:py-2 rounded font-black uppercase tracking-widest text-xs w-full md:w-auto">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
