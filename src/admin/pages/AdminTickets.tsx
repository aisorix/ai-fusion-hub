import { useEffect, useState } from "react";
import { invokeAdmin } from "@/admin/lib/adminApi";
import DataTable from "@/admin/components/DataTable";
import StatusPill from "@/admin/components/StatusPill";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Send } from "lucide-react";

export default function AdminTickets() {
  const [rows, setRows] = useState<any[]>([]);
  const [statusF, setStatusF] = useState<string>("");
  const [priorityF, setPriorityF] = useState<string>("");
  const [active, setActive] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [reply, setReply] = useState("");
  const [notes, setNotes] = useState("");

  const load = async () => {
    try {
      const r = await invokeAdmin<{ tickets: any[] }>("admin-tickets-update", { action: "list", status: statusF || undefined, priority: priorityF || undefined });
      setRows(r.tickets);
    } catch (e: any) { toast.error(e.message); }
  };
  useEffect(() => { load(); }, [statusF, priorityF]);

  const openTicket = async (row: any) => {
    setActive(row); setNotes(row.internal_notes ?? "");
    try {
      const r = await invokeAdmin<{ ticket: any; messages: any[] }>("admin-tickets-update", { action: "get", id: row.id });
      setMessages(r.messages);
    } catch (e: any) { toast.error(e.message); }
  };
  const patch = async (p: any) => {
    if (!active) return;
    try { const r = await invokeAdmin<{ ticket: any }>("admin-tickets-update", { action: "update", id: active.id, patch: p }); setActive(r.ticket); load(); }
    catch (e: any) { toast.error(e.message); }
  };
  const sendReply = async () => {
    if (!reply.trim() || !active) return;
    try { const r = await invokeAdmin<{ message: any }>("admin-tickets-update", { action: "reply", id: active.id, content: reply }); setMessages((m) => [...m, r.message]); setReply(""); }
    catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Select value={statusF || "all"} onValueChange={(v) => setStatusF(v === "all" ? "" : v)}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="open">Open</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="resolved">Resolved</SelectItem><SelectItem value="closed">Closed</SelectItem></SelectContent>
        </Select>
        <Select value={priorityF || "all"} onValueChange={(v) => setPriorityF(v === "all" ? "" : v)}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Priority" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All priorities</SelectItem><SelectItem value="low">Low</SelectItem><SelectItem value="normal">Normal</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="urgent">Urgent</SelectItem></SelectContent>
        </Select>
      </div>
      <DataTable rows={rows} searchKeys={["title", "guest_email"]} onRowClick={openTicket} columns={[
        { key: "title", header: "Subject", render: (r) => <span className="font-medium">{r.title || r.guest_email || "(untitled)"}</span> },
        { key: "status", header: "Status", render: (r) => <StatusPill value={r.status ?? "open"} /> },
        { key: "priority", header: "Priority", render: (r) => <StatusPill value={r.priority ?? "normal"} /> },
        { key: "last_message_at", header: "Last activity", render: (r) => r.last_message_at ? new Date(r.last_message_at).toLocaleString() : "—" },
      ]} />
      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent className="overflow-y-auto w-full sm:max-w-xl">
          <SheetHeader><SheetTitle>{active?.title || "Ticket"}</SheetTitle></SheetHeader>
          {active && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Select value={active.status ?? "open"} onValueChange={(v) => patch({ status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="open">Open</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="resolved">Resolved</SelectItem><SelectItem value="closed">Closed</SelectItem></SelectContent>
                </Select>
                <Select value={active.priority ?? "normal"} onValueChange={(v) => patch({ priority: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="normal">Normal</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="urgent">Urgent</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto border border-slate-200 rounded p-3 bg-slate-50">
                {messages.map((m) => (
                  <div key={m.id} className={`p-2 rounded text-sm ${m.sender_type === "employee" ? "bg-sky-50 ml-6" : "bg-white mr-6"}`}>
                    <div className="text-[10px] text-slate-500 mb-1">{m.sender_type} · {new Date(m.created_at).toLocaleString()}</div>
                    {m.content}
                  </div>
                ))}
                {!messages.length && <p className="text-xs text-slate-500">No messages yet.</p>}
              </div>
              <div className="flex gap-2">
                <Textarea rows={2} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Reply…" />
                <Button onClick={sendReply}><Send className="w-4 h-4" /></Button>
              </div>
              <div>
                <label className="text-xs text-slate-600">Internal notes (admin only)</label>
                <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} onBlur={() => patch({ internal_notes: notes })} />
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
