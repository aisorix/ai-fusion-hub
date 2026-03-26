import { create } from "zustand";

export type AgentStatus = "idle" | "thinking" | "working" | "blocked";
export type TaskStatus = "pending" | "running" | "blocked" | "completed" | "failed";
export type ConnectorService = "google_drive" | "gmail" | "linkedin" | "twitter" | "facebook" | "instagram" | "whatsapp" | "whatsapp_business" | "youtube" | "telegram" | "slack" | "discord" | "pinterest" | "tiktok";

export interface TaskStep {
  label: string;
  status: "pending" | "running" | "done" | "error";
  detail?: string;
}

export interface CoWorkTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  steps: TaskStep[];
  result?: string;
  created_at: string;
}

export interface CoWorkMessage {
  id: string;
  role: "user" | "assistant" | "tool";
  content: string;
  tool_calls?: Array<{ name: string; args: Record<string, unknown>; status: "running" | "done" | "error" }>;
  tool_results?: Array<{ name: string; result: string }>;
  model?: string;
  tokens_used?: number;
  created_at: string;
  isStreaming?: boolean;
}

export interface ConnectorState {
  service: ConnectorService;
  status: "connected" | "disconnected" | "coming_soon";
  label: string;
  icon: string;
}

export interface ApprovalRequest {
  id: string;
  action: string;
  description: string;
  content: string;
  taskId?: string;
}

interface CoWorkState {
  agentStatus: AgentStatus;
  messages: CoWorkMessage[];
  tasks: CoWorkTask[];
  connectors: ConnectorState[];
  selectedModel: string;
  approvalRequest: ApprovalRequest | null;

  setAgentStatus: (s: AgentStatus) => void;
  addMessage: (m: CoWorkMessage) => void;
  updateLastAssistantMessage: (content: string) => void;
  clearMessages: () => void;
  addTask: (t: CoWorkTask) => void;
  updateTask: (id: string, updates: Partial<CoWorkTask>) => void;
  removeTask: (id: string) => void;
  setSelectedModel: (m: string) => void;
  setApprovalRequest: (r: ApprovalRequest | null) => void;
  updateConnector: (service: ConnectorService, status: ConnectorState["status"]) => void;
}

export const useCoWorkStore = create<CoWorkState>((set) => ({
  agentStatus: "idle",
  messages: [],
  tasks: [],
  connectors: [
    { service: "google_drive", status: "coming_soon", label: "Google Drive", icon: "hard-drive" },
    { service: "gmail", status: "coming_soon", label: "Gmail", icon: "mail" },
    { service: "linkedin", status: "coming_soon", label: "LinkedIn", icon: "linkedin" },
    { service: "twitter", status: "coming_soon", label: "Twitter / X", icon: "twitter" },
    { service: "facebook", status: "coming_soon", label: "Facebook", icon: "facebook" },
    { service: "instagram", status: "coming_soon", label: "Instagram", icon: "instagram" },
    { service: "whatsapp", status: "coming_soon", label: "WhatsApp", icon: "message-circle" },
    { service: "whatsapp_business", status: "coming_soon", label: "WhatsApp Business", icon: "message-circle-more" },
    { service: "youtube", status: "coming_soon", label: "YouTube", icon: "youtube" },
    { service: "telegram", status: "coming_soon", label: "Telegram", icon: "send" },
    { service: "slack", status: "coming_soon", label: "Slack", icon: "hash" },
    { service: "discord", status: "coming_soon", label: "Discord", icon: "hash" },
    { service: "pinterest", status: "coming_soon", label: "Pinterest", icon: "pin" },
    { service: "tiktok", status: "coming_soon", label: "TikTok", icon: "music" },
  ],
  selectedModel: "google/gemini-2.5-pro",
  approvalRequest: null,

  setAgentStatus: (s) => set({ agentStatus: s }),
  addMessage: (m) => set((state) => ({ messages: [...state.messages, m] })),
  updateLastAssistantMessage: (content) =>
    set((state) => {
      const msgs = [...state.messages];
      for (let i = msgs.length - 1; i >= 0; i--) {
        if (msgs[i].role === "assistant") {
          msgs[i] = { ...msgs[i], content, isStreaming: true };
          break;
        }
      }
      return { messages: msgs };
    }),
  clearMessages: () => set({ messages: [] }),
  addTask: (t) => set((state) => ({ tasks: [t, ...state.tasks] })),
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),
  removeTask: (id) => set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
  setSelectedModel: (m) => set({ selectedModel: m }),
  setApprovalRequest: (r) => set({ approvalRequest: r }),
  updateConnector: (service, status) =>
    set((state) => ({
      connectors: state.connectors.map((c) => (c.service === service ? { ...c, status } : c)),
    })),
}));
