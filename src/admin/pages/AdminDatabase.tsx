import { useEffect, useState } from "react";
import { invokeAdmin } from "../lib/adminApi";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Database, Table as TableIcon, Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TableInfo { name: string; rows: number }

export default function AdminDatabase() {
  const [tables, setTables] = useState<TableInfo[] | null>(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [rows, setRows] = useState<any[] | null>(null);
  const [cols, setCols] = useState<string[]>([]);

  const loadTables = () => {
    setTables(null);
    invokeAdmin<{ tables: TableInfo[] }>("admin-db-explorer", { action: "list_tables" })
      .then((r) => setTables(r.tables))
      .catch(() => setTables([]));
  };

  useEffect(() => { loadTables(); }, []);

  const loadRows = (name: string) => {
    setSelected(name); setRows(null); setCols([]);
    invokeAdmin<{ rows: any[]; columns: string[] }>("admin-db-explorer", { action: "read_rows", table: name, limit: 50 })
      .then((r) => { setRows(r.rows); setCols(r.columns); })
      .catch(() => setRows([]));
  };

  const filtered = (tables ?? []).filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white">
          <Database className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-foreground">Database</h2>
          <p className="text-sm text-muted-foreground">All public tables — live row counts and read-only data viewer.</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadTables}><RefreshCw className="w-4 h-4 mr-2" /> Refresh</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tables…" className="pl-9" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {tables === null && Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
        {filtered.map((t) => (
          <button
            key={t.name}
            onClick={() => loadRows(t.name)}
            className={`text-left p-4 rounded-lg border bg-card hover:border-primary/50 transition-colors ${selected === t.name ? "border-primary" : "border-border"}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <TableIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <div className="text-sm font-medium truncate">{t.name}</div>
              </div>
              <div className="text-xs tabular-nums text-muted-foreground">{t.rows.toLocaleString()} rows</div>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <Card className="p-0 bg-card border-border overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold">{selected}</h3>
            <Button variant="ghost" size="sm" onClick={() => { setSelected(null); setRows(null); }}>Close</Button>
          </div>
          <div className="overflow-x-auto max-h-[60vh]">
            {rows === null && <div className="p-6"><Skeleton className="h-40" /></div>}
            {rows && rows.length === 0 && <div className="p-10 text-sm text-muted-foreground text-center">Empty table</div>}
            {rows && rows.length > 0 && (
              <table className="w-full text-xs">
                <thead className="bg-muted/50 sticky top-0">
                  <tr>{cols.map(c => <th key={c} className="px-3 py-2 text-left font-medium text-muted-foreground border-b border-border">{c}</th>)}</tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30">
                      {cols.map(c => {
                        const v = r[c];
                        const display = v === null ? "—" : typeof v === "object" ? JSON.stringify(v) : String(v);
                        return <td key={c} className="px-3 py-2 max-w-[280px] truncate" title={display}>{display}</td>;
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
