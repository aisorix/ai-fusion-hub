// Project AI hook for project-specific AI conversations
// Handles project management and message persistence
// NOTE: Uses 'any' type assertions until types are regenerated after migration

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface DbProject {
  id: string;
  user_id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
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

export const useProjectAI = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<DbProject[]>([]);
  const [currentProject, setCurrentProject] = useState<DbProject | null>(null);
  const [messages, setMessages] = useState<ProjectMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all projects for the current user
  const fetchProjects = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Use type assertion since types aren't regenerated yet
      const { data, error } = await (supabase as any)
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setProjects((data || []) as DbProject[]);
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      // Only show toast if it's not a "table doesn't exist" error
      if (!error.message?.includes('does not exist')) {
        toast({
          title: 'Error',
          description: 'Failed to load projects',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Create a new project
  const createProject = useCallback(async (
    name: string,
    description: string,
    icon: string,
    color: string
  ): Promise<DbProject | null> => {
    if (!user) return null;

    try {
      const { data, error } = await (supabase as any)
        .from('projects')
        .insert({
          user_id: user.id,
          name,
          description,
          icon,
          color,
          status: 'active',
        })
        .select()
        .single();

      if (error) throw error;
      
      const newProject = data as DbProject;
      setProjects(prev => [newProject, ...prev]);
      
      toast({
        title: 'Project Created',
        description: `"${name}" has been created successfully.`,
      });
      
      return newProject;
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast({
        title: 'Error',
        description: 'Failed to create project',
        variant: 'destructive',
      });
      return null;
    }
  }, [user]);

  // Update a project
  const updateProject = useCallback(async (
    projectId: string,
    updates: Partial<DbProject>
  ): Promise<boolean> => {
    try {
      const { error } = await (supabase as any)
        .from('projects')
        .update(updates)
        .eq('id', projectId);

      if (error) throw error;
      
      setProjects(prev => prev.map(p => 
        p.id === projectId ? { ...p, ...updates } : p
      ));
      
      if (currentProject?.id === projectId) {
        setCurrentProject(prev => prev ? { ...prev, ...updates } : null);
      }
      
      return true;
    } catch (error: any) {
      console.error('Error updating project:', error);
      toast({
        title: 'Error',
        description: 'Failed to update project',
        variant: 'destructive',
      });
      return false;
    }
  }, [currentProject]);

  // Delete a project
  const deleteProject = useCallback(async (projectId: string): Promise<boolean> => {
    try {
      const { error } = await (supabase as any)
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;
      
      setProjects(prev => prev.filter(p => p.id !== projectId));
      
      if (currentProject?.id === projectId) {
        setCurrentProject(null);
      }
      
      toast({
        title: 'Project Deleted',
        description: 'The project has been deleted.',
      });
      
      return true;
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete project',
        variant: 'destructive',
      });
      return false;
    }
  }, [currentProject]);

  // Select a project and load its messages
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
      console.error('Error loading project messages:', error);
      // Only show toast if it's not a "table doesn't exist" error
      if (!error.message?.includes('does not exist')) {
        toast({
          title: 'Error',
          description: 'Failed to load project messages',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Send a message in the current project
  const sendMessage = useCallback(async (content: string): Promise<void> => {
    if (!currentProject || !user || !content.trim()) return;

    setIsStreaming(true);
    
    try {
      // Add user message to local state immediately
      const userMessage: ProjectMessage = {
        id: Date.now().toString(),
        project_id: currentProject.id,
        user_id: user.id,
        role: 'user',
        content: content.trim(),
        tokens_used: 0,
        created_at: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Add placeholder assistant message
      const assistantMessage: ProjectMessage = {
        id: (Date.now() + 1).toString(),
        project_id: currentProject.id,
        user_id: user.id,
        role: 'assistant',
        content: '',
        tokens_used: 0,
        created_at: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // TODO: Call project-ai edge function when implemented
      // For now, simulate a response
      setTimeout(() => {
        setMessages(prev => prev.map(m => 
          m.id === assistantMessage.id 
            ? { ...m, content: 'Project AI functionality will be available soon. This is a placeholder response.' }
            : m
        ));
        setIsStreaming(false);
      }, 1000);
      
    } catch (error: any) {
      console.error('Error sending message:', error);
      setIsStreaming(false);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    }
  }, [currentProject, user]);

  // Load projects on mount
  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user, fetchProjects]);

  return {
    projects,
    currentProject,
    messages,
    isStreaming,
    isLoading,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    selectProject,
    sendMessage,
    setCurrentProject,
  };
};

export default useProjectAI;
