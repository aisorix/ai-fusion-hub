import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, Check, X, Loader2, RotateCcw, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { ExtractedTest } from '@/pages/HealthPage';

interface HealthTestReviewProps {
  tests: ExtractedTest[];
  onConfirm: (tests: ExtractedTest[]) => void;
  onStartOver: () => void;
  isLoading: boolean;
}

const categoryColors = {
  necessary: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-600 dark:text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' },
  optional: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-600 dark:text-amber-400', badge: 'bg-amber-500/20 text-amber-700 dark:text-amber-300' },
  unnecessary: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-600 dark:text-red-400', badge: 'bg-red-500/20 text-red-700 dark:text-red-300' },
};

const HealthTestReview: React.FC<HealthTestReviewProps> = ({ tests: initialTests, onConfirm, onStartOver, isLoading }) => {
  const [tests, setTests] = useState<ExtractedTest[]>(initialTests);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCost, setEditCost] = useState('');

  const totalCost = tests.reduce((sum, t) => sum + t.cost, 0);
  const necessaryCost = tests.filter(t => t.category === 'necessary').reduce((sum, t) => sum + t.cost, 0);

  const startEdit = (test: ExtractedTest) => {
    setEditingId(test.id);
    setEditName(test.name);
    setEditCost(String(test.cost));
  };

  const saveEdit = () => {
    if (!editingId) return;
    setTests(prev => prev.map(t =>
      t.id === editingId ? { ...t, name: editName, cost: parseFloat(editCost) || 0 } : t
    ));
    setEditingId(null);
  };

  const removeTest = (id: string) => {
    setTests(prev => prev.filter(t => t.id !== id));
  };

  const addTest = () => {
    const newTest: ExtractedTest = {
      id: `test-${Date.now()}`,
      name: 'New Test',
      cost: 0,
      category: 'optional',
      explanation: '',
    };
    setTests(prev => [...prev, newTest]);
    startEdit(newTest);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Review Extracted Tests</h2>
        <p className="text-sm text-muted-foreground">
          We found {tests.length} tests from your documents. You can edit, add, or remove tests before final analysis.
        </p>
      </div>

      {/* Cost Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground">Total Cost</p>
          <p className="text-xl font-bold text-foreground">৳{totalCost.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
          <p className="text-xs text-muted-foreground">Necessary Only</p>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">৳{necessaryCost.toLocaleString()}</p>
        </div>
      </div>

      {/* Test List */}
      <div className="space-y-2">
        {tests.map((test, index) => {
          const colors = categoryColors[test.category];
          const isEditing = editingId === test.id;

          return (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                'flex items-center gap-3 p-3 rounded-xl border transition-colors',
                colors.bg, colors.border
              )}
            >
              <div className={cn('w-1.5 h-10 rounded-full', test.category === 'necessary' ? 'bg-emerald-500' : test.category === 'optional' ? 'bg-amber-500' : 'bg-red-500')} />

              {isEditing ? (
                <>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 h-8 text-sm bg-background"
                  />
                  <Input
                    type="number"
                    value={editCost}
                    onChange={(e) => setEditCost(e.target.value)}
                    className="w-24 h-8 text-sm bg-background"
                    placeholder="Cost"
                  />
                  <button onClick={saveEdit} className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center hover:bg-emerald-500/30">
                    <Check className="w-4 h-4 text-emerald-600" />
                  </button>
                  <button onClick={() => setEditingId(null)} className="w-7 h-7 rounded-lg bg-red-500/20 flex items-center justify-center hover:bg-red-500/30">
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                </>
              ) : (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{test.name}</p>
                    <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium', colors.badge)}>
                      {test.category}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-foreground whitespace-nowrap">৳{test.cost.toLocaleString()}</span>
                  <button onClick={() => startEdit(test)} className="w-7 h-7 rounded-lg hover:bg-muted flex items-center justify-center">
                    <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                  <button onClick={() => removeTest(test.id)} className="w-7 h-7 rounded-lg hover:bg-destructive/10 flex items-center justify-center">
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </button>
                </>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Add Test */}
      <button
        onClick={addTest}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-border hover:border-primary/40 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Test
      </button>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onStartOver}
          className="flex-1 gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Start Over
        </Button>
        <Button
          onClick={() => onConfirm(tests)}
          disabled={tests.length === 0 || isLoading}
          className="flex-1 gap-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              Confirm & Analyze
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default HealthTestReview;
