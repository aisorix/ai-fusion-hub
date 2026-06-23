// Bangla safety warning banner shown on Sorix Health & Sorix Agro pages.
// Highlighted, dismissible per-session (re-shows on next visit) and
// designed to read clearly on both mobile and desktop.
import React, { useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface SafetyWarningBannerProps {
  kind: 'health' | 'agro';
}

const COPY = {
  health: {
    title: '⚠️ চিকিৎসা সতর্কতা',
    body: 'ডাক্তারের অনুমতি ছাড়া কোনো ঔষধ বা চিকিৎসা গ্রহণ করবেন না। Sorix Health শুধুমাত্র তথ্যমূলক সহায়তা প্রদান করে — চূড়ান্ত সিদ্ধান্ত একজন রেজিস্টার্ড পেশাদার চিকিৎসকের পরামর্শ অনুযায়ী নিন।',
  },
  agro: {
    title: '⚠️ কৃষি সতর্কতা',
    body: 'কৃষি বিশেষজ্ঞের অনুমতি ছাড়া কোনো কীটনাশক, সার বা চিকিৎসা প্রয়োগ করবেন না। Sorix Agro শুধুমাত্র তথ্যমূলক সহায়তা প্রদান করে — চূড়ান্ত সিদ্ধান্ত একজন স্থানীয় কৃষি বিশেষজ্ঞের পরামর্শ অনুযায়ী নিন।',
  },
} as const;

const STORAGE_PREFIX = 'sorix-safety-banner-dismissed:';

const SafetyWarningBanner: React.FC<SafetyWarningBannerProps> = ({ kind }) => {
  const storageKey = `${STORAGE_PREFIX}${kind}`;
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      setDismissed(sessionStorage.getItem(storageKey) === '1');
    } catch {/* */}
  }, [storageKey]);

  if (dismissed) return null;

  const { title, body } = COPY[kind];

  return (
    <div
      role="alert"
      className="mx-3 sm:mx-4 md:mx-6 mt-3 mb-2 rounded-xl border-2 border-amber-400/60 dark:border-amber-500/40 bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-rose-950/40 shadow-sm"
    >
      <div className="flex items-start gap-3 p-3 sm:p-3.5">
        <div className="shrink-0 w-9 h-9 rounded-lg bg-amber-500/15 dark:bg-amber-500/20 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" strokeWidth={2.4} />
        </div>
        <div className="flex-1 min-w-0" lang="bn">
          <p className="text-[13px] sm:text-sm font-extrabold text-amber-900 dark:text-amber-200 leading-tight">
            {title}
          </p>
          <p className="mt-1 text-[12px] sm:text-[13px] leading-relaxed text-amber-950/90 dark:text-amber-100/90">
            {body}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            try { sessionStorage.setItem(storageKey, '1'); } catch {/* */}
            setDismissed(true);
          }}
          className="shrink-0 p-1.5 rounded-md text-amber-700/70 hover:text-amber-900 hover:bg-amber-500/10 dark:text-amber-300/70 dark:hover:text-amber-100 transition-colors"
          aria-label="Dismiss warning"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SafetyWarningBanner;
