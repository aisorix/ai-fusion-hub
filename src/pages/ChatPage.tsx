// AI Chat Page - Main chat interface
// Protected route that requires authentication
// (rebuild marker — forces Vite to refresh dynamic import chunk)

import React, { useEffect, useState } from 'react';
import SEOHead from '@/components/SEOHead';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useChatStore } from '@/stores/chatStore';
import ChatArea from '@/components/aichat/ChatArea';
import ChatSidebar from '@/components/aichat/ChatSidebar';
import MobileHeader from '@/components/aichat/MobileHeader';
import MobileSidebar from '@/components/aichat/MobileSidebar';
import ShareModal from '@/components/aichat/ShareModal';
import MultiWindowChat from '@/components/aichat/MultiWindowChat';
import ProjectsModal from '@/components/aichat/ProjectsModal';
import { LiveVoiceOverlay } from '@/components/voice';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const ChatPage = () => {
  const navigate = useNavigate();
  const { user, isLoading: loading, isAuthenticated } = useAuth();
  const { theme, viewMode, createNewChat, sidebarOpen } = useChatStore();
  const [showVoiceMode, setShowVoiceMode] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // Apply theme
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleNewChat = () => {
    createNewChat();
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className={cn(
       'flex h-[100dvh] overflow-hidden transition-colors duration-200',
      'bg-background text-foreground'
    )}>
      <SEOHead
        title="AI Chat | AI Sorix"
        description="Chat with 15+ premium AI models including GPT-5, Claude, Gemini, and more. Get instant answers, generate code, and research anything."
        path="/chat"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "AI Sorix Chat",
        "url": "https://www.aisorix.com/chat",
        "image": "https://storage.googleapis.com/gpt-engineer-file-uploads/TW4KYntEtgdPvf4urbHFts3hfl32/uploads/1770273544597-logo_(2).png",
        "applicationCategory": "BusinessApplication",
        "applicationSubCategory": "AI Chat Assistant",
        "operatingSystem": "Web",
        "description": "Multi-model AI chat with 15+ frontier models — GPT-5, Claude Sonnet 4.5, Gemini 2.5 Pro, DeepSeek V3, Grok 4 — file attachments, voice mode, multi-window chat, projects, and shareable conversations.",
        "featureList": ["15+ AI Models", "File Attachments", "Voice Mode", "Multi-Window Chat", "Projects Workspace", "Conversation Sharing", "Web Search", "Image Generation"],
        "isPartOf": { "@type": "WebSite", "name": "AI Sorix", "url": "https://www.aisorix.com" },
        "publisher": { "@type": "Organization", "name": "AI Sorix", "url": "https://www.aisorix.com" },
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "description": "Free tier with 15K tokens" }
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.aisorix.com/" },
          { "@type": "ListItem", "position": 2, "name": "AI Chat", "item": "https://www.aisorix.com/chat" }
        ]
      }) }} />

      {/* Desktop Sidebar - hidden on mobile */}
      {!isMobile && sidebarOpen && (
        <ChatSidebar onNewChat={handleNewChat} />
      )}

      {/* Mobile Sidebar - Sheet component */}
      <MobileSidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        onNewChat={handleNewChat}
      />
      
      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <MobileHeader
          onOpenSidebar={() => setMobileSidebarOpen(true)}
          onNewChat={handleNewChat}
        />

        {viewMode === 'multi' ? (
          <MultiWindowChat />
        ) : (
          <ChatArea onOpenVoiceMode={() => setShowVoiceMode(true)} />
        )}
      </main>
      
      {/* Share Modal */}
      <ShareModal />

      {/* Projects Modal */}
      <ProjectsModal />

      {/* Voice Mode Overlay */}
      <LiveVoiceOverlay isOpen={showVoiceMode} onClose={() => setShowVoiceMode(false)} />
    </div>
  );
};

export default ChatPage;
