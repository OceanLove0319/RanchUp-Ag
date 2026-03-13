import { useStore } from "@/lib/store";
import { useAuth } from "@/hooks/useAuth";
import { useRanches, useBlocks, useFieldLogs, useChemicalApps } from "@/hooks/useData";
import { Link } from "wouter";
import { ArrowLeft, Download, CheckCircle2, FileText, AlertCircle, BookOpen, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RANCHUP_SEASON_TOC_V1, PacketState } from "@/lib/packets/packetSchemas";
import { buildPacket } from "@/lib/packets/buildPacket";
import { generatePdfFromBlocks, triggerPdfDownload } from "@/utils/pdf/generatePdf";
import { Badge } from "@/components/ui/badge";

export default function PacketSeason() {
  const { user } = useAuth();
  const isPCA = user?.role === 'PCA';
  const activeRanchId = useStore(s => s.activeRanchId);
  const { data: allRanches = [] } = useRanches();
  const activeRanch = allRanches.find(r => r.id === activeRanchId);

  const { data: allBlocks = [] } = useBlocks(activeRanchId);
  const { data: allLogs = [] } = useFieldLogs(activeRanchId);
  const { data: allApps = [] } = useChemicalApps(activeRanchId);

  const { toast } = useToast();
  
  const [pdfUrls, setPdfUrls] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState<Record<string, boolean>>({});

  // --------------------------------------------------------------------------------
  // PCA EXPORT VIEW (All Ranches Readiness)
  // --------------------------------------------------------------------------------
  if (isPCA) {
    const ranchReadiness = useMemo(() => {
      return allRanches.map(ranch => {
        const ranchApps = allApps.filter(a => a.ranchId === ranch.id);
        const ranchLogs = allLogs.filter(l => l.ranchId === ranch.id);
        
        const issuesCount = ranchApps.filter(a => a.costStatus === 'UNIT_MISMATCH' || !a.estimatedCost ).length + 
                           ranchLogs.filter(l => !l.amount || l.amount <= 0).length;

        return {
          ...ranch,
          issuesCount,
          isReady: issuesCount === 0
        };
      });
    }, [allRanches, allApps, allLogs]);

    const handleGenerateRanchPdf = (ranchId: string) => {
      setIsGenerating(prev => ({ ...prev, [ranchId]: true }));
      
      const ranch = allRanches.find(r => r.id === ranchId);
      const blocks = allBlocks.filter(b => b.ranchId === ranchId);
      const logs = allLogs.filter(l => l.ranchId === ranchId);
      const apps = allApps.filter(a => a.ranchId === ranchId);
      
      const state: PacketState = {
        ranch,
        blocks,
        logs,
        apps,
        issuesCount: 0,
        dateStart: new Date(new Date().getFullYear(), 0, 1),
        dateEnd: new Date()
      };

      setTimeout(() => {
        try {
          const renderBlocks = buildPacket(RANCHUP_SEASON_TOC_V1, state);
          const fileName = `${ranch?.name.replace(/\s+/g, '_')}_Season_Packet.pdf`;
          const url = generatePdfFromBlocks(renderBlocks, fileName);
          
          setPdfUrls(prev => ({ ...prev, [ranchId]: url }));
          triggerPdfDownload(url, fileName);
          
          toast({ title: "PDF Generated", description: `${ranch?.name} Season Binder downloaded.` });
        } catch (e) {
          console.error(e);
          toast({ title: "Error", description: "Failed to generate PDF.", variant: "destructive" });
        } finally {
          setIsGenerating(prev => ({ ...prev, [ranchId]: false }));
        }
      }, 500);
    };

    return (
      <div className="animate-in fade-in duration-500 max-w-4xl mx-auto pb-24">
        <div className="flex justify-between items-center mb-6">
          <Link href="/app" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" /> Command Center
          </Link>
        </div>

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-foreground mb-2">Export Season Proof</h1>
          <p className="text-muted-foreground font-medium text-lg">Clean records create clean proof. Generate compliance and billing packets.</p>
        </header>

        <div className="space-y-4">
          {ranchReadiness.map(ranch => (
            <div key={ranch.id} className="bg-card border border-border p-5 rounded-xl flex flex-col md:flex-row justify-between md:items-center gap-4 hover:border-primary/50 transition-colors shadow-sm">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-xl text-foreground">{ranch.name}</h3>
                  {ranch.isReady ? (
                    <Badge variant="outline" className="text-[10px] uppercase tracking-widest text-green-400 border-green-400/30 bg-green-400/10">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Ready to Export
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] uppercase tracking-widest text-red-400 border-red-400/30 bg-red-400/10">
                      Not Ready
                    </Badge>
                  )}
                </div>
                
                {ranch.isReady ? (
                  <p className="text-sm text-muted-foreground">This ranch is export-ready. All records and applications are complete.</p>
                ) : (
                  <p className="text-sm text-red-400 font-medium">{ranch.issuesCount} issue{ranch.issuesCount !== 1 ? 's' : ''} need cleanup before export.</p>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                {!ranch.isReady ? (
                  <Link href="/app/reports/variance">
                    <Button className="w-full bg-red-500/20 text-red-500 hover:bg-red-500/30 font-bold uppercase tracking-widest h-12">
                      Fix Blockers
                    </Button>
                  </Link>
                ) : pdfUrls[ranch.id] ? (
                  <Button 
                    onClick={() => triggerPdfDownload(pdfUrls[ranch.id], `${ranch.name.replace(/\s+/g, '_')}_Season_Packet.pdf`)}
                    className="w-full bg-green-600/20 text-green-500 hover:bg-green-600/30 font-bold uppercase tracking-widest h-12 gap-2"
                  >
                    <Download className="w-4 h-4" /> Download Again
                  </Button>
                ) : (
                  <Button 
                    onClick={() => handleGenerateRanchPdf(ranch.id)}
                    disabled={isGenerating[ranch.id]}
                    className="w-full font-bold uppercase tracking-widest h-12 shadow-sm gap-2"
                  >
                    {isGenerating[ranch.id] ? "Compiling..." : <><FileText className="w-4 h-4" /> Export Packet</>}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------------
  // GROWER VIEW (Active Ranch Only)
  // --------------------------------------------------------------------------------
  const blocks = useMemo(() => allBlocks.filter(b => b.ranchId === activeRanchId), [allBlocks, activeRanchId]);
  const logs = useMemo(() => allLogs.filter(l => l.ranchId === activeRanchId), [allLogs, activeRanchId]);
  const apps = useMemo(() => allApps.filter(a => a.ranchId === activeRanchId), [allApps, activeRanchId]);

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isGeneratingGrower, setIsGeneratingGrower] = useState(false);

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
    setIsGeneratingGrower(true);
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
        setIsGeneratingGrower(false);
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
        <Link href="/app" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
      </div>

      <header className="mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">Print Proof</h1>
        <p className="text-gray-400 font-medium">Generate your season audit packet.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#111113] border border-border p-5 rounded-xl text-center shadow-sm">
          <p className="text-3xl font-black text-white">{logs.length}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Season Logs</p>
        </div>
        <div className="bg-[#111113] border border-border p-5 rounded-xl text-center shadow-sm">
          <p className="text-3xl font-black text-white">{blocks.length}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Blocks</p>
        </div>
        <div className={`border p-5 rounded-xl text-center shadow-sm ${issuesCount > 0 ? 'bg-red-500/10 border-red-500/30' : 'bg-[#111113] border-border'}`}>
          <p className={`text-3xl font-black ${issuesCount > 0 ? 'text-red-400' : 'text-white'}`}>{issuesCount}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Missing Info</p>
        </div>
      </div>

      {issuesCount > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div>
            <h3 className="font-bold text-red-400 flex items-center gap-2 text-lg">
              <AlertCircle className="w-5 h-5" /> Heads Up: Missing Info
            </h3>
            <p className="text-sm text-red-400/80 mt-1">Some logs are missing rates or acreage.</p>
          </div>
          <Link href="/app/reports/variance">
            <Button size="lg" variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/20 w-full sm:w-auto text-sm font-bold uppercase tracking-widest py-6">
              Fix Now
            </Button>
          </Link>
        </div>
      )}

      {/* TOC Preview */}
      <div className="bg-[#111113] border border-border rounded-xl mb-8 overflow-hidden">
        <div className="p-4 border-b border-border bg-white/5 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-sm uppercase tracking-widest">What's inside</h3>
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

      <div className="bg-card border border-primary/30 p-6 rounded-xl shadow-[0_0_20px_rgba(234,153,61,0.05)] text-center">
        {!pdfUrl ? (
          <Button 
            onClick={handleGeneratePdf} 
            disabled={isGeneratingGrower}
            className="w-full h-14 text-base font-black uppercase tracking-widest gap-2"
          >
            {isGeneratingGrower ? "Compiling Packet..." : "Print Season Packet"}
          </Button>
        ) : (
          <Button 
            onClick={handleDownloadAgain}
            className="w-full h-14 gap-2 text-base font-black uppercase tracking-widest"
          >
            <Download className="w-5 h-5" /> Download Packet Again
          </Button>
        )}
      </div>
    </div>
  );
}
