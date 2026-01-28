import React from 'react';
import { FileText, Shield, Cookie, RefreshCw, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const legalDocuments = [
  {
    icon: FileText,
    title: 'Terms of Service',
    description: 'Rules and guidelines for using AI Sorix',
    link: '/terms-of-service',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Shield,
    title: 'Privacy Policy',
    description: 'How we collect and use your data',
    link: '/privacy-policy',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Cookie,
    title: 'Cookie Policy',
    description: 'Information about cookies we use',
    link: '/cookie-policy',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    icon: RefreshCw,
    title: 'Refund Policy',
    description: 'Our refund and cancellation policy',
    link: '/refund-policy',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
];

export const TermsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-lg bg-muted/50">
        <p className="text-sm text-muted-foreground">
          By using AI Sorix, you agree to our terms of service and privacy policy. 
          Please review these documents to understand your rights and responsibilities.
        </p>
      </div>

      <div className="space-y-3">
        {legalDocuments.map((doc) => {
          const Icon = doc.icon;
          return (
            <Link
              key={doc.title}
              to={doc.link}
              className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/50 transition-all"
            >
              <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', doc.bg)}>
                <Icon className={cn('h-6 w-6', doc.color)} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{doc.title}</p>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {doc.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Last Updated */}
      <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border">
        <p>Last updated: January 2025</p>
        <p className="mt-1">© 2025 AI Sorix by Sorixlab. All rights reserved.</p>
      </div>
    </div>
  );
};
