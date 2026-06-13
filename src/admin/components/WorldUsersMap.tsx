import { useEffect, useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Card } from "@/components/ui/card";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface Props {
  byCountry: Record<string, number>; // ISO alpha-2 -> count
}

export default function WorldUsersMap({ byCountry }: Props) {
  const [hover, setHover] = useState<{ name: string; count: number } | null>(null);

  const max = useMemo(() => Math.max(1, ...Object.values(byCountry)), [byCountry]);
  const total = useMemo(() => Object.values(byCountry).reduce((a, b) => a + b, 0), [byCountry]);

  const colorFor = (count: number) => {
    if (!count) return "hsl(var(--muted))";
    const t = count / max;
    // cyan→teal scale, opacity by intensity
    const alpha = 0.25 + 0.7 * t;
    return `hsla(189, 95%, 43%, ${alpha})`;
  };

  return (
    <Card className="p-5 bg-card border-border">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Users by Country</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{total.toLocaleString()} total users · {Object.keys(byCountry).length} countries</p>
        </div>
        {hover && (
          <div className="text-xs text-right">
            <div className="font-medium text-foreground">{hover.name}</div>
            <div className="text-muted-foreground">{hover.count.toLocaleString()} users</div>
          </div>
        )}
      </div>
      <div className="w-full" style={{ height: 360 }}>
        <ComposableMap projectionConfig={{ scale: 145 }} style={{ width: "100%", height: "100%" }}>
          <Geographies geography={GEO_URL}>
            {({ geographies }: any) =>
              geographies.map((geo: any) => {
                const iso = (geo.properties.iso_a2 || geo.properties["Alpha-2"] || "").toUpperCase();
                const count = byCountry[iso] ?? 0;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={colorFor(count)}
                    stroke="hsl(var(--border))"
                    strokeWidth={0.4}
                    onMouseEnter={() => setHover({ name: geo.properties.name, count })}
                    onMouseLeave={() => setHover(null)}
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none", fill: "hsl(var(--primary))", opacity: 0.85 },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>
    </Card>
  );
}
