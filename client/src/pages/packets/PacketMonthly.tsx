import { useStore } from "@/lib/store";
import { Link } from "wouter";
import { ArrowLeft, Download, MessageSquare, Mail, Copy, CheckCircle2, FileText, AlertCircle } from "lucide-react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RANCHUP_SEASON_TOC_V1, PacketState } from "@/lib/packets/packetSchemas";
import { buildPacket } from "@/lib/packets/buildPacket";
import { generatePdfFromBlocks, triggerPdfDownload } from "@/utils/pdf/generatePdf";

export default function PacketMonthly() {
  const activeRanchId = useStore(s => s.activeRanchId);
  const activeRanch = useStore(s => s.ranches.find(r => r.id === activeRanchId));
  
  // Extract full arrays first to prevent infinite loop on update
  const allBlocks = useStore(s => s.blocks);
  const allLogs = useStore(s => s.logs);
  const allApps = useStore(s => s.chemicalApps);
  
  const { toast } = useToast();
  
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Date Range (Current Month)
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const logs = useMemo(() => 
    allLogs.filter(l => {
      if (l.ranchId !== activeRanchId) return false;
      const d = new Date(l.date);
      return d >= monthStart && d <= monthEnd;
    })
  , [allLogs, activeRanchId, monthStart, monthEnd]);

  const blocks = useMemo(() => {
    const blockIds = Array.from(new Set(logs.map(l => l.blockId)));
    return allBlocks.filter(b => blockIds.includes(b.id));
  }, [allBlocks, logs]);
  
  const apps = useMemo(() => 
    allApps.filter(a => {
      if (a.ranchId !== activeRanchId) return false;
      const d = new Date(a.dateApplied);
      return d >= monthStart && d <= monthEnd;
    })
  , [allApps, activeRanchId, monthStart, monthEnd]);

  const issuesCount = useMemo(() => {
    return apps.filter(a => a.costStatus === 'UNIT_MISMATCH').length + 
           logs.filter(l => !l.amount || l.amount <= 0).length;
  }, [apps, logs]);

  const filename = `RanchUp_${format(now, 'MMMM')}_Packet.pdf`;

  const handleGeneratePdf = () => {
    setIsGenerating(true);
    setTimeout(() => {
      try {
        const state: PacketState = {
          ranch: activeRanch,
          blocks,
          logs,
          apps,
          issuesCount,
          dateStart: monthStart,
          dateEnd: monthEnd
        };
        
        const renderBlocks = buildPacket(RANCHUP_SEASON_TOC_V1, state);
        const url = generatePdfFromBlocks(renderBlocks, filename);
        
        setPdfUrl(url);
        
        // Automatically trigger actual download
        triggerPdfDownload(url, filename);
        
        toast({ title: "PDF Generated", description: "Monthly Packet has been downloaded." });
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
      triggerPdfDownload(pdfUrl, filename);
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
        <h1 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">Monthly Packet</h1>
        <p className="text-gray-400 font-medium">Review bundle for {format(now, 'MMMM yyyy')}</p>
      </header>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-[#111113] border border-border p-4 rounded-lg text-center">
          <p className="text-2xl font-black text-white">{logs.length}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Logs</p>
        </div>
        <div className="bg-[#111113] border border-border p-4 rounded-lg text-center">
          <p className="text-2xl font-black text-white">{blocks.length}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Blocks</p>
        </div>
        <div className={`border p-4 rounded-lg text-center ${issuesCount > 0 ? 'bg-red-500/10 border-red-500/30' : 'bg-[#111113] border-border'}`}>
          <p className={`text-2xl font-black ${issuesCount > 0 ? 'text-red-400' : 'text-white'}`}>{issuesCount}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Issues</p>
        </div>
      </div>

      {issuesCount > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Issues Detected
            </h3>
            <p className="text-xs text-red-400/80 mt-1">Please review and resolve missing data before sending to the PCA.</p>
          </div>
          <Link href="/app/reports/variance">
            <Button size="sm" variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/20 w-full sm:w-auto text-xs uppercase tracking-widest">
              Fix Now
            </Button>
          </Link>
        </div>
      )}

      <div className="bg-card border border-primary/30 p-6 rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.05)] text-center">
        {!pdfUrl ? (
          <Button 
            onClick={handleGeneratePdf} 
            disabled={isGenerating || logs.length === 0}
            className="w-full h-14 text-base font-black uppercase tracking-widest gap-2"
          >
            {isGenerating ? "Generating..." : "Generate PDF"}
          </Button>
        ) : (
          <div className="space-y-4">
            <Button 
              variant="outline" 
              onClick={handleDownloadAgain}
              className="w-full h-12 gap-2 border-primary/50 text-primary hover:bg-primary/10"
            >
              <Download className="w-4 h-4" /> Download PDF Again
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <a href={`sms:?&body=${encodeURIComponent("Monthly Packet from RanchUp is ready for review.")}`} className="flex">
                <Button variant="secondary" className="w-full gap-2 text-xs">
                  <MessageSquare className="w-4 h-4" /> Text
                </Button>
              </a>
              <a href={`mailto:?subject=${format(now, 'MMMM')} Packet Review`} className="flex">
                <Button variant="secondary" className="w-full gap-2 text-xs">
                  <Mail className="w-4 h-4" /> Email
                </Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
