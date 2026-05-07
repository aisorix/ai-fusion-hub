import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useCoWorkStore, type CoWorkMessage, type CoWorkTask } from "@/stores/coworkStore";

/** Loads recent cowork messages + tasks on mount and subscribes to realtime task updates. */
export function useCoWorkHistory() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    (async () => {
      // Load last 50 messages (oldest -> newest)
      const { data: msgs } = await supabase
        .from("cowork_messages")
        .select("id,role,content,model,created_at,tool_calls,tool_results,tokens_used")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      // Load recent tasks (last 24h or 30 most recent)
      const { data: tasks } = await supabase
        .from("cowork_tasks")
        .select("id,title,description,status,steps,result,created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(30);

      if (cancelled) return;

      if (msgs) {
        const ordered = [...msgs].reverse().map((m: any): CoWorkMessage => ({
          id: m.id,
          role: m.role,
          content: m.content,
          model: m.model ?? undefined,
          tokens_used: m.tokens_used ?? undefined,
          created_at: m.created_at,
        }));
        useCoWorkStore.setState({ messages: ordered });
      }

      if (tasks) {
        const mapped = tasks.map((t: any): CoWorkTask => ({
          id: t.id,
          title: t.title,
          description: t.description ?? "",
          status: t.status,
          steps: Array.isArray(t.steps) ? t.steps : [],
          result: t.result ?? undefined,
          created_at: t.created_at,
        }));
        useCoWorkStore.setState({ tasks: mapped });
      }
    })();

    // Realtime subscription on cowork_tasks
    const channel = supabase
      .channel(`cowork_tasks:${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "cowork_tasks", filter: `user_id=eq.${user.id}` },
        (payload) => {
          const store = useCoWorkStore.getState();
          if (payload.eventType === "INSERT") {
            const t: any = payload.new;
            if (store.tasks.find((x) => x.id === t.id)) return;
            store.addTask({
              id: t.id, title: t.title, description: t.description ?? "",
              status: t.status, steps: Array.isArray(t.steps) ? t.steps : [],
              result: t.result ?? undefined, created_at: t.created_at,
            });
          } else if (payload.eventType === "UPDATE") {
            const t: any = payload.new;
            store.updateTask(t.id, {
              status: t.status,
              steps: Array.isArray(t.steps) ? t.steps : [],
              result: t.result ?? undefined,
            });
          } else if (payload.eventType === "DELETE") {
            store.removeTask((payload.old as any).id);
          }
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [user]);
}
