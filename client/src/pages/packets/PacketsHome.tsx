import { Link } from "wouter";
import { ArrowLeft, FileText, Calendar, Clock, BookOpen, Send, LayoutList } from "lucide-react";

export default function PacketsHome() {
  return (
    <div className="animate-in fade-in duration-500 max-w-2xl mx-auto pb-24">
      <div className="flex justify-between items-center mb-6">
        <Link href="/app" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
      </div>

      <header className="mb-10">
        <div className="flex items-center gap-3 text-primary mb-2">
          <FileText className="w-8 h-8" />
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white">Packets</h1>
        </div>
        <p className="text-gray-400 font-medium">Generate deterministic operation reports for sharing and compliance.</p>
      </header>

      <div className="grid gap-6">
        <Link href="/app/packets/today">
          <div className="bg-card border border-border p-6 rounded-xl hover:border-primary/50 transition-all cursor-pointer group">
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-primary/10 p-3 rounded-lg text-primary">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-white group-hover:text-primary transition-colors">Today Packet</h2>
                <p className="text-sm text-muted-foreground">End-of-Day Proof</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-2">Daily artifact to send in 15 seconds. Includes today's logs grouped by block, totals, and issues list.</p>
          </div>
        </Link>

        <Link href="/app/packets/monthly">
          <div className="bg-card border border-border p-6 rounded-xl hover:border-primary/50 transition-all cursor-pointer group">
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-primary/10 p-3 rounded-lg text-primary">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-white group-hover:text-primary transition-colors">Monthly Packet</h2>
                <p className="text-sm text-muted-foreground">Monthly Cleanup & Review</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-2">Monthly review bundle for manager/PCA. Includes month's logs, totals, open issues, and signoff page.</p>
          </div>
        </Link>

        <Link href="/app/packets/season">
          <div className="bg-card border border-border p-6 rounded-xl hover:border-primary/50 transition-all cursor-pointer group">
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-primary/10 p-3 rounded-lg text-primary">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-white group-hover:text-primary transition-colors">Season Packet</h2>
                <p className="text-sm text-muted-foreground">Audit Binder</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-2">Packer-shipper audited season-long documentation. Includes TOC, block register, full records, and exception history.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
