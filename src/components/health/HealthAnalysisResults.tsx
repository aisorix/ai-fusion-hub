import React from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign, TrendingDown, CheckCircle2, AlertTriangle, XCircle,
  MessageSquare, RotateCcw, Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import type { AnalysisResult } from '@/pages/HealthPage';

interface HealthAnalysisResultsProps {
  result: AnalysisResult;
  onStartOver: () => void;
  onContinueChat: () => void;
}

const PIE_COLORS = ['#10b981', '#f59e0b', '#ef4444'];

const getFairnessColor = (score: number) => {
  if (score >= 80) return 'text-emerald-500';
  if (score >= 60) return 'text-amber-500';
  if (score >= 40) return 'text-orange-500';
  return 'text-red-500';
};

const getFairnessGradient = (score: number) => {
  if (score >= 80) return 'from-emerald-500 to-teal-400';
  if (score >= 60) return 'from-amber-500 to-yellow-400';
  if (score >= 40) return 'from-orange-500 to-amber-400';
  return 'from-red-500 to-rose-400';
};

const categoryIcon = {
  necessary: CheckCircle2,
  optional: AlertTriangle,
  unnecessary: XCircle,
};

const categoryBorder = {
  necessary: 'border-l-emerald-500',
  optional: 'border-l-amber-500',
  unnecessary: 'border-l-red-500',
};

const HealthAnalysisResults: React.FC<HealthAnalysisResultsProps> = ({ result, onStartOver, onContinueChat }) => {
  const barData = [
    { name: 'Total Cost', value: result.totalCost, fill: 'hsl(var(--primary))' },
    { name: 'Necessary', value: result.necessaryCost, fill: '#10b981' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6 pb-20">
      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-2xl bg-card border border-border"
      >
        <h3 className="text-lg font-bold text-foreground mb-2">📋 Analysis Summary</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
      </motion.div>

      {/* Cost Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-xl bg-card border border-border"
        >
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Total Cost</span>
          </div>
          <p className="text-2xl font-bold text-foreground">৳{result.totalCost.toLocaleString()}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20"
        >
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-xs text-muted-foreground">Necessary Cost</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">৳{result.necessaryCost.toLocaleString()}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20"
        >
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="w-4 h-4 text-amber-500" />
            <span className="text-xs text-muted-foreground">Potential Savings</span>
          </div>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">৳{result.savings.toLocaleString()}</p>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="p-5 rounded-2xl bg-card border border-border"
        >
          <h4 className="text-sm font-semibold text-foreground mb-3">Test Category Distribution</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={result.categoryDistribution}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {result.categoryDistribution.map((entry, index) => (
                  <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value} tests`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {result.categoryDistribution.map((entry, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                <span className="text-muted-foreground">{entry.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="p-5 rounded-2xl bg-card border border-border"
        >
          <h4 className="text-sm font-semibold text-foreground mb-3">Cost Comparison</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} barGap={8}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => [`৳${value.toLocaleString()}`, '']} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Fairness Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="p-5 rounded-2xl bg-card border border-border text-center"
      >
        <h4 className="text-sm font-semibold text-foreground mb-3">Prescription Fairness Score</h4>
        <div className="flex items-center justify-center gap-4">
          <div className={cn('text-5xl font-extrabold', getFairnessColor(result.fairnessScore))}>
            {result.fairnessScore}
          </div>
          <div className="text-left">
            <span className={cn(
              'text-xs font-semibold px-2.5 py-1 rounded-full bg-gradient-to-r text-white',
              getFairnessGradient(result.fairnessScore)
            )}>
              {result.fairnessLabel}
            </span>
            <p className="text-xs text-muted-foreground mt-1">out of 100</p>
          </div>
        </div>
        <div className="mt-3 w-full h-2.5 rounded-full bg-muted overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${result.fairnessScore}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className={cn('h-full rounded-full bg-gradient-to-r', getFairnessGradient(result.fairnessScore))}
          />
        </div>
      </motion.div>

      {/* Detailed Analysis */}
      {result.detailedAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-5 rounded-2xl bg-card border border-border"
        >
          <h4 className="text-sm font-semibold text-foreground mb-3">🔬 Detailed Analysis</h4>
          <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {result.detailedAnalysis}
          </div>
        </motion.div>
      )}

      {/* Test Detail Cards */}
      {result.tests.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Test Details</h4>
          {result.tests.map((test, i) => {
            const Icon = categoryIcon[test.category];
            return (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className={cn(
                  'p-4 rounded-xl bg-card border border-border border-l-4',
                  categoryBorder[test.category]
                )}
              >
                <div className="flex items-start gap-3">
                  <Icon className={cn(
                    'w-5 h-5 mt-0.5 shrink-0',
                    test.category === 'necessary' ? 'text-emerald-500' : test.category === 'optional' ? 'text-amber-500' : 'text-red-500'
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h5 className="text-sm font-semibold text-foreground">{test.name}</h5>
                      <span className="text-sm font-bold text-foreground whitespace-nowrap">৳{test.cost.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{test.explanation}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 sticky bottom-4">
        <Button variant="outline" onClick={onStartOver} className="flex-1 gap-2">
          <RotateCcw className="w-4 h-4" />
          New Analysis
        </Button>
        <Button
          onClick={onContinueChat}
          className="flex-1 gap-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white"
        >
          <MessageSquare className="w-4 h-4" />
          Ask Follow-up Questions
        </Button>
      </div>
    </div>
  );
};

export default HealthAnalysisResults;
