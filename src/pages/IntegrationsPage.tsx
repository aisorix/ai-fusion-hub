import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Search, Sparkles, Plus, Globe2, Trash2 } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { INTEGRATIONS } from "@/components/integrations/integrationsCatalog";
import IntegrationCard from "@/components/integrations/IntegrationCard";
import { useIntegrations } from "@/hooks/useIntegrations";
import { useCustomIntegrations } from "@/hooks/useCustomIntegrations";
import CustomIntegrationDialog from "@/components/integrations/CustomIntegrationDialog";
import { toast } from "sonner";

const CATEGORIES = ["all", "productivity", "social", "communication", "developer", "creative"] as const;

const IntegrationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { getByProvider, startConnect, disconnect, refresh, loading, syncFromNango } = useIntegrations();
  const { items: customItems, remove: removeCustom } = useCustomIntegrations();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<typeof CATEGORIES[number]>("all");
  const [addOpen, setAddOpen] = useState(false);

  // Handle Nango redirect-back
  useEffect(() => {
    const connected = params.get("connected");
    const error = params.get("error");
    if (connected) {
      toast.success(`${connected} connected successfully`);
      params.delete("connected"); setParams(params, { replace: true });
      syncFromNango();
    }
    if (error) {
      toast.error(`Connection failed: ${error}`);
      params.delete("error"); setParams(params, { replace: true });
    }
  }, [params, setParams, syncFromNango]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return INTEGRATIONS.filter(i =>
      (cat === "all" || i.category === cat) &&
      (!q || i.label.toLowerCase().includes(q) || i.description.toLowerCase().includes(q))
    );
  }, [query, cat]);

  return (
    <>
      <SEOHead
        title="Integrations | Sorix Agent"
        description="Connect 15+ apps including Gmail, GitHub, Notion, Slack, LinkedIn and more so Sorix Agent can act on your behalf."
        path="/agent/integrations"
      />
      <div className="min-h-[100dvh] bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="icon" onClick={() => navigate("/agent")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
                Integrations <Sparkles className="w-5 h-5 text-cyan-500" />
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                One-click connect any app. Sorix Agent will act on your behalf securely.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-cyan-500/5 to-teal-500/5 p-4 sm:p-5 mb-6 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-cyan-500" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-foreground">Zero-trust by design</p>
              <p className="text-muted-foreground mt-0.5">
                Tokens are stored and refreshed by our integration provider. Sorix only requests them for the moment of an action — never exposed to the browser or to the LLM.
              </p>
            </div>
          </div>

          {/* Search + categories */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search integrations…"
                className="pl-9"
              />
            </div>
            <div className="flex gap-1.5 overflow-x-auto">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    cat === c
                      ? "bg-foreground text-background"
                      : "bg-muted/40 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {c[0].toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Custom integrations section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Your custom integrations</h2>
                <p className="text-xs text-muted-foreground">Bring any REST API. The agent calls it on your behalf.</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => setAddOpen(true)}>
                <Plus className="w-4 h-4 mr-1" /> Add custom
              </Button>
            </div>
            {customItems.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border/60 p-4 text-center text-xs text-muted-foreground">
                No custom integrations yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {customItems.map((c) => (
                  <div key={c.id} className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                      <Globe2 className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">{c.name}</div>
                      <div className="text-[11px] text-muted-foreground truncate">{c.base_url}</div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={async () => {
                        try { await removeCustom(c.id); toast.success("Removed"); }
                        catch (e: any) { toast.error(e.message ?? "Failed"); }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filtered.map(p => (
              <IntegrationCard
                key={p.id}
                provider={p}
                connection={getByProvider(p.id)}
                onConnect={() => startConnect(p.id)}
                onDisconnect={() => disconnect(p.id)}
              />
            ))}
          </div>

          {loading && <p className="text-xs text-muted-foreground mt-6 text-center">Loading…</p>}
          {!loading && filtered.length === 0 && (
            <p className="text-sm text-muted-foreground mt-10 text-center">No integrations match your search.</p>
          )}
        </div>
      </div>
      <CustomIntegrationDialog open={addOpen} onOpenChange={setAddOpen} />
    </>
  );
};

export default IntegrationsPage;
