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
  plans: UserPlan[];
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

export interface ChatWindow {
  id: string;
  modelId: string;
  messages: Message[];
  isStreaming: boolean;
}

interface ChatState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  toggleSidebarCollapse: () => void;
  
  viewMode: 'single' | 'multi';
  setViewMode: (mode: 'single' | 'multi') => void;
  
  chatWindows: ChatWindow[];
  addChatWindow: () => void;
  removeChatWindow: (windowId: string) => void;
  setWindowModel: (windowId: string, modelId: string) => void;
  addWindowMessage: (windowId: string, message: Message) => void;
  updateWindowLastMessage: (windowId: string, content: string) => void;
  setWindowLastMessageCitations: (windowId: string, citations: string[]) => void;
  setWindowStreaming: (windowId: string, isStreaming: boolean) => void;
  clearAllWindows: () => void;
  
  user: User;
  setUser: (user: User) => void;
  setUserPlan: (plan: UserPlan) => void;
  
  projects: Project[];
  activeProjectId: string | null;
  createProject: (name: string, description: string, icon: string, color: string) => Project;
  setActiveProject: (projectId: string | null) => void;
  deleteProject: (projectId: string) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  projectsModalOpen: boolean;
  setProjectsModalOpen: (open: boolean) => void;
  
  chats: Chat[];
  activeChatId: string | null;
  createNewChat: () => Chat;
  setActiveChat: (chatId: string | null) => void;
  deleteChat: (chatId: string) => void;
  updateChatTitle: (chatId: string, title: string) => void;
  
  messages: Message[];
  getMessages: () => Message[];
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateLastMessage: (content: string) => void;
  setLastMessageCitations: (citations: string[]) => void;
  
  isStreaming: boolean;
  setStreaming: (streaming: boolean) => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  
  pendingAttachments: Attachment[];
  addAttachment: (attachment: Attachment) => void;
  removeAttachment: (index: number) => void;
  clearAttachments: () => void;
  
  models: Model[];
  selectedModel: string;
  setSelectedModel: (modelId: string) => void;
  getAvailableModels: () => Model[];
  isModelLocked: (modelId: string) => boolean;
  
  shareModalOpen: boolean;
  shareMessageId: string | null;
  openShareModal: (messageId: string) => void;
  closeShareModal: () => void;
  
  language: string;
  setLanguage: (lang: string) => void;
  
  isHealthMode: boolean;
  healthAnalysisType: 'general' | 'prescription' | 'lab_report' | 'veterinary';
  setHealthMode: (enabled: boolean) => void;
  setHealthAnalysisType: (type: 'general' | 'prescription' | 'lab_report' | 'veterinary') => void;
  
  openRouterKey: string;
  setOpenRouterKey: (key: string) => void;
}

