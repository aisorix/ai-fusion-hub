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
        <Button variant="outline" size="sm" className="h-9 gap-2 w-full sm:w-auto justify-between sm:justify-center">
          <span className="flex items-center gap-2 min-w-0">
            <CalendarIcon className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-xs font-medium truncate">{PRESET_LABEL[range.preset]}</span>
          </span>
          <ChevronDown className="w-3.5 h-3.5 opacity-60 flex-shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[calc(100vw-1.5rem)] sm:w-auto max-w-[680px] p-0 pointer-events-auto"
        align="start"
      >
        <div className="flex flex-col sm:flex-row max-h-[80vh] overflow-y-auto">
          <div className="w-full sm:w-44 border-b sm:border-b-0 sm:border-r border-border p-2 grid grid-cols-3 sm:block gap-1 sm:gap-0 sm:space-y-0.5">
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
            <div className="hidden sm:block my-1 border-t border-border" />
            <div className="hidden sm:block px-2.5 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">Custom range</div>
          </div>
          <div className="p-3 space-y-2 overflow-x-auto">
            <Calendar
              mode="range"
              selected={{ from, to }}
              onSelect={(r: any) => { setFrom(r?.from); setTo(r?.to); }}
              numberOfMonths={1}
              className="pointer-events-auto sm:hidden"
            />
            <Calendar
              mode="range"
              selected={{ from, to }}
              onSelect={(r: any) => { setFrom(r?.from); setTo(r?.to); }}
              numberOfMonths={2}
              className="pointer-events-auto hidden sm:block"
            />
            <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-muted-foreground">
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
