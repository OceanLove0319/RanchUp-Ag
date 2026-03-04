import { AlertCircle } from "lucide-react";

interface RedBadgeProps {
  count: number;
  className?: string;
  showIcon?: boolean;
}

export function RedBadge({ count, className = "", showIcon = true }: RedBadgeProps) {
  if (count <= 0) return null;
  
  return (
    <div className={`flex items-center gap-1 bg-red-500/10 border border-red-500/20 text-red-500 px-2 py-0.5 rounded-full ${className}`}>
      {showIcon && <AlertCircle className="w-3 h-3" />}
      <span className="text-[10px] font-black">{count} issue{count > 1 ? 's' : ''}</span>
    </div>
  );
}
