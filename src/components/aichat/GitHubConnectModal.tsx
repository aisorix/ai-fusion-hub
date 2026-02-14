import React, { useState, useEffect } from 'react';
import { X, Github, Loader2, Check, Unlink, ExternalLink, GitBranch, Lock, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGitHubSync, type GitHubRepo } from '@/hooks/useGitHubSync';

interface GitHubConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
}

const GitHubConnectModal: React.FC<GitHubConnectModalProps> = ({
  isOpen, onClose, projectId, projectName,
}) => {
  const github = useGitHubSync(projectId);
  const [search, setSearch] = useState('');
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const [branch, setBranch] = useState('main');
  const [connecting, setConnecting] = useState(false);
  const [step, setStep] = useState<'auth' | 'select' | 'connected'>('auth');

  useEffect(() => {
    if (isOpen) {
      github.fetchConnection();
    }
  }, [isOpen, projectId]);

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
          await github.fetchRepos(token);
          setStep('select');
        }
      })();
    }
  }, []);

  const handleConnect = async () => {
    if (!selectedRepo || !github.accessToken) return;
    setConnecting(true);
    const ok = await github.connectRepo(selectedRepo.owner, selectedRepo.name, branch, github.accessToken);
    setConnecting(false);
    if (ok) setStep('connected');
  };

  const handleDisconnect = async () => {
    if (confirm('Disconnect this repository?')) {
      await github.disconnectRepo();
      setStep('auth');
    }
  };

  const filteredRepos = github.repos.filter(r =>
    r.full_name.toLowerCase().includes(search.toLowerCase())
  );

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
                Sync your project files automatically. Every file change will be pushed to your repository.
              </p>
              <Button
                onClick={() => window.location.href = github.getOAuthUrl()}
                className="gap-2 bg-[#24292f] hover:bg-[#1b1f23] text-white"
              >
                <Github className="w-4 h-4" />
                Authorize with GitHub
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </div>
          )}

          {/* STEP: SELECT REPO */}
          {step === 'select' && (
            <div className="p-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Select Repository</label>
                <Input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search repositories..."
                  className="bg-muted/50"
                />
              </div>

              <ScrollArea className="h-[240px]">
                <div className="space-y-1.5">
                  {github.isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : filteredRepos.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No repositories found</p>
                  ) : (
                    filteredRepos.map(repo => (
                      <button
                        key={repo.id}
                        onClick={() => { setSelectedRepo(repo); setBranch(repo.default_branch); }}
                        className={cn(
                          'w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all',
                          selectedRepo?.id === repo.id
                            ? 'bg-primary/10 border border-primary/30'
                            : 'hover:bg-muted/50 border border-transparent'
                        )}
                      >
                        {repo.private ? <Lock className="w-4 h-4 text-muted-foreground shrink-0" /> : <Globe className="w-4 h-4 text-muted-foreground shrink-0" />}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground truncate">{repo.full_name}</p>
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <GitBranch className="w-3 h-3" /> {repo.default_branch}
                          </p>
                        </div>
                        {selectedRepo?.id === repo.id && <Check className="w-4 h-4 text-primary shrink-0" />}
                      </button>
                    ))
                  )}
                </div>
              </ScrollArea>

              {selectedRepo && (
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Branch</label>
                  <Input value={branch} onChange={e => setBranch(e.target.value)} className="bg-muted/50" />
                </div>
              )}
            </div>
          )}

          {/* STEP: CONNECTED */}
          {step === 'connected' && github.connection && (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-5">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Connected!</h3>
              <p className="text-sm text-muted-foreground mb-1">
                <span className="font-semibold text-foreground">{github.connection.repo_owner}/{github.connection.repo_name}</span>
              </p>
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

        {/* Footer */}
        {step === 'select' && (
          <div className="p-4 border-t border-border">
            <Button
              onClick={handleConnect}
              disabled={!selectedRepo || connecting}
              className="w-full gap-2"
            >
              {connecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Github className="w-4 h-4" />}
              Connect Repository
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GitHubConnectModal;
