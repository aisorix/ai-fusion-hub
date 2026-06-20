import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2, Lock, Sparkles } from "lucide-react";

type Kind = "course" | "workshop" | "competition";

interface Props {
  kind: Kind;
  slug: string;
  title: string;
  priceBdt: number;
  seatsAvailable?: number | null;
  className?: string;
  variant?: "primary" | "ghost";
}

export default function ScholarsEnrollButton({ kind, slug, title, priceBdt, seatsAvailable, className, variant = "primary" }: Props) {
  const { user } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [seats, setSeats] = useState(1);
  const [teamName, setTeamName] = useState("");
  const [accept, setAccept] = useState(false);
  const [loading, setLoading] = useState(false);

  const label = priceBdt > 0
    ? `Enroll · ৳${priceBdt.toLocaleString()}${kind === "workshop" && seats > 1 ? ` × ${seats}` : ""}`
    : (kind === "competition" ? "Register · Free" : kind === "workshop" ? "Book seat · Free" : "Enroll · Free");

  const submit = async () => {
    if (!user) {
      toast.message("Please sign in to continue");
      nav(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    if (priceBdt > 0 && !accept) {
      toast.error("Please accept the terms to continue");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("scholars-checkout", {
        body: { kind, slug, seats, team_name: teamName || undefined, origin: window.location.origin },
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || "Checkout failed");
      if (data.free) {
        toast.success("You're enrolled!");
        setOpen(false);
        nav(data.redirect || "/sorixscholars/dashboard");
        return;
      }
      window.location.href = data.gatewayPageURL;
    } catch (e: any) {
      toast.error(e.message || "Could not start checkout");
    } finally {
      setLoading(false);
    }
  };

  const primaryClasses = variant === "primary"
    ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:opacity-90 shadow-lg shadow-cyan-500/20"
    : "";

  return (
    <>
      <Button
        size="lg"
        onClick={() => setOpen(true)}
        className={`${primaryClasses} ${className || ""}`}
        disabled={seatsAvailable === 0}
      >
        <Sparkles className="w-4 h-4 mr-2" />
        {seatsAvailable === 0 ? "Sold out" : label}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md bg-background">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-4 h-4" /> Secure checkout
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg bg-muted/50 border border-border">
              <div className="text-xs text-muted-foreground capitalize">{kind}</div>
              <div className="font-semibold text-foreground">{title}</div>
              {priceBdt > 0
                ? <div className="text-2xl font-bold mt-1 bg-gradient-to-r from-cyan-500 to-teal-500 bg-clip-text text-transparent">৳{(priceBdt * (kind === "workshop" ? seats : 1)).toLocaleString()}</div>
                : <div className="text-sm text-emerald-600 font-semibold mt-1">Free</div>}
            </div>

            {kind === "workshop" && (
              <div>
                <Label>Seats</Label>
                <Input type="number" min={1} max={Math.min(10, seatsAvailable || 10)} value={seats} onChange={(e) => setSeats(Math.max(1, parseInt(e.target.value, 10) || 1))} />
                {typeof seatsAvailable === "number" && <div className="text-xs text-muted-foreground mt-1">{seatsAvailable} seat(s) available</div>}
              </div>
            )}

            {kind === "competition" && (
              <div>
                <Label>Team name (optional)</Label>
                <Input value={teamName} onChange={(e) => setTeamName(e.target.value)} maxLength={120} placeholder="Solo or your team name" />
              </div>
            )}

            {priceBdt > 0 && (
              <label className="flex items-start gap-2 text-xs text-muted-foreground cursor-pointer">
                <Checkbox checked={accept} onCheckedChange={(v) => setAccept(!!v)} className="mt-0.5" />
                <span>I accept the <a href="/terms-of-service" target="_blank" className="underline">Terms</a> and <a href="/refund-policy" target="_blank" className="underline">Refund Policy</a>. Payment processed by SSLCommerz.</span>
              </label>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>Cancel</Button>
            <Button onClick={submit} disabled={loading || (priceBdt > 0 && !accept)} className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white">
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing…</> : (priceBdt > 0 ? "Continue to payment" : "Confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
