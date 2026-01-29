import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import { cn } from '@/lib/utils';

interface HealthDataPoint {
  label: string;
  value: number;
  normal_min?: number;
  normal_max?: number;
  unit?: string;
  status?: 'normal' | 'high' | 'low' | 'critical';
}

interface HealthChartData {
  type: 'bar' | 'line' | 'gauge';
  title: string;
  data: HealthDataPoint[];
}

interface HealthAnalysisChartProps {
  chartData: HealthChartData;
}

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'normal':
      return 'hsl(var(--chart-2))'; // Green
    case 'high':
      return 'hsl(var(--chart-4))'; // Orange/Yellow
    case 'low':
      return 'hsl(var(--chart-3))'; // Blue
    case 'critical':
      return 'hsl(var(--destructive))'; // Red
    default:
      return 'hsl(var(--primary))';
  }
};

const getStatusEmoji = (status?: string) => {
  switch (status) {
    case 'normal':
      return '✅';
    case 'high':
      return '📈';
    case 'low':
      return '📉';
    case 'critical':
      return '🔴';
    default:
      return '📊';
  }
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as HealthDataPoint;
    return (
      <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
        <p className="font-medium text-foreground">{data.label}</p>
        <p className="text-primary font-bold">
          {data.value} {data.unit || ''}
        </p>
        {data.normal_min !== undefined && data.normal_max !== undefined && (
          <p className="text-xs text-muted-foreground">
            Normal: {data.normal_min} - {data.normal_max} {data.unit || ''}
          </p>
        )}
        <p className="text-xs mt-1">
          {getStatusEmoji(data.status)} {data.status?.toUpperCase() || 'N/A'}
        </p>
      </div>
    );
  }
  return null;
};

const HealthAnalysisChart: React.FC<HealthAnalysisChartProps> = ({ chartData }) => {
  const { type, title, data } = chartData;

  if (type === 'gauge') {
    // Render gauge-style indicators for single values
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl p-4 my-4"
      >
        <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <span>📊</span> {title}
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {data.map((item, index) => {
            const percentage = item.normal_max 
              ? Math.min((item.value / item.normal_max) * 100, 150) 
              : 50;
            
            return (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-muted/50 rounded-lg p-3 relative overflow-hidden"
              >
                <div 
                  className="absolute bottom-0 left-0 right-0 opacity-20 transition-all"
                  style={{ 
                    height: `${Math.min(percentage, 100)}%`,
                    backgroundColor: getStatusColor(item.status)
                  }}
                />
                <div className="relative z-10">
                  <p className="text-xs text-muted-foreground truncate">{item.label}</p>
                  <p className="text-lg font-bold" style={{ color: getStatusColor(item.status) }}>
                    {item.value}
                    <span className="text-xs font-normal ml-1">{item.unit}</span>
                  </p>
                  <p className="text-xs">
                    {getStatusEmoji(item.status)} {item.status}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  // Bar chart (default)
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-4 my-4"
    >
      <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
        <span>📊</span> {title}
      </h4>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(var(--chart-2))' }} />
          <span>Normal</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(var(--chart-4))' }} />
          <span>High</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(var(--chart-3))' }} />
          <span>Low</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(var(--destructive))' }} />
          <span>Critical</span>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis 
              dataKey="label" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getStatusColor(entry.status)} />
              ))}
            </Bar>
            {/* Reference lines for normal range if available */}
            {data[0]?.normal_min && (
              <ReferenceLine 
                y={data[0].normal_min} 
                stroke="hsl(var(--chart-2))" 
                strokeDasharray="5 5"
                label={{ value: 'Min', fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              />
            )}
            {data[0]?.normal_max && (
              <ReferenceLine 
                y={data[0].normal_max} 
                stroke="hsl(var(--chart-2))" 
                strokeDasharray="5 5"
                label={{ value: 'Max', fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default HealthAnalysisChart;
