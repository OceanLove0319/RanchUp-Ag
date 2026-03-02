import { useStore } from "@/lib/store";
import { FileText, Download, Filter } from "lucide-react";

export default function Vault() {
  const logs = useStore(s => s.logs);
  const blocks = useStore(s => s.blocks);

  const getBlockName = (id: string) => blocks.find(b => b.id === id)?.name || "Unknown";

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Archive</p>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-foreground">Season Vault</h1>
        </div>
        <button className="flex items-center gap-2 bg-card border border-border hover:border-primary/50 text-foreground px-4 py-2 rounded font-bold uppercase tracking-widest text-sm transition-colors">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden mb-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-border bg-background">
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-muted-foreground text-xs">Date</th>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-muted-foreground text-xs">Block</th>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-muted-foreground text-xs">Action</th>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-muted-foreground text-xs">Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={log.id || i} className="border-b border-border hover:bg-background/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-muted-foreground">{log.date}</td>
                  <td className="px-6 py-4 font-bold text-foreground">{getBlockName(log.blockId)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest
                      ${log.actionType === 'SPRAY' ? 'bg-purple-400/10 text-purple-400' : 
                        log.actionType === 'FERT' ? 'bg-orange-400/10 text-orange-400' : 
                        'bg-blue-400/10 text-blue-400'}`}
                    >
                      {log.actionType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <span className="text-foreground font-bold">{log.amount} {log.unit}</span> {log.material}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground font-medium">
                    No field actions recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <h2 className="text-2xl font-black uppercase tracking-tight text-foreground mb-6">Documents</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-card border border-border p-4 rounded-lg flex items-center justify-between group cursor-pointer hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-background rounded text-muted-foreground group-hover:text-primary transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-foreground">Soil Analysis 2026.pdf</p>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Added Mar 1</p>
            </div>
          </div>
          <Download className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </div>
        
        <div className="bg-card border border-border border-dashed p-4 rounded-lg flex items-center justify-center cursor-pointer hover:bg-background/50 transition-colors text-muted-foreground hover:text-foreground">
          <p className="font-bold uppercase tracking-widest text-sm">+ Upload Document</p>
        </div>
      </div>
    </div>
  );
}
