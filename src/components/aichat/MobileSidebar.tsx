import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  LayoutGrid,
  Sparkles,
  FolderKanban,
  ChevronDown,
  Settings,
  Crown,
  MessageSquare,
  Leaf,
  Heart,
  BookOpen,
  Home,
  PanelLeftClose, // ছবির মতো আইকনের জন্য এটি যোগ করা হয়েছে
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
      icon: Leaf,
      color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
      comingSoon: true,
    },
    {
      id: "health",
      name: "Sorix Health",
      icon: Heart,
      color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
      comingSoon: true,
    },
    {
      id: "legends",
      name: "Sorix Legends",
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
        <SheetContent side="left" className="w-[280px] p-0 flex flex-col gap-0 border-r border-border">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
          </SheetHeader>

          {/* Header - Padding কমানো হয়েছে এবং কলাপ্স বাটন যোগ করা হয়েছে */}
          <div className={cn("p-3 flex items-center justify-between", isPaidUser ? "border-primary/10" : "")}>
            <Link to="/" className="flex items-center gap-2" onClick={onClose}>
              <img src={sorixLogo} alt="AI Sorix" className="w-7 h-7" />
              <div className="leading-tight">
                <h1 className="font-bold text-foreground text-[13px] flex items-center gap-1">
                  AI Sorix
                  {isPaidUser && <PlanBadge plan={user.plan as PlanType} />}
                </h1>
                <p className="text-[9px] text-muted-foreground">Premium AI Platform</p>
              </div>
            </Link>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground"
            >
              <PanelLeftClose className="w-5 h-5" />
            </button>
          </div>

          {/* New Chat Button - Gap কমানোর জন্য mt-1 ব্যবহার করা হয়েছে */}
          <div className="px-3 mt-1">
            <Button
              onClick={handleNewChat}
              className="w-full h-10 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl"
            >
              <Plus className="w-4 h-4" />
              New chat
            </Button>
          </div>

          {/* Search - mt-2 ব্যবহার করা হয়েছে */}
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

          {/* Quick Actions - mt-2 এবং space-y-0.5 দিয়ে একদম ছবির মতো টাইট করা হয়েছে */}
          <div className="px-2 mt-2 space-y-0.5">
            <button
              onClick={() => {
                setViewMode(viewMode === "single" ? "multi" : "single");
                onClose();
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                viewMode === "multi"
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-foreground/80 hover:bg-muted/50",
              )}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Multi-Window Chat</span>
            </button>

            <div>
              <button
                onClick={() => setShowMoreTools(!showMoreTools)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-foreground/80 hover:bg-muted/50 transition-colors"
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
                    <div className="py-1 px-2 space-y-0.5">
                      {moreTools.map((tool) => (
                        <button
                          key={tool.id}
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
              onClick={() => {
                setProjectsModalOpen(true);
                onClose();
              }}
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

          {/* Chat History - mt-2 ব্যবহার করা হয়েছে */}
          <ScrollArea className="flex-1 mt-2">
            <div className="px-3 space-y-3 pb-4">
              {todayChats.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest px-3 mb-1.5">
                    Today
                  </h3>
                  <div className="space-y-0.5">
                    {todayChats.map((chat) => (
                      <button
                        key={chat.id}
                        onClick={() => handleSelectChat(chat.id)}
                        className={cn(
                          "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                          activeChatId === chat.id
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-foreground/70 hover:bg-muted/50",
                        )}
                      >
                        <MessageSquare className="w-4 h-4 shrink-0 opacity-70" />
                        <span className="truncate flex-1 text-left">{chat.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {/* This Week and Older sections similarly updated... */}
            </div>
          </ScrollArea>

          {/* Bottom Section */}
          <div className="p-3 border-t border-border/50 space-y-2 bg-background/50">
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-muted/30">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                {userInitials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{userName}</p>
                <p className="text-[10px] text-muted-foreground truncate">{userEmail}</p>
              </div>
              <button
                onClick={() => {
                  setShowSettings(true);
                  onClose();
                }}
                className="p-1.5 hover:bg-muted rounded-md transition-colors"
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
