import { useStore } from "@/lib/store";
import { Link } from "wouter";
import { ArrowLeft, Download, CheckCircle2, FileText, AlertCircle, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RANCHUP_SEASON_TOC_V1, PacketState } from "@/lib/packets/packetSchemas";
import { buildPacket } from "@/lib/packets/buildPacket";
import { generatePdfFromBlocks, triggerPdfDownload } from "@/utils/pdf/generatePdf";

export default function PacketSeason() {
  const activeRanchId = useStore(s => s.activeRanchId);
  const activeRanch = useStore(s => s.ranches.find(r => r.id === activeRanchId));
  
  // Extract state first, then filter in useMemo to prevent infinite loops
  const allBlocks = useStore(s => s.blocks);
  const allLogs = useStore(s => s.logs);
  const allApps = useStore(s => s.chemicalApps);

  const blocks = useMemo(() => allBlocks.filter(b => b.ranchId === activeRanchId), [allBlocks, activeRanchId]);
  const logs = useMemo(() => allLogs.filter(l => l.ranchId === activeRanchId), [allLogs, activeRanchId]);
  const apps = useMemo(() => allApps.filter(a => a.ranchId === activeRanchId), [allApps, activeRanchId]);

  const { toast } = useToast();
  
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const issuesCount = useMemo(() => {
    return apps.filter(a => a.costStatus === 'UNIT_MISMATCH').length + 
           logs.filter(l => !l.amount || l.amount <= 0).length;
  }, [apps, logs]);

  const state: PacketState = useMemo(() => ({
    ranch: activeRanch,
    blocks,
    logs,
    apps,
    issuesCount,
    dateStart: new Date(new Date().getFullYear(), 0, 1),
    dateEnd: new Date()
  }), [activeRanch, blocks, logs, apps, issuesCount]);

  const handleGeneratePdf = () => {
    setIsGenerating(true);
    setTimeout(() => {
      try {
        const renderBlocks = buildPacket(RANCHUP_SEASON_TOC_V1, state);
        const url = generatePdfFromBlocks(renderBlocks, "RanchUp_Season_Packet.pdf");
        
        setPdfUrl(url);
        
        // Trigger actual download!
        triggerPdfDownload(url, "RanchUp_Season_Packet.pdf");
        
        toast({ title: "PDF Generated", description: "Season Audit Binder has been downloaded." });
      } catch (e) {
        console.error(e);
        toast({ title: "Error", description: "Failed to generate PDF.", variant: "destructive" });
      } finally {
        setIsGenerating(false);
      }
    }, 500);
  };

  const handleDownloadAgain = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pdfUrl) {
      triggerPdfDownload(pdfUrl, "RanchUp_Season_Packet.pdf");
    }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-2xl mx-auto pb-24">
      <div className="flex justify-between items-center mb-6">
        <Link href="/app/packets" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Packets
        </Link>
      </div>

      <header className="mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">Season Packet</h1>
        <p className="text-gray-400 font-medium">Audit Binder & Rollups</p>
      </header>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-[#111113] border border-border p-4 rounded-lg text-center">
          <p className="text-2xl font-black text-white">{logs.length}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Season Logs</p>
        </div>
        <div className="bg-[#111113] border border-border p-4 rounded-lg text-center">
          <p className="text-2xl font-black text-white">{blocks.length}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Blocks</p>
        </div>
        <div className={`border p-4 rounded-lg text-center ${issuesCount > 0 ? 'bg-red-500/10 border-red-500/30' : 'bg-[#111113] border-border'}`}>
          <p className={`text-2xl font-black ${issuesCount > 0 ? 'text-red-400' : 'text-white'}`}>{issuesCount}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Open Issues</p>
        </div>
      </div>

      {issuesCount > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Issues Detected
            </h3>
            <p className="text-xs text-red-400/80 mt-1">Audit binder will reflect unresolved flags.</p>
          </div>
          <Link href="/app/reports/variance">
            <Button size="sm" variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/20 w-full sm:w-auto text-xs uppercase tracking-widest">
              Fix Now
            </Button>
          </Link>
        </div>
      )}

      {/* TOC Preview */}
      <div className="bg-[#111113] border border-border rounded-xl mb-8 overflow-hidden">
        <div className="p-4 border-b border-border bg-white/5 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-sm uppercase tracking-widest">Table of Contents Preview</h3>
        </div>
        <div className="divide-y divide-border">
          {RANCHUP_SEASON_TOC_V1.map((section) => {
            const isIncluded = section.includeIf(state);
            return (
              <div key={section.id} className="p-3 px-4 flex items-center gap-3">
                {isIncluded ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-muted-foreground/30" />
                )}
                <span className={`text-sm font-medium ${isIncluded ? 'text-foreground' : 'text-muted-foreground line-through'}`}>
                  {section.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-card border border-primary/30 p-6 rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.05)] text-center">
        {!pdfUrl ? (
          <Button 
            onClick={handleGeneratePdf} 
            disabled={isGenerating}
            className="w-full h-14 text-base font-black uppercase tracking-widest gap-2"
          >
            {isGenerating ? "Compiling Audit Binder..." : "Generate PDF"}
          </Button>
        ) : (
          <Button 
            onClick={handleDownloadAgain}
            className="w-full h-14 gap-2 text-base font-black uppercase tracking-widest"
          >
            <Download className="w-5 h-5" /> Download Season Packet Again
          </Button>
        )}
      </div>
    </div>
  );
}
