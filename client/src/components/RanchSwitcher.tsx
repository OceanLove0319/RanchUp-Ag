import { useStore } from "@/lib/store";
import { MapPin } from "lucide-react";

export default function RanchSwitcher() {
  const ranches = useStore(s => s.ranches);
  const activeRanchId = useStore(s => s.activeRanchId);
  const setActiveRanch = useStore(s => s.setActiveRanch);

  if (ranches.length === 0) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-border rounded-md w-full md:w-auto">
      <MapPin className="w-4 h-4 text-primary shrink-0" />
      <select 
        value={activeRanchId || ""}
        onChange={(e) => setActiveRanch(e.target.value)}
        className="bg-transparent text-sm font-bold uppercase tracking-wider text-white focus:outline-none appearance-none cursor-pointer w-full"
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
