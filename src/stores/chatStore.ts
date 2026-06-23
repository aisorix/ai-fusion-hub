import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { FileType } from '@/lib/fileParser';

export interface Attachment {
  type: 'image' | 'file';
  url: string;
  name: string;
  size?: number;
  parsedContent?: string;
  fileType?: FileType;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  attachments?: Attachment[] | null;
  citations?: string[] | null;
  modelId?: string;
  modelName?: string;
  createdAt: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  isStarred?: boolean;
  projectId?: string | null;
  titleManuallySet?: boolean;
}

export type ModelCategory = 'chat' | 'code' | 'search' | 'system';
export type UserPlan = 'free' | 'basic' | 'pro' | 'premium' | 'premium_plus' | 'max' | 'enterprise';

export interface Model {
  id: string;
  name: string;
  backendId: string;
  description: string;
  category: ModelCategory;
  plans: UserPlan[];
  multiplier: number;
  dailyLimit?: Partial<Record<UserPlan, number>>;
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
  historyCollapsed: boolean;
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
  setWindowMessages: (windowId: string, messages: Message[]) => void;
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
  updateChatTitle: (chatId: string, title: string, manual?: boolean) => void;
  toggleStarChat: (chatId: string) => void;
  addChatToProject: (chatId: string, projectId: string | null) => void;
  
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
  
