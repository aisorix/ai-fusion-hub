import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  LayoutGrid,
  Sparkles,
  FolderKanban,
  ChevronDown,
  Workflow,
  Grid3X3,
  ChevronRight,
  Settings,
  Crown,
  MessageSquare,
  Leaf,
  Heart,
  Stethoscope,
  BookOpen,
  Palette,
  Presentation,
  Home,
  PanelLeftClose,
  Check,
  X,
  Bot,
  Star,
} from "lucide-react";
import { useChatStore } from "@/stores/chatStore";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/translations";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import sorixLogo from "@/assets/logo.png";
import { useUserProfile } from "@/hooks/useUserProfile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import ChatHistoryActions from "./ChatHistoryActions";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import SettingsModal from "./SettingsModal";
import UpgradePlanModal from "./UpgradePlanModal";
import { PlanBadge, type PlanType } from "./PlanIcons";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
}

// Mobile chat item with context menu
const MobileChatItem = ({
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
        "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors group",
        isActive ? "bg-primary/10 text-primary font-medium" : "text-foreground/70 hover:bg-muted/50",
      )}
    >
      <button onClick={onSelect} className="flex items-center gap-2.5 flex-1 min-w-0 text-left">
        <MessageSquare className="w-4 h-4 shrink-0 opacity-70" />
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

