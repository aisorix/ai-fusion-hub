import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  LayoutGrid,
  Sparkles,
  FolderKanban,
  Workflow,
  Grid3X3,
  Moon,
  Sun,
  ChevronDown,
  ChevronRight,
  LogOut,
  Settings,
  HelpCircle,
  Crown,
  MessageSquare,
  Leaf,
  Heart,
  Stethoscope,
  BookOpen,
  Palette,
  Presentation,
  PanelLeftClose,
  PanelLeft,
  Home,
  Check,
  X,
  Bot,
  Clapperboard,
  Star,
} from "lucide-react";
import { useChatStore } from "@/stores/chatStore";
import { useTranslation } from "@/lib/translations";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import sorixLogo from "@/assets/logo.png";
import { useUserProfile } from "@/hooks/useUserProfile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import ChatHistoryActions from "./ChatHistoryActions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SettingsModal from "./SettingsModal";
import type { TabId } from "./SettingsModal";
import UpgradePlanModal from "./UpgradePlanModal";
import { PlanIcon, PlanBadge, type PlanType } from "./PlanIcons";

interface ChatSidebarProps {
  onNewChat: () => void;
}

// Chat item with context menu
const ChatItem = ({
  chat,
  isActive,
  onSelect,
  onDelete,
  onRename,
  onToggleStar,
}: {
  chat: { id: string; title: string; isStarred?: boolean };
  isActive: boolean;
  onSelect: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onToggleStar: (id: string) => void;
}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(chat.title);

  const handleRenameSubmit = () => {
    if (renameValue.trim()) {
      onRename(chat.id, renameValue.trim());
    }
    setIsRenaming(false);
  };

  if (isRenaming) {
    return (
      <div className="flex items-center gap-1 px-2 py-1">
        <input
          autoFocus
          value={renameValue}
          onChange={(e) => setRenameValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleRenameSubmit();
            if (e.key === "Escape") setIsRenaming(false);
          }}
          className="flex-1 text-sm px-2 py-1 rounded-md bg-muted border border-border focus:outline-none focus:ring-1 focus:ring-primary/50"
        />
        <button onClick={handleRenameSubmit} className="p-1 hover:bg-muted rounded text-green-500">
          <Check className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => setIsRenaming(false)} className="p-1 hover:bg-muted rounded text-muted-foreground">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors group relative",
        isActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted",
      )}
    >
      <button onClick={onSelect} className="flex items-center gap-2 flex-1 min-w-0 text-left">
        <MessageSquare className="w-4 h-4 shrink-0" />
        <span className="truncate">{chat.title}</span>
      </button>

      <ChatHistoryActions
        chatId={chat.id}
        isStarred={chat.isStarred}
        onDelete={onDelete}
        onRenameRequest={() => {
          setRenameValue(chat.title);
          setIsRenaming(true);
        }}
        onToggleStar={onToggleStar}
      />
    </div>
  );
};

