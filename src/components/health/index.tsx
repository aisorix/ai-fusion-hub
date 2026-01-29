// Health Components Stub
// Placeholder for health-related components

import React from 'react';

// Health Analysis Chart - placeholder
interface ChartData {
  type: string;
  title: string;
  data: any;
}

export const HealthAnalysisChart: React.FC<{ chartData: ChartData }> = ({ chartData }) => {
  return (
    <div className="p-4 rounded-lg bg-muted border border-border my-4">
      <h4 className="font-semibold text-sm mb-2">{chartData.title}</h4>
      <p className="text-xs text-muted-foreground">
        Chart visualization for health data will be available soon.
      </p>
    </div>
  );
};

type HealthAnalysisType = 'general' | 'prescription' | 'lab_report' | 'veterinary';

// Health Features Modal - placeholder
export const HealthFeaturesModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSelectFeature?: (type: string) => void;
  onEnableHealthMode?: (type: HealthAnalysisType) => void;
}> = ({ isOpen, onClose, onSelectFeature, onEnableHealthMode }) => {
  if (!isOpen) return null;
  
  const handleSelect = (type: HealthAnalysisType) => {
    if (onEnableHealthMode) {
      onEnableHealthMode(type);
    }
    if (onSelectFeature) {
      onSelectFeature(type);
    }
    onClose();
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Health Analysis</h3>
        <div className="space-y-2">
          <button
            onClick={() => handleSelect('general')}
            className="w-full p-3 text-left rounded-lg hover:bg-muted transition-colors"
          >
            General Health Analysis
          </button>
          <button
            onClick={() => handleSelect('prescription')}
            className="w-full p-3 text-left rounded-lg hover:bg-muted transition-colors"
          >
            Prescription Analysis
          </button>
          <button
            onClick={() => handleSelect('lab_report')}
            className="w-full p-3 text-left rounded-lg hover:bg-muted transition-colors"
          >
            Lab Report Analysis
          </button>
          <button
            onClick={() => handleSelect('veterinary')}
            className="w-full p-3 text-left rounded-lg hover:bg-muted transition-colors"
          >
            Veterinary Analysis
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full p-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default {
  HealthAnalysisChart,
  HealthFeaturesModal,
};
