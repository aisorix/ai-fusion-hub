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
  default: "text-slate-900",
  positive: "text-emerald-600",
  warning: "text-amber-600",
  danger: "text-rose-600",
};

export default function KpiCard({ label, value, hint, icon, tone = "default", className }: Props) {
  return (
    <Card className={cn("p-5 bg-white border-slate-200", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <p className="text-xs uppercase tracking-wider text-slate-500 truncate">{label}</p>
          <p className={cn("text-2xl font-bold tabular-nums", toneClasses[tone])}>{value}</p>
          {hint && <p className="text-xs text-slate-500">{hint}</p>}
        </div>
        {icon && <div className="p-2 rounded-lg bg-slate-100 text-slate-600">{icon}</div>}
      </div>
    </Card>
  );
}