const MobileSidebar = ({ isOpen, onClose, onNewChat }: MobileSidebarProps) => {
  const navigate = useNavigate();
  const { signOut, user: authUser } = useAuth();
  const { theme, toggleTheme, chats, activeChatId, setActiveChat, deleteChat, updateChatTitle, toggleStarChat, viewMode, setViewMode, user, setProjectsModalOpen, historyCollapsed, language } =
    useChatStore();
  const { avatarUrl, fullName } = useUserProfile();
  const { t } = useTranslation(language as 'en' | 'bn');

  const [showMoreTools, setShowMoreTools] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleSelectChat = (chatId: string) => {
    setActiveChat(chatId);
    onClose();
  };

  const handleNewChat = () => {
    onNewChat();
    onClose();
  };

  const filteredChats = chats.filter((chat) => chat.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const unstarredChats = filteredChats.filter((c) => !c.isStarred);

  const todayChats = unstarredChats.filter((c) => new Date(c.createdAt) >= today);
  const thisWeekChats = unstarredChats.filter((c) => {
    const d = new Date(c.createdAt);
    return d < today && d >= weekAgo;
  });
  const olderChats = unstarredChats.filter((c) => new Date(c.createdAt) < weekAgo);
  const starredChats = filteredChats.filter((c) => c.isStarred);

  const moreTools = [
    { id: "agro", name: t('sorixAgro'), desc: t('sorixAgroDesc'), icon: Leaf, gradient: "bg-gradient-to-br from-green-500 to-lime-500", free: true },
    { id: "health", name: t('sorixHealth'), desc: t('sorixHealthDesc'), icon: Stethoscope, gradient: "bg-gradient-to-br from-emerald-500 to-teal-500", free: true },
    { id: "deck", name: t('sorixDeck'), desc: t('sorixDeckDesc'), icon: Presentation, gradient: "bg-gradient-to-br from-cyan-500 to-blue-600", free: false },
    { id: "imagine", name: t('sorixImagine'), desc: t('sorixImagineDesc'), icon: Palette, gradient: "bg-gradient-to-br from-cyan-500 to-blue-500", free: false },
    { id: "legends", name: t('sorixLegends'), desc: t('sorixLegendsDesc'), icon: Crown, gradient: "bg-gradient-to-br from-blue-500 to-cyan-500", free: false },
    { id: "flowbuilder", name: "Sorix FlowBuilder", desc: "AI diagram & flowchart generator", icon: Workflow, gradient: "bg-gradient-to-br from-violet-500 to-purple-600", free: false },
  ];

  const userInitials = authUser?.email
    ? authUser.email.charAt(0).toUpperCase()
    : user.name.split(" ").map((n) => n[0]).join("").toUpperCase();
  const userName = fullName || authUser?.user_metadata?.full_name || user.name;
  const userEmail = authUser?.email || user.email;
  const isPaidUser = user.plan !== "free";

  const renderChatList = (chatList: typeof chats) =>
    chatList.map((chat) => (
      <MobileChatItem
        key={chat.id}
        chat={chat}
        isActive={activeChatId === chat.id}
        onSelect={() => handleSelectChat(chat.id)}
        onDelete={deleteChat}
        onRename={updateChatTitle}
        onToggleStar={toggleStarChat}
      />
    ));

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="w-[280px] p-0 flex flex-col gap-0 border-r border-border [&>button]:hidden">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
          </SheetHeader>

          {/* Header */}
          <div className={cn("p-4 flex items-center justify-between", isPaidUser ? "border-primary/20" : "")}>
            <div className="flex items-center gap-2">
              <img src={sorixLogo} alt="AI Sorix" className="w-8 h-8" />
              <div className="leading-tight">
                <h1 className="font-bold text-foreground text-[13px] flex items-center gap-1.5">
                  AI Sorix
                  {isPaidUser && <PlanBadge plan={user.plan as PlanType} />}
                </h1>
                <p className="text-[10px] text-muted-foreground">{t('premiumAIPlatform')}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground">
              <PanelLeftClose className="w-5 h-5" />
            </button>
          </div>

          {/* New Chat */}
          <div className="px-3 mt-1">
            <Button onClick={handleNewChat} className="w-full h-10 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl">
              <Plus className="w-4 h-4" />
              {t('newChat')}
            </Button>
          </div>

          {/* Search */}
          <div className="px-3 mt-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={t('searchChats')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-xl bg-muted/30 border border-border/50 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="px-2 mt-2 space-y-0.5">
            <button
              onClick={() => { setViewMode(viewMode === "single" ? "multi" : "single"); onClose(); }}
              className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors", viewMode === "multi" ? "bg-primary/10 text-primary font-medium" : "text-foreground/80 hover:bg-muted/50")}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>{t('multiWindowChat')}</span>
            </button>

            <button
              onClick={() => { navigate("/agent"); onClose(); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground/80 hover:bg-muted/50 transition-colors"
            >
              <Bot className="w-4 h-4" />
              <span>Sorix Agent</span>
            </button>

            <div>
              <button onClick={() => { navigate("/tools"); onClose(); }} className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-foreground/80 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Grid3X3 className="w-4 h-4" />
                  <span>{t('moreTools')}</span>
                </div>
              </button>

              <AnimatePresence>
                {showMoreTools && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="py-1 pl-3 pr-2 space-y-0.5">
                      {moreTools.map((tool) => (
                        <button
                          key={tool.id}
                          onClick={() => {
                            if (tool.id === 'health') { navigate('/health'); onClose(); }
                            if (tool.id === 'agro') { navigate('/agro'); onClose(); }
                            if (tool.id === 'legends') { navigate('/legends'); onClose(); }
                            if (tool.id === 'imagine') { navigate('/imagine'); onClose(); }
                            if (tool.id === 'deck') { navigate('/deck'); onClose(); }
                            if (tool.id === 'flowbuilder') { navigate('/flowbuilder'); onClose(); }
                          }}
                          className="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm text-foreground/80 hover:bg-muted/50 transition-colors"
                        >
                          <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm", tool.gradient)}>
                            <tool.icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[13px] font-medium">{tool.name}</span>
                              {tool.free && (
                                <span className="text-[8px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-600 dark:text-green-400 font-bold uppercase tracking-wide">{t('free')}</span>
                              )}
                            </div>
                            <p className="text-[10px] text-muted-foreground truncate">{tool.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => { setProjectsModalOpen(true); onClose(); }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-foreground/80 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FolderKanban className="w-4 h-4" />
                <span>{t('projects')}</span>
              </div>
              {user.plan === 'free' && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold">PRO</span>
                </div>
              )}
            </button>
          </div>

          {/* Chat History */}
          <div className="px-3 mt-2 flex items-center justify-between">
            <h3 className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest px-3">{t('history')}</h3>
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
            <div className="px-3 space-y-3 pb-4">
              {starredChats.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest px-3 mb-1.5 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    Starred
                  </h3>
                  <div className="space-y-0.5">{renderChatList(starredChats)}</div>
                </div>
              )}
              {todayChats.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest px-3 mb-1.5">{t('today')}</h3>
                  <div className="space-y-0.5">{renderChatList(todayChats)}</div>
                </div>
              )}
              {thisWeekChats.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest px-3 mb-1.5">{t('thisWeek')}</h3>
                  <div className="space-y-0.5">{renderChatList(thisWeekChats)}</div>
                </div>
              )}
              {olderChats.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest px-3 mb-1.5">{t('older')}</h3>
                  <div className="space-y-0.5">{renderChatList(olderChats)}</div>
                </div>
              )}
            </div>
            )}
          </ScrollArea>

          {/* Bottom Section */}
          <div className="p-3 border-t border-border/50 space-y-2 bg-background/50">
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-muted/30">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                {avatarUrl ? <img src={avatarUrl} alt="" className="w-full h-full object-cover" /> : userInitials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{userName}</p>
                <p className="text-[10px] text-muted-foreground truncate">{userEmail}</p>
              </div>
              <button onClick={() => { setShowSettings(true); onClose(); }} className="p-1.5 hover:bg-muted rounded-md transition-colors">
                <Settings className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => { setShowUpgradeModal(true); onClose(); }}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors border border-border/50"
              >
                <Crown className="w-3.5 h-3.5 text-primary" />
                <span>{t('upgrade')}</span>
              </button>
              <Link
                to="/"
                onClick={onClose}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors border border-border/50"
              >
                <Home className="w-3.5 h-3.5" />
                <span>{t('home')}</span>
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <UpgradePlanModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
    </>
  );
};

export default MobileSidebar;
