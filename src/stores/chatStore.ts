import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { FileType } from '@/lib/fileParser';

export interface Attachment {
  type: 'image' | 'file';
  url: string;
  name: string;
  size?: number;
  parsedContent?: string; // Extracted text content for documents
  fileType?: FileType; // Type of file for icon display
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  attachments?: Attachment[] | null;
  citations?: string[] | null; // URLs from Perplexity/search models
  modelId?: string; // ID of the model used for this message
  modelName?: string; // Display name of the model used
  createdAt: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export type ModelCategory = 'chat' | 'code' | 'search' | 'system';
export type UserPlan = 'free' | 'basic' | 'pro' | 'premium';

export interface Model {
  id: string;
  name: string;
  backendId: string;
  description: string;
  category: ModelCategory;
  plans: UserPlan[]; // Plans that have access to this model
  multiplier: number; // Token multiplier (1x, 2x, 3x, etc.)
  icon?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  chatCount: number;
  status: 'active' | 'archived' | 'completed';
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: UserPlan;
  tokensUsed: number;
  tokensLimit: number;
}

// Multi-Window types
export interface ChatWindow {
  id: string;
  modelId: string;
  messages: Message[];
  isStreaming: boolean;
}

interface ChatState {
  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  
  // Sidebar
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  toggleSidebarCollapse: () => void;
  
  // View Mode
  viewMode: 'single' | 'multi';
  setViewMode: (mode: 'single' | 'multi') => void;
  
  // Multi-Window Chat
  chatWindows: ChatWindow[];
  addChatWindow: () => void;
  removeChatWindow: (windowId: string) => void;
  setWindowModel: (windowId: string, modelId: string) => void;
  addWindowMessage: (windowId: string, message: Message) => void;
  updateWindowLastMessage: (windowId: string, content: string) => void;
  setWindowLastMessageCitations: (windowId: string, citations: string[]) => void;
  setWindowStreaming: (windowId: string, isStreaming: boolean) => void;
  clearAllWindows: () => void;
  
  // User
  user: User;
  setUser: (user: User) => void;
  setUserPlan: (plan: UserPlan) => void;
  
  // Projects
  projects: Project[];
  activeProjectId: string | null;
  createProject: (name: string, description: string, icon: string, color: string) => Project;
  setActiveProject: (projectId: string | null) => void;
  deleteProject: (projectId: string) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  projectsModalOpen: boolean;
  setProjectsModalOpen: (open: boolean) => void;
  
  // Chats
  chats: Chat[];
  activeChatId: string | null;
  createNewChat: () => Chat;
  setActiveChat: (chatId: string | null) => void;
  deleteChat: (chatId: string) => void;
  updateChatTitle: (chatId: string, title: string) => void;
  
  // Messages (derived from active chat)
  messages: Message[];
  getMessages: () => Message[];
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateLastMessage: (content: string) => void;
  setLastMessageCitations: (citations: string[]) => void;
  
  // Streaming & Loading
  isStreaming: boolean;
  setStreaming: (streaming: boolean) => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  
  // Attachments
  pendingAttachments: Attachment[];
  addAttachment: (attachment: Attachment) => void;
  removeAttachment: (index: number) => void;
  clearAttachments: () => void;
  
  // Models
  models: Model[];
  selectedModel: string;
  setSelectedModel: (modelId: string) => void;
  getAvailableModels: () => Model[];
  isModelLocked: (modelId: string) => boolean;
  getModelMultiplier: (modelId: string) => number;
  
  // Share Modal
  shareModalOpen: boolean;
  shareMessageId: string | null;
  openShareModal: (messageId: string) => void;
  closeShareModal: () => void;
  
  // Language
  language: string;
  setLanguage: (lang: string) => void;
  
  // Health Mode
  isHealthMode: boolean;
  healthAnalysisType: 'general' | 'prescription' | 'lab_report' | 'veterinary';
  setHealthMode: (enabled: boolean) => void;
  setHealthAnalysisType: (type: 'general' | 'prescription' | 'lab_report' | 'veterinary') => void;
  
