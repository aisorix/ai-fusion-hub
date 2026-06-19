import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
  tone?: "default" | "positive" | "warning" | "danger";
  className?: string;
}

const toneClasses = {
  default: "text-foreground",
  positive: "text-emerald-500",
  warning: "text-amber-500",
  danger: "text-rose-500",
};

export default function KpiCard({ label, value, hint, icon, tone = "default", className }: Props) {
  return (
    <Card className={cn("p-4 sm:p-5 bg-card border-border", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <p className="text-[11px] sm:text-xs uppercase tracking-wider text-muted-foreground truncate">{label}</p>
          <p className={cn("text-xl sm:text-2xl font-bold tabular-nums break-all", toneClasses[tone])}>{value}</p>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
        {icon && <div className="p-2 rounded-lg bg-muted text-muted-foreground flex-shrink-0">{icon}</div>}
      </div>
    </Card>
  );
}
