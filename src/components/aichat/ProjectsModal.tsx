import React, { useState, useRef, useEffect, useCallback, lazy, Suspense, memo } from 'react';
import {
  X, Plus, ArrowLeft, FolderKanban, Send, Loader2, Trash2,
  Lock, Sparkles, Cpu, Brain, Zap, Clock, MessageSquare, Crown,
  PanelRightOpen, PanelRightClose, Github,
  Globe, Server, Smartphone, BarChart3, Workflow,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/stores/chatStore';
import { useProjectAI, type ProjectModel, type DbProject } from '@/hooks/useProjectAI';
import { useProjectFiles } from '@/hooks/useProjectFiles';
import { useGitHubSync } from '@/hooks/useGitHubSync';
import MarkdownRenderer from './MarkdownRenderer';
import UpgradePlanModal from './UpgradePlanModal';
import GitHubConnectModal from './GitHubConnectModal';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useIsMobile } from '@/hooks/use-mobile';

// Lazy load the heavy file explorer
const ProjectFileExplorer = lazy(() => import('./project/ProjectFileExplorer'));

type View = 'list' | 'create' | 'create-type' | 'chat';

const EMOJIS = ['🚀', '💡', '🎯', '⚡', '🔥', '🌟', '💎', '🎨', '🔧', '📱', '🌐', '🤖', '📊', '🎮', '🛠️', '📝'];
const COLORS = ['cyan', 'blue', 'purple', 'pink', 'orange', 'green', 'red', 'amber'];

const COLOR_MAP: Record<string, string> = {
  cyan: 'from-cyan-500 to-cyan-600',
  blue: 'from-blue-500 to-blue-600',
  purple: 'from-purple-500 to-purple-600',
  pink: 'from-pink-500 to-pink-600',
  orange: 'from-orange-500 to-orange-600',
  green: 'from-green-500 to-green-600',
  red: 'from-red-500 to-red-600',
  amber: 'from-amber-500 to-amber-600',
};

const COLOR_BG: Record<string, string> = {
  cyan: 'bg-cyan-500/10 border-cyan-500/20',
  blue: 'bg-blue-500/10 border-blue-500/20',
  purple: 'bg-purple-500/10 border-purple-500/20',
  pink: 'bg-pink-500/10 border-pink-500/20',
  orange: 'bg-orange-500/10 border-orange-500/20',
  green: 'bg-green-500/10 border-green-500/20',
  red: 'bg-red-500/10 border-red-500/20',
  amber: 'bg-amber-500/10 border-amber-500/20',
};

const MODEL_INFO: Record<ProjectModel, { name: string; desc: string; multiplier: number; icon: typeof Cpu }> = {
  'deepseek/deepseek-v3.2': { name: 'DeepSeek V3.2', desc: 'Best for small-medium projects', multiplier: 1, icon: Cpu },
  'anthropic/claude-sonnet-4.5': { name: 'Claude Sonnet 4.5', desc: 'Best for complex projects', multiplier: 6, icon: Brain },
};

// Project type cards for creation flow
const PROJECT_TYPES = [
  { id: 'webapp', label: 'Web App', desc: 'Build a website or web application', icon: Globe, color: 'from-blue-500 to-cyan-500', descPlaceholder: 'A modern web application that...' },
  { id: 'api', label: 'API / Backend', desc: 'Design APIs and server logic', icon: Server, color: 'from-purple-500 to-violet-500', descPlaceholder: 'A REST/GraphQL API service that...' },
  { id: 'mobile', label: 'Mobile App', desc: 'Plan and build mobile interfaces', icon: Smartphone, color: 'from-pink-500 to-rose-500', descPlaceholder: 'A mobile app for iOS/Android that...' },
  { id: 'data', label: 'Data Analysis', desc: 'Analyze data and build dashboards', icon: BarChart3, color: 'from-amber-500 to-orange-500', descPlaceholder: 'A data dashboard that visualizes...' },
  { id: 'automation', label: 'Automation', desc: 'Create workflows and scripts', icon: Workflow, color: 'from-green-500 to-emerald-500', descPlaceholder: 'An automation workflow that...' },
  { id: 'other', label: 'Other', desc: 'Start with a blank project', icon: Sparkles, color: 'from-slate-500 to-zinc-500', descPlaceholder: 'Describe what you want to build...' },
] as const;

