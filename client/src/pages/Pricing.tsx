import { useStore } from "@/lib/store";
import { PLANS, ADD_ONS, ONBOARDING_FEES, PlanId, AddOnId } from "@/config/pricing";
import { Check, Zap, ShieldAlert, Users, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function Pricing() {
  const billing = useStore(s => s.billing);
  const setPlan = useStore(s => s.setPlan);
  const toggleAnnual = useStore(s => s.toggleAnnual);
  const setAddOn = useStore(s => s.setAddOn);
  const purchaseOnboarding = useStore(s => s.purchaseOnboarding);
  const { toast } = useToast();

  const [localAnnual, setLocalAnnual] = useState(billing.isAnnual);

  const handleUpgrade = (planId: PlanId) => {
    setPlan(planId, localAnnual);
    toast({
      title: "Plan Updated (Demo)",
      description: `You are now on the ${PLANS[planId].name} plan. Billing will be wired to Stripe in production.`,
      duration: 5000,
    });
  };

  const handleToggleAddOn = (addOnId: AddOnId) => {
    const isEnabled = !!billing.addOns[addOnId];
    setAddOn(addOnId, !isEnabled);
    toast({
      title: "Add-on Updated (Demo)",
      description: `${ADD_ONS[addOnId].name} has been ${!isEnabled ? 'enabled' : 'disabled'}.`,
    });
  };

  const handleSeatChange = (addOnId: AddOnId, delta: number) => {
    const current = (billing.addOns[addOnId] as number) || 0;
    const next = Math.max(0, current + delta);
    setAddOn(addOnId, next);
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20 max-w-6xl mx-auto px-4">
      <div className="text-center mb-12">
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Pricing</p>
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground mb-4">
          Field-Tested Pricing
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Built for Central Valley operations. Start logging in minutes, scale to full multi-ranch compliance when you're ready.
        </p>
        
        <div className="flex items-center justify-center gap-4 mt-8">
          <span className={`text-sm font-bold uppercase tracking-widest ${!localAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>Monthly</span>
          <button 
            onClick={() => setLocalAnnual(!localAnnual)}
            className="w-14 h-7 bg-card border border-border rounded-full relative transition-colors hover:border-primary"
          >
            <div className={`absolute top-1 w-5 h-5 rounded-full bg-primary transition-all ${localAnnual ? 'right-1' : 'left-1'}`} />
          </button>
          <span className={`text-sm font-bold uppercase tracking-widest ${localAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
            Annual <span className="text-primary ml-1 text-xs">(Save ~15%)</span>
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {(Object.values(PLANS) as (typeof PLANS[PlanId])[]).map(plan => {
          const isCurrent = billing.planId === plan.id;
          const price = localAnnual ? plan.annualPrice / 12 : plan.monthlyPrice;
          
          return (
            <div key={plan.id} className={`bg-card rounded-lg p-8 border-2 transition-all ${isCurrent ? 'border-primary shadow-[0_0_20px_rgba(212,175,55,0.15)] relative' : 'border-border'}`}>
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                  Current Plan
                </div>
              )}
              
              <h2 className="text-2xl font-black uppercase tracking-tight text-foreground mb-2">{plan.name}</h2>
              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-4xl font-black text-foreground">${Math.round(price)}</span>
                <span className="text-muted-foreground text-sm font-bold uppercase tracking-widest">/mo</span>
              </div>
              
              {localAnnual && (
                <p className="text-xs text-primary font-bold uppercase tracking-widest mb-6 border-b border-border pb-4">
                  Billed ${plan.annualPrice} annually
                </p>
              )}
              {!localAnnual && <div className="h-px bg-border mb-6 w-full" />}

              <ul className="space-y-4 mb-8">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-sm font-medium text-foreground">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => !isCurrent && handleUpgrade(plan.id)}
                disabled={isCurrent}
                className={`w-full py-4 rounded font-black uppercase tracking-widest text-sm transition-colors ${
                  isCurrent 
                    ? 'bg-background text-muted-foreground cursor-default'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                {isCurrent ? 'Current Plan' : `Upgrade to ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h3 className="text-xl font-black uppercase tracking-tight text-foreground mb-6">Optional Add-ons</h3>
          <div className="space-y-4">
            {(Object.values(ADD_ONS) as (typeof ADD_ONS[AddOnId])[]).map(addon => {
              const isQuantity = 'type' in addon && addon.type === 'quantity';
              const isEnabled = !!billing.addOns[addon.id];
              const count = (billing.addOns[addon.id] as number) || 0;
              const isLocked = 'requires' in addon && addon.requires && PLANS[billing.planId].monthlyPrice < PLANS[addon.requires as PlanId].monthlyPrice;

              return (
                <div key={addon.id} className={`bg-card border p-5 rounded-lg flex items-center justify-between ${isLocked ? 'border-border opacity-50' : isEnabled || count > 0 ? 'border-primary/50 bg-primary/5' : 'border-border'}`}>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-foreground">{addon.name}</h4>
                      {isLocked && 'requires' in addon && <span className="text-[10px] font-bold uppercase tracking-widest bg-background px-2 py-0.5 rounded text-muted-foreground">Requires {PLANS[addon.requires as PlanId].name}</span>}
                    </div>
                    <p className="text-sm text-muted-foreground">{addon.description}</p>
                    <p className="text-xs font-bold uppercase tracking-widest text-primary mt-2">+${addon.price}/mo {isQuantity ? 'per seat' : ''}</p>
                  </div>
                  
                  {!isLocked && (
                    <div className="shrink-0 ml-4">
                      {isQuantity ? (
                        <div className="flex items-center gap-3 bg-background border border-border rounded p-1">
                          <button onClick={() => handleSeatChange(addon.id, -1)} className="w-8 h-8 flex items-center justify-center hover:text-primary transition-colors font-bold text-lg">-</button>
                          <span className="font-black w-4 text-center">{count}</span>
                          <button onClick={() => handleSeatChange(addon.id, 1)} className="w-8 h-8 flex items-center justify-center hover:text-primary transition-colors font-bold text-lg">+</button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleToggleAddOn(addon.id)}
                          className={`w-12 h-6 rounded-full relative transition-colors ${isEnabled ? 'bg-primary' : 'bg-background border border-border'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${isEnabled ? 'right-1 bg-primary-foreground' : 'left-1 bg-muted-foreground'}`} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-black uppercase tracking-tight text-foreground mb-6">Onboarding & Setup</h3>
          <div className="space-y-4">
            {Object.values(ONBOARDING_FEES).map(fee => (
              <div key={fee.id} className="bg-card border border-border p-5 rounded-lg flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-foreground mb-1">{fee.name}</h4>
                  <p className="text-sm text-muted-foreground">{fee.description}</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary mt-2">${fee.price.toLocaleString()} One-time</p>
                </div>
                <button
                  onClick={() => {
                    purchaseOnboarding();
                    toast({ title: "Setup added", description: "Our team will contact you shortly." });
                  }}
                  disabled={billing.onboardingPurchased}
                  className="shrink-0 ml-4 px-4 py-2 border border-primary text-primary font-bold uppercase tracking-widest text-xs rounded hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:border-border disabled:text-muted-foreground"
                >
                  {billing.onboardingPurchased ? 'Added' : 'Add'}
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-6 bg-background border border-border rounded-lg text-center">
            <ShieldAlert className="w-8 h-8 text-primary mx-auto mb-3" />
            <h4 className="font-bold text-foreground mb-2">Prototype Billing Warning</h4>
            <p className="text-sm text-muted-foreground">
              This is a demonstration of the monetization flows. No real payments are processed. Upgrading a plan will unlock premium features in the UI instantly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