const allModels: Model[] = [
  { id: 'gpt-4o', name: 'GPT-4o', backendId: 'openai/gpt-4o-mini', description: 'Smart AI assistant', category: 'chat', plans: ['free', 'basic', 'pro', 'premium'] },
  { id: 'deepseek', name: 'DeepSeek', backendId: 'deepseek/deepseek-chat', description: 'Advanced reasoning', category: 'chat', plans: ['free', 'basic', 'pro', 'premium'] },
  { id: 'gemini-25-flash', name: 'Gemini 2.5 Flash', backendId: 'google/gemini-2.5-flash-lite-preview-09-2025', description: 'Google fast model', category: 'chat', plans: ['free', 'basic', 'pro', 'premium'] },
  
  { id: 'gpt5-mini', name: 'GPT-5 mini', backendId: 'openai/gpt-4o-mini', description: 'Fast and efficient', category: 'chat', plans: ['basic', 'pro', 'premium'] },
  { id: 'gpt5-nano', name: 'GPT-5 nano', backendId: 'openai/gpt-4o-mini', description: 'Ultra-fast responses', category: 'chat', plans: ['basic', 'pro', 'premium'] },
  { id: 'gemini-3-flash', name: 'Gemini 3 Flash', backendId: 'google/gemini-2.0-flash-001', description: 'Next-gen Gemini', category: 'chat', plans: ['basic', 'pro', 'premium'] },
  { id: 'grok-4', name: 'Grok 4', backendId: 'x-ai/grok-3-mini', description: 'xAI smart model', category: 'chat', plans: ['basic', 'pro', 'premium'] },
  { id: 'deepseek-v3', name: 'DeepSeek V3', backendId: 'deepseek/deepseek-v3', description: 'Latest DeepSeek', category: 'chat', plans: ['basic', 'pro', 'premium'] },
  { id: 'llama-smart', name: 'LLaMA Smart', backendId: 'meta-llama/llama-3.1-8b-instruct', description: 'Smart open-source', category: 'chat', plans: ['basic', 'pro', 'premium'] },
  { id: 'qwen-flash', name: 'Qwen Flash', backendId: 'qwen/qwen-2.5-7b-instruct', description: 'Fast Qwen model', category: 'code', plans: ['basic', 'pro', 'premium'] },
  
  { id: 'perplexity', name: 'Perplexity', backendId: 'perplexity/sonar', description: 'Web search powered', category: 'search', plans: ['pro', 'premium'] },
  { id: 'qwen-pro', name: 'Qwen Pro', backendId: 'qwen/qwen-2.5-coder-32b-instruct', description: 'Professional coding', category: 'code', plans: ['pro', 'premium'] },
  { id: 'gpt5-1', name: 'GPT-5.1', backendId: 'openai/gpt-4o-mini', description: 'Enhanced GPT model', category: 'chat', plans: ['pro', 'premium'] },
  { id: 'gpt5-2', name: 'GPT-5.2', backendId: 'openai/o1-mini', description: 'Flagship reasoning', category: 'chat', plans: ['pro', 'premium'] },
  { id: 'gemini-25-pro', name: 'Gemini 2.5 Pro', backendId: 'google/gemini-1.5-pro', description: 'Professional Gemini', category: 'chat', plans: ['pro', 'premium'] },
  { id: 'grok-4-fast', name: 'Grok 4 fast', backendId: 'x-ai/grok-4-fast', description: 'Fast xAI model', category: 'chat', plans: ['pro', 'premium'] },
  { id: 'deepseek-chat', name: 'DeepSeek Chat', backendId: 'deepseek/deepseek-v3', description: 'DeepSeek conversational', category: 'chat', plans: ['pro', 'premium'] },
  { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner', backendId: 'deepseek/deepseek-r1', description: 'Deep reasoning', category: 'chat', plans: ['pro', 'premium'] },
  { id: 'llama-pro', name: 'LLaMA Pro', backendId: 'meta-llama/llama-3.3-70b-instruct', description: 'Professional LLaMA', category: 'chat', plans: ['pro', 'premium'] },
  
  { id: 'claude-sonnet-45', name: 'Claude Sonnet 4.5', backendId: 'anthropic/claude-sonnet-4.5', description: 'Anthropic Sonnet', category: 'chat', plans: ['premium'] },
  { id: 'claude-opus-45', name: 'Claude Opus 4.5', backendId: 'anthropic/claude-haiku-4.5', description: 'Anthropic Opus', category: 'chat', plans: ['premium'] },
  { id: 'gemini-3-pro', name: 'Gemini 3 Pro (Experimental)', backendId: 'google/gemini-2.0-pro-exp-02-05', description: 'Cutting-edge Gemini', category: 'chat', plans: ['premium'] },
  { id: 'grok-41-fast', name: 'Grok 4.1 fast', backendId: 'x-ai/grok-4.1-fast', description: 'Latest xAI model', category: 'chat', plans: ['premium'] },
  { id: 'llama-ultra', name: 'LLaMA Ultra', backendId: 'meta-llama/llama-3.3-70b-instruct', description: 'Maximum capability', category: 'chat', plans: ['premium'] },
  { id: 'kimi-k2', name: 'Kimi-K2', backendId: 'moonshotai/kimi-k2', description: 'Advanced Moonshot', category: 'chat', plans: ['premium'] },
  { id: 'mistral-codestral', name: 'Mistral Codestral', backendId: 'mistralai/codestral-2508', description: 'Mistral code expert', category: 'code', plans: ['premium'] },
];

const planTokenLimits: Record<UserPlan, number> = {
  free: 5000,
  basic: 800000,
  pro: 1500000,
  premium: 3000000,
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

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      
      sidebarOpen: true,
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      toggleSidebarCollapse: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      
      viewMode: 'single',
      setViewMode: (mode) => set({ viewMode: mode }),
      
      chatWindows: [
        { id: '1', modelId: 'gpt-4o', messages: [], isStreaming: false },
        { id: '2', modelId: 'gemini-25-flash', messages: [], isStreaming: false },
      ],
      addChatWindow: () => set((state) => {
        if (state.chatWindows.length >= 4) return state;
        const availableModels = state.getAvailableModels();
        const usedModels = state.chatWindows.map(w => w.modelId);
        const availableModel = availableModels.find(m => !usedModels.includes(m.id))?.id || 'gpt-4o';
        return {
          chatWindows: [
            ...state.chatWindows,
            { id: Date.now().toString(), modelId: availableModel, messages: [], isStreaming: false }
          ]
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
          if (w.id !== windowId || w.messages.length === 0) return w;
          const messages = [...w.messages];
          const lastMessage = { ...messages[messages.length - 1] };
          lastMessage.content += content;
          messages[messages.length - 1] = lastMessage;
          return { ...w, messages };
        })
      })),
      setWindowLastMessageCitations: (windowId, citations) => set((state) => ({
        chatWindows: state.chatWindows.map(w => {
          if (w.id !== windowId || w.messages.length === 0) return w;
          const messages = [...w.messages];
          const lastMessage = { ...messages[messages.length - 1] };
          lastMessage.citations = citations;
          messages[messages.length - 1] = lastMessage;
          return { ...w, messages };
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
      
      user: syncUserTokenLimit(defaultUser),
      setUser: (user) => set({ user: syncUserTokenLimit(user) }),
      setUserPlan: (plan) => set((state) => ({
        user: {
          ...state.user,
          plan,
          tokensLimit: planTokenLimits[plan],
        }
      })),
      
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
        set((state) => ({
          projects: [newProject, ...state.projects],
          activeProjectId: newProject.id
        }));
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
      
      chats: [],
      activeChatId: null,
      createNewChat: () => {
        const newChat: Chat = {
          id: Date.now().toString(),
          title: 'New Chat',
          messages: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          chats: [newChat, ...state.chats],
          activeChatId: newChat.id,
        }));
        return newChat;
      },
      setActiveChat: (chatId) => set({ activeChatId: chatId }),
      deleteChat: (chatId) => set((state) => ({
        chats: state.chats.filter((c) => c.id !== chatId),
        activeChatId: state.activeChatId === chatId ? null : state.activeChatId,
      })),
      updateChatTitle: (chatId, title) => set((state) => ({
        chats: state.chats.map(c => c.id === chatId ? { ...c, title } : c)
      })),
      
      messages: [],
      getMessages: () => {
        const state = get();
        const activeChat = state.chats.find((c) => c.id === state.activeChatId);
        return activeChat?.messages || [];
      },
      addMessage: (message) => set((state) => {
        const chatIndex = state.chats.findIndex((c) => c.id === state.activeChatId);
        if (chatIndex === -1) return state;
        
        const updatedChats = [...state.chats];
        const chat = { ...updatedChats[chatIndex] };
        chat.messages = [...chat.messages, message];
        chat.updatedAt = new Date().toISOString();
        
        if (message.role === 'user' && chat.messages.filter(m => m.role === 'user').length === 1) {
          chat.title = message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '');
        }
        
        updatedChats[chatIndex] = chat;
        return { chats: updatedChats };
      }),
      updateLastMessage: (content) => set((state) => {
        const chatIndex = state.chats.findIndex((c) => c.id === state.activeChatId);
        if (chatIndex === -1) return state;
        
        const updatedChats = [...state.chats];
        const chat = { ...updatedChats[chatIndex] };
        const messages = [...chat.messages];
        
        if (messages.length > 0) {
          const lastMessage = { ...messages[messages.length - 1] };
          lastMessage.content += content;
          messages[messages.length - 1] = lastMessage;
          chat.messages = messages;
          updatedChats[chatIndex] = chat;
        }
        
        return { chats: updatedChats };
      }),
      setLastMessageCitations: (citations) => set((state) => {
        const chatIndex = state.chats.findIndex((c) => c.id === state.activeChatId);
        if (chatIndex === -1) return state;
        
        const updatedChats = [...state.chats];
        const chat = { ...updatedChats[chatIndex] };
        const messages = [...chat.messages];
        
        if (messages.length > 0) {
          const lastMessage = { ...messages[messages.length - 1] };
          lastMessage.citations = citations;
          messages[messages.length - 1] = lastMessage;
          chat.messages = messages;
          updatedChats[chatIndex] = chat;
        }
        
        return { chats: updatedChats };
      }),
      setMessages: (messages) => {
        set((state) => {
          const chatIndex = state.chats.findIndex((c) => c.id === state.activeChatId);
          if (chatIndex === -1) return state;
          
          const updatedChats = [...state.chats];
          updatedChats[chatIndex] = { ...updatedChats[chatIndex], messages };
          return { chats: updatedChats };
        });
      },
      
      isStreaming: false,
      setStreaming: (streaming) => set({ isStreaming: streaming }),
      isLoading: false,
      setLoading: (loading) => set({ isLoading: loading }),
      error: null,
      setError: (error) => set({ error }),
      
      pendingAttachments: [],
      addAttachment: (attachment) => set((state) => ({
        pendingAttachments: [...state.pendingAttachments, attachment],
      })),
      removeAttachment: (index) => set((state) => ({
        pendingAttachments: state.pendingAttachments.filter((_, i) => i !== index),
      })),
      clearAttachments: () => set({ pendingAttachments: [] }),
      
      models: allModels,
      selectedModel: 'gpt-4o',
      setSelectedModel: (modelId) => {
        const state = get();
        const model = allModels.find(m => m.id === modelId);
        if (model && model.plans.includes(state.user.plan)) {
          set({ selectedModel: modelId });
        }
      },
      getAvailableModels: () => {
        const state = get();
        return allModels.filter(m => m.plans.includes(state.user.plan));
      },
      isModelLocked: (modelId) => {
        const state = get();
        const model = allModels.find(m => m.id === modelId);
        return model ? !model.plans.includes(state.user.plan) : true;
      },
      
      shareModalOpen: false,
      shareMessageId: null,
      openShareModal: (messageId) => set({ shareModalOpen: true, shareMessageId: messageId }),
      closeShareModal: () => set({ shareModalOpen: false, shareMessageId: null }),
      
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),
      
      isHealthMode: false,
      healthAnalysisType: 'general' as const,
      setHealthMode: (enabled) => set({ isHealthMode: enabled }),
      setHealthAnalysisType: (type) => set({ healthAnalysisType: type }),
      
      openRouterKey: '',
      setOpenRouterKey: (key) => set({ openRouterKey: key }),
    }),
    {
      name: 'sorix-chat-storage',
      partialize: (state) => ({
        theme: state.theme,
        chats: state.chats,
        activeChatId: state.activeChatId,
        selectedModel: state.selectedModel,
        language: state.language,
        sidebarCollapsed: state.sidebarCollapsed,
        user: state.user,
        openRouterKey: state.openRouterKey,
      }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<ChatState>;
        const user = persisted.user 
          ? syncUserTokenLimit(persisted.user as User) 
          : currentState.user;
        return {
          ...currentState,
          ...persisted,
          user,
        };
      },
    }
  )
);

export default useChatStore;
