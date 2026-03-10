import { useLocation } from "wouter";
import { useStore } from "@/lib/store";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { seedDemoData } from "@/lib/demoSeeds/ryanNeufeldSeed";
import { pcaDemoUser, pcaDemoRanches, pcaDemoBlocks, pcaDemoLogs, pcaDemoApps, pcaDemoRecommendations } from "@/data/pcaDemoSeed";

export default function Login() {
  const [, setLocation] = useLocation();
  const login = useStore((state) => state.login);
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleDemoLogin = () => {
    seedDemoData(useStore);
    setLocation("/app");
    toast({
      title: "Demo Mode Active",
      description: "Logged in as Ryan Neufeld (Neufeld Farms)."
    });
  };

  const handlePCADemoLogin = () => {
    const store = useStore.getState();
    // Overwrite state completely for PCA mode
    store.user = pcaDemoUser;
    store.ranches = pcaDemoRanches;
    store.blocks = pcaDemoBlocks;
    store.logs = pcaDemoLogs;
    store.chemicalApps = pcaDemoApps;
    store.recommendations = pcaDemoRecommendations;
    store.activeRanchId = pcaDemoRanches[0].id;
    store.isAuthenticated = true;
    
    // Auto-enable pro plan to show all tools
    store.setPlan("PRO", false);
    store.setAddOn("COST_ENGINE", true);
    
    setLocation("/app");
    toast({
      title: "PCA Demo Active",
      description: "Logged in as Karl W. (Simplot Grower Solutions)."
    });
  };

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "demo@ranchupfarms.com" && password === "peaches") {
      login();
      // Activate the PRO plan and Cost Engine for the demo
      useStore.getState().setPlan("PRO", false);
      useStore.getState().setAddOn("COST_ENGINE", true);
      
      setLocation("/app");
      toast({
        title: "Welcome back",
        description: "Logged into RanchUp Farms demo account (Pro + Cost Engine active)."
      });
    } else {
      toast({
        variant: "destructive",
        title: "Invalid credentials",
        description: "For the demo, use demo@ranchupfarms.com / peaches"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border p-8 rounded-lg">
        <h1 className="text-3xl font-black uppercase tracking-tight mb-2 text-foreground">Access Your Operation</h1>
        <p className="text-muted-foreground mb-8 font-medium">Log in or continue with the demo environment.</p>
        
        <form className="space-y-4 mb-8" onSubmit={handleStandardLogin}>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Email</label>
            <input 
              type="email" 
              placeholder="demo@ranchupfarms.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-background border border-border rounded px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-background border border-border rounded px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
            />
            <p className="text-[10px] text-muted-foreground mt-2 italic">Demo hint: Use demo@ranchupfarms.com / peaches</p>
          </div>
          <button type="submit" className="w-full bg-primary text-primary-foreground font-bold uppercase tracking-widest py-3 rounded hover:bg-primary/90 transition-colors">
            Sign In
          </button>
        </form>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-card px-4 text-muted-foreground font-bold uppercase tracking-widest">Or</span>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Demo Accounts</p>
          
          <button 
            onClick={handlePCADemoLogin}
            className="w-full border-2 border-blue-500/50 bg-blue-500/10 text-blue-400 text-left px-6 py-4 rounded hover:bg-blue-500/20 transition-colors group flex flex-col items-start"
          >
            <div className="flex justify-between w-full items-center mb-1">
              <span className="font-black uppercase tracking-widest group-hover:text-white transition-colors">Karl W.</span>
              <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-black tracking-widest uppercase">PCA</span>
            </div>
            <span className="text-sm font-medium text-muted-foreground">Simplot • 4 Ranches • Multi-tenant View</span>
          </button>

          <button 
            onClick={handleDemoLogin}
            className="w-full border-2 border-primary bg-primary/5 text-primary text-left px-6 py-4 rounded hover:bg-primary/10 transition-colors group flex flex-col items-start"
          >
            <div className="flex justify-between w-full items-center mb-1">
              <span className="font-black uppercase tracking-widest group-hover:text-white transition-colors">Ryan Neufeld</span>
              <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded font-black tracking-widest uppercase">Grower</span>
            </div>
            <span className="text-sm font-medium text-muted-foreground">Neufeld Farms (Traver, CA) • Stone Fruit</span>
          </button>
          
          <button 
            onClick={() => { login(); setLocation("/onboarding"); }}
            className="w-full border border-border text-muted-foreground font-bold uppercase tracking-widest py-4 rounded hover:bg-white/5 transition-colors"
          >
            Enter Fresh Demo (Empty)
          </button>
        </div>
      </div>
    </div>
  );
}
