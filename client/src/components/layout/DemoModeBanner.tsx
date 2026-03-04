import { useStore } from "@/lib/store";
import { AlertTriangle, RefreshCw, LogOut } from "lucide-react";
import { useLocation } from "wouter";
import { seedDemoData } from "@/lib/demoSeeds/ryanNeufeldSeed";

export function DemoModeBanner() {
  const [, setLocation] = useLocation();
  const user = useStore(state => state.user);
  const logout = useStore(state => state.logout);
  
  // Simple check if we are in the demo account
  if (user?.name !== "Ryan Neufeld") return null;

  const handleReset = () => {
    seedDemoData(useStore);
    // Force a reload to ensure all Zustand state is perfectly synced
    window.location.reload();
  };

  const handleExit = () => {
    logout();
    setLocation("/");
  };

  return (
    <div className="bg-primary/20 border-b border-primary/30 py-2 px-4 flex items-center justify-between z-50 w-full relative">
      <div className="flex items-center gap-2 text-primary">
        <AlertTriangle className="w-4 h-4" />
        <span className="text-xs font-black uppercase tracking-widest">Demo Mode Active</span>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary hover:text-white transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          <span className="hidden sm:inline">Reset Data</span>
        </button>
        
        <button 
          onClick={handleExit}
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-white transition-colors"
        >
          <LogOut className="w-3 h-3" />
          <span className="hidden sm:inline">Switch Account</span>
        </button>
      </div>
    </div>
  );
}