const ChatSidebar = ({ onNewChat }: ChatSidebarProps) => {
  const navigate = useNavigate();
  const { signOut, user: authUser } = useAuth();
  const {
    theme,
    toggleTheme,
    sidebarCollapsed,
    toggleSidebarCollapse,
    chats,
    activeChatId,
    setActiveChat,
    deleteChat,
    updateChatTitle,
    toggleStarChat,
    viewMode,
    setViewMode,
    user,
    setProjectsModalOpen,
    historyCollapsed,
    language,
  } = useChatStore();
  const { t } = useTranslation(language as 'en' | 'bn');
  const { avatarUrl, fullName } = useUserProfile();

  const [showMoreTools, setShowMoreTools] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [settingsInitialTab, setSettingsInitialTab] = useState<TabId | undefined>(undefined);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const filteredChats = useMemo(
    () => chats.filter((chat) => chat.title.toLowerCase().includes(searchQuery.toLowerCase())),
    [chats, searchQuery]
  );

  const { todayChats, thisWeekChats, olderChats } = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const unstarredChats = filteredChats.filter((c) => !c.isStarred);

    return {
      todayChats: unstarredChats.filter((c) => new Date(c.createdAt) >= now),
      thisWeekChats: unstarredChats.filter((c) => {
        const d = new Date(c.createdAt);
        return d < now && d >= weekAgo;
      }),
      olderChats: unstarredChats.filter((c) => new Date(c.createdAt) < weekAgo),
    };
  }, [filteredChats]);

  const moreTools = [
    {
      id: "agro",
      name: "Sorix Agro",
      description: "AI-powered agricultural assistant",
      icon: Leaf,
      gradient: "bg-gradient-to-br from-green-500 to-lime-500",
      free: true,
    },
    {
      id: "health",
      name: "Sorix Health",
      description: "Your personal health companion",
      icon: Stethoscope,
      gradient: "bg-gradient-to-br from-emerald-500 to-teal-500",
      free: true,
    },
    {
      id: "deck",
      name: "Sorix Deck",
      description: "AI presentation builder",
      icon: Presentation,
      gradient: "bg-gradient-to-br from-cyan-500 to-blue-600",
      free: false,
    },
    {
      id: "imagine",
      name: "Sorix Imagine",
      description: "AI-powered image generation",
      icon: Palette,
      gradient: "bg-gradient-to-br from-cyan-500 to-blue-500",
      free: false,
    },
    {
      id: "legends",
      name: "Sorix Legends",
      description: "Chat with historical legends",
      icon: Crown,
      gradient: "bg-gradient-to-br from-blue-500 to-cyan-500",
      free: false,
    },
    {
      id: "flowbuilder",
      name: "Sorix FlowBuilder",
      description: "AI diagram & flowchart generator",
      icon: Workflow,
      gradient: "bg-gradient-to-br from-violet-500 to-purple-600",
      free: false,
    },
  ];

  const userInitials = authUser?.email
    ? authUser.email.charAt(0).toUpperCase()
    : user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

  const userName = fullName || authUser?.user_metadata?.full_name || user.name;
  const userEmail = authUser?.email || user.email;
  const isPaidUser = user.plan !== "free";

  const starredChats = useMemo(
    () => filteredChats.filter((c) => c.isStarred),
    [filteredChats]
  );

  const renderChatList = (chatList: typeof chats) =>
    chatList.map((chat) => (
      <ChatItem
        key={chat.id}
        chat={chat}
        isActive={activeChatId === chat.id}
        onSelect={() => setActiveChat(chat.id)}
        onDelete={deleteChat}
        onRename={updateChatTitle}
        onToggleStar={toggleStarChat}
      />
    ));

  // Collapsed sidebar view
  if (sidebarCollapsed) {
    return (
      <>
        <div className="w-14 h-full bg-card border-r border-border flex flex-col items-center py-4">
          {/* Top icons */}
          <div className="flex flex-col items-center gap-1.5">
            <button
              onClick={toggleSidebarCollapse}
              className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground"
            >
              <PanelLeft className="w-5 h-5" />
            </button>
            <button
              onClick={onNewChat}
              className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground">
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode(viewMode === "single" ? "multi" : "single")}
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                viewMode === "multi" ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground",
              )}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
          </div>

          {/* More Tools */}
          <button
            onClick={() => navigate("/tools")}
            className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground"
          >
            <Grid3X3 className="w-5 h-5" />
          </button>
          {/* Spacer */}
          <div className="flex-1" />

          {/* Bottom icons */}
          <div className="flex flex-col items-center gap-1.5">
            {/* User avatar with dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm hover:bg-primary/20 transition-colors">
                  {avatarUrl ? <img src={avatarUrl} alt="" className="w-full h-full object-cover" /> : userInitials}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                side="right"
                className="w-56 bg-popover border border-border shadow-lg z-50"
              >
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-foreground truncate">{userName}</p>
                  <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowUpgradeModal(true)}>
                  <Crown className="w-4 h-4 mr-2 text-primary" />
                  {t('upgradePlan')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowSettings(true)}>
                  <Settings className="w-4 h-4 mr-2" />
                  {t('settings')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSettingsInitialTab("help");
                    setShowSettings(true);
                  }}
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  {t('helpAndSupport')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  {t('logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Home */}
            <Link
              to="/"
              className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground"
            >
              <Home className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <SettingsModal
          isOpen={showSettings}
          onClose={() => {
            setShowSettings(false);
            setSettingsInitialTab(undefined);
          }}
          initialTab={settingsInitialTab}
        />
        <UpgradePlanModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
      </>
    );
  }

  return (
    <>
      <div
        className={cn(
          "w-64 h-full bg-card border-r flex flex-col overflow-hidden",
          isPaidUser ? "border-primary/20 bg-gradient-to-b from-card via-card to-primary/5" : "border-border",
        )}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={sorixLogo} alt="AI Sorix" className="w-8 h-8" />
            <div>
              <h1 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                AI Sorix
                {isPaidUser && <PlanBadge plan={user.plan as PlanType} />}
              </h1>
              <p className="text-[10px] text-muted-foreground">{t('premiumAIPlatform')}</p>
            </div>
          </div>
          <button
            onClick={toggleSidebarCollapse}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* New Chat */}
        <div className="px-3">
          <Button onClick={onNewChat} className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4" />
            {t('newChat')}
          </Button>
        </div>

        {/* Search */}
        <div className="px-3 mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('searchChats')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-muted/50 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="px-3 mt-4 space-y-1">
          <button
            onClick={() => setViewMode(viewMode === "single" ? "multi" : "single")}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
              viewMode === "multi" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted",
            )}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>{t('multiWindowChat')}</span>
          </button>

          <button
            onClick={() => navigate("/agent")}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
          >
            <Bot className="w-4 h-4" />
            <span>Sorix Agent</span>
          </button>

          <button
            onClick={() => navigate("/cineshoot")}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
          >
            <Clapperboard className="w-4 h-4" />
            <span>Sorix Cineshoot</span>
          </button>

          <div>
            <button
              onClick={() => navigate("/tools")}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <Grid3X3 className="w-4 h-4" />
                <span>{t('moreTools')}</span>
              </div>
            </button>

            <AnimatePresence>
              {showMoreTools && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="py-1 space-y-1">
                    {moreTools.map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => {
                          if (tool.id === "health") navigate("/health");
                          if (tool.id === "agro") navigate("/agro");
                          if (tool.id === "legends") navigate("/legends");
                          if (tool.id === "imagine") navigate("/imagine");
                          if (tool.id === "deck") navigate("/deck");
                          if (tool.id === "flowbuilder") navigate("/flowbuilder");
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shadow-sm", tool.gradient)}>
                          <tool.icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{tool.name}</span>
                            {tool.free && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-600 dark:text-green-400 font-bold">FREE</span>
                            )}
                          </div>
                          <p className="text-[10px] text-muted-foreground">{tool.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setProjectsModalOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <FolderKanban className="w-4 h-4" />
              <span>{t('projects')}</span>
            </div>
            {user.plan === "free" && <span className="text-muted-foreground">🔒</span>}
          </button>
        </div>

        {/* Chat History */}
        <div className="px-3 mt-4 flex items-center justify-between">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-3">{t('history')}</h3>
          <button
            onClick={() => useChatStore.setState({ historyCollapsed: !historyCollapsed })}
            className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground"
            title={historyCollapsed ? "Show history" : "Hide history"}
          >
            {historyCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
        <ScrollArea className="flex-1 mt-1">
          {!historyCollapsed && (
            <div className="px-3 space-y-4">
              {starredChats.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-1 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    Starred
                  </h3>
                  <div className="space-y-0.5">{renderChatList(starredChats)}</div>
                </div>
              )}
              {todayChats.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-1">
                    {t('today')}
                  </h3>
                  <div className="space-y-0.5">{renderChatList(todayChats)}</div>
                </div>
              )}
              {thisWeekChats.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-1">
                    {t('thisWeek')}
                  </h3>
                  <div className="space-y-0.5">{renderChatList(thisWeekChats)}</div>
                </div>
              )}
              {olderChats.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-1">
                    {t('older')}
                  </h3>
                  <div className="space-y-0.5">{renderChatList(olderChats.slice(0, 10))}</div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Bottom Section */}
        <div className="p-3 border-t border-border space-y-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center text-primary font-semibold text-xs">
                  {avatarUrl ? <img src={avatarUrl} alt="" className="w-full h-full object-cover" /> : userInitials}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{userName}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{userEmail}</p>
                </div>
                <MoreHorizontal className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-popover border border-border shadow-lg z-50">
              <DropdownMenuItem onClick={() => setShowUpgradeModal(true)}>
                <Crown className="w-4 h-4 mr-2 text-primary" />
                {t('upgradePlan')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowSettings(true)}>
                <Settings className="w-4 h-4 mr-2" />
                {t('settings')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSettingsInitialTab("help");
                  setShowSettings(true);
                }}
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                {t('helpAndSupport')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                {t('logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            to="/"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>{t('backToHome')}</span>
          </Link>
        </div>
      </div>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => {
          setShowSettings(false);
          setSettingsInitialTab(undefined);
        }}
        initialTab={settingsInitialTab}
      />
      <UpgradePlanModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
    </>
  );
};

export default ChatSidebar;
