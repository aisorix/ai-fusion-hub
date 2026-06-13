import { useState } from "react";
import { Calendar as CalendarIcon, ChevronDown, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useAdminRange, RangePreset } from "../context/AdminRangeContext";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const PRESETS: { id: RangePreset; label: string }[] = [
  { id: "today",      label: "Today" },
  { id: "yesterday",  label: "Yesterday" },
  { id: "24h",        label: "Last 24 hours" },
  { id: "7d",         label: "Last 7 days" },
  { id: "14d",        label: "Last 14 days" },
  { id: "30d",        label: "Last 30 days" },
  { id: "90d",        label: "Last 90 days" },
  { id: "this_month", label: "This month" },
  { id: "1y",         label: "Last 1 year" },
];

const PRESET_LABEL: Record<RangePreset, string> = Object.fromEntries(
  [...PRESETS.map(p => [p.id, p.label] as const), ["custom", "Custom"] as const]
) as any;

export default function DateRangePicker() {
  const { range, setPreset, setCustom } = useAdminRange();
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState<Date | undefined>(new Date(range.from));
  const [to, setTo] = useState<Date | undefined>(new Date(range.to));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-2">
          <CalendarIcon className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">{PRESET_LABEL[range.preset]}</span>
          <ChevronDown className="w-3.5 h-3.5 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 pointer-events-auto" align="end">
        <div className="flex">
          <div className="w-44 border-r border-border p-2 space-y-0.5">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => { setPreset(p.id); setOpen(false); }}
                className={cn(
                  "w-full text-left text-xs px-2.5 py-1.5 rounded-md hover:bg-muted transition-colors",
                  range.preset === p.id && "bg-muted font-medium"
                )}
              >
                {p.label}
              </button>
            ))}
            <div className="my-1 border-t border-border" />
            <div className="px-2.5 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">Custom range</div>
          </div>
          <div className="p-3 space-y-2">
            <Calendar
              mode="range"
              selected={{ from, to }}
              onSelect={(r: any) => { setFrom(r?.from); setTo(r?.to); }}
              numberOfMonths={2}
              className="pointer-events-auto"
            />
            <div className="flex items-center justify-between gap-2 px-1 text-xs text-muted-foreground">
              <span>
                {from ? format(from, "MMM d, yyyy") : "Start"} – {to ? format(to, "MMM d, yyyy") : "End"}
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => setOpen(false)}><X className="w-3.5 h-3.5" /></Button>
                <Button
                  size="sm"
                  disabled={!from || !to}
                  onClick={() => {
                    if (from && to) {
                      setCustom(from.toISOString(), to.toISOString());
                      setOpen(false);
                    }
                  }}
                >Apply</Button>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
