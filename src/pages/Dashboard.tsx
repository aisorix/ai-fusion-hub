import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Sparkles, 
  Home, 
  Settings, 
  LogOut,
  Zap,
  Brain,
  TrendingUp,
  Clock,
  Star
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useChatStore } from '@/stores/chatStore';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { user: storeUser, chats } = useChatStore();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const quickActions = [
    {
      id: 'chat',
      title: 'AI Chat',
      description: 'Start a conversation with AI models',
      icon: MessageSquare,
      color: 'from-cyan-500 to-blue-500',
      shadow: 'shadow-cyan-500/25',
      onClick: () => navigate('/chat'),
    },
    {
      id: 'new-chat',
      title: 'New Chat',
      description: 'Begin a fresh conversation',
      icon: Sparkles,
      color: 'from-purple-500 to-pink-500',
      shadow: 'shadow-purple-500/25',
      onClick: () => navigate('/chat'),
    },
  ];

  const stats = [
    {
      label: 'Total Chats',
      value: chats.length,
      icon: MessageSquare,
      color: 'text-cyan-500',
    },
    {
      label: 'Tokens Used',
      value: `${(storeUser.tokensUsed / 1000).toFixed(1)}K`,
      icon: Zap,
      color: 'text-amber-500',
    },
    {
      label: 'Plan',
      value: storeUser.plan.charAt(0).toUpperCase() + storeUser.plan.slice(1),
      icon: Star,
      color: 'text-purple-500',
    },
  ];

  const features = [
    {
      title: 'Multiple AI Models',
      description: 'Access GPT-4, Claude, Gemini, and more',
      icon: Brain,
    },
    {
      title: 'Smart Conversations',
      description: 'Context-aware responses and memory',
      icon: Sparkles,
    },
    {
      title: 'Fast & Reliable',
      description: 'Quick responses with high uptime',
      icon: TrendingUp,
    },
    {
      title: '24/7 Available',
      description: 'Use anytime, anywhere',
      icon: Clock,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-foreground">AI Sorix</span>
            </div>

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Home className="w-4 h-4" />
                Home
              </button>
              <button
                onClick={() => navigate('/chat')}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Chat
              </button>
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-foreground">{storeUser.name}</p>
                <p className="text-xs text-muted-foreground">{storeUser.email}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold text-sm">
                {storeUser.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Welcome back, {storeUser.name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-muted-foreground">
            Ready to explore AI? Start a new conversation or continue where you left off.
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
        >
          {quickActions.map((action, index) => (
            <motion.button
              key={action.id}
              onClick={action.onClick}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'relative p-6 rounded-2xl text-left overflow-hidden group',
                'bg-gradient-to-br',
                action.color,
                'shadow-lg',
                action.shadow,
                'hover:shadow-xl transition-shadow'
              )}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/20 -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/20 translate-y-1/2 -translate-x-1/2" />
              </div>

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{action.title}</h3>
                <p className="text-white/80 text-sm">{action.description}</p>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="bg-card border border-border rounded-xl p-4 text-center"
            >
              <stat.icon className={cn('w-5 h-5 mx-auto mb-2', stat.color)} />
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">What you can do</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-medium text-foreground mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <button
            onClick={() => navigate('/chat')}
            className={cn(
              'inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white',
              'bg-gradient-to-r from-cyan-500 to-blue-600',
              'shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40',
              'hover:scale-[1.02] active:scale-[0.98] transition-all'
            )}
          >
            <MessageSquare className="w-5 h-5" />
            Start Chatting Now
          </button>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
