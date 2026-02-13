import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  LayoutGrid,
  Sparkles,
  FolderKanban,
  ChevronDown,
  ChevronRight,
  Settings,
  Crown,
  MessageSquare,
  Leaf,
  Heart,
  BookOpen,
  Home,
  PanelLeftClose,
  MoreHorizontal,
  Pencil,
  Trash2,
  Check,
  X,
} from "lucide-react";
import { useChatStore } from "@/stores/chatStore";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import sorixLogo from "@/assets/logo.png";
import { useUserProfile } from "@/hooks/useUserProfile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
}: {
  chat: { id: string; title: string };
  isActive: boolean;
  onSelect: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
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

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-1 rounded shrink-0 hover:bg-muted/80">
            <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-36 bg-popover border border-border shadow-lg z-50">
          <DropdownMenuItem
            onClick={() => {
              setRenameValue(chat.title);
              setIsRenaming(true);
            }}
          >
            <Pencil className="w-3.5 h-3.5 mr-2" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onDelete(chat.id)} className="text-destructive focus:text-destructive">
            <Trash2 className="w-3.5 h-3.5 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const MobileSidebar = ({ isOpen, onClose, onNewChat }: MobileSidebarProps) => {
  const navigate = useNavigate();
  const { signOut, user: authUser } = useAuth();
  const { theme, toggleTheme, chats, activeChatId, setActiveChat, deleteChat, updateChatTitle, viewMode, setViewMode, user, setProjectsModalOpen, historyCollapsed } =
    useChatStore();
  const { avatarUrl, fullName } = useUserProfile();

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

  const todayChats = filteredChats.filter((c) => new Date(c.createdAt) >= today);
  const thisWeekChats = filteredChats.filter((c) => {
    const d = new Date(c.createdAt);
    return d < today && d >= weekAgo;
  });
  const olderChats = filteredChats.filter((c) => new Date(c.createdAt) < weekAgo);

  const moreTools = [
    { id: "agro", name: "Sorix Agro", icon: Leaf, color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" },
    { id: "health", name: "Sorix Health", icon: Heart, color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" },
    { id: "legends", name: "Sorix Legends", icon: BookOpen, color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
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
            <Link to="/" className="flex items-center gap-2" onClick={onClose}>
              <img src={sorixLogo} alt="AI Sorix" className="w-8 h-8" />
              <div className="leading-tight">
                <h1 className="font-bold text-foreground text-[13px] flex items-center gap-1.5">
                  AI Sorix
                  {isPaidUser && <PlanBadge plan={user.plan as PlanType} />}
                </h1>
                <p className="text-[10px] text-muted-foreground">Premium AI Platform</p>
              </div>
            </Link>
            <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground">
              <PanelLeftClose className="w-5 h-5" />
            </button>
          </div>

          {/* New Chat */}
          <div className="px-3 mt-1">
            <Button onClick={handleNewChat} className="w-full h-10 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl">
              <Plus className="w-4 h-4" />
              New chat
            </Button>
          </div>

          {/* Search */}
          <div className="px-3 mt-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search chats"
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
              <span>Multi-Window Chat</span>
            </button>

            <div>
              <button onClick={() => setShowMoreTools(!showMoreTools)} className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-foreground/80 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>More Tools</span>
                </div>
                <ChevronDown className={cn("w-4 h-4 transition-transform text-muted-foreground", showMoreTools && "rotate-180")} />
              </button>

              <AnimatePresence>
                {showMoreTools && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="py-1 px-2 space-y-0.5">
                      {moreTools.map((tool) => (
                        <button
                          key={tool.id}
                          onClick={() => {
                            if (tool.id === 'health') { navigate('/health'); onClose(); }
                            if (tool.id === 'agro') { navigate('/agro'); onClose(); }
                            if (tool.id === 'legends') { navigate('/legends'); onClose(); }
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground/80 hover:bg-muted/50 transition-colors"
                        >
                          <div className={cn("w-7 h-7 rounded-md flex items-center justify-center", tool.color)}>
                            <tool.icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-[13px]">{tool.name}</span>
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
                <span>Projects</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold">PRO</span>
              </div>
            </button>
          </div>

          {/* Chat History */}
          <div className="px-3 mt-2 flex items-center justify-between">
            <h3 className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest px-3">History</h3>
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
              {todayChats.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest px-3 mb-1.5">Today</h3>
                  <div className="space-y-0.5">{renderChatList(todayChats)}</div>
                </div>
              )}
              {thisWeekChats.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest px-3 mb-1.5">This Week</h3>
                  <div className="space-y-0.5">{renderChatList(thisWeekChats)}</div>
                </div>
              )}
              {olderChats.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest px-3 mb-1.5">Older</h3>
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
                <span>Upgrade</span>
              </button>
              <Link
                to="/"
                onClick={onClose}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors border border-border/50"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
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
