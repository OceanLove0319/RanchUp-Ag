import { useState } from "react";
import { Link } from "wouter";
import { ClipboardEdit, Target, Archive, ArrowRight, FileText, BarChart, AlertTriangle } from "lucide-react";
import { useStore } from "@/lib/store";
import PcaIntakeCard from "@/components/home/PcaIntakeCard";

export default function Home() {
  const user = useStore(s => s.user);
  const activeRanchId = useStore(s => s.activeRanchId);
  const activeRanch = useStore(s => s.ranches.find(r => r.id === activeRanchId));
  const [activeTab, setActiveTab] = useState<"HOME" | "PCA_INTAKE">("HOME");

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Good Morning</p>
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground mb-2">
          {user?.org || "Operation"}
        </h1>
        {activeRanch && (
          <div className="inline-flex items-center bg-white/5 border border-white/10 px-3 py-1.5 rounded-full mt-2">
            <span className="text-sm font-bold uppercase tracking-widest text-white">{activeRanch.name}</span>
          </div>
        )}
      </header>

      {/* Navigation Tabs */}
      <div className="flex border-b border-border mb-8">
        <button 
          onClick={() => setActiveTab("HOME")}
          className={`px-6 py-3 text-sm font-black uppercase tracking-widest transition-colors border-b-2 ${
            activeTab === "HOME" 
              ? "border-primary text-primary" 
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Home
        </button>
        <button 
          onClick={() => setActiveTab("PCA_INTAKE")}
          className={`px-6 py-3 text-sm font-black uppercase tracking-widest transition-colors border-b-2 ${
            activeTab === "PCA_INTAKE" 
              ? "border-primary text-primary" 
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          PCA Intake
        </button>
      </div>

      {activeTab === "PCA_INTAKE" ? (
        <div className="animate-in fade-in duration-300">
          <PcaIntakeCard />
        </div>
      ) : (
        <div className="animate-in fade-in duration-300">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Quick Actions</p>
      
      {/* Top row: Core flow */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-10">
        <Link href="/app/log" className="bg-card border border-border p-6 md:p-8 rounded-lg hover:border-primary/50 transition-colors group flex flex-col justify-between min-h-[160px]">
          <div>
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
              <ClipboardEdit className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-foreground mb-2">Log Action</h2>
            <p className="text-muted-foreground font-medium">Record field work while you're in the orchard.</p>
          </div>
          <div className="mt-8 flex items-center text-primary font-bold uppercase tracking-widest text-sm group-hover:translate-x-2 transition-transform">
            Start <ArrowRight className="ml-2 w-4 h-4" />
          </div>
        </Link>

        <Link href="/app/blocks" className="bg-card border border-border p-6 md:p-8 rounded-lg hover:border-primary/50 transition-colors group flex flex-col justify-between min-h-[160px]">
          <div>
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
              <Target className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-foreground mb-2">Blocks</h2>
            <p className="text-muted-foreground font-medium">Manage blocks and targets.</p>
          </div>
          <div className="mt-8 flex items-center text-primary font-bold uppercase tracking-widest text-sm group-hover:translate-x-2 transition-transform">
            Manage <ArrowRight className="ml-2 w-4 h-4" />
          </div>
        </Link>
      </div>

      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Reports & Analysis</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Link href="/app/reports/weekly" className="bg-card border border-border p-6 rounded-lg hover:border-primary/50 transition-colors group flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 bg-white/5 rounded flex items-center justify-center mb-4 text-white">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black uppercase tracking-tight text-foreground mb-1">Weekly Packet</h2>
            <p className="text-sm text-muted-foreground">Audit-ready compliance report.</p>
          </div>
        </Link>

        <Link href="/app/reports/monthly" className="bg-card border border-border p-6 rounded-lg hover:border-primary/50 transition-colors group flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 bg-white/5 rounded flex items-center justify-center mb-4 text-white">
              <BarChart className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black uppercase tracking-tight text-foreground mb-1">Monthly Summary</h2>
            <p className="text-sm text-muted-foreground">Spend by block and type.</p>
          </div>
        </Link>

        <Link href="/app/reports/variance" className="bg-card border border-border p-6 rounded-lg hover:border-primary/50 transition-colors group flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 bg-orange-400/10 rounded flex items-center justify-center mb-4 text-orange-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black uppercase tracking-tight text-foreground mb-1">Variance Flags</h2>
            <p className="text-sm text-muted-foreground">Cost spikes and unit mismatches.</p>
          </div>
        </Link>
      </div>
        </div>
      )}
    </div>
  );
}
