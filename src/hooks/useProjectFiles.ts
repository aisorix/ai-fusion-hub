import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface ProjectFile {
  id: string;
  project_id: string;
  user_id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  is_folder: boolean;
  created_at: string;
  updated_at: string;
}

// Map file extensions to language identifiers
const EXT_TO_LANG: Record<string, string> = {
  js: 'javascript', jsx: 'jsx', ts: 'typescript', tsx: 'tsx',
  py: 'python', rb: 'ruby', go: 'go', rs: 'rust', java: 'java',
  c: 'c', cpp: 'cpp', cs: 'csharp', php: 'php', swift: 'swift',
  kt: 'kotlin', dart: 'dart', sql: 'sql', sh: 'bash', bash: 'bash',
  html: 'html', css: 'css', scss: 'scss', less: 'less',
  json: 'json', yaml: 'yaml', yml: 'yaml', xml: 'xml',
  md: 'markdown', txt: 'plaintext', env: 'plaintext',
  toml: 'toml', ini: 'ini', cfg: 'ini', dockerfile: 'dockerfile',
};

export const detectLanguage = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  return EXT_TO_LANG[ext] || 'plaintext';
};

export const useProjectFiles = (projectId: string | null) => {
  const { user } = useAuth();
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const activeFile = files.find(f => f.id === activeFileId) || null;

  const fetchFiles = useCallback(async () => {
    if (!projectId || !user) return;
    setIsLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('project_files')
        .select('*')
        .eq('project_id', projectId)
        .order('is_folder', { ascending: false })
        .order('name', { ascending: true });
      if (error) throw error;
      setFiles((data || []) as ProjectFile[]);
    } catch (error: any) {
      if (!error.message?.includes('does not exist')) {
        console.error('Error fetching files:', error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [projectId, user]);

  const createFile = useCallback(async (
    name: string,
    path: string = '/',
    isFolder: boolean = false,
    content: string = ''
  ): Promise<ProjectFile | null> => {
    if (!projectId || !user) return null;
    try {
      const language = isFolder ? 'folder' : detectLanguage(name);
      const { data, error } = await (supabase as any)
        .from('project_files')
        .insert({
          project_id: projectId,
          user_id: user.id,
          name,
          path,
          content: isFolder ? '' : content,
          language,
          is_folder: isFolder,
        })
        .select()
        .single();
      if (error) throw error;
      const newFile = data as ProjectFile;
      setFiles(prev => [...prev, newFile]);
      if (!isFolder) setActiveFileId(newFile.id);
      return newFile;
    } catch (error: any) {
      console.error('Error creating file:', error);
      toast({ title: 'Error', description: `Failed to create ${isFolder ? 'folder' : 'file'}`, variant: 'destructive' });
      return null;
    }
  }, [projectId, user]);

  const updateFileContent = useCallback(async (fileId: string, content: string): Promise<boolean> => {
    setIsSaving(true);
    try {
      const { error } = await (supabase as any)
        .from('project_files')
        .update({ content })
        .eq('id', fileId);
      if (error) throw error;
      setFiles(prev => prev.map(f => f.id === fileId ? { ...f, content } : f));
      return true;
    } catch (error: any) {
      console.error('Error saving file:', error);
      toast({ title: 'Error', description: 'Failed to save file', variant: 'destructive' });
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const renameFile = useCallback(async (fileId: string, newName: string): Promise<boolean> => {
    try {
      const file = files.find(f => f.id === fileId);
      const updates: any = { name: newName };
      if (file && !file.is_folder) {
        updates.language = detectLanguage(newName);
      }
      const { error } = await (supabase as any)
        .from('project_files')
        .update(updates)
        .eq('id', fileId);
      if (error) throw error;
      setFiles(prev => prev.map(f => f.id === fileId ? { ...f, ...updates } : f));
      return true;
    } catch (error: any) {
      console.error('Error renaming:', error);
      toast({ title: 'Error', description: 'Failed to rename', variant: 'destructive' });
      return false;
    }
  }, [files]);

  const deleteFile = useCallback(async (fileId: string): Promise<boolean> => {
    try {
      const file = files.find(f => f.id === fileId);
      if (!file) return false;

      // If it's a folder, delete all children too
      if (file.is_folder) {
        const folderPath = file.path === '/' ? `/${file.name}` : `${file.path}/${file.name}`;
        // Delete children whose path starts with this folder
        const children = files.filter(f => f.path.startsWith(folderPath));
        for (const child of children) {
          await (supabase as any).from('project_files').delete().eq('id', child.id);
        }
      }

      const { error } = await (supabase as any).from('project_files').delete().eq('id', fileId);
      if (error) throw error;

      setFiles(prev => {
        if (file.is_folder) {
          const folderPath = file.path === '/' ? `/${file.name}` : `${file.path}/${file.name}`;
          return prev.filter(f => f.id !== fileId && !f.path.startsWith(folderPath));
        }
        return prev.filter(f => f.id !== fileId);
      });

      if (activeFileId === fileId) setActiveFileId(null);
      return true;
    } catch (error: any) {
      console.error('Error deleting:', error);
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
      return false;
    }
  }, [files, activeFileId]);

  const moveFile = useCallback(async (fileId: string, newPath: string): Promise<boolean> => {
    try {
      const { error } = await (supabase as any)
        .from('project_files')
        .update({ path: newPath })
        .eq('id', fileId);
      if (error) throw error;
      setFiles(prev => prev.map(f => f.id === fileId ? { ...f, path: newPath } : f));
      return true;
    } catch (error: any) {
      console.error('Error moving:', error);
      return false;
    }
  }, []);

  // Build a tree structure from flat files
  const getFilesInPath = useCallback((path: string): ProjectFile[] => {
    return files.filter(f => f.path === path);
  }, [files]);

  // Get all file contents for AI context (non-folders, limited size)
  const getFilesForAIContext = useCallback((): { name: string; path: string; content: string; language: string }[] => {
    return files
      .filter(f => !f.is_folder && f.content.length > 0 && f.content.length < 50000)
      .map(f => ({
        name: f.name,
        path: f.path === '/' ? `/${f.name}` : `${f.path}/${f.name}`,
        content: f.content,
        language: f.language,
      }));
  }, [files]);

  return {
    files,
    activeFile,
    activeFileId,
    isLoading,
    isSaving,
    setActiveFileId,
    fetchFiles,
    createFile,
    updateFileContent,
    renameFile,
    deleteFile,
    moveFile,
    getFilesInPath,
    getFilesForAIContext,
  };
};
