import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface GitHubConnection {
  id: string;
  project_id: string;
  repo_owner: string;
  repo_name: string;
  branch: string;
  connected_at: string;
}

export interface GitHubRepo {
  id: number;
  full_name: string;
  name: string;
  owner: string;
  default_branch: string;
  private: boolean;
}

const GITHUB_CLIENT_ID = 'Ov23liXXXXXXXXXX'; // Will be replaced by edge function

const callGitHubSync = async (action: string, params: Record<string, any>) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error('No session');

  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/github-sync`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, ...params }),
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Error ${res.status}`);
  }
  return res.json();
};

export const useGitHubSync = (projectId: string | null) => {
  const [connection, setConnection] = useState<GitHubConnection | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const getOAuthUrl = useCallback(() => {
    // The client ID is obtained via the edge function; we use a redirect flow
    const redirectUri = `${window.location.origin}/chat?github_callback=true`;
    return `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo`;
  }, []);

  const exchangeCode = useCallback(async (code: string): Promise<string | null> => {
    try {
      const data = await callGitHubSync('exchange_code', { code });
      setAccessToken(data.access_token);
      return data.access_token;
    } catch (err: any) {
      toast({ title: 'GitHub Auth Failed', description: err.message, variant: 'destructive' });
      return null;
    }
  }, []);

  const fetchRepos = useCallback(async (token: string) => {
    setIsLoading(true);
    try {
      const data = await callGitHubSync('list_repos', { accessToken: token });
      setRepos(data);
    } catch (err: any) {
      toast({ title: 'Error', description: 'Failed to fetch repos', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const connectRepo = useCallback(async (
    repoOwner: string, repoName: string, branch: string, token: string
  ): Promise<boolean> => {
    if (!projectId) return false;
    try {
      const data = await callGitHubSync('connect_repo', {
        projectId, repoOwner, repoName, branch, accessToken: token,
      });
      setConnection(data);
      toast({ title: 'Connected!', description: `Linked to ${repoOwner}/${repoName}` });
      return true;
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
      return false;
    }
  }, [projectId]);

  const disconnectRepo = useCallback(async (): Promise<boolean> => {
    if (!projectId) return false;
    try {
      await callGitHubSync('disconnect_repo', { projectId });
      setConnection(null);
      toast({ title: 'Disconnected', description: 'GitHub connection removed' });
      return true;
    } catch {
      return false;
    }
  }, [projectId]);

  const fetchConnection = useCallback(async () => {
    if (!projectId) return;
    try {
      const data = await callGitHubSync('get_connection', { projectId });
      setConnection(data);
    } catch {
      setConnection(null);
    }
  }, [projectId]);

  const syncFile = useCallback(async (
    filePath: string, content: string, operation: 'create' | 'update' | 'delete'
  ) => {
    if (!projectId || !connection) return;
    try {
      await callGitHubSync('sync_file', { projectId, filePath, content, operation });
    } catch (err: any) {
      console.error('GitHub sync failed:', err);
      // Silent fail - don't block the user, just log
    }
  }, [projectId, connection]);

  return {
    connection,
    repos,
    isLoading,
    accessToken,
    getOAuthUrl,
    exchangeCode,
    fetchRepos,
    connectRepo,
    disconnectRepo,
    fetchConnection,
    syncFile,
  };
};
