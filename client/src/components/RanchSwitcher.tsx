import { useStore } from "@/lib/store";
import { useRanches } from "@/hooks/useData";
import { MapPin } from "lucide-react";
import { useEffect } from "react";

export default function RanchSwitcher({ compact = false }: { compact?: boolean }) {
  const { data: ranches = [] } = useRanches();
  const activeRanchId = useStore(s => s.activeRanchId);
  const setActiveRanch = useStore(s => s.setActiveRanch);

  // Auto-select first ranch if none selected
  useEffect(() => {
    if (ranches.length > 0 && !activeRanchId) {
      setActiveRanch(ranches[0].id);
    }
  }, [ranches, activeRanchId, setActiveRanch]);

  if (ranches.length === 0) return null;

  return (
    <div className={`flex items-center gap-2 bg-white/5 border border-border rounded-md ${compact ? 'px-2 py-1' : 'px-3 py-2 w-full md:w-auto'}`}>
      <MapPin className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} text-primary shrink-0`} />
      <select
        value={activeRanchId || ""}
        onChange={(e) => setActiveRanch(e.target.value)}
        className={`bg-transparent font-bold uppercase tracking-wider text-white focus:outline-none appearance-none cursor-pointer w-full ${compact ? 'text-xs max-w-[120px]' : 'text-sm'}`}
      >
        {ranches.map(r => (
          <option key={r.id} value={r.id} className="bg-background text-foreground">
            {r.name}
          </option>
        ))}
      </select>
    </div>
  );
}
