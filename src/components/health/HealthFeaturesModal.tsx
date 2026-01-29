import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Stethoscope, Pill, TestTube, Dog, Brain, BarChart3, Image, FileSearch, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HealthFeaturesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnableHealthMode: (analysisType: 'general' | 'prescription' | 'lab_report' | 'veterinary') => void;
}

const features = [
  {
    icon: Stethoscope,
    title: 'General Health Q&A',
    description: 'Ask any health question for humans or animals',
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
  },
  {
    icon: Pill,
    title: 'Prescription Analysis',
    description: 'Decode medications, dosages & interactions',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    icon: TestTube,
    title: 'Lab Report Interpretation',
    description: 'Understand blood work, urinalysis & more',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Dog,
    title: 'Veterinary Support',
    description: 'Pet health, nutrition & behavioral guidance',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    icon: Image,
    title: 'Medical Image Analysis',
    description: 'Upload X-rays, skin conditions, symptoms',
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
  },
  {
    icon: BarChart3,
    title: 'Visual Health Charts',
    description: 'Auto-generated graphs for lab values',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: FileSearch,
    title: 'Document Parsing',
    description: 'Upload PDFs, images of prescriptions',
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
  },
  {
    icon: Brain,
    title: 'AI-Powered Insights',
    description: 'GPT-4o multimodal health analysis',
    color: 'text-pink-500',
    bg: 'bg-pink-500/10',
  },
];

const analysisTypes = [
  {
    id: 'general' as const,
    label: 'General Health',
    emoji: '🩺',
    description: 'Ask any health-related question',
    color: 'from-rose-500 to-pink-500',
    borderColor: 'border-rose-500/50',
    bgColor: 'bg-rose-500/10',
  },
  {
    id: 'prescription' as const,
    label: 'Prescription',
    emoji: '💊',
    description: 'Analyze medications & dosages',
    color: 'from-purple-500 to-violet-500',
    borderColor: 'border-purple-500/50',
    bgColor: 'bg-purple-500/10',
  },
  {
    id: 'lab_report' as const,
    label: 'Lab Report',
    emoji: '🧪',
    description: 'Interpret blood work & tests',
    color: 'from-blue-500 to-cyan-500',
    borderColor: 'border-blue-500/50',
    bgColor: 'bg-blue-500/10',
  },
  {
    id: 'veterinary' as const,
    label: 'Veterinary',
    emoji: '🐾',
    description: 'Pet health & care guidance',
    color: 'from-amber-500 to-orange-500',
    borderColor: 'border-amber-500/50',
    bgColor: 'bg-amber-500/10',
  },
];

const HealthFeaturesModal: React.FC<HealthFeaturesModalProps> = ({
  isOpen,
  onClose,
  onEnableHealthMode,
}) => {
  const [selectedType, setSelectedType] = useState<'general' | 'prescription' | 'lab_report' | 'veterinary'>('general');

  const modalUi = useMemo(
    () => (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]"
            />

            {/* Modal - Properly centered like Projects modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={cn(
                // Fixed center positioning
                'fixed inset-0 m-auto',
                // Responsive sizing matching Projects modal
                'w-[90vw] sm:w-[85vw] md:w-[720px] lg:w-[800px]',
                'h-auto max-h-[85vh]',
                'bg-card border border-border rounded-2xl shadow-2xl z-[1000]',
                'flex flex-col overflow-hidden'
              )}
            >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-gradient-to-r from-rose-500/10 to-pink-500/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Sorix Health</h2>
                  <p className="text-xs text-muted-foreground">AI Medical & Veterinary Assistant</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Intro */}
              <div className="mb-6 text-center">
                <p className="text-sm text-muted-foreground">
                  🏥 Professional health analysis for humans and pets. Upload prescriptions, lab reports, or ask any health question.
                </p>
              </div>
              
              {/* Analysis Type Selector */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">1</span>
                  Select Analysis Type
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {analysisTypes.map((type) => (
                    <motion.button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        'relative p-4 rounded-xl border-2 transition-all duration-200 text-left',
                        selectedType === type.id
                          ? cn(type.borderColor, type.bgColor)
                          : 'border-border hover:border-muted-foreground/30 hover:bg-muted/30'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{type.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm text-foreground">{type.label}</h4>
                            {selectedType === type.id && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className={cn(
                                  'w-4 h-4 rounded-full bg-gradient-to-r flex items-center justify-center',
                                  type.color
                                )}
                              >
                                <Check className="w-2.5 h-2.5 text-white" />
                              </motion.div>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{type.description}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
              
              {/* Features Grid */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">2</span>
                  What Sorix Health Can Do
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', feature.bg)}>
                        <feature.icon className={cn('w-4 h-4', feature.color)} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-medium text-foreground">{feature.title}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Disclaimer */}
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-xs text-amber-600 dark:text-amber-400 text-center">
                  ⚠️ <strong>Disclaimer:</strong> AI provides general information only. Always consult healthcare professionals for medical decisions.
                </p>
              </div>
            </div>
            
            {/* Footer */}
            <div className="px-6 py-4 border-t border-border bg-muted/30">
              <motion.button
                onClick={() => {
                  onEnableHealthMode(selectedType);
                  onClose();
                }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transition-all flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4" />
                Start {analysisTypes.find(t => t.id === selectedType)?.label} Analysis
              </motion.button>
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    ),
    [isOpen, onClose, onEnableHealthMode, selectedType]
  );

  // Ensure the modal is not affected by any ancestor's overflow/transform.
  if (typeof document === 'undefined') return modalUi;
  return createPortal(modalUi, document.body);
};

export default HealthFeaturesModal;
