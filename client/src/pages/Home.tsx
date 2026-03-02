import { Link } from "wouter";
import { ClipboardEdit, Target, Archive, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";

export default function Home() {
  const user = useStore(s => s.user);

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-10">
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Good Morning</p>
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground">
          {user?.org || "Operation"}
        </h1>
      </header>

      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Next Steps</p>
      
      <div className="grid md:grid-cols-3 gap-4 md:gap-6">
        <Link href="/app/log" className="bg-card border border-border p-6 md:p-8 rounded-lg hover:border-primary/50 transition-colors group flex flex-col justify-between min-h-[200px]">
          <div>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
              <ClipboardEdit className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-foreground mb-2">Log Action</h2>
            <p className="text-muted-foreground font-medium">Record field work while you're in the orchard.</p>
          </div>
          <div className="mt-8 flex items-center text-primary font-bold uppercase tracking-widest text-sm group-hover:translate-x-2 transition-transform">
            Start <ArrowRight className="ml-2 w-4 h-4" />
          </div>
        </Link>

        <Link href="/app/blocks" className="bg-card border border-border p-6 md:p-8 rounded-lg hover:border-primary/50 transition-colors group flex flex-col justify-between min-h-[200px]">
          <div>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-foreground mb-2">Plan</h2>
            <p className="text-muted-foreground font-medium">Review targets and ingredient plans by block.</p>
          </div>
          <div className="mt-8 flex items-center text-primary font-bold uppercase tracking-widest text-sm group-hover:translate-x-2 transition-transform">
            Review <ArrowRight className="ml-2 w-4 h-4" />
          </div>
        </Link>

        <Link href="/app/vault" className="bg-card border border-border p-6 md:p-8 rounded-lg hover:border-primary/50 transition-colors group flex flex-col justify-between min-h-[200px]">
          <div>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
              <Archive className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-foreground mb-2">Vault</h2>
            <p className="text-muted-foreground font-medium">Access season records and field notes.</p>
          </div>
          <div className="mt-8 flex items-center text-primary font-bold uppercase tracking-widest text-sm group-hover:translate-x-2 transition-transform">
            Open <ArrowRight className="ml-2 w-4 h-4" />
          </div>
        </Link>
      </div>
    </div>
  );
}
