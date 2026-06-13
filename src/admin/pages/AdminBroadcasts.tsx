import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Megaphone, Send, Mail, Bell, Loader2 } from "lucide-react";
import { invokeAdmin } from "../lib/adminApi";
import RoleGate from "../components/RoleGate";
import { supabase } from "@/integrations/supabase/client";

interface Broadcast {
  id: string;
  subject: string;
  body: string;
  channels: string[];
  recipient_count: number;
  sent_count: number;
  failed_count: number;
  status: string;
  created_at: string;
  created_by_email: string | null;
}

export default function AdminBroadcasts() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [audiencePlan, setAudiencePlan] = useState<string>("all");
  const [channels, setChannels] = useState<string[]>(["email", "in_app"]);
  const [sending, setSending] = useState(false);
  const [history, setHistory] = useState<Broadcast[] | null>(null);

  const refresh = async () => {
    const { data } = await supabase
      .from("broadcasts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    setHistory((data as any) ?? []);
  };

  useEffect(() => { refresh(); }, []);

  const toggleChannel = (c: string) =>
    setChannels((cs) => cs.includes(c) ? cs.filter(x => x !== c) : [...cs, c]);

  const send = async () => {
    if (!subject.trim() || !body.trim()) { toast.error("Subject and message body required"); return; }
    if (channels.length === 0) { toast.error("Select at least one channel"); return; }
    setSending(true);
    try {
      const res = await invokeAdmin<{ id: string; recipients: number }>("admin-broadcast-send", {
        subject: subject.trim(),
        body: body.trim(),
        audience: { plan: audiencePlan },
        channels,
      });
      toast.success(`Broadcast queued · ${res.recipients} recipients`);
      setSubject(""); setBody("");
      refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed to send");
    } finally { setSending(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white">
          <Megaphone className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Broadcasts</h2>
          <p className="text-sm text-muted-foreground">Send a message to every user — email and/or in-app notification.</p>
        </div>
      </div>

      <RoleGate mode="write" fallback={
        <Card className="p-6 bg-card border-border">
          <p className="text-sm text-muted-foreground">You have read-only access. Manager role required to send broadcasts.</p>
        </Card>
      }>
        <Card className="p-6 bg-card border-border space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Important update from AI Sorix" maxLength={200} />
            </div>
            <div className="space-y-2">
              <Label>Audience</Label>
              <select
                value={audiencePlan}
                onChange={(e) => setAudiencePlan(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="all">All users</option>
                <option value="free">Free plan only</option>
                <option value="basic">Basic plan</option>
                <option value="pro">Pro plan</option>
                <option value="premium">Premium plan</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Message</Label>
            <Textarea id="body" value={body} onChange={(e) => setBody(e.target.value)} rows={8} placeholder="Write your message. Plain text or simple markdown." maxLength={4000} />
            <p className="text-xs text-muted-foreground">{body.length} / 4000 characters</p>
          </div>

          <div className="space-y-2">
            <Label>Channels</Label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={channels.includes("email")} onCheckedChange={() => toggleChannel("email")} />
                <Mail className="w-4 h-4" /> <span className="text-sm">Email</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={channels.includes("in_app")} onCheckedChange={() => toggleChannel("in_app")} />
                <Bell className="w-4 h-4" /> <span className="text-sm">In-app notification</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={send} disabled={sending} className="gap-2">
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Send broadcast
            </Button>
          </div>
        </Card>
      </RoleGate>

      <Card className="p-0 bg-card border-border overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <h3 className="text-sm font-semibold">History</h3>
        </div>
        <div className="divide-y divide-border">
          {history === null && <div className="p-4 space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>}
          {history && history.length === 0 && <div className="px-5 py-10 text-sm text-muted-foreground text-center">No broadcasts yet.</div>}
          {history?.map((b) => (
            <div key={b.id} className="px-5 py-3 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{b.subject}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(b.created_at).toLocaleString()} · {b.created_by_email ?? "—"} · channels: {b.channels.join(", ")}
                </div>
              </div>
              <div className="text-xs text-muted-foreground tabular-nums">{b.sent_count}/{b.recipient_count} sent</div>
              <Badge variant={b.status === "sent" ? "secondary" : b.status === "failed" ? "destructive" : "outline"}>{b.status}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
