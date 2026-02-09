import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  LayoutGrid,
  Sparkles,
  FolderKanban,
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
  BookOpen,
  PanelLeftClose,
  PanelLeft,
  MoreHorizontal,
  Home,
} from "lucide-react";
import { useChatStore } from "@/stores/chatStore";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import sorixLogo from "@/assets/logo.png";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SettingsModal from "./SettingsModal";
import UpgradePlanModal from "./UpgradePlanModal";
import { PlanIcon, PlanBadge, type PlanType } from "./PlanIcons";

interface ChatSidebarProps {
  onNewChat: () => void;
}

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
    viewMode,
    setViewMode,
    user,
    setProjectsModalOpen,
  } = useChatStore();

  const [showMoreTools, setShowMoreTools] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  // Filter chats by search
  const filteredChats = chats.filter((chat) => chat.title.toLowerCase().includes(searchQuery.toLowerCase()));

  // Group chats by date
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
    {
      id: "agro",
      name: "Sorix Agro",
      description: "AI-powered agricultural assistant",
      icon: Leaf,
      color: "bg-green-100 text-green-600",
      comingSoon: true,
    },
    {
      id: "health",
      name: "Sorix Health",
      description: "Your personal health companion",
      icon: Heart,
      color: "bg-red-100 text-red-600",
      comingSoon: true,
    },
    {
      id: "legends",
      name: "Sorix Legends",
      description: "Chat with historical legends",
      icon: BookOpen,
      color: "bg-amber-100 text-amber-600",
      comingSoon: true,
    },
  ];

  // Get user initials
  const userInitials = authUser?.email
    ? authUser.email.charAt(0).toUpperCase()
    : user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

  const userName = authUser?.user_metadata?.full_name || user.name;
  const userEmail = authUser?.email || user.email;
  const isPaidUser = user.plan !== "free";

  // Collapsed sidebar view
  if (sidebarCollapsed) {
    return (
      <div className="w-14 h-full bg-card border-r border-border flex flex-col items-center py-4 gap-2">
        {/* Expand button */}
        <button
          onClick={toggleSidebarCollapse}
          className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-muted transition-colors mb-2"
        >
          <PanelLeft className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* New Chat */}
        <button
          onClick={onNewChat}
          className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
        </button>

        {/* Search */}
        <button className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground">
          <Search className="w-5 h-5" />
        </button>

        {/* Multi-Window */}
        <button
          onClick={() => setViewMode(viewMode === "single" ? "multi" : "single")}
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
            viewMode === "multi" ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground",
          )}
        >
          <LayoutGrid className="w-5 h-5" />
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Home */}
        <Link
          to="/"
          className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground"
        >
          <Home className="w-5 h-5" />
        </Link>

        {/* User Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm hover:bg-primary/20 transition-colors">
              {userInitials}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="right" className="w-56 bg-popover border border-border shadow-lg z-50">
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-foreground truncate">{userName}</p>
              <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setShowUpgradeModal(true)}>
              <Crown className="w-4 h-4 mr-2 text-primary" />
              Upgrade Plan
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowSettings(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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
        {/* Header with Plan Icon */}
        <div className="p-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src={sorixLogo} alt="AI Sorix" className="w-8 h-8" />
            <div>
              <h1 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                AI Sorix
                {isPaidUser && <PlanBadge plan={user.plan as PlanType} />}
              </h1>
              <p className="text-[10px] text-muted-foreground">Premium AI Platform</p>
            </div>
          </Link>
          <button
            onClick={toggleSidebarCollapse}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="px-3">
          <Button onClick={onNewChat} className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4" />
            New chat
          </Button>
        </div>

        {/* Search */}
        <div className="px-3 mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search chats"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-muted/50 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Navigation Items */}
        <div className="px-3 mt-4 space-y-1">
          {/* Multi-Window Chat */}
          <button
            onClick={() => setViewMode(viewMode === "single" ? "multi" : "single")}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
              viewMode === "multi" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted",
            )}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Multi-Window Chat</span>
          </button>

          {/* More Tools */}
          <div>
            <button
              onClick={() => setShowMoreTools(!showMoreTools)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>More Tools</span>
              </div>
              <ChevronDown
                className={cn("w-4 h-4 transition-transform text-muted-foreground", showMoreTools && "rotate-180")}
              />
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
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", tool.color)}>
                          <tool.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{tool.name}</span>
                            {tool.comingSoon && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/20 text-accent-foreground">
                                COMING SOON
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-muted-foreground">{tool.description}</p>
                        </div>
                      </button>
                    ))}
                    {/* More tools coming */}
                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <span className="text-sm text-primary">More Tools Coming:</span>
                        <p className="text-[10px] text-muted-foreground">New AI tools coming soon</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Projects */}
          <button
            onClick={() => setProjectsModalOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <FolderKanban className="w-4 h-4" />
              <span>Projects</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">PRO</span>
              {user.plan === "free" && <span className="text-muted-foreground">🔒</span>}
            </div>
          </button>
        </div>

        {/* Chat History */}
        <ScrollArea className="flex-1 mt-4">
          <div className="px-3 space-y-4">
            {/* Today */}
            {todayChats.length > 0 && (
              <div>
                <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-1">
                  Today
                </h3>
                <div className="space-y-0.5">
                  {todayChats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => setActiveChat(chat.id)}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors group",
                        activeChatId === chat.id ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted",
                      )}
                    >
                      <MessageSquare className="w-4 h-4 shrink-0" />
                      <span className="truncate flex-1 text-left">{chat.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* This Week */}
            {thisWeekChats.length > 0 && (
              <div>
                <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-1">
                  This Week
                </h3>
                <div className="space-y-0.5">
                  {thisWeekChats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => setActiveChat(chat.id)}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                        activeChatId === chat.id ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted",
                      )}
                    >
                      <MessageSquare className="w-4 h-4 shrink-0" />
                      <span className="truncate flex-1 text-left">{chat.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Older */}
            {olderChats.length > 0 && (
              <div>
                <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-1">
                  Older
                </h3>
                <div className="space-y-0.5">
                  {olderChats.slice(0, 10).map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => setActiveChat(chat.id)}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                        activeChatId === chat.id ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted",
                      )}
                    >
                      <MessageSquare className="w-4 h-4 shrink-0" />
                      <span className="truncate flex-1 text-left">{chat.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Bottom Section */}
        <div className="p-3 border-t border-border space-y-1">
          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-xs">
                  {userInitials}
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
                Upgrade Plan
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowSettings(true)}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="w-4 h-4 mr-2" />
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Back to Home */}
          <Link
            to="/"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      {/* Modals */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <UpgradePlanModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
    </>
  );
};

export default ChatSidebar;
