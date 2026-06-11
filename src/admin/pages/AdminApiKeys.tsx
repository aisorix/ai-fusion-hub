import { useEffect, useState } from "react";
import { invokeAdmin } from "@/admin/lib/adminApi";
import DataTable from "@/admin/components/DataTable";
import { Key } from "lucide-react";

export default function AdminApiKeys() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { invokeAdmin<{ secrets: any[] }>("admin-secrets-list").then((r) => setItems(r.secrets)).catch(() => {}); }, []);

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600 flex items-center gap-2"><Key className="w-4 h-4" /> Configured backend secrets. Values are never exposed. Manage rotation via Lovable Cloud Settings → Secrets.</p>
      <DataTable rows={items} columns={[
        { key: "name", header: "Secret", render: (r) => <span className="font-mono text-xs">{r.name}</span> },
        { key: "present", header: "Status", render: (r) => (
          <span className={`inline-flex items-center gap-1.5 text-xs ${r.present ? "text-emerald-600" : "text-rose-600"}`}>
            <span className={`w-2 h-2 rounded-full ${r.present ? "bg-emerald-500" : "bg-rose-500"}`} />
            {r.present ? "Configured" : "Missing"}
          </span>
        )},
        { key: "last_rotated", header: "Last rotated", render: (r) => r.last_rotated ? new Date(r.last_rotated).toLocaleString() : "—" },
      ]} />
    </div>
  );
}
