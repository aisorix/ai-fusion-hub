import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useChatStore, type UserPlan } from '@/stores/chatStore';

export type ProjectModel = 'deepseek/deepseek-v3.2' | 'anthropic/claude-sonnet-4.5';

export interface DbProject {
  id: string;
  user_id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  model: ProjectModel;
  status: 'active' | 'completed' | 'archived';
  chat_count: number;
  tokens_used: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectMessage {
  id: string;
  project_id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  tokens_used: number;
  created_at: string;
}

const PLAN_PROJECT_LIMITS: Record<UserPlan, number> = {
  free: 0,
  basic: 2,
  pro: 5,
  premium: 10,
  premium_plus: 25,
  max: 100,
  enterprise: 999,
};

const MODEL_MULTIPLIERS: Record<ProjectModel, number> = {
  'deepseek/deepseek-v3.2': 1,
  'anthropic/claude-sonnet-4.5': 6,
};

export const useProjectAI = () => {
  const { user: authUser } = useAuth();
  const { user: storeUser } = useChatStore();
  const [projects, setProjects] = useState<DbProject[]>([]);
  const [currentProject, setCurrentProject] = useState<DbProject | null>(null);
  const [messages, setMessages] = useState<ProjectMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const plan = storeUser.plan;
  const maxProjects = PLAN_PROJECT_LIMITS[plan];
  const canCreateProject = plan !== 'free' && projects.length < maxProjects;

  const fetchProjects = useCallback(async () => {
    if (!authUser) return;
    setIsLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('projects')
        .select('*')
        .eq('user_id', authUser.id)
        .order('updated_at', { ascending: false });
      if (error) throw error;
      setProjects((data || []) as DbProject[]);
    } catch (error: any) {
      if (!error.message?.includes('does not exist')) {
        console.error('Error fetching projects:', error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [authUser]);

  const createProject = useCallback(async (
    name: string,
    description: string,
    icon: string,
    color: string,
    model: ProjectModel = 'deepseek/deepseek-v3.2',
    projectType: string = 'other'
  ): Promise<DbProject | null> => {
    if (!authUser) return null;
    if (!canCreateProject) {
      toast({ title: 'Limit Reached', description: `Your ${plan} plan allows ${maxProjects} projects.`, variant: 'destructive' });
      return null;
    }
    try {
      const { data, error } = await (supabase as any)
        .from('projects')
        .insert({ user_id: authUser.id, name, description, icon, color, model, status: 'active', project_type: projectType })
        .select()
        .single();
      if (error) throw error;
      const newProject = data as DbProject;
      setProjects(prev => [newProject, ...prev]);
      toast({ title: 'Project Created', description: `"${name}" is ready.` });
      return newProject;
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast({ title: 'Error', description: 'Failed to create project', variant: 'destructive' });
      return null;
    }
  }, [authUser, canCreateProject, plan, maxProjects]);

  const updateProject = useCallback(async (projectId: string, updates: Partial<DbProject>): Promise<boolean> => {
    try {
      const { error } = await (supabase as any).from('projects').update(updates).eq('id', projectId);
      if (error) throw error;
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, ...updates } : p));
      if (currentProject?.id === projectId) setCurrentProject(prev => prev ? { ...prev, ...updates } : null);
      return true;
    } catch (error: any) {
      console.error('Error updating project:', error);
      return false;
    }
  }, [currentProject]);

  const deleteProject = useCallback(async (projectId: string): Promise<boolean> => {
    try {
      // Delete messages first, then project
      await (supabase as any).from('project_messages').delete().eq('project_id', projectId);
      const { error } = await (supabase as any).from('projects').delete().eq('id', projectId);
      if (error) throw error;
      setProjects(prev => prev.filter(p => p.id !== projectId));
      if (currentProject?.id === projectId) { setCurrentProject(null); setMessages([]); }
      toast({ title: 'Deleted', description: 'Project removed.' });
      return true;
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast({ title: 'Error', description: 'Failed to delete project', variant: 'destructive' });
      return false;
    }
  }, [currentProject]);

  const selectProject = useCallback(async (project: DbProject): Promise<void> => {
    setCurrentProject(project);
    setIsLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('project_messages')
        .select('*')
        .eq('project_id', project.id)
        .order('created_at', { ascending: true });
      if (error) throw error;
      setMessages((data || []) as ProjectMessage[]);
    } catch (error: any) {
      if (!error.message?.includes('does not exist')) {
        console.error('Error loading messages:', error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (
    content: string,
    fileContext?: { name: string; path: string; content: string; language: string }[]
  ): Promise<void> => {
    if (!currentProject || !authUser || !content.trim()) return;

    setIsStreaming(true);

    // Add user message optimistically
    const userMsg: ProjectMessage = {
      id: Date.now().toString(),
      project_id: currentProject.id,
      user_id: authUser.id,
      role: 'user',
      content: content.trim(),
      tokens_used: 0,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);

    // Add placeholder assistant message
    const assistantId = (Date.now() + 1).toString();
    const assistantMsg: ProjectMessage = {
      id: assistantId,
      project_id: currentProject.id,
      user_id: authUser.id,
      role: 'assistant',
      content: '',
      tokens_used: 0,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, assistantMsg]);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error('No session');

      // Build conversation history (last 20 messages for context)
      const conversationHistory = messages.slice(-20).map(m => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/project-ai`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            projectId: currentProject.id,
            message: content.trim(),
            conversationHistory,
            userId: authUser.id,
            model: currentProject.model || 'deepseek/deepseek-v3.2',
            files: fileContext || [],
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.error === 'TOKEN_LIMIT_REACHED') {
          throw new Error('TOKEN_LIMIT_REACHED');
        }
        throw new Error(errorData.error || `Error: ${response.status}`);
      }

      // Parse SSE stream
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const data = JSON.parse(line.slice(6));
              const delta = data.choices?.[0]?.delta?.content;
              if (delta) {
                fullContent += delta;
                setMessages(prev => prev.map(m =>
                  m.id === assistantId ? { ...m, content: fullContent } : m
                ));
              }
            } catch { /* ignore parse errors */ }
          }
        }
      }

      // Update user's tokens in store
      const multiplier = MODEL_MULTIPLIERS[currentProject.model as ProjectModel] || 1;
      const inputTokens = Math.ceil(content.length / 4);
      const outputTokens = Math.ceil(fullContent.length / 4);
      const totalDeducted = Math.round((inputTokens + outputTokens) * multiplier);

      useChatStore.setState(state => ({
        user: { ...state.user, tokensUsed: state.user.tokensUsed + totalDeducted }
      }));

    } catch (error: any) {
      console.error('Error sending message:', error);
      if (error.message === 'TOKEN_LIMIT_REACHED') {
        setMessages(prev => prev.map(m =>
          m.id === assistantId ? { ...m, content: '⚠️ You\'ve reached your token limit. Please upgrade your plan to continue.' } : m
        ));
      } else {
        setMessages(prev => prev.map(m =>
          m.id === assistantId ? { ...m, content: '❌ Failed to get response. Please try again.' } : m
        ));
      }
    } finally {
      setIsStreaming(false);
    }
  }, [currentProject, authUser, messages]);

  useEffect(() => {
    if (authUser) fetchProjects();
  }, [authUser, fetchProjects]);

  return {
    projects,
    currentProject,
    messages,
    isStreaming,
    isLoading,
    plan,
    maxProjects,
    canCreateProject,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    selectProject,
    sendMessage,
    setCurrentProject,
    setMessages,
  };
};

export default useProjectAI;
