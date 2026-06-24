import React, { useEffect, useState } from "react";
import { AlertOctagon, Loader2, RotateCcw, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const DISMISS_KEY = "sorix-recovery-banner-dismissed";

const AccountRecoveryBanner: React.FC = () => {
  const { user } = useAuth();
  const [scheduled, setScheduled] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!user) {
      setScheduled(null);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("deletion_scheduled_at")
        .eq("user_id", user.id)
        .maybeSingle();
      if (cancelled) return;
      const d = (data as any)?.deletion_scheduled_at as string | null;
      if (d && new Date(d).getTime() > Date.now()) setScheduled(d);
      else setScheduled(null);
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const recover = async () => {
    setBusy(true);
    try {
      const { error } = await supabase.functions.invoke("account-delete-recover");
      if (error) throw error;
      setScheduled(null);
      toast.success("Account recovered — welcome back!");
    } catch (e: any) {
      toast.error(e?.message || "Failed to recover account");
    } finally {
      setBusy(false);
    }
  };

  if (!user || !scheduled || hidden) return null;
  try {
    if (sessionStorage.getItem(DISMISS_KEY) === scheduled) return null;
  } catch {}

  const date = new Date(scheduled).toLocaleDateString();

  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[250] w-[calc(100vw-1rem)] max-w-2xl">
      <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 backdrop-blur-md shadow-lg">
        <AlertOctagon className="w-4 h-4 text-amber-600 shrink-0" />
        <p className="text-xs sm:text-sm text-foreground flex-1 min-w-0 truncate">
          Your account is scheduled for deletion on <strong>{date}</strong>.
        </p>
        <button
          onClick={recover}
          disabled={busy}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-foreground text-background hover:opacity-90 disabled:opacity-50 shrink-0"
        >
          {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
          Recover
        </button>
        <button
          onClick={() => {
            try { sessionStorage.setItem(DISMISS_KEY, scheduled); } catch {}
            setHidden(true);
          }}
          className="w-7 h-7 rounded-md hover:bg-amber-500/20 grid place-items-center text-muted-foreground shrink-0"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AccountRecoveryBanner;
