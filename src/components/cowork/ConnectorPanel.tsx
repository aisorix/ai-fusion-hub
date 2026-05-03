import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Plug, Settings2, Search, Plus, Loader2, Trash2, Globe2 } from "lucide-react";
import { INTEGRATIONS } from "@/components/integrations/integrationsCatalog";
import { useIntegrations } from "@/hooks/useIntegrations";
import { useCustomIntegrations } from "@/hooks/useCustomIntegrations";
import CustomIntegrationDialog from "@/components/integrations/CustomIntegrationDialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ConnectorPanelProps {
  language: string;
}

const ConnectorPanel: React.FC<ConnectorPanelProps> = ({ language }) => {
  const navigate = useNavigate();
  const { getByProvider, startConnect, disconnect } = useIntegrations();
  const { items: customItems, remove: removeCustom } = useCustomIntegrations();

  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return INTEGRATIONS;
    return INTEGRATIONS.filter(i =>
      i.label.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)
    );
  }, [query]);

  const filteredCustom = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customItems;
    return customItems.filter(c =>
      c.name.toLowerCase().includes(q) || (c.description ?? "").toLowerCase().includes(q)
    );
  }, [customItems, query]);

  const handleToggle = async (providerId: string, connected: boolean) => {
    try {
      setBusyId(providerId);
      if (connected) await disconnect(providerId);
      else await startConnect(providerId);
    } catch (e: any) {
      toast.error(e.message ?? "Action failed");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
          {language === "bn" ? "ইন্টিগ্রেশন" : "Integrations"}
        </h4>
        <button
          onClick={() => navigate("/agent/integrations")}
          className="text-[10px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
        >
          <Settings2 className="w-3 h-3" /> Manage
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={language === "bn" ? "অনুসন্ধান…" : "Search apps…"}
          className="w-full pl-8 pr-2 py-1.5 text-xs rounded-lg bg-muted/30 border border-border/40 outline-none focus:border-cyan-500/40"
        />
      </div>

      <div className="space-y-1.5 max-h-[55vh] overflow-y-auto pr-1">
        {filtered.map((p) => {
          const Icon = p.icon;
          const conn = getByProvider(p.id);
          const connected = !!conn;
          const busy = busyId === p.id;
          return (
            <button
              key={p.id}
              onClick={() => handleToggle(p.id, connected)}
              disabled={busy}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-xl border text-left transition-all text-xs disabled:opacity-60",
                connected
                  ? "border-cyan-500/30 bg-cyan-500/5 text-foreground"
                  : "border-border/30 bg-card/30 text-muted-foreground hover:bg-muted/30"
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0", connected ? "text-cyan-400" : p.accent)} />
              <span className="flex-1 font-medium truncate">{p.label}</span>
              {busy ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : connected ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              ) : (
                <Plug className="w-3.5 h-3.5" />
              )}
            </button>
          );
        })}

        {/* Custom integrations section */}
        <div className="pt-2 mt-2 border-t border-border/40">
          <div className="flex items-center justify-between px-1 mb-1.5">
            <h5 className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
              {language === "bn" ? "কাস্টম" : "Custom"}
            </h5>
            <button
              onClick={() => setAddOpen(true)}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>

          {filteredCustom.length === 0 && (
            <p className="text-[11px] text-muted-foreground/70 px-1 py-2">
              {language === "bn"
                ? "নিজের API যোগ করুন।"
                : "Add your own REST API so the agent can call it."}
            </p>
          )}

          {filteredCustom.map((c) => (
            <div
              key={c.id}
              className="group w-full flex items-center gap-3 px-3 py-2 rounded-xl border border-cyan-500/20 bg-cyan-500/5 text-xs"
            >
              <Globe2 className="w-4 h-4 shrink-0 text-cyan-400" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground truncate">{c.name}</div>
                <div className="text-[10px] text-muted-foreground truncate">{c.base_url}</div>
              </div>
              <button
                onClick={async () => {
                  try { await removeCustom(c.id); toast.success("Removed"); }
                  catch (e: any) { toast.error(e.message ?? "Failed"); }
                }}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                aria-label="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <CustomIntegrationDialog open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
};

export default ConnectorPanel;