  // OpenRouter Key
  openRouterKey: string;
  setOpenRouterKey: (key: string) => void;
}

// ============================================
// MODEL DEFINITIONS BY PLAN WITH MULTIPLIERS
// Models are organized by display name - no duplicates!
// ============================================

// 🆓 FREE PLAN MODELS (5k Tokens/Month)
const freeModels: Model[] = [
  { id: 'gpt-4o', name: 'GPT-4o', backendId: 'openai/gpt-4o-mini', description: 'Smart AI assistant', category: 'chat', plans: ['free'], multiplier: 1 },
  { id: 'deepseek-v31-free', name: 'DeepSeek V3.1', backendId: 'deepseek/deepseek-chat-v3.1', description: 'Advanced reasoning', category: 'chat', plans: ['free'], multiplier: 1 },
  { id: 'gemini-3-flash-free', name: 'Gemini 3 Flash', backendId: 'google/gemini-3-flash-preview', description: 'Google fast model', category: 'chat', plans: ['free'], multiplier: 5 },
];

// 📦 BASIC PLAN MODELS (800k Tokens/Month)
const basicModels: Model[] = [
  { id: 'gpt5-1-mini-basic', name: 'GPT-5.1 mini', backendId: 'openai/gpt-5-mini', description: 'Fast and efficient', category: 'chat', plans: ['basic'], multiplier: 4 },
  { id: 'gpt5-nano-basic', name: 'GPT-5 nano', backendId: 'openai/gpt-5-nano', description: 'Ultra-fast responses', category: 'chat', plans: ['basic'], multiplier: 1 },
  { id: 'gemini-3-flash-basic', name: 'Gemini 3 Flash', backendId: 'google/gemini-3-flash-preview', description: 'Next-gen Gemini', category: 'chat', plans: ['basic'], multiplier: 5 },
  { id: 'gemini-3-basic', name: 'Gemini 3', backendId: 'google/gemini-3-flash-preview', description: 'Google flagship', category: 'chat', plans: ['basic'], multiplier: 5 },
  { id: 'grok-4-basic', name: 'Grok 4', backendId: 'x-ai/grok-3-mini', description: 'xAI smart model', category: 'chat', plans: ['basic'], multiplier: 2 },
  { id: 'grok-4-fast-basic', name: 'Grok 4 Fast', backendId: 'x-ai/grok-4-fast', description: 'Fast xAI model', category: 'chat', plans: ['basic'], multiplier: 1 },
  { id: 'deepseek-v31-basic', name: 'DeepSeek V3.1', backendId: 'deepseek/deepseek-chat-v3.1', description: 'Latest DeepSeek', category: 'chat', plans: ['basic'], multiplier: 2 },
  { id: 'deepseek-v32-basic', name: 'DeepSeek V3.2', backendId: 'deepseek/deepseek-v3.2', description: 'Newest DeepSeek', category: 'chat', plans: ['basic'], multiplier: 1 },
  { id: 'llama-31-basic', name: 'LLaMA 3.1', backendId: 'meta-llama/llama-3.1-70b-instruct', description: 'Meta open-source', category: 'chat', plans: ['basic'], multiplier: 1.5 },
  { id: 'llama-33-basic', name: 'LLaMA 3.3', backendId: 'meta-llama/llama-3.3-70b-instruct', description: 'Latest LLaMA', category: 'chat', plans: ['basic'], multiplier: 1 },
  { id: 'qwen3-coder-basic', name: 'Qwen 3 Coder', backendId: 'qwen/qwen3-coder', description: 'Code specialist', category: 'code', plans: ['basic'], multiplier: 2 },
  { id: 'qwen3-vl-basic', name: 'Qwen 3 VL', backendId: 'qwen/qwen3-vl-30b-a3b-instruct', description: 'Vision-language', category: 'chat', plans: ['basic'], multiplier: 1.5 },
];

// ⚡ PRO PLAN MODELS (1.5M Tokens/Month)
const proModels: Model[] = [
  { id: 'qwen3-pro-pro', name: 'Qwen 3 Pro', backendId: 'qwen/qwen3-235b-a22b-2507', description: 'Professional Qwen', category: 'chat', plans: ['pro'], multiplier: 1 },
  { id: 'qwen3-coder-pro', name: 'Qwen 3 Coder', backendId: 'qwen/qwen3-coder', description: 'Code specialist', category: 'code', plans: ['pro'], multiplier: 2 },
  { id: 'qwen3-vl-pro', name: 'Qwen 3 VL', backendId: 'qwen/qwen3-vl-30b-a3b-instruct', description: 'Vision-language', category: 'chat', plans: ['pro'], multiplier: 1 },
  { id: 'gpt5-1-mini-pro', name: 'GPT-5.1 mini', backendId: 'openai/gpt-5-mini', description: 'Fast and efficient', category: 'chat', plans: ['pro'], multiplier: 3 },
  { id: 'gpt5-nano-pro', name: 'GPT-5 nano', backendId: 'openai/gpt-5-nano', description: 'Ultra-fast responses', category: 'chat', plans: ['pro'], multiplier: 1 },
  { id: 'gpt5-1-pro', name: 'GPT-5.1', backendId: 'openai/gpt-5.1', description: 'Enhanced GPT model', category: 'chat', plans: ['pro'], multiplier: 20 },
  { id: 'gpt5-2-pro', name: 'GPT-5.2', backendId: 'openai/gpt-5.2', description: 'Flagship reasoning', category: 'chat', plans: ['pro'], multiplier: 30 },
  { id: 'gemini-3-flash-pro', name: 'Gemini 3 Flash', backendId: 'google/gemini-3-flash-preview', description: 'Next-gen Gemini', category: 'chat', plans: ['pro'], multiplier: 5 },
  { id: 'gemini-3-pro', name: 'Gemini 3', backendId: 'google/gemini-3-flash-preview', description: 'Google flagship', category: 'chat', plans: ['pro'], multiplier: 5 },
  { id: 'gemini-25-pro', name: 'Gemini 2.5 Pro', backendId: 'google/gemini-2.5-pro', description: 'Professional Gemini', category: 'chat', plans: ['pro'], multiplier: 20 },
  { id: 'grok-4-pro', name: 'Grok 4', backendId: 'x-ai/grok-3-mini', description: 'xAI smart model', category: 'chat', plans: ['pro'], multiplier: 2 },
  { id: 'grok-4-fast-pro', name: 'Grok 4 Fast', backendId: 'x-ai/grok-4-fast', description: 'Fast xAI model', category: 'chat', plans: ['pro'], multiplier: 1 },
  { id: 'grok-41-fast-pro', name: 'Grok 4.1 fast', backendId: 'x-ai/grok-4.1-fast', description: 'Latest xAI model', category: 'chat', plans: ['pro'], multiplier: 1 },
  { id: 'perplexity-sonar-pro', name: 'Perplexity Sonar', backendId: 'perplexity/sonar', description: 'Web search powered', category: 'search', plans: ['pro'], multiplier: 3 },
  { id: 'deepseek-v31-pro', name: 'DeepSeek V3.1', backendId: 'deepseek/deepseek-chat-v3.1', description: 'Latest DeepSeek', category: 'chat', plans: ['pro'], multiplier: 2 },
  { id: 'deepseek-v32-pro', name: 'DeepSeek V3.2', backendId: 'deepseek/deepseek-v3.2', description: 'Newest DeepSeek', category: 'chat', plans: ['pro'], multiplier: 1 },
  { id: 'llama-31-pro', name: 'LLaMA 3.1', backendId: 'meta-llama/llama-3.1-70b-instruct', description: 'Meta open-source', category: 'chat', plans: ['pro'], multiplier: 2 },
  { id: 'llama-33-pro', name: 'LLaMA 3.3', backendId: 'meta-llama/llama-3.3-70b-instruct', description: 'Latest LLaMA', category: 'chat', plans: ['pro'], multiplier: 1 },
  { id: 'llama-4-maverick-pro', name: 'Llama 4 Maverick', backendId: 'meta-llama/llama-4-maverick', description: 'Latest Llama 4', category: 'chat', plans: ['pro'], multiplier: 2 },
  { id: 'llama-4-scout-pro', name: 'Llama 4 Scout', backendId: 'meta-llama/llama-4-scout', description: 'Llama 4 Scout', category: 'chat', plans: ['pro'], multiplier: 1 },
];

// 👑 PREMIUM PLAN MODELS (3M Tokens/Month)
const premiumModels: Model[] = [
  { id: 'qwen3-pro-prem', name: 'Qwen 3 Pro', backendId: 'qwen/qwen3-235b-a22b-2507', description: 'Professional Qwen', category: 'chat', plans: ['premium'], multiplier: 1 },
  { id: 'qwen3-coder-prem', name: 'Qwen 3 Coder', backendId: 'qwen/qwen3-coder', description: 'Code specialist', category: 'code', plans: ['premium'], multiplier: 2 },
  { id: 'qwen3-vl-prem', name: 'Qwen 3 VL', backendId: 'qwen/qwen3-vl-30b-a3b-instruct', description: 'Vision-language', category: 'chat', plans: ['premium'], multiplier: 1 },
  { id: 'gpt5-1-mini-prem', name: 'GPT-5.1 mini', backendId: 'openai/gpt-5-mini', description: 'Fast and efficient', category: 'chat', plans: ['premium'], multiplier: 3 },
  { id: 'gpt5-nano-prem', name: 'GPT-5 nano', backendId: 'openai/gpt-5-nano', description: 'Ultra-fast responses', category: 'chat', plans: ['premium'], multiplier: 1 },
  { id: 'gpt5-1-prem', name: 'GPT-5.1', backendId: 'openai/gpt-5.1', description: 'Enhanced GPT model', category: 'chat', plans: ['premium'], multiplier: 15 },
  { id: 'gpt5-2-prem', name: 'GPT-5.2', backendId: 'openai/gpt-5.2', description: 'Flagship reasoning', category: 'chat', plans: ['premium'], multiplier: 20 },
  { id: 'claude-sonnet-45', name: 'Claude Sonnet 4.5', backendId: 'anthropic/claude-sonnet-4.5', description: 'Anthropic Sonnet', category: 'chat', plans: ['premium'], multiplier: 25 },
  { id: 'claude-opus-45', name: 'Claude Opus 4.5', backendId: 'anthropic/claude-opus-4.5', description: 'Anthropic Opus', category: 'chat', plans: ['premium'], multiplier: 40 },
  { id: 'gemini-3-flash-prem', name: 'Gemini 3 Flash', backendId: 'google/gemini-3-flash-preview', description: 'Next-gen Gemini', category: 'chat', plans: ['premium'], multiplier: 5 },
  { id: 'gemini-3-prem', name: 'Gemini 3', backendId: 'google/gemini-3-flash-preview', description: 'Google flagship', category: 'chat', plans: ['premium'], multiplier: 5 },
  { id: 'gemini-25-pro-prem', name: 'Gemini 2.5 Pro', backendId: 'google/gemini-2.5-pro', description: 'Professional Gemini', category: 'chat', plans: ['premium'], multiplier: 15 },
  { id: 'grok-4-prem', name: 'Grok 4', backendId: 'x-ai/grok-3-mini', description: 'xAI smart model', category: 'chat', plans: ['premium'], multiplier: 1 },
  { id: 'grok-4-fast-prem', name: 'Grok 4 Fast', backendId: 'x-ai/grok-4-fast', description: 'Fast xAI model', category: 'chat', plans: ['premium'], multiplier: 1 },
  { id: 'grok-41-fast-prem', name: 'Grok 4.1 fast', backendId: 'x-ai/grok-4.1-fast', description: 'Latest xAI model', category: 'chat', plans: ['premium'], multiplier: 1 },
  { id: 'perplexity-sonar-pro-prem', name: 'Perplexity Sonar Pro', backendId: 'perplexity/sonar', description: 'Web search powered', category: 'search', plans: ['premium'], multiplier: 2 },
  { id: 'perplexity-research-prem', name: 'Perplexity Research Pro', backendId: 'perplexity/sonar-deep-research', description: 'Deep research', category: 'search', plans: ['premium'], multiplier: 12 },
  { id: 'deepseek-v31-prem', name: 'DeepSeek V3.1', backendId: 'deepseek/deepseek-chat-v3.1', description: 'Latest DeepSeek', category: 'chat', plans: ['premium'], multiplier: 1 },
  { id: 'deepseek-v32-prem', name: 'DeepSeek V3.2', backendId: 'deepseek/deepseek-v3.2', description: 'Newest DeepSeek', category: 'chat', plans: ['premium'], multiplier: 1 },
  { id: 'llama-31-prem', name: 'LLaMA 3.1', backendId: 'meta-llama/llama-3.1-70b-instruct', description: 'Meta open-source', category: 'chat', plans: ['premium'], multiplier: 1 },
  { id: 'llama-33-prem', name: 'LLaMA 3.3', backendId: 'meta-llama/llama-3.3-70b-instruct', description: 'Latest LLaMA', category: 'chat', plans: ['premium'], multiplier: 1 },
  { id: 'llama-4-maverick-prem', name: 'Llama 4 Maverick', backendId: 'meta-llama/llama-4-maverick', description: 'Latest Llama 4', category: 'chat', plans: ['premium'], multiplier: 1 },
  { id: 'llama-4-scout-prem', name: 'Llama 4 Scout', backendId: 'meta-llama/llama-4-scout', description: 'Llama 4 Scout', category: 'chat', plans: ['premium'], multiplier: 1 },
  { id: 'kimi-k25-prem', name: 'Kimi-K2.5', backendId: 'moonshotai/kimi-k2.5', description: 'Advanced Moonshot', category: 'chat', plans: ['premium'], multiplier: 5 },
  { id: 'mistral-large-3-prem', name: 'Mistral Large 3', backendId: 'mistralai/mistral-large-2512', description: 'Mistral flagship', category: 'chat', plans: ['premium'], multiplier: 3 },
];

// Combine all models - each plan sees appropriate models
const allModels: Model[] = [
  ...freeModels,
  ...basicModels,
  ...proModels,
  ...premiumModels,
];

// Plan token limits
const planTokenLimits: Record<UserPlan, number> = {
  free: 5000,        // 5K tokens (Free Trial)
  basic: 800000,     // 800K tokens
  pro: 1500000,      // 1.5M tokens
  premium: 3000000,  // 3M tokens
};

const defaultUser: User = {
  id: '1',
  name: 'Sorix User',
  email: 'user@sorix.ai',
  plan: 'free',
  tokensUsed: 0,
  tokensLimit: planTokenLimits['free'],
};

// Helper to ensure token limit matches current plan (handles migrations)
const syncUserTokenLimit = (user: User): User => {
  const correctLimit = planTokenLimits[user.plan];
  if (user.tokensLimit !== correctLimit) {
    return { ...user, tokensLimit: correctLimit };
  }
  return user;
};

// Helper to get models by plan hierarchy
const getModelsForPlan = (plan: UserPlan): Model[] => {
  return allModels.filter(m => m.plans.includes(plan));
};

// Default model for each plan
const defaultModelByPlan: Record<UserPlan, string> = {
  free: 'gpt-4o',
  basic: 'gpt5-nano-basic',
  pro: 'gpt5-nano-pro',
  premium: 'gpt5-nano-prem',
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      
      // Sidebar
      sidebarOpen: true,
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      toggleSidebarCollapse: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      
      // View Mode
      viewMode: 'single',
      setViewMode: (mode) => set({ viewMode: mode }),
      
      // Multi-Window Chat
      chatWindows: [
        { id: '1', modelId: 'gpt-4o', messages: [], isStreaming: false },
        { id: '2', modelId: 'gemini-3-flash-free', messages: [], isStreaming: false },
      ],
      addChatWindow: () => set((state) => {
        if (state.chatWindows.length >= 4) return state;
        const availableModels = getModelsForPlan(state.user.plan);
        const usedModelIds = state.chatWindows.map(w => w.id);
        // Prefer unused models
        const unusedModels = availableModels.filter(m => !usedModelIds.includes(m.id));
        const newModelId = unusedModels.length > 0 ? unusedModels[0].id : availableModels[0]?.id || 'gpt-4o';
        return {
          chatWindows: [...state.chatWindows, {
            id: Date.now().toString(),
            modelId: newModelId,
            messages: [],
            isStreaming: false
          }]
        };
      }),
      removeChatWindow: (windowId) => set((state) => ({
        chatWindows: state.chatWindows.filter(w => w.id !== windowId)
      })),
      setWindowModel: (windowId, modelId) => set((state) => ({
        chatWindows: state.chatWindows.map(w => 
          w.id === windowId ? { ...w, modelId } : w
        )
      })),
      addWindowMessage: (windowId, message) => set((state) => ({
        chatWindows: state.chatWindows.map(w =>
          w.id === windowId ? { ...w, messages: [...w.messages, message] } : w
        )
      })),
      updateWindowLastMessage: (windowId, content) => set((state) => ({
        chatWindows: state.chatWindows.map(w => {
          if (w.id !== windowId) return w;
          const newMessages = [...w.messages];
          if (newMessages.length > 0) {
            const lastMessage = newMessages[newMessages.length - 1];
            newMessages[newMessages.length - 1] = {
              ...lastMessage,
              content: lastMessage.content + content
            };
          }
          return { ...w, messages: newMessages };
        })
      })),
      setWindowLastMessageCitations: (windowId, citations) => set((state) => ({
        chatWindows: state.chatWindows.map(w => {
          if (w.id !== windowId) return w;
          const newMessages = [...w.messages];
          if (newMessages.length > 0) {
            const lastMessage = newMessages[newMessages.length - 1];
            newMessages[newMessages.length - 1] = {
              ...lastMessage,
              citations
            };
          }
          return { ...w, messages: newMessages };
        })
      })),
      setWindowStreaming: (windowId, isStreaming) => set((state) => ({
        chatWindows: state.chatWindows.map(w =>
          w.id === windowId ? { ...w, isStreaming } : w
        )
      })),
      clearAllWindows: () => set((state) => ({
        chatWindows: state.chatWindows.map(w => ({ ...w, messages: [], isStreaming: false }))
      })),
      
      // User
      user: defaultUser,
      setUser: (user) => set({ user: syncUserTokenLimit(user) }),
      setUserPlan: (plan) => set((state) => {
        const newLimit = planTokenLimits[plan];
        const defaultModel = defaultModelByPlan[plan];
        return {
          user: { 
            ...state.user, 
            plan, 
            tokensLimit: newLimit,
            tokensUsed: 0 // Reset tokens on plan change
          },
          selectedModel: defaultModel,
          // Reset multi-window with plan-appropriate models
          chatWindows: [
            { id: '1', modelId: defaultModel, messages: [], isStreaming: false },
            { id: '2', modelId: getModelsForPlan(plan)[1]?.id || defaultModel, messages: [], isStreaming: false },
          ]
        };
      }),
      
      // Projects
      projects: [],
      activeProjectId: null,
      createProject: (name, description, icon, color) => {
        const newProject: Project = {
          id: Date.now().toString(),
          name,
          description,
          icon,
          color,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          chatCount: 0,
          status: 'active'
        };
        set((state) => ({ projects: [...state.projects, newProject] }));
        return newProject;
      },
      setActiveProject: (projectId) => set({ activeProjectId: projectId }),
      deleteProject: (projectId) => set((state) => ({
        projects: state.projects.filter(p => p.id !== projectId),
        activeProjectId: state.activeProjectId === projectId ? null : state.activeProjectId
      })),
      updateProject: (projectId, updates) => set((state) => ({
        projects: state.projects.map(p => 
          p.id === projectId ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
        )
      })),
      projectsModalOpen: false,
      setProjectsModalOpen: (open) => set({ projectsModalOpen: open }),
      
      // Chats
      chats: [],
      activeChatId: null,
      createNewChat: () => {
        const model = get().models.find(m => m.id === get().selectedModel);
        const modelName = model?.name || 'Sorix AI';
        const newChat: Chat = {
          id: Date.now().toString(),
          title: `Chat with ${modelName}`,
          messages: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        set((state) => ({
          chats: [newChat, ...state.chats],
          activeChatId: newChat.id
        }));
        return newChat;
      },
      setActiveChat: (chatId) => set({ activeChatId: chatId }),
      deleteChat: (chatId) => set((state) => ({
        chats: state.chats.filter(c => c.id !== chatId),
        activeChatId: state.activeChatId === chatId 
          ? (state.chats.find(c => c.id !== chatId)?.id || null)
          : state.activeChatId
      })),
      updateChatTitle: (chatId, title) => set((state) => ({
        chats: state.chats.map(c => 
          c.id === chatId ? { ...c, title, updatedAt: new Date().toISOString() } : c
        )
      })),
      
      // Messages (derived from active chat)
      messages: [],
      getMessages: () => {
        const state = get();
        return state.chats.find(c => c.id === state.activeChatId)?.messages || [];
      },
      setMessages: (messages) => set((state) => ({
        chats: state.chats.map(c =>
          c.id === state.activeChatId
            ? { ...c, messages, updatedAt: new Date().toISOString() }
            : c
        )
      })),
      addMessage: (message) => set((state) => {
        // Update title based on first user message
        const activeChat = state.chats.find(c => c.id === state.activeChatId);
        const isFirstUserMessage = activeChat?.messages.length === 0 && message.role === 'user';
        
        return {
          chats: state.chats.map(c =>
            c.id === state.activeChatId
              ? {
                  ...c,
                  messages: [...c.messages, message],
                  title: isFirstUserMessage 
                    ? message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '')
                    : c.title,
                  updatedAt: new Date().toISOString()
                }
              : c
          )
        };
      }),
      updateLastMessage: (content) => set((state) => ({
        chats: state.chats.map(c => {
          if (c.id !== state.activeChatId) return c;
          const newMessages = [...c.messages];
          if (newMessages.length > 0) {
            const lastMessage = newMessages[newMessages.length - 1];
            newMessages[newMessages.length - 1] = {
              ...lastMessage,
              content: lastMessage.content + content
            };
          }
          return { ...c, messages: newMessages, updatedAt: new Date().toISOString() };
        })
      })),
      setLastMessageCitations: (citations) => set((state) => ({
        chats: state.chats.map(c => {
          if (c.id !== state.activeChatId) return c;
          const newMessages = [...c.messages];
          if (newMessages.length > 0) {
            const lastMessage = newMessages[newMessages.length - 1];
            newMessages[newMessages.length - 1] = {
              ...lastMessage,
              citations
            };
          }
          return { ...c, messages: newMessages, updatedAt: new Date().toISOString() };
        })
      })),
      
      // Streaming & Loading
      isStreaming: false,
      setStreaming: (streaming) => set({ isStreaming: streaming }),
      isLoading: false,
      setLoading: (loading) => set({ isLoading: loading }),
      error: null,
      setError: (error) => set({ error }),
      
      // Attachments
      pendingAttachments: [],
      addAttachment: (attachment) => set((state) => ({
        pendingAttachments: [...state.pendingAttachments, attachment]
      })),
      removeAttachment: (index) => set((state) => ({
        pendingAttachments: state.pendingAttachments.filter((_, i) => i !== index)
      })),
      clearAttachments: () => set({ pendingAttachments: [] }),
      
      // Models
      models: allModels,
      selectedModel: 'gpt-4o',
      setSelectedModel: (modelId) => set({ selectedModel: modelId }),
      getAvailableModels: () => {
        const state = get();
        return getModelsForPlan(state.user.plan);
      },
      isModelLocked: (modelId) => {
        const state = get();
        const model = state.models.find(m => m.id === modelId);
        if (!model) return true;
        return !model.plans.includes(state.user.plan);
      },
      getModelMultiplier: (modelId) => {
        const state = get();
        const model = state.models.find(m => m.id === modelId);
        return model?.multiplier || 1;
      },
      
      // Share Modal
      shareModalOpen: false,
      shareMessageId: null,
      openShareModal: (messageId) => set({ shareModalOpen: true, shareMessageId: messageId }),
      closeShareModal: () => set({ shareModalOpen: false, shareMessageId: null }),
      
      // Language
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),
      
      // Health Mode
      isHealthMode: false,
      healthAnalysisType: 'general',
      setHealthMode: (enabled) => set({ isHealthMode: enabled }),
      setHealthAnalysisType: (type) => set({ healthAnalysisType: type }),
      
      // OpenRouter Key
      openRouterKey: '',
      setOpenRouterKey: (key) => set({ openRouterKey: key }),
    }),
    {
      name: 'sorix-chat-storage',
      partialize: (state) => ({
        theme: state.theme,
        chats: state.chats,
        activeChatId: state.activeChatId,
        user: state.user,
        projects: state.projects,
        language: state.language,
        openRouterKey: state.openRouterKey,
      }),
      onRehydrateStorage: () => (state) => {
        // Sync token limit on rehydration
        if (state?.user) {
          const correctLimit = planTokenLimits[state.user.plan];
          if (state.user.tokensLimit !== correctLimit) {
            state.user.tokensLimit = correctLimit;
          }
        }
      },
    }
  )
);
