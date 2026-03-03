import { useStore } from "@/lib/store";
import { PLANS, ADD_ONS, ONBOARDING_FEES } from "@/config/pricing";
import { Link } from "wouter";
import { FileText, ArrowRight, Settings } from "lucide-react";

export default function Billing() {
  const billing = useStore(s => s.billing);
  const currentPlan = PLANS[billing.planId];
  
  // Calculate totals
  const basePrice = billing.isAnnual ? currentPlan.annualPrice / 12 : currentPlan.monthlyPrice;
  
  let addonsTotal = 0;
  const activeAddonsList: {name: string, cost: number}[] = [];
  
  Object.entries(billing.addOns).forEach(([id, value]) => {
    const addon = ADD_ONS[id as keyof typeof ADD_ONS];
    if (!addon) return;
    
    if ('type' in addon && addon.type === 'quantity' && typeof value === 'number' && value > 0) {
      const cost = addon.price * value;
      addonsTotal += cost;
      activeAddonsList.push({ name: `${addon.name} (x${value})`, cost });
    } else if (value === true) {
      addonsTotal += addon.price;
      activeAddonsList.push({ name: addon.name, cost: addon.price });
    }
  });

  const monthlyTotal = basePrice + addonsTotal;

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto pb-20">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Settings</p>
        <h1 className="text-4xl font-black uppercase tracking-tighter text-foreground">Billing & Plans</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Current Plan Card */}
          <div className="bg-card border border-border rounded-lg p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-10 -mt-10" />
            
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Current Plan</h2>
            
            <div className="flex justify-between items-end mb-6">
              <div>
                <h3 className="text-3xl font-black uppercase tracking-tight text-foreground">{currentPlan.name}</h3>
                <p className="text-primary font-bold mt-1">
                  {billing.isAnnual ? 'Billed Annually' : 'Billed Monthly'}
                </p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-foreground">${Math.round(basePrice)}</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
            </div>
            
            <Link href="/app/pricing">
              <button className="flex items-center gap-2 bg-background border border-border hover:border-primary px-4 py-2 rounded text-sm font-bold uppercase tracking-widest transition-colors w-full justify-center">
                Change Plan <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          {/* Billing Breakdown */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">Monthly Estimate</h2>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center pb-4 border-b border-border/50">
                <span className="font-bold text-foreground">{currentPlan.name} Plan {billing.isAnnual ? '(Annual Rate)' : ''}</span>
                <span className="font-bold">${Math.round(basePrice)}</span>
              </div>
              
              {activeAddonsList.map((addon, i) => (
                <div key={i} className="flex justify-between items-center pb-4 border-b border-border/50">
                  <span className="text-muted-foreground">{addon.name}</span>
                  <span className="font-bold">${addon.cost}</span>
                </div>
              ))}
              
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-black uppercase tracking-widest">Total Monthly</span>
                <span className="text-2xl font-black text-primary">${Math.round(monthlyTotal)}</span>
              </div>
            </div>
          </div>
          
          {/* One-time fees */}
          {billing.onboardingPurchased && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">One-Time Charges</h2>
              <div className="flex justify-between items-center">
                <span className="font-bold text-foreground">Onboarding & Setup</span>
                <span className="font-bold text-muted-foreground">Paid</span>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar / Invoices */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">Recent Invoices</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-background rounded group-hover:text-primary transition-colors">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Mar 1, 2026</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">Paid</p>
                  </div>
                </div>
                <span className="text-sm font-bold">${Math.round(monthlyTotal)}</span>
              </div>
              <div className="flex items-center justify-between group cursor-pointer opacity-70">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-background rounded group-hover:text-primary transition-colors">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Feb 1, 2026</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">Paid</p>
                  </div>
                </div>
                <span className="text-sm font-bold">${Math.round(monthlyTotal)}</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 border border-dashed border-border rounded-lg text-center">
            <Settings className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Prototype Environment</p>
            <button 
              onClick={() => {
                localStorage.removeItem('kebb_billing');
                window.location.reload();
              }}
              className="mt-3 text-[10px] font-bold uppercase tracking-widest text-primary hover:underline"
            >
              Reset Billing State
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
