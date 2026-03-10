import { AlertCircle, Beaker } from "lucide-react";
import { useLocation } from "wouter";

export function DemoModeBanner() {
  const [location, setLocation] = useLocation();

  if (location.startsWith("/guild")) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-b border-primary/20 p-2 flex items-center justify-center gap-2">
      <Beaker className="w-3.5 h-3.5 text-primary" />
      <p className="text-[10px] font-bold uppercase tracking-widest text-foreground">
        <span className="text-primary mr-1">Demo Mode:</span> Data does not persist.
      </p>
    </div>
  );
}
