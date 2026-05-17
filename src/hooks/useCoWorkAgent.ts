import { useCallback } from "react";
import { useCoWorkStore, type CoWorkMessage, type CoWorkTask, type TaskStep } from "@/stores/coworkStore";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const ERROR_TOASTS: Record<string, string> = {
  rate_limit: "The AI is rate-limited right now. Try again in a moment.",
  browserless_timeout: "The web browser took too long. Try a simpler URL or retry.",
  llm_parse: "The AI returned an unexpected response. Retrying may help.",
  not_connected: "That app isn't connected yet. Open Integrations to link it.",
  unauthorized: "Please sign in again.",
  unknown: "Something went wrong. Please try again.",
};

export function useCoWorkAgent() {
  const { user } = useAuth();
  const {
    addMessage,
    updateLastAssistantMessage,
    setAgentStatus,
    addTask,
    updateTask,
    selectedModel,
    messages,
  } = useCoWorkStore();

  const sendMessage = useCallback(
    async (content: string) => {
      if (!user || !content.trim()) return;

      const userMsg: CoWorkMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: content.trim(),
        created_at: new Date().toISOString(),
      };
      addMessage(userMsg);

      // Persist user message immediately (assistant message is persisted server-side)
      void supabase.from("cowork_messages").insert({
        user_id: user.id, role: "user", content: content.trim(),
      } as any);

      const assistantMsg: CoWorkMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
        model: selectedModel,
        created_at: new Date().toISOString(),
        isStreaming: true,
      };
      addMessage(assistantMsg);
      setAgentStatus("thinking");

      try {
        let { data: sessionData } = await supabase.auth.getSession();
        let supabaseSessionToken = sessionData?.session?.access_token;
        if (!supabaseSessionToken) {
          const { data: refreshed } = await supabase.auth.refreshSession();
          supabaseSessionToken = refreshed?.session?.access_token;
        }
        if (!supabaseSessionToken) {
          throw new Error("Your session expired. Please sign in again.");
        }

        const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
        const url = `https://${projectId}.supabase.co/functions/v1/agent-router`;

        const history = [...messages, userMsg].map((m) => ({
          role: m.role, content: m.content,
        }));

        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseSessionToken}` },
          body: JSON.stringify({ messages: history, model: selectedModel }),
        });

        if (!response.ok) {
          const err = await response.text();
          throw new Error(err || "Agent request failed");
        }

        setAgentStatus("working");

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let fullContent = "";
        let buffer = "";

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });

            // Process complete SSE lines only
            let nl: number;
            while ((nl = buffer.indexOf("\n")) !== -1) {
              const line = buffer.slice(0, nl).trim();
              buffer = buffer.slice(nl + 1);
              if (!line.startsWith("data: ")) continue;
              const data = line.slice(6);
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                if (parsed.type === "content") {
                  fullContent += parsed.text;
                  updateLastAssistantMessage(fullContent);
                } else if (parsed.type === "tool_use") {
                  const task: CoWorkTask = {
                    id: parsed.task_id ?? crypto.randomUUID(),
                    title: parsed.title || parsed.tool_name || "Working",
                    description: parsed.description || "",
                    status: "running",
                    steps: (parsed.steps || ["Execute"]).map((label: string, i: number): TaskStep => ({
                      label, status: i === 0 ? "running" : "pending",
                    })),
                    created_at: new Date().toISOString(),
                  };
                  addTask(task);
                } else if (parsed.type === "tool_result") {
                  const id = parsed.task_id;
                  if (id) {
                    const store = useCoWorkStore.getState();
                    const t = store.tasks.find((x) => x.id === id);
                    if (t) {
                      updateTask(id, {
                        status: parsed.ok ? "completed" : "failed",
                        result: parsed.summary,
                        steps: t.steps.map((s) => ({ ...s, status: parsed.ok ? "done" : "error" })),
                      });
                    }
                  }
                  if (!parsed.ok) toast.error(`${parsed.name}: ${parsed.summary}`);
                } else if (parsed.type === "error") {
                  const friendly = ERROR_TOASTS[parsed.code] ?? parsed.message ?? ERROR_TOASTS.unknown;
                  toast.error(friendly);
                  fullContent += `\n\n⚠️ ${friendly}`;
                  updateLastAssistantMessage(fullContent);
                }
                // route_decision is silent (per project memory: no info toasts)
              } catch {
                // ignore parse errors
              }
            }
          }
        }

        // Finalize streaming flag
        const store = useCoWorkStore.getState();
        const msgs = [...store.messages];
        for (let i = msgs.length - 1; i >= 0; i--) {
          if (msgs[i].role === "assistant") {
            msgs[i] = { ...msgs[i], isStreaming: false };
            break;
          }
        }
        useCoWorkStore.setState({ messages: msgs });
        setAgentStatus("idle");
      } catch (err: any) {
        setAgentStatus("idle");
        updateLastAssistantMessage(`❌ Error: ${err.message || "Something went wrong."}`);
        const store = useCoWorkStore.getState();
        const msgs = [...store.messages];
        for (let i = msgs.length - 1; i >= 0; i--) {
          if (msgs[i].role === "assistant") {
            msgs[i] = { ...msgs[i], isStreaming: false };
            break;
          }
        }
        useCoWorkStore.setState({ messages: msgs });
      }
    },
    [user, selectedModel, messages, addMessage, updateLastAssistantMessage, setAgentStatus, addTask, updateTask]
  );

  return { sendMessage };
}