// Memoized project card to prevent re-renders
const ProjectCard = memo(({ project, onOpen, onDelete }: {
  project: DbProject;
  onOpen: (p: DbProject) => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
}) => (
  <div
    onClick={() => onOpen(project)}
    className={cn(
      'group relative p-4 rounded-xl border cursor-pointer transition-all duration-200',
      'bg-card/50 backdrop-blur-sm hover:bg-card/80',
      'border-border/50 hover:border-primary/30',
      'hover:shadow-lg hover:shadow-primary/5'
    )}
  >
    <div className="flex items-start gap-3">
      <div className={cn(
        'w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br shrink-0',
        COLOR_MAP[project.color] || COLOR_MAP.cyan
      )}>
        {project.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="font-semibold text-foreground truncate">{project.name}</h3>
          <span className={cn(
            'text-[10px] font-medium px-1.5 py-0.5 rounded-md border',
            COLOR_BG[project.color] || COLOR_BG.cyan
          )}>
            {project.status}
          </span>
        </div>
        {project.description && (
          <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{project.description}</p>
        )}
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{project.chat_count} msgs</span>
          <span className="flex items-center gap-1"><Zap className="w-3 h-3" />{(project.tokens_used || 0).toLocaleString()} tokens</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(project.updated_at).toLocaleDateString()}</span>
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted/50 border border-border/50">
            {MODEL_INFO[project.model as ProjectModel]?.icon === Brain ? <Brain className="w-3 h-3" /> : <Cpu className="w-3 h-3" />}
            {MODEL_INFO[project.model as ProjectModel]?.name || 'DeepSeek V3.2'}
          </span>
        </div>
      </div>
      <button
        onClick={(e) => onDelete(e, project.id)}
        className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  </div>
));
ProjectCard.displayName = 'ProjectCard';

