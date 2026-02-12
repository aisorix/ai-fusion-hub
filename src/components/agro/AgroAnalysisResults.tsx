import React from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle, CheckCircle2, XCircle, MessageSquare,
  RotateCcw, Pill, Shield, Clock, Leaf, Bug,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { AgroResult } from '@/pages/AgroPage';

interface AgroAnalysisResultsProps {
  result: AgroResult;
  onStartOver: () => void;
  onContinueChat: () => void;
}

const severityConfig = {
  low: { color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/30', label: 'কম (Low)' },
  medium: { color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/30', label: 'মাঝারি (Medium)' },
  high: { color: 'text-orange-500', bg: 'bg-orange-500/10 border-orange-500/30', label: 'বেশি (High)' },
  critical: { color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/30', label: 'গুরুতর (Critical)' },
};

const AgroAnalysisResults: React.FC<AgroAnalysisResultsProps> = ({ result, onStartOver, onContinueChat }) => {
  const sev = severityConfig[result.severity] || severityConfig.medium;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6 pb-24">
      {/* Diagnosis Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-2xl bg-card border border-border"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shrink-0">
            <Bug className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground mb-1">🔬 রোগ নির্ণয় (Diagnosis)</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{result.diagnosis}</p>
          </div>
        </div>
      </motion.div>

      {/* Severity Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className={cn('p-4 rounded-xl border text-center', sev.bg)}
      >
        <p className="text-xs text-muted-foreground mb-1">তীব্রতা (Severity)</p>
        <p className={cn('text-3xl font-extrabold', sev.color)}>{result.severityScore}/100</p>
        <p className={cn('text-sm font-semibold mt-1', sev.color)}>{sev.label}</p>
        <div className="mt-2 w-full h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${result.severityScore}%` }}
            transition={{ duration: 1, delay: 0.3 }}
            className={cn('h-full rounded-full', {
              'bg-emerald-500': result.severity === 'low',
              'bg-amber-500': result.severity === 'medium',
              'bg-orange-500': result.severity === 'high',
              'bg-red-500': result.severity === 'critical',
            })}
          />
        </div>
      </motion.div>

      {/* Causes */}
      {result.causes?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded-2xl bg-card border border-border"
        >
          <h4 className="text-sm font-semibold text-foreground mb-3">⚡ কারণসমূহ (Causes)</h4>
          <ul className="space-y-2">
            {result.causes.map((cause, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                {cause}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Medicines */}
      {result.medicines?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-3"
        >
          <h4 className="text-sm font-semibold text-foreground">💊 ওষুধ ও কীটনাশক (Medicines & Pesticides)</h4>
          {result.medicines.map((med, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className={cn(
                'p-4 rounded-xl bg-card border border-border border-l-4',
                med.isBiological ? 'border-l-emerald-500' : 'border-l-blue-500'
              )}
            >
              <div className="flex items-start gap-3">
                <Pill className={cn('w-5 h-5 shrink-0 mt-0.5', med.isBiological ? 'text-emerald-500' : 'text-blue-500')} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h5 className="text-sm font-semibold text-foreground">{med.name}</h5>
                    <span className="text-sm font-bold text-foreground">৳{med.cost?.toLocaleString() || 'N/A'}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className={cn(
                      'text-[10px] px-2 py-0.5 rounded-full font-medium',
                      med.isBiological ? 'bg-emerald-500/10 text-emerald-600' : 'bg-blue-500/10 text-blue-600'
                    )}>
                      {med.isBiological ? '🌿 Biological' : '🧪 Chemical'}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{med.type}</span>
                  </div>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-1 text-xs text-muted-foreground">
                    <span>📏 মাত্রা: {med.dosage}</span>
                    <span>🔧 প্রয়োগ: {med.applicationMethod}</span>
                    <span>🔄 পুনরাবৃত্তি: {med.frequency}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Prevention Tips */}
      {result.preventionTips?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="p-5 rounded-2xl bg-card border border-border"
        >
          <h4 className="text-sm font-semibold text-foreground mb-3">🛡️ প্রতিরোধমূলক পরামর্শ (Prevention Tips)</h4>
          <ul className="space-y-2">
            {result.preventionTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                {tip}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Alternative Treatments */}
      {result.alternativeTreatments?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20"
        >
          <h4 className="text-sm font-semibold text-foreground mb-3">🌿 জৈব/প্রাকৃতিক বিকল্প (Organic Alternatives)</h4>
          <ul className="space-y-2">
            {result.alternativeTreatments.map((alt, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Leaf className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                {alt}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Timeline */}
      {result.timeline && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="p-5 rounded-2xl bg-card border border-border"
        >
          <h4 className="text-sm font-semibold text-foreground mb-3">⏱️ সময়সীমা (Timeline)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-xs text-muted-foreground">চিকিৎসার সময়কাল</p>
                <p className="text-sm font-medium text-foreground">{result.timeline.treatmentDuration}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <div>
                <p className="text-xs text-muted-foreground">আশানুরূপ সুস্থতা</p>
                <p className="text-sm font-medium text-foreground">{result.timeline.expectedRecovery}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Detailed Analysis */}
      {result.detailedAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-5 rounded-2xl bg-card border border-border"
        >
          <h4 className="text-sm font-semibold text-foreground mb-3">📋 বিস্তারিত বিশ্লেষণ</h4>
          <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {result.detailedAnalysis}
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex gap-3 sticky bottom-4">
        <Button variant="outline" onClick={onStartOver} className="flex-1 gap-2">
          <RotateCcw className="w-4 h-4" />
          নতুন বিশ্লেষণ
        </Button>
        <Button
          onClick={onContinueChat}
          className="flex-1 gap-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white"
        >
          <MessageSquare className="w-4 h-4" />
          আরও প্রশ্ন করুন
        </Button>
      </div>
    </div>
  );
};

export default AgroAnalysisResults;
