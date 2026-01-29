import React, { useState } from 'react';
import { Bug, Send, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const BUG_TYPES = [
  { id: 'ui', label: 'UI/Visual Issue', description: 'Layout, styling, or display problems' },
  { id: 'functionality', label: 'Functionality Bug', description: 'Feature not working as expected' },
  { id: 'performance', label: 'Performance Issue', description: 'Slow loading or lag' },
  { id: 'crash', label: 'App Crash', description: 'Application stops working' },
  { id: 'other', label: 'Other', description: 'Something else' },
];

const SEVERITY_LEVELS = [
  { id: 'low', label: 'Low', icon: Info, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 'medium', label: 'Medium', icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { id: 'high', label: 'High', icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { id: 'critical', label: 'Critical', icon: Bug, color: 'text-red-500', bg: 'bg-red-500/10' },
];

const ReportBugTab = () => {
  const [bugType, setBugType] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!bugType || !title || !description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Bug report submitted successfully! We\'ll look into it.');
    
    // Reset form
    setBugType('');
    setTitle('');
    setDescription('');
    setSteps('');
    setIsSubmitting(false);
  };

  const isFormValid = bugType && title && description;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
            <Bug className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold">Report a Bug</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Help us improve by reporting issues you encounter
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pr-1 sm:pr-2 space-y-4 sm:space-y-5">
        {/* Bug Type */}
        <div className="space-y-2 sm:space-y-3">
          <label className="block text-xs sm:text-sm font-semibold">
            Bug Type <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {BUG_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setBugType(type.id)}
                className={cn(
                  'flex flex-col items-start p-3 sm:p-4 rounded-xl transition-all duration-200',
                  'border-2 text-left',
                  bugType === type.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-card hover:border-primary/30 hover:bg-accent/50'
                )}
              >
                <span className={cn(
                  'text-sm font-medium',
                  bugType === type.id ? 'text-primary' : 'text-foreground'
                )}>
                  {type.label}
                </span>
                <span className="text-xs text-muted-foreground mt-0.5">
                  {type.description}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Severity Level */}
        <div className="space-y-2 sm:space-y-3">
          <label className="block text-xs sm:text-sm font-semibold">
            Severity Level
          </label>
          <div className="grid grid-cols-4 gap-2">
            {SEVERITY_LEVELS.map((level) => {
              const Icon = level.icon;
              return (
                <button
                  key={level.id}
                  onClick={() => setSeverity(level.id)}
                  className={cn(
                    'flex flex-col items-center gap-1.5 p-2.5 sm:p-3 rounded-xl transition-all duration-200',
                    'border-2',
                    severity === level.id
                      ? `border-current ${level.bg} ${level.color}`
                      : 'border-border bg-card hover:border-primary/30'
                  )}
                >
                  <Icon className={cn(
                    'w-4 h-4 sm:w-5 sm:h-5',
                    severity === level.id ? level.color : 'text-muted-foreground'
                  )} />
                  <span className={cn(
                    'text-xs font-medium',
                    severity === level.id ? level.color : 'text-muted-foreground'
                  )}>
                    {level.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label className="block text-xs sm:text-sm font-semibold">
            Bug Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Brief description of the issue"
            className={cn(
              'w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-200 text-sm',
              'bg-muted border border-border',
              'placeholder:text-muted-foreground',
              'focus:outline-none focus:border-primary/50 focus:shadow-glow'
            )}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-xs sm:text-sm font-semibold">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the bug in detail. What happened? What did you expect to happen?"
            rows={4}
            className={cn(
              'w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-200 text-sm resize-none',
              'bg-muted border border-border',
              'placeholder:text-muted-foreground',
              'focus:outline-none focus:border-primary/50 focus:shadow-glow'
            )}
          />
        </div>

        {/* Steps to Reproduce */}
        <div className="space-y-2">
          <label className="block text-xs sm:text-sm font-semibold">
            Steps to Reproduce <span className="text-muted-foreground font-normal">(optional)</span>
          </label>
          <textarea
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
            placeholder="1. Go to...&#10;2. Click on...&#10;3. See error..."
            rows={3}
            className={cn(
              'w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-200 text-sm resize-none',
              'bg-muted border border-border',
              'placeholder:text-muted-foreground',
              'focus:outline-none focus:border-primary/50 focus:shadow-glow'
            )}
          />
        </div>

        {/* Contact Email */}
        <div className="space-y-2">
          <label className="block text-xs sm:text-sm font-semibold">
            Your Email <span className="text-muted-foreground font-normal">(for follow-up)</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className={cn(
              'w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-200 text-sm',
              'bg-muted border border-border',
              'placeholder:text-muted-foreground',
              'focus:outline-none focus:border-primary/50 focus:shadow-glow'
            )}
          />
        </div>

        {/* Support Contact Info */}
        <div className={cn(
          'p-4 rounded-xl',
          'bg-muted/50 border border-border'
        )}>
          <p className="text-xs text-muted-foreground">
            Need immediate assistance? Email us directly at{' '}
            <a 
              href="mailto:support@aisorix.com" 
              className="text-primary hover:underline font-medium"
            >
              support@aisorix.com
            </a>
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4 sm:pt-6 mt-auto">
        <button
          onClick={handleSubmit}
          disabled={!isFormValid || isSubmitting}
          className={cn(
            'w-full py-2.5 sm:py-3 rounded-xl font-medium text-sm sm:text-base transition-all duration-200',
            'flex items-center justify-center gap-2',
            isFormValid && !isSubmitting
              ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:shadow-lg'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          )}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit Bug Report
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ReportBugTab;