const ProjectsModal = () => {
  const { projectsModalOpen, setProjectsModalOpen, user } = useChatStore();
  const {
    projects, currentProject, messages, isStreaming, isLoading,
    plan, maxProjects, canCreateProject,
    createProject, deleteProject, selectProject, sendMessage, setCurrentProject, setMessages,
  } = useProjectAI();

  const projectFiles = useProjectFiles(currentProject?.id || null);
  const githubSync = useGitHubSync(currentProject?.id || null);
  const isMobile = useIsMobile();

  const [view, setView] = useState<View>('list');
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showFiles, setShowFiles] = useState(true);
  const [showGitHub, setShowGitHub] = useState(false);

  // Create form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedModel, setSelectedModel] = useState<ProjectModel>('deepseek/deepseek-v3.2');
  const [selectedIcon, setSelectedIcon] = useState('🚀');
  const [selectedColor, setSelectedColor] = useState('cyan');
  const [selectedType, setSelectedType] = useState('other');
  const [creating, setCreating] = useState(false);

  // Chat state
  const [chatInput, setChatInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (currentProject) {
      projectFiles.fetchFiles();
      githubSync.fetchConnection();
    }
  }, [currentProject?.id]);

  useEffect(() => {
    if (!projectsModalOpen) {
      setView('list');
      setCurrentProject(null);
      setMessages([]);
    }
  }, [projectsModalOpen]);

  const handleCreate = useCallback(async () => {
    if (!name.trim()) return;
    setCreating(true);
    const project = await createProject(name.trim(), description.trim(), selectedIcon, selectedColor, selectedModel, selectedType);
    setCreating(false);
    if (project) {
      setName(''); setDescription(''); setSelectedModel('deepseek/deepseek-v3.2');
      setSelectedIcon('🚀'); setSelectedColor('cyan'); setSelectedType('other');
      setView('list');
    }
  }, [name, description, selectedIcon, selectedColor, selectedModel, selectedType, createProject]);

  const handleOpenProject = useCallback(async (project: DbProject) => {
    await selectProject(project);
    setView('chat');
  }, [selectProject]);

  const handleSend = useCallback(() => {
    if (!chatInput.trim() || isStreaming) return;
    const fileContext = projectFiles.getFilesForAIContext();
    sendMessage(chatInput.trim(), fileContext);
    setChatInput('');
  }, [chatInput, isStreaming, projectFiles, sendMessage]);

  const handleDelete = useCallback(async (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    if (confirm('Delete this project and all its messages?')) {
      await deleteProject(projectId);
    }
  }, [deleteProject]);

  const handleSelectType = useCallback((typeId: string) => {
    setSelectedType(typeId);
    const typeInfo = PROJECT_TYPES.find(t => t.id === typeId);
    if (typeInfo) {
      setDescription('');
    }
    setView('create');
  }, []);

  if (!projectsModalOpen && !showUpgrade) return null;

  const isFreePlan = plan === 'free';

  return (
    <>
      {projectsModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setProjectsModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "bg-background w-full h-full sm:h-auto sm:max-h-[90vh] sm:rounded-2xl border-0 sm:border border-border overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-2 duration-200",
              view === 'chat' ? 'sm:max-w-6xl' : 'sm:max-w-3xl',
              "max-h-[100dvh]"
            )}
          >
            {/* ===== LIST VIEW ===== */}
            {view === 'list' && (
              <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
                <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                      <FolderKanban className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                        Sorix Codex
                        {!isFreePlan && (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                            {projects.length}/{maxProjects}
                          </span>
                        )}
                      </h2>
                      <p className="text-xs text-muted-foreground">AI-powered development workspace</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!isFreePlan && (
                      <Button
                        size="sm"
                        onClick={() => setView('create-type')}
                        disabled={!canCreateProject}
                        className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">New Codex Project</span>
                      </Button>
                    )}
                    <button onClick={() => setProjectsModalOpen(false)} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-muted transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <ScrollArea className="flex-1 min-h-0">
                  <div className="p-4 sm:p-5 space-y-3">
                    {isFreePlan ? (
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-20 h-20 rounded-2xl bg-muted/50 border border-border flex items-center justify-center mb-6">
                          <Lock className="w-9 h-9 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">Projects are for Paid Users</h3>
                        <p className="text-sm text-muted-foreground max-w-sm mb-6">
                          Upgrade to Basic, Pro, or Premium to create AI-powered development projects with DeepSeek V3.2 or Claude Sonnet 4.5.
                        </p>
                        <Button
                          onClick={() => { setProjectsModalOpen(false); setShowUpgrade(true); }}
                          className="gap-2 bg-gradient-to-r from-primary to-blue-600 text-primary-foreground hover:opacity-90"
                        >
                          <Crown className="w-4 h-4" />
                          Upgrade Plan
                        </Button>
                      </div>
                    ) : projects.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-20 h-20 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center mb-6">
                          <Sparkles className="w-9 h-9 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">Create Your First Project</h3>
                        <p className="text-sm text-muted-foreground max-w-sm mb-6">
                          Start building with AI assistance. Choose DeepSeek V3.2 for speed or Claude Sonnet 4.5 for complex tasks.
                        </p>
                        <Button onClick={() => setView('create-type')} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                          <Plus className="w-4 h-4" />
                          New Project
                        </Button>
                      </div>
                    ) : (
                      projects.map((project) => (
                        <ProjectCard key={project.id} project={project} onOpen={handleOpenProject} onDelete={handleDelete} />
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* ===== TYPE SELECTION VIEW ===== */}
            {view === 'create-type' && (
              <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
                <div className="flex items-center gap-3 p-4 sm:p-5 border-b border-border">
                  <button onClick={() => setView('list')} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-muted transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">What do you want to build?</h2>
                    <p className="text-xs text-muted-foreground">Select a project type to get started</p>
                  </div>
                </div>

                <ScrollArea className="flex-1 min-h-0">
                  <div className="p-4 sm:p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {PROJECT_TYPES.map((type) => {
                        const Icon = type.icon;
                        return (
                          <button
                            key={type.id}
                            onClick={() => handleSelectType(type.id)}
                            className={cn(
                              'group relative p-5 rounded-2xl border text-left transition-all duration-200',
                              'bg-card/30 backdrop-blur-sm hover:bg-card/60',
                              'border-border/50 hover:border-primary/40',
                              'hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-0.5'
                            )}
                          >
                            <div className={cn(
                              'w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br transition-transform group-hover:scale-110',
                              type.color
                            )}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-semibold text-foreground text-sm mb-1">{type.label}</h3>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">{type.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* ===== CREATE VIEW ===== */}
            {view === 'create' && (
              <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
                <div className="flex items-center gap-3 p-4 sm:p-5 border-b border-border">
                  <button onClick={() => setView('create-type')} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-muted transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Select Type</span>
                      <ChevronBreadcrumb />
                      <span className="text-xs font-medium text-foreground">Configure</span>
                    </div>
                    <h2 className="text-lg font-bold text-foreground">Configure Project</h2>
                  </div>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto">
                  <div className="p-4 sm:p-5 space-y-5">
                    {/* Name */}
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Project Name</label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="My Awesome Project"
                        className="bg-muted/50"
                        maxLength={50}
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Description</label>
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={PROJECT_TYPES.find(t => t.id === selectedType)?.descPlaceholder || 'What are you building?'}
                        className="bg-muted/50 min-h-[80px]"
                        maxLength={200}
                      />
                    </div>

                    {/* Model Selector */}
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Backend Model</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {(Object.entries(MODEL_INFO) as [ProjectModel, typeof MODEL_INFO[ProjectModel]][]).map(([id, info]) => {
                          const Icon = info.icon;
                          return (
                            <button
                              key={id}
                              onClick={() => setSelectedModel(id)}
                              className={cn(
                                'relative p-4 rounded-xl border-2 text-left transition-all duration-200',
                                selectedModel === id
                                  ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                                  : 'border-border hover:border-primary/30 bg-card/50'
                              )}
                            >
                              <div className="flex items-center gap-2.5 mb-2">
                                <div className={cn(
                                  'w-9 h-9 rounded-lg flex items-center justify-center',
                                  selectedModel === id ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
                                )}>
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                  <p className="font-semibold text-sm text-foreground">{info.name}</p>
                                  <p className="text-[10px] text-muted-foreground">{info.desc}</p>
                                </div>
                              </div>
                              <div className={cn(
                                'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold',
                                info.multiplier === 1
                                  ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20'
                                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                              )}>
                                <Zap className="w-3 h-3" />
                                {info.multiplier}x Token Cost
                              </div>
                              {selectedModel === id && (
                                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                  <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Icon Picker */}
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Icon</label>
                      <div className="flex flex-wrap gap-2">
                        {EMOJIS.map(emoji => (
                          <button
                            key={emoji}
                            onClick={() => setSelectedIcon(emoji)}
                            className={cn(
                              'w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all',
                              selectedIcon === emoji
                                ? 'bg-primary/10 border-2 border-primary scale-110'
                                : 'bg-muted/50 border border-border hover:bg-muted'
                            )}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Color Picker */}
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Color</label>
                      <div className="flex flex-wrap gap-2">
                        {COLORS.map(color => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={cn(
                              'w-9 h-9 rounded-xl bg-gradient-to-br transition-all',
                              COLOR_MAP[color],
                              selectedColor === color ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110' : 'opacity-70 hover:opacity-100'
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5 border-t border-border">
                  <Button
                    onClick={handleCreate}
                    disabled={!name.trim() || creating}
                    className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-11"
                  >
                    {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Create Project
                  </Button>
                </div>
              </div>
            )}

            {/* ===== CHAT VIEW ===== */}
            {view === 'chat' && currentProject && (
              <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
                <div className="flex items-center gap-3 p-4 border-b border-border">
                  <button onClick={() => { setView('list'); setCurrentProject(null); setMessages([]); }} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-muted transition-colors shrink-0">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-gradient-to-br shrink-0',
                    COLOR_MAP[currentProject.color] || COLOR_MAP.cyan
                  )}>
                    {currentProject.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-bold text-foreground text-sm truncate">{currentProject.name}</h2>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground border border-border flex items-center gap-1">
                        {MODEL_INFO[currentProject.model as ProjectModel]?.icon === Brain ? <Brain className="w-3 h-3" /> : <Cpu className="w-3 h-3" />}
                        {MODEL_INFO[currentProject.model as ProjectModel]?.name || 'DeepSeek V3.2'}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {MODEL_INFO[currentProject.model as ProjectModel]?.multiplier || 1}x
                      </span>
                      {githubSync.connection && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 flex items-center gap-1">
                          <Github className="w-3 h-3" /> Synced
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {/* GitHub button */}
                    <button
                      onClick={() => setShowGitHub(true)}
                      className={cn(
                        'w-9 h-9 rounded-xl flex items-center justify-center transition-colors',
                        githubSync.connection ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'hover:bg-muted text-muted-foreground'
                      )}
                      title="GitHub"
                    >
                      <Github className="w-5 h-5" />
                    </button>
                    {/* File panel toggle */}
                    {!isMobile && (
                      <button
                        onClick={() => setShowFiles(!showFiles)}
                        className={cn(
                          'w-9 h-9 rounded-xl flex items-center justify-center transition-colors',
                          showFiles ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'
                        )}
                        title={showFiles ? 'Hide files' : 'Show files'}
                      >
                        {showFiles ? <PanelRightClose className="w-5 h-5" /> : <PanelRightOpen className="w-5 h-5" />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Split Layout: Chat + Files */}
                <div className="flex-1 flex min-h-0 overflow-hidden">
                  {/* Chat Panel */}
                  <div className="flex-1 flex flex-col min-w-0">
                    <ScrollArea className="flex-1 min-h-0">
                      <div className="p-4 space-y-4">
                        {isLoading ? (
                          <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                          </div>
                        ) : messages.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className={cn(
                              'w-16 h-16 rounded-2xl flex items-center justify-center text-2xl bg-gradient-to-br mb-4',
                              COLOR_MAP[currentProject.color] || COLOR_MAP.cyan
                            )}>
                              {currentProject.icon}
                            </div>
                            <h3 className="font-bold text-foreground mb-1">{currentProject.name}</h3>
                            <p className="text-sm text-muted-foreground max-w-sm">
                              Start a conversation about your project. Ask for code, architecture advice, or task planning.
                            </p>
                            {projectFiles.files.length > 0 && (
                              <p className="text-xs text-primary mt-2">
                                📁 {projectFiles.files.filter(f => !f.is_folder).length} files available as AI context
                              </p>
                            )}
                          </div>
                        ) : (
                          messages.map((msg) => (
                            <div key={msg.id} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                              <div className={cn(
                                'max-w-[85%] rounded-2xl px-4 py-3',
                                msg.role === 'user'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted/50 border border-border/50'
                              )}>
                                {msg.role === 'assistant' ? (
                                  <MarkdownRenderer content={msg.content || (isStreaming ? '' : '...')} />
                                ) : (
                                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                )}
                                {msg.role === 'assistant' && isStreaming && msg === messages[messages.length - 1] && !msg.content && (
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    Thinking...
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>

                    {/* Chat Input */}
                    <div className="p-4 border-t border-border">
                      <div className="flex items-end gap-2">
                        <Textarea
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSend();
                            }
                          }}
                          placeholder="Ask about your project..."
                          className="min-h-[44px] max-h-[120px] bg-muted/50 resize-none"
                          rows={1}
                        />
                        <Button
                          onClick={handleSend}
                          disabled={!chatInput.trim() || isStreaming}
                          size="icon"
                          className="h-11 w-11 shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* File Explorer Panel - Desktop only, lazy loaded */}
                  {!isMobile && showFiles && (
                    <Suspense fallback={<div className="w-52 border-l border-border flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>}>
                      <ProjectFileExplorer
                        files={projectFiles.files}
                        activeFile={projectFiles.activeFile}
                        activeFileId={projectFiles.activeFileId}
                        isSaving={projectFiles.isSaving}
                        isLoading={projectFiles.isLoading}
                        onSelectFile={projectFiles.setActiveFileId}
                        onCreateFile={projectFiles.createFile}
                        onUpdateContent={projectFiles.updateFileContent}
                        onRenameFile={projectFiles.renameFile}
                        onDeleteFile={projectFiles.deleteFile}
                        getFilesInPath={projectFiles.getFilesInPath}
                      />
                    </Suspense>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <UpgradePlanModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} />

      {showGitHub && currentProject && (
        <GitHubConnectModal
          isOpen={showGitHub}
          onClose={() => setShowGitHub(false)}
          projectId={currentProject.id}
          projectName={currentProject.name}
        />
      )}
    </>
  );
};

// Simple breadcrumb chevron
const ChevronBreadcrumb = () => (
  <svg className="w-3 h-3 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

export default ProjectsModal;
