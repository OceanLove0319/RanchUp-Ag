import { HomeStep } from "./GuidedStepRail";
import { Link } from "wouter";
import { Settings, LogOut } from "lucide-react";
import { useStore } from "@/lib/store";

export function ManagementNav() {
  const logout = useStore(s => s.logout);

  return (
    <div className="mt-8 animate-in fade-in duration-300">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-4 h-4 text-muted-foreground" />
        <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground">System Management</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Link href="/app/blocks" className="bg-background border border-border p-3 rounded text-sm font-bold hover:border-primary/50 transition-colors text-center">
          Ranches & Blocks
        </Link>
        <Link href="/app/inputs" className="bg-background border border-border p-3 rounded text-sm font-bold hover:border-primary/50 transition-colors text-center">
          Inputs Library
        </Link>
        <Link href="/app/projections/templates" className="bg-background border border-border p-3 rounded text-sm font-bold hover:border-primary/50 transition-colors text-center">
          Templates
        </Link>
        <Link href="/app/settings/billing" className="bg-background border border-border p-3 rounded text-sm font-bold hover:border-primary/50 transition-colors text-center">
          Settings
        </Link>
      </div>
      
      <div className="mt-6 flex justify-center">
        <Link href="/" onClick={logout} className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
          <LogOut className="w-3 h-3" /> Exit App
        </Link>
      </div>
    </div>
  );
}