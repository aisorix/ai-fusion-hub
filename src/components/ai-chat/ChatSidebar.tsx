import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  MessageSquare, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Trash2,
  Home,
  LogOut,
  Moon,
  Sun,
  FolderOpen,
  Search,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { useChatStore } from '@/stores/chatStore';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export const ChatSidebar = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const {
    sidebarOpen,
    sidebarCollapsed,
    toggleSidebar,
    toggleSidebarCollapse,
    chats,
    activeChatId,
    setActiveChat,
    createNewChat,
    deleteChat,
    theme,
    toggleTheme,
    setProjectsModalOpen,
  } = useChatStore();

  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedChats = filteredChats.reduce((acc, chat) => {
    const date = new Date(chat.updatedAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let group: string;
    if (date.toDateString() === today.toDateString()) {
      group = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      group = 'Yesterday';
    } else if (date > new Date(today.setDate(today.getDate() - 7))) {
      group = 'This Week';
    } else {
      group = format(date, 'MMMM yyyy');
    }
    
    if (!acc[group]) acc[group] = [];
    acc[group].push(chat);
    return acc;
  }, {} as Record<string, typeof chats>);

  const handleNewChat = () => {
    createNewChat();
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (!sidebarOpen) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:flex hidden"
        onClick={toggleSidebar}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <>
      {/* Mobile overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={toggleSidebar}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border z-50 flex flex-col transition-all duration-300',
          sidebarCollapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Header */}
        <div className="p-3 border-b border-sidebar-border flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">S</span>
              </div>
              <span className="font-semibold text-sidebar-foreground">AI Sorix</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-sidebar-foreground"
              onClick={toggleSidebarCollapse}
            >
              {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-sidebar-foreground md:hidden"
              onClick={toggleSidebar}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <Button
            onClick={handleNewChat}
            className={cn(
              'w-full justify-start gap-2 bg-primary hover:bg-primary/90',
              sidebarCollapsed && 'justify-center px-0'
            )}
          >
            <Plus className="h-4 w-4" />
            {!sidebarCollapsed && 'New Chat'}
          </Button>
        </div>

        {/* Search */}
        {!sidebarCollapsed && (
          <div className="px-3 pb-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9 text-sm bg-sidebar-accent"
              />
            </div>
          </div>
        )}

        {/* Chat List */}
        <ScrollArea className="flex-1 px-2">
          {Object.entries(groupedChats).map(([group, groupChats]) => (
            <div key={group} className="mb-4">
              {!sidebarCollapsed && (
                <p className="text-xs text-muted-foreground px-2 py-1 font-medium">
                  {group}
                </p>
              )}
              {groupChats.map((chat) => (
                <div
                  key={chat.id}
                  className={cn(
                    'group flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-colors',
                    activeChatId === chat.id
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'hover:bg-sidebar-accent/50 text-sidebar-foreground'
                  )}
                  onClick={() => setActiveChat(chat.id)}
                >
                  <MessageSquare className="h-4 w-4 shrink-0" />
                  {!sidebarCollapsed && (
                    <>
                      <span className="text-sm truncate flex-1">{chat.title}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteChat(chat.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}

          {chats.length === 0 && !sidebarCollapsed && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No conversations yet</p>
              <p className="text-xs mt-1">Start a new chat above</p>
            </div>
          )}
        </ScrollArea>

        {/* Footer Actions */}
        <div className="p-3 border-t border-sidebar-border space-y-1">
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start gap-2 text-sidebar-foreground',
              sidebarCollapsed && 'justify-center px-0'
            )}
            onClick={() => setProjectsModalOpen(true)}
          >
            <FolderOpen className="h-4 w-4" />
            {!sidebarCollapsed && 'Projects'}
          </Button>

          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start gap-2 text-sidebar-foreground',
              sidebarCollapsed && 'justify-center px-0'
            )}
            onClick={() => navigate('/')}
          >
            <Home className="h-4 w-4" />
            {!sidebarCollapsed && 'Home'}
          </Button>

          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start gap-2 text-sidebar-foreground',
              sidebarCollapsed && 'justify-center px-0'
            )}
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {!sidebarCollapsed && (theme === 'dark' ? 'Light Mode' : 'Dark Mode')}
          </Button>

          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start gap-2 text-sidebar-foreground',
              sidebarCollapsed && 'justify-center px-0'
            )}
            onClick={() => setSettingsOpen(true)}
          >
            <Settings className="h-4 w-4" />
            {!sidebarCollapsed && 'Settings'}
          </Button>

          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start gap-2 text-destructive hover:text-destructive',
              sidebarCollapsed && 'justify-center px-0'
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            {!sidebarCollapsed && 'Sign Out'}
          </Button>
        </div>
      </aside>
    </>
  );
};
