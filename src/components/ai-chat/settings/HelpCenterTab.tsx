import React from 'react';
import { 
  HelpCircle, 
  Book, 
  MessageCircle, 
  Mail, 
  ExternalLink,
  Youtube,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const helpResources = [
  {
    icon: Book,
    title: 'Documentation',
    description: 'Read our comprehensive guides and tutorials',
    link: '#',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Youtube,
    title: 'Video Tutorials',
    description: 'Watch step-by-step video guides',
    link: '#',
    color: 'text-red-500',
    bg: 'bg-red-500/10',
  },
  {
    icon: MessageCircle,
    title: 'Community Forum',
    description: 'Connect with other users',
    link: '#',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    icon: Mail,
    title: 'Email Support',
    description: 'Get help from our support team',
    link: 'mailto:support@aisorix.com',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
];

const faqs = [
  {
    question: 'How do I upgrade my plan?',
    answer: 'Go to Settings > Plans & Tokens and click "Upgrade Plan" to see available options.',
  },
  {
    question: 'Can I use AI Sorix in Bengali?',
    answer: 'Yes! AI Sorix supports both English and Bengali. You can change the language in Settings > General.',
  },
  {
    question: 'What models are available?',
    answer: 'We offer 23+ AI models including GPT-5, Claude, Gemini, and more. Available models depend on your plan.',
  },
  {
    question: 'How does Health Mode work?',
    answer: 'Health Mode provides specialized AI assistance for health-related queries including prescription and lab report analysis.',
  },
];

export const HelpCenterTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Quick Links */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
        <div className="grid grid-cols-2 gap-3">
          {helpResources.map((resource) => {
            const Icon = resource.icon;
            return (
              <a
                key={resource.title}
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/50 transition-all"
              >
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', resource.bg)}>
                  <Icon className={cn('h-5 w-5', resource.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="font-medium text-sm">{resource.title}</p>
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {resource.description}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* FAQs */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions</h3>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="p-4 rounded-lg border border-border">
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">{faq.question}</p>
                  <p className="text-sm text-muted-foreground mt-1">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="p-4 rounded-xl bg-muted/50 text-center">
        <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground mb-3">
          Can't find what you're looking for?
        </p>
        <Button variant="outline" size="sm">
          <Mail className="h-4 w-4 mr-2" />
          Contact Support
        </Button>
      </div>
    </div>
  );
};
