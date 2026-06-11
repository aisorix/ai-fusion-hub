import { cn } from "@/lib/utils";

const toneMap: Record<string, string> = {
  open: "bg-sky-50 text-sky-700 border-sky-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  closed: "bg-slate-100 text-slate-600 border-slate-200",
  low: "bg-slate-100 text-slate-600 border-slate-200",
  normal: "bg-sky-50 text-sky-700 border-sky-200",
  high: "bg-amber-50 text-amber-700 border-amber-200",
  urgent: "bg-rose-50 text-rose-700 border-rose-200",
  info: "bg-sky-50 text-sky-700 border-sky-200",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warn: "bg-amber-50 text-amber-700 border-amber-200",
  critical: "bg-rose-50 text-rose-700 border-rose-200",
  on: "bg-emerald-50 text-emerald-700 border-emerald-200",
  off: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function StatusPill({ value, className }: { value: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border capitalize", toneMap[value] ?? "bg-slate-100 text-slate-600 border-slate-200", className)}>
      {value}
    </span>
  );
}
