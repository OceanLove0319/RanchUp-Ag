import { useStore } from "@/lib/store";
import { useRanches, useBlocks, useFieldLogs, useChemicalApps } from "@/hooks/useData";
import { Link } from "wouter";
import { ArrowLeft, Send, Download, MessageSquare, Mail, Copy, CheckCircle2 } from "lucide-react";
import { format, isToday, parseISO } from "date-fns";
import { useMemo, useState } from "react";
import { generateTodayPacketPdf } from "@/utils/todayPacketPdf";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function TodayPacket() {
  const activeRanchId = useStore(s => s.activeRanchId);
  const { data: allRanches = [] } = useRanches();
  const activeRanch = allRanches.find(r => r.id === activeRanchId);
  const { data: allBlocks = [] } = useBlocks(activeRanchId);
  const { data: allLogs = [] } = useFieldLogs(activeRanchId);
  const { data: allApps = [] } = useChemicalApps(activeRanchId);
  const { toast } = useToast();
  
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Derive "Today" boundaries (local time logic based on ISO strings for MVP)
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  
  const todayLogs = useMemo(() => 
    allLogs.filter(l => l.ranchId === activeRanchId && l.date.startsWith(todayStr))
  , [allLogs, activeRanchId, todayStr]);

  const todayBlockIds = Array.from(new Set(todayLogs.map(l => l.blockId)));
  const todayBlocks = allBlocks.filter(b => todayBlockIds.includes(b.id));
  
  const todayApps = useMemo(() => 
    allApps.filter(a => a.ranchId === activeRanchId && a.dateApplied.startsWith(todayStr))
  , [allApps, activeRanchId, todayStr]);

  // Compute Totals
  const totals = useMemo(() => {
    let acres = 0;
    let spend = 0;
    const materials: Record<string, { amount: number, unit: string }> = {};

    todayBlocks.forEach(b => acres += b.acreage);
    
    todayLogs.forEach(log => {
      // Spend
      const app = todayApps.find(a => a.id === `app-${log.id}`);
      if (app && app.estimatedCost && app.costStatus !== 'UNIT_MISMATCH') {
        spend += app.estimatedCost;
      }
      
      // Materials (Very naive sum for MVP, real system needs unit conversion)
      if (log.amount && log.material) {
        let isPerAcre = log.unit.toLowerCase().includes('/ac');
        let totalAmount = isPerAcre ? log.amount * (allBlocks.find(b => b.id === log.blockId)?.acreage || 1) : log.amount;
        let baseUnit = log.unit.replace('/ac', '').replace('/AC', '');
        
        const key = `${log.material}|${baseUnit}`;
        if (!materials[key]) {
          materials[key] = { amount: 0, unit: baseUnit };
        }
        materials[key].amount += totalAmount;
      }
    });

    const formattedMaterials: Record<string, string> = {};
    Object.entries(materials).forEach(([key, data]) => {
      const [mat] = key.split('|');
      formattedMaterials[mat] = `${data.amount.toFixed(1)} ${data.unit}`;
    });

    return { acres, spend, materials: formattedMaterials };
  }, [todayBlocks, todayLogs, todayApps, allBlocks]);

  // Compute Issues
  const anomalies = useMemo(() => {
    const mismatch = todayApps.filter(a => a.costStatus === 'UNIT_MISMATCH');
    const missingRates = todayLogs.filter(l => !l.amount || l.amount <= 0);
    return {
      mismatch,
      missingRates,
      count: mismatch.length + missingRates.length
    };
  }, [todayApps, todayLogs]);

  const handleGeneratePdf = () => {
    setIsGenerating(true);
    // Slight delay to allow UI to show loading state
    setTimeout(() => {
      try {
        const url = generateTodayPacketPdf({
          date: new Date(),
          ranchName: activeRanch?.name || "Ranch",
          blocks: todayBlocks,
          logs: todayLogs,
          apps: todayApps,
          totals,
          issuesCount: anomalies.count
        });
        setPdfUrl(url);
        toast({ title: "PDF Generated", description: "Packet is ready to share." });
      } catch (e) {
        toast({ title: "Error", description: "Failed to generate PDF.", variant: "destructive" });
      } finally {
        setIsGenerating(false);
      }
    }, 500);
  };

  const copySummary = () => {
    const text = `RanchUp Update: ${activeRanch?.name || ''} - ${format(new Date(), 'MMM d')}
Touched ${todayBlocks.length} blocks (${totals.acres.toFixed(1)} ac).
View full packet in app.`;
    
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };

  const smsLink = `sms:?&body=${encodeURIComponent(`Here is today's field packet for ${activeRanch?.name}. Open RanchUp app to view.`)}`;
  const emailLink = `mailto:?subject=Today's Packet - ${activeRanch?.name}&body=${encodeURIComponent(`Please find today's logs for ${totals.acres.toFixed(1)} acres attached in the app.`)}`;

  return (
    <div className="animate-in fade-in duration-500 max-w-2xl mx-auto pb-24">
      <div className="flex justify-between items-center mb-6">
        <Link href="/app" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Link>
      </div>

      <header className="mb-8">
        <div className="flex items-center gap-3 text-primary mb-2">
          <Send className="w-6 h-6" />
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Today's Packet</h1>
        </div>
        <p className="text-gray-400 font-medium">{format(new Date(), 'EEEE, MMMM d, yyyy')} • {activeRanch?.name}</p>
      </header>

      {todayLogs.length === 0 ? (
        <div className="bg-[#111113] border border-white/10 p-8 rounded-lg text-center flex flex-col items-center">
          <CheckCircle2 className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
          <h2 className="font-bold text-lg mb-2">No logs today</h2>
          <p className="text-muted-foreground mb-6">Start logging to build today's packet.</p>
          <Link href="/app/log">
            <Button className="font-bold uppercase tracking-widest text-xs">Start Quick Log</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Action Card */}
          <div className="bg-card border border-primary/30 p-5 rounded-xl shadow-[0_0_20px_rgba(234,153,61,0.05)]">
            {!pdfUrl ? (
              <Button 
                onClick={handleGeneratePdf} 
                disabled={isGenerating}
                className="w-full h-14 text-base font-black uppercase tracking-widest gap-2"
              >
                {isGenerating ? "Generating..." : "Generate PDF Proof"}
              </Button>
            ) : (
              <div className="space-y-3">
                <a href={pdfUrl} target="_blank" rel="noreferrer" className="flex">
                  <Button variant="outline" className="w-full h-12 gap-2 border-primary/50 text-primary hover:bg-primary/10">
                    <Download className="w-4 h-4" /> Download PDF
                  </Button>
                </a>
                <div className="grid grid-cols-2 gap-3">
                  <a href={smsLink} className="flex">
                    <Button variant="secondary" className="w-full gap-2 text-xs">
                      <MessageSquare className="w-3 h-3" /> Text
                    </Button>
                  </a>
                  <a href={emailLink} className="flex">
                    <Button variant="secondary" className="w-full gap-2 text-xs">
                      <Mail className="w-3 h-3" /> Email
                    </Button>
                  </a>
                </div>
                <Button onClick={copySummary} variant="ghost" className="w-full text-xs text-muted-foreground hover:text-white">
                  <Copy className="w-3 h-3 mr-2" /> Copy text summary
                </Button>
              </div>
            )}
          </div>

          {/* Issues Warning */}
          {anomalies.count > 0 && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-red-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  {anomalies.count} Issues to Review
                </h3>
                <p className="text-xs text-red-400/80 mt-1">Fix missing rates or unit mismatches before sending to manager.</p>
              </div>
              <Link href="/app/reports/variance">
                <Button size="sm" variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/20 w-full sm:w-auto text-xs uppercase tracking-widest">
                  Fix Now
                </Button>
              </Link>
            </div>
          )}

          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#111113] border border-white/5 p-4 rounded-lg">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Acres Touched</p>
              <p className="text-2xl font-black text-white">{totals.acres.toFixed(1)}</p>
            </div>
            <div className="bg-[#111113] border border-white/5 p-4 rounded-lg">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Est Spend</p>
              <p className="text-2xl font-black text-white">${totals.spend.toLocaleString()}</p>
            </div>
          </div>

          {/* Materials */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="p-4 border-b border-border bg-white/5">
              <h3 className="font-bold text-sm uppercase tracking-widest">Total Materials Applied</h3>
            </div>
            <div className="divide-y divide-border">
              {Object.keys(totals.materials).length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm">No materials logged.</div>
              ) : (
                Object.entries(totals.materials).map(([mat, amt]) => (
                  <div key={mat} className="p-3 px-4 flex justify-between items-center text-sm">
                    <span className="font-medium">{mat}</span>
                    <span className="font-bold text-primary">{amt}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Block Breakdowns */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4 px-1">Blocks Worked ({todayBlocks.length})</h3>
            <div className="space-y-4">
              {todayBlocks.map(block => {
                const blockLogs = todayLogs.filter(l => l.blockId === block.id);
                return (
                  <div key={block.id} className="bg-card border border-border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/5">
                      <h4 className="font-bold text-white">{block.name}</h4>
                      <span className="text-xs font-bold text-muted-foreground bg-[#111113] px-2 py-1 rounded">{block.acreage} AC</span>
                    </div>
                    <div className="space-y-2">
                      {blockLogs.map(log => {
                        const app = todayApps.find(a => a.id === `app-${log.id}`);
                        const hasIssue = app?.costStatus === 'UNIT_MISMATCH' || !log.amount;
                        return (
                          <div key={log.id} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                log.actionType === 'SPRAY' ? 'bg-purple-500/20 text-purple-400' :
                                log.actionType === 'FERT' ? 'bg-orange-500/20 text-orange-400' :
                                'bg-blue-500/20 text-blue-400'
                              }`}>
                                {log.actionType.substring(0,4)}
                              </span>
                              <span className={hasIssue ? "text-red-400" : "text-gray-300"}>{log.material}</span>
                            </div>
                            <span className={`font-bold ${hasIssue ? "text-red-400" : ""}`}>
                              {log.amount || '?'} {log.unit}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
