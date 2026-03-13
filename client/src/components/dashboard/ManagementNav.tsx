import { Link } from "wouter";
import { Settings, LogOut, FileText, PieChart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function ManagementNav() {
  const { logout } = useAuth();

  return (
    <div className="mt-12 pt-8 border-t border-border animate-in fade-in duration-300">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground">System Management</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        <Link href="/app/blocks" className="bg-background border border-border p-4 rounded-lg font-bold uppercase tracking-wider text-xs hover:border-primary/50 hover:text-primary transition-colors flex items-center justify-between group">
          <span>Ranches & Blocks</span>
        </Link>
        <Link href="/app/inputs" className="bg-background border border-border p-4 rounded-lg font-bold uppercase tracking-wider text-xs hover:border-primary/50 hover:text-primary transition-colors flex items-center justify-between group">
          <span>Inputs & Inventory</span>
        </Link>
        <Link href="/app/projections/templates" className="bg-background border border-border p-4 rounded-lg font-bold uppercase tracking-wider text-xs hover:border-primary/50 hover:text-primary transition-colors flex items-center justify-between group">
          <span>Program Templates</span>
        </Link>
        <Link href="/app/projections" className="bg-background border border-border p-4 rounded-lg font-bold uppercase tracking-wider text-xs hover:border-primary/50 hover:text-primary transition-colors flex items-center justify-between group">
          <span>Costs & Budgets</span>
        </Link>
        <Link href="/app/reports/monthly" className="bg-background border border-border p-4 rounded-lg font-bold uppercase tracking-wider text-xs hover:border-primary/50 hover:text-primary transition-colors flex items-center justify-between group">
          <span>Reports & Exports</span>
        </Link>
        <Link href="/app/settings/billing" className="bg-background border border-border p-4 rounded-lg font-bold uppercase tracking-wider text-xs hover:border-primary/50 hover:text-primary transition-colors flex items-center justify-between group">
          <span>Settings & Billing</span>
        </Link>
      </div>
      
      <div className="flex justify-center pb-8">
        <Link href="/" onClick={logout} className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors px-4 py-2 rounded-full hover:bg-white/5">
          <LogOut className="w-4 h-4" /> Exit Application
        </Link>
      </div>
    </div>
  );
}