import React, { useState, useEffect } from 'react';
import { X, Github, Loader2, Check, Unlink, ExternalLink, GitBranch, Lock, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { useGitHubSync } from '@/hooks/useGitHubSync';

interface GitHubConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
}

const sanitizeRepoName = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9._-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'my-project';

const GitHubConnectModal: React.FC<GitHubConnectModalProps> = ({
  isOpen, onClose, projectId, projectName,
}) => {
  const github = useGitHubSync(projectId);
  const [step, setStep] = useState<'auth' | 'create' | 'pushing' | 'connected'>('auth');
  const [repoName, setRepoName] = useState(sanitizeRepoName(projectName));
  const [isPrivate, setIsPrivate] = useState(false);
  const [loadingClientId, setLoadingClientId] = useState(false);

  useEffect(() => {
    if (isOpen) {
      github.fetchConnection();
      setRepoName(sanitizeRepoName(projectName));
    }
  }, [isOpen, projectId, projectName]);

  useEffect(() => {
    if (github.connection) setStep('connected');
  }, [github.connection]);

  // Handle GitHub OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const isCallback = params.get('github_callback');
    if (code && isCallback) {
      window.history.replaceState({}, '', window.location.pathname);
      (async () => {
        const token = await github.exchangeCode(code);
        if (token) {
          setStep('create');
        }
      })();
    }
  }, []);

  const handleAuthorize = async () => {
    setLoadingClientId(true);
    const id = github.clientId || await github.fetchClientId();
    setLoadingClientId(false);
    if (id) {
      window.location.href = github.getOAuthUrl(id);
    }
  };

  const handleCreateAndPush = async () => {
    if (!github.accessToken || !repoName.trim()) return;
    setStep('pushing');
    const conn = await github.createRepo(repoName.trim(), isPrivate, github.accessToken);
    if (conn) {
      setStep('connected');
    } else {
      setStep('create');
    }
  };

  const handleDisconnect = async () => {
    if (confirm('Disconnect this repository?')) {
      await github.disconnectRepo();
      setStep('auth');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4" onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        className="bg-background w-full max-w-lg rounded-2xl border border-border overflow-hidden flex flex-col max-h-[80vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#24292f] dark:bg-white/10 flex items-center justify-center">
              <Github className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">GitHub Integration</h2>
              <p className="text-xs text-muted-foreground">{projectName}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-auto">
          {/* STEP: AUTH */}
          {step === 'auth' && (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted/50 border border-border flex items-center justify-center mb-5">
                <Github className="w-8 h-8 text-foreground" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Connect to GitHub</h3>
              <p className="text-sm text-muted-foreground max-w-sm mb-6">
                Authorize GitHub to auto-create a repository and push all your project files.
              </p>
              <Button
                onClick={handleAuthorize}
                disabled={loadingClientId}
                className="gap-2 bg-[#24292f] hover:bg-[#1b1f23] text-white"
              >
                {loadingClientId ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Github className="w-4 h-4" />
                )}
                Authorize with GitHub
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </div>
          )}

          {/* STEP: CREATE REPO */}
          {step === 'create' && (
            <div className="p-6 space-y-5">
              <div className="text-center mb-2">
                <h3 className="text-lg font-bold text-foreground mb-1">Create Repository</h3>
                <p className="text-sm text-muted-foreground">A new repo will be created and all project files pushed to it.</p>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Repository Name</label>
                <Input
                  value={repoName}
                  onChange={e => setRepoName(sanitizeRepoName(e.target.value))}
                  placeholder="my-project"
                  className="bg-muted/50"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border">
                <div className="flex items-center gap-2">
                  {isPrivate ? <Lock className="w-4 h-4 text-muted-foreground" /> : <Globe className="w-4 h-4 text-muted-foreground" />}
                  <span className="text-sm font-medium text-foreground">{isPrivate ? 'Private' : 'Public'}</span>
                </div>
                <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
              </div>

              <Button onClick={handleCreateAndPush} className="w-full gap-2" disabled={!repoName.trim()}>
                <Github className="w-4 h-4" />
                Create & Push
              </Button>
            </div>
          )}

          {/* STEP: PUSHING */}
          {step === 'pushing' && (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <Loader2 className="w-10 h-10 animate-spin text-primary mb-5" />
              <h3 className="text-lg font-bold text-foreground mb-2">Creating Repository...</h3>
              <p className="text-sm text-muted-foreground mb-4">Pushing all project files to GitHub. This may take a moment.</p>
              <Progress value={undefined} className="w-full max-w-xs h-2" />
            </div>
          )}

          {/* STEP: CONNECTED */}
          {step === 'connected' && github.connection && (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-5">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Connected!</h3>
              <a
                href={`https://github.com/${github.connection.repo_owner}/${github.connection.repo_name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-primary hover:underline mb-1 flex items-center gap-1"
              >
                {github.connection.repo_owner}/{github.connection.repo_name}
                <ExternalLink className="w-3 h-3" />
              </a>
              <p className="text-xs text-muted-foreground mb-6 flex items-center gap-1">
                <GitBranch className="w-3 h-3" /> {github.connection.branch}
              </p>
              <Button variant="outline" onClick={handleDisconnect} className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10">
                <Unlink className="w-4 h-4" />
                Disconnect
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GitHubConnectModal;