  // Daily Model Usage
  dailyModelUsage: Record<string, { count: number; date: string }>;
  incrementDailyUsage: (modelId: string) => void;
  getDailyUsageRemaining: (modelId: string) => number | null;
  
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
// MODEL DEFINITIONS - SINGLE SOURCE OF TRUTH
// ============================================

const smartAutoModel: Model = {
  id: 'smart-auto',
  name: 'Smart Auto',
  backendId: 'smart-auto',
  description: 'AI routes your query to the best model for optimal results',
  category: 'system',
  plans: ['free', 'basic', 'pro', 'premium', 'premium_plus', 'max', 'enterprise'],
  multiplier: 1,
};

// 🆓 FREE TIER MODELS — available to everyone
const freeModels: Model[] = [
  { id: 'gpt-4o', name: 'GPT-4o', backendId: 'openai/gpt-4o-mini', description: 'Smart AI assistant', category: 'chat', plans: ['free', 'basic', 'pro', 'premium', 'premium_plus', 'max', 'enterprise'], multiplier: 1 },
  { id: 'deepseek-v31', name: 'DeepSeek V3.1', backendId: 'deepseek/deepseek-chat-v3.1', description: 'Advanced reasoning', category: 'chat', plans: ['free', 'basic', 'pro', 'premium', 'premium_plus', 'max', 'enterprise'], multiplier: 1 },
  { id: 'gemini-25-flash', name: 'Gemini 2.5 Flash', backendId: 'google/gemini-2.5-flash-lite', description: 'Fast Google model', category: 'chat', plans: ['free', 'basic', 'pro', 'premium', 'premium_plus', 'max', 'enterprise'], multiplier: 1 },
];

// 📦 BASIC TIER MODELS — available to basic and above
const basicModels: Model[] = [
  { id: 'gpt5-1-mini', name: 'GPT-5.1 mini', backendId: 'openai/gpt-5-mini', description: 'Fast and efficient', category: 'chat', plans: ['basic', 'pro', 'premium', 'premium_plus', 'max', 'enterprise'], multiplier: 1 },
  { id: 'gpt5-nano', name: 'GPT-5 nano', backendId: 'openai/gpt-5-nano', description: 'Ultra-fast responses', category: 'chat', plans: ['basic', 'pro', 'premium', 'premium_plus', 'max', 'enterprise'], multiplier: 1 },
  { id: 'gemini-3-flash', name: 'Gemini 3 Flash', backendId: 'google/gemini-3-flash-preview', description: 'Next-gen Gemini', category: 'chat', plans: ['basic', 'pro', 'premium', 'premium_plus', 'max', 'enterprise'], multiplier: 1.5 },
  { id: 'gemini-3', name: 'Gemini 3', backendId: 'google/gemini-3-flash-preview', description: 'Google flagship', category: 'chat', plans: ['basic', 'pro', 'premium', 'premium_plus', 'max', 'enterprise'], multiplier: 1.5 },
  { id: 'grok-4', name: 'Grok 4', backendId: 'x-ai/grok-3-mini', description: 'xAI smart model', category: 'chat', plans: ['basic', 'pro', 'premium', 'premium_plus', 'max', 'enterprise'], multiplier: 1 },
  { id: 'grok-4-fast', name: 'Grok 4 Fast', backendId: 'x-ai/grok-4-fast', description: 'Fast xAI model', category: 'chat', plans: ['basic', 'pro', 'premium', 'premium_plus', 'max', 'enterprise'], multiplier: 1 },
  { id: 'deepseek-v32', name: 'DeepSeek V3.2', backendId: 'deepseek/deepseek-v3.2', description: 'Newest DeepSeek', category: 'chat', plans: ['basic', 'pro', 'premium', 'premium_plus', 'max', 'enterprise'], multiplier: 1 },
  { id: 'llama-31', name: 'LLaMA 3.1', backendId: 'meta-llama/llama-3.1-70b-instruct', description: 'Meta open-source', category: 'chat', plans: ['basic', 'pro', 'premium', 'premium_plus', 'max', 'enterprise'], multiplier: 1 },
  { id: 'llama-33', name: 'LLaMA 3.3', backendId: 'meta-llama/llama-3.3-70b-instruct', description: 'Latest LLaMA', category: 'chat', plans: ['basic', 'pro', 'premium', 'premium_plus', 'max', 'enterprise'], multiplier: 1 },
  { id: 'qwen3-coder', name: 'Qwen 3 Coder', backendId: 'qwen/qwen3-coder', description: 'Code specialist', category: 'code', plans: ['basic', 'pro', 'premium', 'premium_plus', 'max', 'enterprise'], multiplier: 1 },
  { id: 'qwen3-vl', name: 'Qwen 3 VL', backendId: 'qwen/qwen3-vl-235b-a22b-instruct', description: 'Vision-language', category: 'chat', plans: ['basic', 'pro', 'premium', 'premium_plus', 'max', 'enterprise'], multiplier: 1 },
];

// ⚡ PRO TIER MODELS — available to pro and above
const proModels: Model[] = [
  { id: 'qwen3-pro', name: 'Qwen 3 Pro', backendId: 'qwen/qwen3-235b-a22b-2507', description: 'Professional Qwen', category: 'chat', plans: ['pro', 'premium', 'premium_plus', 'max', 'enterprise'], multiplier: 1 },
  { id: 'gpt5-1', name: 'GPT-5.1', backendId: 'openai/gpt-5.1', description: 'Enhanced GPT model', category: 'chat', plans: ['pro', 'premium', 'premium_plus', 'max', 'enterprise'], multiplier: 4, dailyLimit: { pro: 20, premium: 20 } },
  { id: 'gpt5-2-limited', name: 'GPT-5.2 (Limited)', backendId: 'openai/gpt-5.2', description: 'Flagship reasoning', category: 'chat', plans: ['pro'], multiplier: 6.5, dailyLimit: { pro: 10 } },
  { id: 'gemini-25-pro-limited', name: 'Gemini 2.5 Pro (Limited)', backendId: 'google/gemini-2.5-pro', description: 'Professional Gemini', category: 'chat', plans: ['pro'], multiplier: 4, dailyLimit: { pro: 20 } },
  { id: 'grok-41-fast', name: 'Grok 4.1 fast', backendId: 'x-ai/grok-4.1-fast', description: 'Latest xAI model', category: 'chat', plans: ['pro', 'premium', 'premium_plus', 'max', 'enterprise'], multiplier: 1 },
  { id: 'perplexity-sonar', name: 'Perplexity Sonar', backendId: 'perplexity/sonar', description: 'Web search powered', category: 'search', plans: ['pro', 'premium', 'premium_plus', 'max', 'enterprise'], multiplier: 3 },
  { id: 'llama-4-maverick', name: 'Llama 4 Maverick', backendId: 'meta-llama/llama-4-maverick', description: 'Latest Llama 4', category: 'chat', plans: ['pro', 'premium', 'premium_plus', 'max', 'enterprise'], multiplier: 1 },
  { id: 'llama-4-scout', name: 'Llama 4 Scout', backendId: 'meta-llama/llama-4-scout', description: 'Llama 4 Scout', category: 'chat', plans: ['pro', 'premium', 'premium_plus', 'max', 'enterprise'], multiplier: 1 },
];

// 👑 PREMIUM TIER MODELS — available to premium and above (incl. enterprise)
const premiumModels: Model[] = [
  { id: 'claude-sonnet-45', name: 'Claude Sonnet 4.5', backendId: 'anthropic/claude-sonnet-4.5', description: 'Anthropic Sonnet', category: 'chat', plans: ['premium', 'premium_plus', 'max', 'enterprise'], multiplier: 6, dailyLimit: { premium: 20, premium_plus: 40, max: 80 } },
  { id: 'claude-opus-45', name: 'Claude Opus 4.5', backendId: 'anthropic/claude-opus-4.5', description: 'Anthropic Opus', category: 'chat', plans: ['premium', 'premium_plus', 'max', 'enterprise'], multiplier: 10, dailyLimit: { premium: 10, premium_plus: 25, max: 50 } },
  { id: 'gpt5-2', name: 'GPT-5.2', backendId: 'openai/gpt-5.2', description: 'Flagship reasoning', category: 'chat', plans: ['premium', 'premium_plus', 'max', 'enterprise'], multiplier: 6.5, dailyLimit: { premium: 30, premium_plus: 60, max: 120 } },
  { id: 'gemini-25-pro', name: 'Gemini 2.5 Pro', backendId: 'google/gemini-2.5-pro', description: 'Professional Gemini', category: 'chat', plans: ['premium', 'premium_plus', 'max', 'enterprise'], multiplier: 4, dailyLimit: { premium: 20, premium_plus: 40, max: 80 } },

  { id: 'kimi-k25', name: 'Kimi-K2.5', backendId: 'moonshotai/kimi-k2.5', description: 'Advanced Moonshot', category: 'chat', plans: ['premium', 'premium_plus', 'max', 'enterprise'], multiplier: 1 },
  { id: 'mistral-large-3', name: 'Mistral Large 3', backendId: 'mistralai/mistral-large-2512', description: 'Mistral flagship', category: 'chat', plans: ['premium', 'premium_plus', 'max', 'enterprise'], multiplier: 1 },
];

const allModels: Model[] = [
  smartAutoModel,
  ...freeModels,
  ...basicModels,
  ...proModels,
  ...premiumModels,
];

const planTokenLimits: Record<UserPlan, number> = {
  free: 15000,
  basic: 800000,
  pro: 1500000,
  premium: 3000000,
  premium_plus: 7000000,
  max: 17000000,
  enterprise: 50000000,
};

const defaultUser: User = {
  id: '1',
  name: 'Sorix User',
  email: 'user@sorix.ai',
  plan: 'free',
  tokensUsed: 0,
  tokensLimit: planTokenLimits['free'],
};

const syncUserTokenLimit = (user: User): User => {
  const correctLimit = planTokenLimits[user.plan];
  if (user.tokensLimit !== correctLimit) {
    return { ...user, tokensLimit: correctLimit };
  }
  return user;
};

const getModelsForPlan = (plan: UserPlan): Model[] => {
  return allModels.filter(m => m.plans.includes(plan));
};

export const getModelTier = (model: Model): UserPlan => {
  if (model.plans.includes('free')) return 'free';
  if (model.plans.includes('basic')) return 'basic';
  if (model.plans.includes('pro')) return 'pro';
  return 'premium';
};

export const getModelsGroupedByTier = (allModelsList: Model[]): {
  free: Model[];
  basic: Model[];
  pro: Model[];
  premium: Model[];
} => {
  return {
    free: allModelsList.filter(m => m.id !== 'smart-auto' && getModelTier(m) === 'free'),
    basic: allModelsList.filter(m => getModelTier(m) === 'basic'),
    pro: allModelsList.filter(m => getModelTier(m) === 'pro'),
    premium: allModelsList.filter(m => getModelTier(m) === 'premium'),
  };
};

const defaultModelByPlan: Record<UserPlan, string> = {
  free: 'smart-auto',
  basic: 'smart-auto',
  pro: 'smart-auto',
  premium: 'smart-auto',
  premium_plus: 'smart-auto',
  max: 'smart-auto',
  enterprise: 'smart-auto',
};

// Maximum chats to persist in localStorage
const MAX_PERSISTED_CHATS = 30;

// Strip attachments from messages for persistence to prevent localStorage overflow
const stripAttachmentsForPersistence = (chats: Chat[]): Chat[] => {
  return chats.slice(0, MAX_PERSISTED_CHATS).map(chat => ({
    ...chat,
    messages: chat.messages.map(msg => ({
      ...msg,
      attachments: msg.attachments?.map(att => ({
        ...att,
        url: att.type === 'image' ? '' : att.url, // Strip base64 images
        parsedContent: undefined, // Strip parsed file content
      })) || null,
    })),
  }));
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
      historyCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      toggleSidebarCollapse: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      
      // View Mode
      viewMode: 'single',
      setViewMode: (mode) => set({ viewMode: mode }),
      
      // Multi-Window Chat
      chatWindows: [
        { id: '1', modelId: 'gpt-4o', messages: [], isStreaming: false },
        { id: '2', modelId: 'gemini-25-flash', messages: [], isStreaming: false },
      ],
      addChatWindow: () => set((state) => {
        if (state.chatWindows.length >= 4) return state;
        const availableModels = getModelsForPlan(state.user.plan).filter(m => m.id !== 'smart-auto');
        const usedModelIds = state.chatWindows.map(w => w.modelId);
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
      setWindowMessages: (windowId, messages) => set((state) => ({
        chatWindows: state.chatWindows.map(w =>
          w.id === windowId ? { ...w, messages } : w
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
        const planModels = getModelsForPlan(plan).filter(m => m.id !== 'smart-auto');
        return {
          user: { 
            ...state.user, 
            plan, 
            tokensLimit: newLimit,
            tokensUsed: 0
          },
          selectedModel: defaultModel,
          chatWindows: [
            { id: '1', modelId: planModels[0]?.id || 'gpt-4o', messages: [], isStreaming: false },
            { id: '2', modelId: planModels[1]?.id || planModels[0]?.id || 'gpt-4o', messages: [], isStreaming: false },
          ]
        };
      }),
      
      // Projects
      projects: [],
      activeProjectId: null,
      createProject: (name, description, icon, color) => {
        const newProject: Project = {
          id: Date.now().toString(),
          name, description, icon, color,
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
      updateChatTitle: (chatId, title, manual = true) => set((state) => ({
        chats: state.chats.map(c =>
          c.id === chatId ? { ...c, title, titleManuallySet: manual ? true : c.titleManuallySet, updatedAt: new Date().toISOString() } : c
        )
      })),
      toggleStarChat: (chatId) => set((state) => ({
        chats: state.chats.map(c =>
          c.id === chatId ? { ...c, isStarred: !c.isStarred, updatedAt: new Date().toISOString() } : c
        )
      })),
      addChatToProject: (chatId, projectId) => set((state) => ({
        chats: state.chats.map(c =>
          c.id === chatId ? { ...c, projectId, updatedAt: new Date().toISOString() } : c
        )
      })),
      
      // Messages
      messages: [],
      getMessages: () => {
        const state = get();
        return state.chats.find(c => c.id === state.activeChatId)?.messages || [];
      },
      setMessages: (messages) => set((state) => ({
        chats: state.chats.map(c =>
          c.id === state.activeChatId ? { ...c, messages, updatedAt: new Date().toISOString() } : c
        )
      })),
      addMessage: (message) => set((state) => {
        const activeChat = state.chats.find(c => c.id === state.activeChatId);
        const isFirstUserMessage = activeChat?.messages.length === 0 && message.role === 'user';
        const smartTitle = (raw: string) => {
          const cleaned = raw
            .replace(/```[\s\S]*?```/g, ' ')
            .replace(/`[^`]*`/g, ' ')
            .replace(/https?:\/\/\S+/g, ' ')
            .replace(/[#*_>~\[\]()]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
          if (!cleaned) return 'New Chat';
          const words = cleaned.split(' ').slice(0, 6).join(' ');
          const titled = words
            .split(' ')
            .map(w => w.length > 2 ? w.charAt(0).toUpperCase() + w.slice(1) : w)
            .join(' ');
          return titled.length > 40 ? titled.slice(0, 40).trim() + '…' : titled;
        };
        return {
          chats: state.chats.map(c =>
            c.id === state.activeChatId
              ? {
                  ...c,
                  messages: [...c.messages, message],
                  title: isFirstUserMessage && !c.titleManuallySet
                    ? smartTitle(message.content)
                    : c.title,
                  updatedAt: new Date().toISOString()
                }
              : c
          )
        };
      }),
      updateLastMessage: (content) => set((state) => {
        const idx = state.chats.findIndex(c => c.id === state.activeChatId);
        if (idx === -1) return state;
        const chat = state.chats[idx];
        const newMessages = [...chat.messages];
        if (newMessages.length > 0) {
          const last = newMessages[newMessages.length - 1];
          newMessages[newMessages.length - 1] = { ...last, content: last.content + content };
        }
        const newChats = [...state.chats];
        newChats[idx] = { ...chat, messages: newMessages, updatedAt: new Date().toISOString() };
        return { chats: newChats };
      }),
      setLastMessageCitations: (citations) => set((state) => ({
        chats: state.chats.map(c => {
          if (c.id !== state.activeChatId) return c;
          const newMessages = [...c.messages];
          if (newMessages.length > 0) {
            const lastMessage = newMessages[newMessages.length - 1];
            newMessages[newMessages.length - 1] = { ...lastMessage, citations };
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
      selectedModel: 'smart-auto',
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
      
      // Daily Model Usage
      dailyModelUsage: {},
      incrementDailyUsage: (modelId) => set((state) => {
        const today = new Date().toISOString().split('T')[0];
        const current = state.dailyModelUsage[modelId];
        const count = (current && current.date === today) ? current.count + 1 : 1;
        return {
          dailyModelUsage: {
            ...state.dailyModelUsage,
            [modelId]: { count, date: today }
          }
        };
      }),
      getDailyUsageRemaining: (modelId) => {
        const state = get();
        const model = state.models.find(m => m.id === modelId);
        if (!model?.dailyLimit) return null;
        const limit = model.dailyLimit[state.user.plan];
        if (limit === undefined) return null;
        const today = new Date().toISOString().split('T')[0];
        const usage = state.dailyModelUsage[modelId];
        const used = (usage && usage.date === today) ? usage.count : 0;
        return Math.max(0, limit - used);
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
        chats: stripAttachmentsForPersistence(state.chats),
        activeChatId: state.activeChatId,
        user: state.user,
        projects: state.projects,
        language: state.language,
        openRouterKey: state.openRouterKey,
        dailyModelUsage: state.dailyModelUsage,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.user) {
          const correctLimit = planTokenLimits[state.user.plan];
          if (state.user.tokensLimit !== correctLimit) {
            state.user.tokensLimit = correctLimit;
          }
        }
        // Prune old chats on rehydration
        if (state?.chats && state.chats.length > MAX_PERSISTED_CHATS) {
          state.chats = state.chats.slice(0, MAX_PERSISTED_CHATS);
        }
        if (state && state.selectedModel && !allModels.find(m => m.id === state.selectedModel)) {
          state.selectedModel = 'smart-auto';
        }
      },
    }
  )
);
