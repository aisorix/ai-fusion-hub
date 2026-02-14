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

// Public endpoint (no auth needed for get_client_id)
const callGitHubSyncPublic = async (action: string) => {
  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/github-sync`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
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
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);

  const fetchClientId = useCallback(async () => {
    try {
      const data = await callGitHubSyncPublic('get_client_id');
      setClientId(data.client_id);
      return data.client_id;
    } catch (err: any) {
      toast({ title: 'Error', description: 'Failed to fetch GitHub config', variant: 'destructive' });
      return null;
    }
  }, []);

  const getOAuthUrl = useCallback((fetchedClientId: string) => {
    const redirectUri = `${window.location.origin}/chat?github_callback=true`;
    return `https://github.com/login/oauth/authorize?client_id=${fetchedClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo`;
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

  const createRepo = useCallback(async (
    repoName: string, isPrivate: boolean, token: string
  ): Promise<GitHubConnection | null> => {
    if (!projectId) return null;
    setIsLoading(true);
    try {
      const data = await callGitHubSync('create_repo', {
        projectId, repoName, isPrivate, accessToken: token,
      });
      setConnection(data);
      toast({ title: 'Repository Created!', description: `Pushed to ${data.repo_owner}/${data.repo_name}` });
      return data;
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
      return null;
    } finally {
      setIsLoading(false);
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
    }
  }, [projectId, connection]);

  return {
    connection,
    isLoading,
    accessToken,
    clientId,
    fetchClientId,
    getOAuthUrl,
    exchangeCode,
    createRepo,
    disconnectRepo,
    fetchConnection,
    syncFile,
  };
};
