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
  default: "text-slate-100",
  positive: "text-emerald-400",
  warning: "text-amber-400",
  danger: "text-rose-400",
};

export default function KpiCard({ label, value, hint, icon, tone = "default", className }: Props) {
  return (
    <Card className={cn("p-5 bg-slate-900/60 border-slate-800", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <p className="text-xs uppercase tracking-wider text-slate-400 truncate">{label}</p>
          <p className={cn("text-2xl font-bold tabular-nums", toneClasses[tone])}>{value}</p>
          {hint && <p className="text-xs text-slate-500">{hint}</p>}
        </div>
        {icon && <div className="p-2 rounded-lg bg-slate-800/60 text-slate-300">{icon}</div>}
      </div>
    </Card>
  );
}
