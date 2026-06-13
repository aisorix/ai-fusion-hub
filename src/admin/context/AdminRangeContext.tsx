import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";

export type RangePreset =
  | "today" | "yesterday" | "24h" | "7d" | "14d" | "30d" | "90d"
  | "this_month" | "1y" | "custom";

export interface DateRange {
  from: string;       // ISO
  to: string;         // ISO
  preset: RangePreset;
}

function computeRange(preset: RangePreset, customFrom?: string, customTo?: string): DateRange {
  const now = new Date();
  const to = now.toISOString();
  const startOf = (d: Date) => { d.setHours(0,0,0,0); return d; };
  const cloneDays = (n: number) => new Date(now.getTime() - n * 86400000);
  switch (preset) {
    case "today":      return { from: startOf(new Date()).toISOString(), to, preset };
    case "yesterday": {
      const y = startOf(cloneDays(1));
      const yEnd = new Date(y); yEnd.setHours(23,59,59,999);
      return { from: y.toISOString(), to: yEnd.toISOString(), preset };
    }
    case "24h":        return { from: cloneDays(1).toISOString(), to, preset };
    case "7d":         return { from: cloneDays(7).toISOString(), to, preset };
    case "14d":        return { from: cloneDays(14).toISOString(), to, preset };
    case "30d":        return { from: cloneDays(30).toISOString(), to, preset };
    case "90d":        return { from: cloneDays(90).toISOString(), to, preset };
    case "this_month": return { from: startOf(new Date(now.getFullYear(), now.getMonth(), 1)).toISOString(), to, preset };
    case "1y":         return { from: cloneDays(365).toISOString(), to, preset };
    case "custom":     return { from: customFrom ?? cloneDays(30).toISOString(), to: customTo ?? to, preset };
  }
}

interface Ctx {
  range: DateRange;
  setPreset: (p: RangePreset) => void;
  setCustom: (from: string, to: string) => void;
}

const AdminRangeContext = createContext<Ctx | null>(null);

export function AdminRangeProvider({ children }: { children: ReactNode }) {
  const [range, setRange] = useState<DateRange>(() => {
    try {
      const stored = localStorage.getItem("aisorix-admin-range");
      if (stored) {
        const parsed = JSON.parse(stored) as DateRange;
        if (parsed.preset && parsed.preset !== "custom") return computeRange(parsed.preset);
        return parsed;
      }
    } catch {}
    return computeRange("7d");
  });

  useEffect(() => {
    localStorage.setItem("aisorix-admin-range", JSON.stringify(range));
  }, [range]);

  const value = useMemo<Ctx>(() => ({
    range,
    setPreset: (p) => setRange(computeRange(p)),
    setCustom: (from, to) => setRange({ from, to, preset: "custom" }),
  }), [range]);

  return <AdminRangeContext.Provider value={value}>{children}</AdminRangeContext.Provider>;
}

export function useAdminRange() {
  const c = useContext(AdminRangeContext);
  if (!c) throw new Error("useAdminRange must be used within AdminRangeProvider");
  return c;
}
