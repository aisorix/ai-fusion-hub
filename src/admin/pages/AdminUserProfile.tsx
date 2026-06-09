import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { invokeAdmin } from "../lib/adminApi";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ArrowLeft, Ban, ShieldOff, Trash2 } from "lucide-react";
import { toast } from "sonner";

const PLANS = ["free", "basic", "pro", "premium", "premium_plus", "max", "enterprise"];

export default function AdminUserProfile() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [openPlan, setOpenPlan] = useState(false);
  const [newPlan, setNewPlan] = useState("free");

  const load = () => {
    if (!id) return;
    invokeAdmin("admin-user-get", { userId: id }).then((d) => {
      setData(d);
      setNewPlan(d.subscription?.plan_id ?? "free");
    });
  };
  useEffect(load, [id]);

  const action = async (action: string) => {
    if (!id) return;
    if (action === "delete" && !confirm("Permanently delete this user? This cannot be undone.")) return;
    setBusy(true);
    try {
      await invokeAdmin("admin-user-action", { userId: id, action });
      toast.success(`Action '${action}' applied`);
      load();
    } catch (e: any) {
      toast.error(e.message);
    } finally { setBusy(false); }
  };

  const changePlan = async () => {
    setBusy(true);
    try {
      await invokeAdmin("admin-user-update", { userId: id, plan: newPlan });
      toast.success("Plan updated");
      setOpenPlan(false);
      load();
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  };

  if (!data) {
    return <div className="space-y-4"><Skeleton className="h-32" /><Skeleton className="h-64" /></div>;
  }

  const sub = data.subscription;

  return (
    <div className="space-y-4">
      <Link to="/admin/users" className="text-sm text-slate-500 hover:text-slate-900 inline-flex items-center gap-1">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to users
      </Link>

      <Card className="p-6 flex items-start justify-between gap-4">
        <div>
          <div className="text-xl font-bold">{data.profile?.full_name || "(Unnamed)"}</div>
          <div className="text-sm text-slate-500">{data.auth?.email}</div>
          <div className="mt-3 flex gap-2 flex-wrap">
            <Badge variant="outline">{sub?.plan_id ?? "free"}</Badge>
            <Badge variant={sub?.status === "active" ? "secondary" : "destructive"}>{sub?.status ?? "—"}</Badge>
            <span className="text-xs text-slate-500">Joined {new Date(data.auth?.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => setOpenPlan(true)} disabled={busy}>Change Plan</Button>
          <Button variant="outline" size="sm" onClick={() => action("suspend")} disabled={busy}><ShieldOff className="w-3.5 h-3.5 mr-1" /> Suspend</Button>
          <Button variant="outline" size="sm" onClick={() => action("ban")} disabled={busy}><Ban className="w-3.5 h-3.5 mr-1" /> Ban</Button>
          <Button variant="destructive" size="sm" onClick={() => action("delete")} disabled={busy}><Trash2 className="w-3.5 h-3.5 mr-1" /> Delete</Button>
        </div>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="audit">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-5">
              <h3 className="text-sm font-semibold mb-3">Account</h3>
              <dl className="text-sm space-y-1.5">
                <div className="flex justify-between"><dt className="text-slate-500">Email</dt><dd>{data.auth?.email}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Country</dt><dd>{data.profile?.country_code ?? "—"}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Phone</dt><dd>{data.profile?.phone ?? "—"}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Last sign-in</dt><dd>{data.auth?.lastSignInAt ? new Date(data.auth.lastSignInAt).toLocaleString() : "—"}</dd></div>
              </dl>
            </Card>
            <Card className="p-5">
              <h3 className="text-sm font-semibold mb-3">Subscription</h3>
              <dl className="text-sm space-y-1.5">
                <div className="flex justify-between"><dt className="text-slate-500">Plan</dt><dd>{sub?.plan_id ?? "—"}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Status</dt><dd>{sub?.status ?? "—"}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Amount</dt><dd>{sub?.currency} {sub?.amount}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Tokens used</dt><dd>{(sub?.tokens_used ?? 0).toLocaleString()}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Renews</dt><dd>{sub?.current_period_end ? new Date(sub.current_period_end).toLocaleDateString() : "—"}</dd></div>
              </dl>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="billing">
          <Card className="p-5">
            <h3 className="text-sm font-semibold mb-3">Payment history</h3>
            {data.payments.length === 0 ? <div className="text-sm text-slate-500">No payments yet.</div> : (
              <div className="space-y-2 text-sm">
                {data.payments.map((p: any) => (
                  <div key={p.id} className="flex justify-between border-b border-slate-100 py-2">
                    <div>
                      <div className="font-medium">{p.gateway} · {p.plan_id ?? "—"}</div>
                      <div className="text-xs text-slate-500">{new Date(p.created_at).toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono">{p.currency} {p.amount}</div>
                      <Badge variant={p.status === "success" ? "secondary" : "destructive"} className="text-[10px]">{p.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="tickets">
          <Card className="p-5">
            {data.tickets.length === 0 ? <div className="text-sm text-slate-500">No tickets.</div> : (
              <div className="space-y-2 text-sm">
                {data.tickets.map((t: any) => (
                  <div key={t.id} className="flex justify-between border-b border-slate-100 py-2">
                    <div>
                      <div className="font-medium">{t.subject || "(No subject)"}</div>
                      <div className="text-xs text-slate-500">{new Date(t.created_at).toLocaleString()}</div>
                    </div>
                    <Badge variant="outline">{t.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card className="p-5">
            {data.auditLog.length === 0 ? <div className="text-sm text-slate-500">No admin actions yet.</div> : (
              <div className="space-y-2 text-sm">
                {data.auditLog.map((a: any) => (
                  <div key={a.id} className="border-b border-slate-100 py-2">
                    <div className="flex justify-between">
                      <div className="font-medium">{a.action}</div>
                      <div className="text-xs text-slate-500">{new Date(a.created_at).toLocaleString()}</div>
                    </div>
                    <div className="text-xs text-slate-500">by {a.actor_email} from {a.ip}</div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={openPlan} onOpenChange={setOpenPlan}>
        <DialogContent>
          <DialogHeader><DialogTitle>Change plan</DialogTitle></DialogHeader>
          <Select value={newPlan} onValueChange={setNewPlan}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{PLANS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenPlan(false)}>Cancel</Button>
            <Button onClick={changePlan} disabled={busy}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
