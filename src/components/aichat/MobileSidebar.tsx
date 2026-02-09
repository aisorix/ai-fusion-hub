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
  LogOut,
  Settings,
  Crown,
  MessageSquare,
  Leaf,
  Heart,
  BookOpen,
  Home,
} from "lucide-react";
import { useChatStore } from "@/stores/chatStore";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import sorixLogo from "@/assets/logo.png";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import SettingsModal from "./SettingsModal";
import UpgradePlanModal from "./UpgradePlanModal";
import { PlanBadge, type PlanType } from "./PlanIcons";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
}

const MobileSidebar = ({ isOpen, onClose, onNewChat }: MobileSidebarProps) => {
  const navigate = useNavigate();
  const { signOut, user: authUser } = useAuth();
  const { theme, toggleTheme, chats, activeChatId, setActiveChat, viewMode, setViewMode, user, setProjectsModalOpen } =
    useChatStore();

  const [showMoreTools, setShowMoreTools] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
    onClose();
  };

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
    {
      id: "agro",
      name: "Sorix Agro",
      description: "AI-powered agricultural assistant",
      icon: Leaf,
      color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
      comingSoon: true,
    },
    {
      id: "health",
      name: "Sorix Health",
      description: "Your personal health companion",
      icon: Heart,
      color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
      comingSoon: true,
    },
    {
      id: "legends",
      name: "Sorix Legends",
      description: "Chat with historical legends",
      icon: BookOpen,
      color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
      comingSoon: true,
    },
  ];

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

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="w-[300px] p-0 flex flex-col">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
          </SheetHeader>

          {/* Header - Reduced Padding */}
          <div
            className={cn(
              "p-3 border-b flex items-center justify-between",
              isPaidUser ? "border-primary/20" : "border-border",
            )}
          >
            <Link to="/" className="flex items-center gap-2" onClick={onClose}>
              <img src={sorixLogo} alt="AI Sorix" className="w-8 h-8" />
              <div>
                <h1 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                  AI Sorix
                  {isPaidUser && <PlanBadge plan={user.plan as PlanType} />}
                </h1>
                <p className="text-[10px] text-muted-foreground">Premium AI Platform</p>
              </div>
            </Link>
          </div>

          {/* New Chat Button - Reduced Top Padding (pt-3 to pt-2) */}
          <div className="px-3 pt-2">
            <Button
              onClick={handleNewChat}
              className="w-full h-10 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="w-5 h-5" />
              New chat
            </Button>
          </div>

          {/* Search - Reduced Top Margin (mt-3 to mt-2) */}
          <div className="px-3 mt-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search chats"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-lg bg-muted/50 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Quick Actions - Reduced Spacing (mt-3 to mt-2, space-y-1 to space-y-0.5) */}
          <div className="px-3 mt-2 space-y-0.5">
            <button
              onClick={() => {
                setViewMode(viewMode === "single" ? "multi" : "single");
                onClose();
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                viewMode === "multi" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted",
              )}
            >
              <LayoutGrid className="w-5 h-5" />
              <span>Multi-Window Chat</span>
            </button>

            <div>
              <button
                onClick={() => setShowMoreTools(!showMoreTools)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span>More Tools</span>
                </div>
                <ChevronDown
                  className={cn("w-5 h-5 transition-transform text-muted-foreground", showMoreTools && "rotate-180")}
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
                    <div className="py-1 space-y-0.5">
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
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                                  SOON
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => {
                setProjectsModalOpen(true);
                onClose();
              }}
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

          {/* Chat History - Reduced Top Margin (mt-3 to mt-2) */}
          <ScrollArea className="flex-1 mt-2">
            <div className="px-3 space-y-3 pb-4">
              {todayChats.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-1">
                    Today
                  </h3>
                  <div className="space-y-0.5">
                    {todayChats.map((chat) => (
                      <button
                        key={chat.id}
                        onClick={() => handleSelectChat(chat.id)}
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

              {thisWeekChats.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-1">
                    This Week
                  </h3>
                  <div className="space-y-0.5">
                    {thisWeekChats.map((chat) => (
                      <button
                        key={chat.id}
                        onClick={() => handleSelectChat(chat.id)}
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

              {olderChats.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-1">
                    Older
                  </h3>
                  <div className="space-y-0.5">
                    {olderChats.slice(0, 10).map((chat) => (
                      <button
                        key={chat.id}
                        onClick={() => handleSelectChat(chat.id)}
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
          <div className="p-3 border-t border-border space-y-2 mt-auto">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50">
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                {userInitials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{userName}</p>
                <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  {userEmail}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowSettings(true);
                  onClose();
                }}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Settings className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setShowUpgradeModal(true);
                  onClose();
                }}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted transition-colors border border-border"
              >
                <Crown className="w-4 h-4 text-primary" />
                <span>Upgrade</span>
              </button>
              <Link
                to="/"
                onClick={onClose}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted transition-colors border border-border"
              >
                <Home className="w-4 h-4" />
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
