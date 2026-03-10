import { useMemo } from "react";
import { Link } from "wouter";
import { useStore } from "@/lib/store";
import { format } from "date-fns";
import { ClipboardList, ArrowLeft, CheckCircle2, AlertCircle, Clock, Map } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Recommendations() {
  const allRecommendations = useStore(s => s.recommendations) || [];
  const allRanches = useStore(s => s.ranches);
  const allBlocks = useStore(s => s.blocks);
  
  // Sort recommendations: pending/draft first, then by date
  const sortedRecs = useMemo(() => {
    return [...allRecommendations].sort((a, b) => {
      const statusWeight = {
        'DRAFT': 0,
        'SENT': 1,
        'PENDING': 2,
        'ACKNOWLEDGED': 3,
        'APPLIED': 4,
        'CLOSED': 5
      };
      
      const weightA = statusWeight[a.status as keyof typeof statusWeight] ?? 99;
      const weightB = statusWeight[b.status as keyof typeof statusWeight] ?? 99;
      
      if (weightA !== weightB) return weightA - weightB;
      
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [allRecommendations]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'SENT': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'PENDING': return 'bg-amber-500/20 text-amber-500 border-amber-500/30';
      case 'ACKNOWLEDGED': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'APPLIED': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'CLOSED': return 'bg-neutral-800 text-neutral-500 border-neutral-700';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DRAFT': return <ClipboardList className="w-3 h-3" />;
      case 'SENT': return <ArrowLeft className="w-3 h-3 rotate-135" />;
      case 'PENDING': return <Clock className="w-3 h-3" />;
      case 'ACKNOWLEDGED': return <AlertCircle className="w-3 h-3" />;
      case 'APPLIED': return <CheckCircle2 className="w-3 h-3" />;
      case 'CLOSED': return <CheckCircle2 className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-6">
        <Link href="/app" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors">
          New Rec
        </button>
      </div>

      <header className="mb-8">
        <div className="flex items-center gap-3 text-blue-400 mb-2">
          <ClipboardList className="w-8 h-8" />
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-foreground">Recommendations</h1>
        </div>
        <p className="text-muted-foreground font-medium text-lg">Manage open recommendations and track grower progress.</p>
      </header>

      <div className="space-y-4">
        {sortedRecs.map(rec => {
          const ranch = allRanches.find(r => r.id === rec.ranchId);
          const block = allBlocks.find(b => b.id === rec.blockId);
          
          return (
            <div key={rec.id} className="bg-card border border-border p-5 rounded-xl hover:border-primary/50 transition-colors">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusColor(rec.status)}`}>
                      {getStatusIcon(rec.status)}
                      {rec.status}
                    </div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      {format(new Date(rec.date), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <h3 className="font-bold text-foreground text-xl leading-tight">{rec.title}</h3>
                  
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-2">
                    <Map className="w-4 h-4 flex-shrink-0" />
                    <span>{ranch?.name} • {block?.name}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 w-full md:w-auto md:justify-end">
                  {rec.cropStage && (
                    <Badge variant="outline" className="bg-background py-1.5 px-3 text-sm">
                      Stage: {rec.cropStage}
                    </Badge>
                  )}
                  {rec.product && (
                    <Badge variant="outline" className="bg-background text-primary border-primary/30 py-1.5 px-3 text-sm">
                      {rec.product}
                    </Badge>
                  )}
                </div>
              </div>
              
              {rec.notes && (
                <div className="bg-background border border-border p-4 rounded-lg text-base text-muted-foreground">
                  <span className="font-bold text-foreground mr-2">Note:</span>
                  {rec.notes}
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t border-border flex flex-col sm:flex-row justify-end gap-3">
                <button className="px-4 py-4 sm:py-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors border border-border sm:border-none rounded-lg sm:rounded-none w-full sm:w-auto">
                  Edit
                </button>
                {rec.status === 'DRAFT' && (
                  <button className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 px-6 py-4 sm:py-2 rounded-lg text-sm font-bold uppercase tracking-widest transition-colors w-full sm:w-auto">
                    Send to Grower
                  </button>
                )}
                {(rec.status === 'SENT' || rec.status === 'PENDING') && (
                  <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-4 sm:py-2 rounded-lg text-sm font-bold uppercase tracking-widest transition-colors w-full sm:w-auto shadow-sm">
                    Mark Applied
                  </button>
                )}
              </div>
            </div>
          );
        })}
        
        {sortedRecs.length === 0 && (
          <div className="text-center p-12 bg-card border border-border border-dashed rounded-xl">
            <ClipboardList className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-bold text-foreground mb-1">No Recommendations</h3>
            <p className="text-muted-foreground text-sm">You haven't created any recommendations yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
