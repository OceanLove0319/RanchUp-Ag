import { Link } from "wouter";
import { ClipboardEdit, Target, ArrowRight } from "lucide-react";

export function LogPanel() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
    </div>
  );
}
