import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  MessageCircle, 
  Book, 
  Video, 
  Mail, 
  ChevronRight, 
  ExternalLink,
  Sparkles,
  Zap,
  Shield,
  CreditCard,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

const QUICK_LINKS = [
  { 
    id: 'getting-started', 
    icon: Sparkles, 
    label: 'Getting Started', 
    description: 'Learn the basics of AI Sorix',
    color: 'from-primary to-accent'
  },
  { 
    id: 'features', 
    icon: Zap, 
    label: 'Features Guide', 
    description: 'Explore all available features',
    color: 'from-amber-500 to-orange-500'
  },
  { 
    id: 'billing', 
    icon: CreditCard, 
    label: 'Billing & Plans', 
    description: 'Subscription and payment help',
    color: 'from-green-500 to-emerald-500'
  },
  { 
    id: 'security', 
    icon: Shield, 
    label: 'Privacy & Security', 
    description: 'How we protect your data',
    color: 'from-blue-500 to-cyan-500'
  },
];

const FAQ_ITEMS = [
  {
    question: 'How do I start a new conversation?',
    answer: 'Click the "New chat" button in the sidebar or use the keyboard shortcut Ctrl/Cmd + N to start a fresh conversation.'
  },
  {
    question: 'Can I export my chat history?',
    answer: 'Yes! Click the export button in any conversation to download it as PDF, Markdown, DOCX, or a ZIP file containing all formats.'
  },
  {
    question: 'How do I change the AI model?',
    answer: 'Use the model selector dropdown at the top of the chat to switch between available AI models.'
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. We use end-to-end encryption and never share your data with third parties. Your conversations are private and secure.'
  },
  {
    question: 'How do I upgrade my plan?',
    answer: 'Go to Settings > Plans & Tokens to view available plans and upgrade your subscription.'
  },
];

const SUPPORT_OPTIONS = [
  { 
    id: 'docs', 
    icon: Book, 
    label: 'Documentation', 
    description: 'Comprehensive guides and tutorials',
    action: 'View Docs'
  },
  { 
    id: 'video', 
    icon: Video, 
    label: 'Video Tutorials', 
    description: 'Step-by-step video guides',
    action: 'Watch Now'
  },
  { 
    id: 'community', 
    icon: Users, 
    label: 'Community Forum', 
    description: 'Connect with other users',
    action: 'Join Community'
  },
  { 
    id: 'email', 
    icon: Mail, 
    label: 'Email Support', 
    description: 'support@aisorix.com',
    action: 'Send Email'
  },
];

const SUPPORT_EMAIL = 'support@aisorix.com';

const HelpCenterTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const filteredFaqs = FAQ_ITEMS.filter(
    faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold">Help Center</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Find answers and get support
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4 sm:mb-6">
        <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for help..."
          className={cn(
            'w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-xl transition-all duration-200 text-sm',
            'bg-muted border border-border',
            'placeholder:text-muted-foreground',
            'focus:outline-none focus:border-primary/50 focus:shadow-glow'
          )}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pr-1 sm:pr-2 space-y-5 sm:space-y-6">
        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Quick Links</h4>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {QUICK_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  className={cn(
                    'flex flex-col items-start p-3 sm:p-4 rounded-xl transition-all duration-200',
                    'border border-border bg-card hover:border-primary/30 hover:bg-accent/50',
                    'group text-left'
                  )}
                >
                  <div className={cn(
                    'w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center mb-2',
                    `bg-gradient-to-br ${link.color}`
                  )}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {link.label}
                  </span>
                  <span className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {link.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Frequently Asked Questions</h4>
          <div className="space-y-2">
            {filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className={cn(
                  'border border-border rounded-xl overflow-hidden transition-all duration-200',
                  expandedFaq === index ? 'bg-primary/5 border-primary/30' : 'bg-card'
                )}
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-3 sm:p-4 text-left"
                >
                  <span className="text-sm font-medium pr-4">{faq.question}</span>
                  <ChevronRight className={cn(
                    'w-4 h-4 text-muted-foreground transition-transform duration-200 flex-shrink-0',
                    expandedFaq === index && 'rotate-90'
                  )} />
                </button>
                {expandedFaq === index && (
                  <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-0">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
            {filteredFaqs.length === 0 && searchQuery && (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground">
                  No results found for "{searchQuery}"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Support Options */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Get More Help</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {SUPPORT_OPTIONS.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  className={cn(
                    'flex items-center gap-3 p-3 sm:p-4 rounded-xl transition-all duration-200',
                    'border border-border bg-card hover:border-primary/30 hover:bg-accent/50',
                    'group text-left'
                  )}
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-foreground block">
                      {option.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {option.description}
                    </span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Contact Card */}
        <div className={cn(
          'p-4 sm:p-5 rounded-2xl',
          'bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20'
        )}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h5 className="font-semibold text-foreground">Still need help?</h5>
              <p className="text-sm text-muted-foreground mt-1">
                Our support team is available 24/7 to assist you with any questions.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 mt-3">
                <a 
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    'bg-primary text-primary-foreground hover:shadow-glow',
                    'flex items-center justify-center gap-2'
                  )}
                >
                  <Mail className="w-4 h-4" />
                  Contact Support
                </a>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(SUPPORT_EMAIL);
                  }}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    'bg-muted text-foreground hover:bg-accent border border-border',
                    'flex items-center justify-center gap-2'
                  )}
                >
                  Copy Email
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {SUPPORT_EMAIL}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterTab;