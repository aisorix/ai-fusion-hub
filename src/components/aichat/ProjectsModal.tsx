import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Plus, ArrowLeft, FolderKanban, Send, Loader2, Trash2,
  Lock, Sparkles, Cpu, Brain, Zap, Clock, MessageSquare, Crown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/stores/chatStore';
import { useProjectAI, type ProjectModel, type DbProject } from '@/hooks/useProjectAI';
import MarkdownRenderer from './MarkdownRenderer';
import UpgradePlanModal from './UpgradePlanModal';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type View = 'list' | 'create' | 'chat';

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

const ProjectsModal = () => {
  const { projectsModalOpen, setProjectsModalOpen, user } = useChatStore();
  const {
    projects, currentProject, messages, isStreaming, isLoading,
    plan, maxProjects, canCreateProject,
    createProject, deleteProject, selectProject, sendMessage, setCurrentProject, setMessages,
  } = useProjectAI();

  const [view, setView] = useState<View>('list');
  const [showUpgrade, setShowUpgrade] = useState(false);

  // Create form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedModel, setSelectedModel] = useState<ProjectModel>('deepseek/deepseek-v3.2');
  const [selectedIcon, setSelectedIcon] = useState('🚀');
  const [selectedColor, setSelectedColor] = useState('cyan');
  const [creating, setCreating] = useState(false);

  // Chat state
  const [chatInput, setChatInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Reset on close
  useEffect(() => {
    if (!projectsModalOpen) {
      setView('list');
      setCurrentProject(null);
      setMessages([]);
    }
  }, [projectsModalOpen]);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setCreating(true);
    const project = await createProject(name.trim(), description.trim(), selectedIcon, selectedColor, selectedModel);
    setCreating(false);
    if (project) {
      setName(''); setDescription(''); setSelectedModel('deepseek/deepseek-v3.2');
      setSelectedIcon('🚀'); setSelectedColor('cyan');
      setView('list');
    }
  };

  const handleOpenProject = async (project: DbProject) => {
    await selectProject(project);
    setView('chat');
  };

  const handleSend = () => {
    if (!chatInput.trim() || isStreaming) return;
    sendMessage(chatInput.trim());
    setChatInput('');
  };

  const handleDelete = async (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    if (confirm('Delete this project and all its messages?')) {
      await deleteProject(projectId);
    }
  };

  if (!projectsModalOpen && !showUpgrade) return null;

  const isFreePlan = plan === 'free';

  return (
    <>
      <AnimatePresence>
        {projectsModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-0 sm:p-4"
            onClick={() => setProjectsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-3xl sm:rounded-2xl border-0 sm:border border-border overflow-hidden flex flex-col"
            >
              {/* ===== LIST VIEW ===== */}
              {view === 'list' && (
                <>
                  <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                        <FolderKanban className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                          Projects
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
                          onClick={() => setView('create')}
                          disabled={!canCreateProject}
                          className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          <Plus className="w-4 h-4" />
                          <span className="hidden sm:inline">New Project</span>
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
                        /* Locked state for free users */
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex flex-col items-center justify-center py-16 text-center"
                        >
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
                        </motion.div>
                      ) : projects.length === 0 ? (
                        /* Empty state */
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex flex-col items-center justify-center py-16 text-center"
                        >
                          <div className="w-20 h-20 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center mb-6">
                            <Sparkles className="w-9 h-9 text-primary" />
                          </div>
                          <h3 className="text-xl font-bold text-foreground mb-2">Create Your First Project</h3>
                          <p className="text-sm text-muted-foreground max-w-sm mb-6">
                            Start building with AI assistance. Choose DeepSeek V3.2 for speed or Claude Sonnet 4.5 for complex tasks.
                          </p>
                          <Button onClick={() => setView('create')} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                            <Plus className="w-4 h-4" />
                            New Project
                          </Button>
                        </motion.div>
                      ) : (
                        /* Project cards */
                        projects.map((project, i) => (
                          <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => handleOpenProject(project)}
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
                                  <span className="flex items-center gap-1">
                                    <MessageSquare className="w-3 h-3" />
                                    {project.chat_count} msgs
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Zap className="w-3 h-3" />
                                    {(project.tokens_used || 0).toLocaleString()} tokens
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(project.updated_at).toLocaleDateString()}
                                  </span>
                                  <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted/50 border border-border/50">
                                    {MODEL_INFO[project.model as ProjectModel]?.icon === Brain ? <Brain className="w-3 h-3" /> : <Cpu className="w-3 h-3" />}
                                    {MODEL_INFO[project.model as ProjectModel]?.name || 'DeepSeek V3.2'}
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={(e) => handleDelete(e, project.id)}
                                className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </>
              )}

              {/* ===== CREATE VIEW ===== */}
              {view === 'create' && (
                <>
                  <div className="flex items-center gap-3 p-4 sm:p-5 border-b border-border">
                    <button onClick={() => setView('list')} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-muted transition-colors">
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-lg font-bold text-foreground">Create Project</h2>
                  </div>

                  <ScrollArea className="flex-1 min-h-0">
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
                          placeholder="What are you building?"
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
                  </ScrollArea>

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
                </>
              )}

              {/* ===== CHAT VIEW ===== */}
              {view === 'chat' && currentProject && (
                <>
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
                      </div>
                    </div>
                  </div>

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
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <UpgradePlanModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </>
  );
};

export default ProjectsModal;
