import { useCallback } from "react";
import { useCoWorkStore, type CoWorkMessage, type CoWorkTask } from "@/stores/coworkStore";
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

      // Add placeholder assistant message
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
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData?.session?.access_token;

        const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
        const url = `https://${projectId}.supabase.co/functions/v1/agent-router`;

        // Build conversation history
        const history = [...messages, userMsg].map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            messages: history,
            model: selectedModel,
          }),
        });

        if (!response.ok) {
          const err = await response.text();
          throw new Error(err || "Agent request failed");
        }

        setAgentStatus("working");

        // Stream response
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let fullContent = "";

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });

            // Parse SSE lines
            const lines = chunk.split("\n");
            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data === "[DONE]") continue;
                try {
                  const parsed = JSON.parse(data);
                  if (parsed.type === "content") {
                    fullContent += parsed.text;
                    updateLastAssistantMessage(fullContent);
                  } else if (parsed.type === "tool_use") {
                    // Add task for tool usage
                    const task: CoWorkTask = {
                      id: crypto.randomUUID(),
                      title: parsed.tool_name || "Processing",
                      description: parsed.description || "",
                      status: "running",
                      steps: (parsed.steps || []).map((s: string) => ({
                        label: s,
                        status: "pending" as const,
                      })),
                      created_at: new Date().toISOString(),
                    };
                    addTask(task);
                    // Simulate step progress
                    for (let i = 0; i < task.steps.length; i++) {
                      await new Promise((r) => setTimeout(r, 800));
                      updateTask(task.id, {
                        steps: task.steps.map((s, idx) => ({
                          ...s,
                          status: idx <= i ? "done" : idx === i + 1 ? "running" : "pending",
                        })),
                      });
                    }
                    updateTask(task.id, { status: "completed" });
                  } else if (parsed.type === "error") {
                    fullContent += `\n\n⚠️ ${parsed.message}`;
                    updateLastAssistantMessage(fullContent);
                  }
                } catch {
                  // Not JSON, treat as raw text
                  fullContent += data;
                  updateLastAssistantMessage(fullContent);
                }
              }
            }
          }
        }

        // Finalize
        const store = useCoWorkStore.getState();
        const msgs = [...store.messages];
        for (let i = msgs.length - 1; i >= 0; i--) {
          if (msgs[i].role === "assistant") {
            msgs[i] = { ...msgs[i], isStreaming: false };
            break;
          }
        }
        useCoWorkStore.setState({ messages: msgs });

        // Save to DB
        await supabase.from("cowork_messages").insert([
          { user_id: user.id, role: "user", content: content.trim() },
          { user_id: user.id, role: "assistant", content: fullContent, model: selectedModel },
        ] as any);

        setAgentStatus("idle");
      } catch (err: any) {
        setAgentStatus("idle");
        updateLastAssistantMessage(
          `❌ Error: ${err.message || "Something went wrong. Please try again."}`
        );
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
