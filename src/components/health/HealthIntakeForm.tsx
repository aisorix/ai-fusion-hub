import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Upload, X, FileText, Image as ImageIcon, Loader2,
  User, Baby, Heart, Stethoscope, Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { PatientData } from '@/pages/HealthPage';

interface HealthIntakeFormProps {
  onSubmit: (data: PatientData) => void;
  isLoading: boolean;
}

const categories = [
  { id: 'men', label: 'Men', icon: User, color: 'from-blue-500 to-indigo-600' },
  { id: 'women', label: 'Women', icon: Heart, color: 'from-pink-500 to-rose-600' },
  { id: 'kids', label: 'Kids', icon: Baby, color: 'from-amber-400 to-orange-500' },
  { id: 'pregnant', label: 'Pregnant', icon: Activity, color: 'from-purple-500 to-violet-600' },
] as const;

const HealthIntakeForm: React.FC<HealthIntakeFormProps> = ({ onSubmit, isLoading }) => {
  const [symptoms, setSymptoms] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [patientCategory, setPatientCategory] = useState<'men' | 'women' | 'kids' | 'pregnant'>('men');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [height, setHeight] = useState('');
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm');
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const valid = newFiles.filter(f => f.size <= 10 * 1024 * 1024);
    setFiles(prev => [...prev, ...valid]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const newFiles = Array.from(e.dataTransfer.files).filter(f => f.size <= 10 * 1024 * 1024);
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleSubmit = async () => {
    // Convert files to base64
    const fileContents = await Promise.all(
      files.map(async (file) => {
        const buffer = await file.arrayBuffer();
        const base64 = btoa(
          new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        return {
          name: file.name,
          type: file.type,
          base64: `data:${file.type};base64,${base64}`,
        };
      })
    );

    onSubmit({
      symptoms,
      gender,
      patientCategory,
      age: parseInt(age) || 0,
      weight: parseFloat(weight) || 0,
      weightUnit,
      height: parseFloat(height) || 0,
      heightUnit,
      files,
      fileContents,
    });
  };

  const isValid = symptoms.trim().length > 0;

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6">
      {/* Title */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-lg"
        >
          <Stethoscope className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-foreground">Tell us about your health concern</h2>
        <p className="text-sm text-muted-foreground">
          Describe symptoms, upload prescriptions or lab reports for AI analysis
        </p>
      </div>

      {/* Patient Category */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Patient Category</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = patientCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setPatientCategory(cat.id)}
                className={cn(
                  'relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border hover:border-primary/30 hover:bg-muted/50'
                )}
              >
                <div className={cn('w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center', cat.color)}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-foreground">{cat.label}</span>
                {isSelected && (
                  <motion.div
                    layoutId="category-indicator"
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                  >
                    <span className="text-[10px] text-primary-foreground">✓</span>
                  </motion.div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Symptoms */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Symptoms & Concerns *</label>
        <Textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="Describe your symptoms, medical concerns, or what you'd like analyzed...&#10;&#10;Examples:&#10;• I have headaches and fever for 3 days&#10;• Please analyze my blood test report&#10;• What does this prescription mean?&#10;• My child has a rash on the arms"
          className="min-h-[140px] bg-card border-border"
        />
      </div>

      {/* Patient Info Grid */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Patient Information</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Gender */}
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Gender</span>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as any)}
              className="w-full h-10 rounded-md border border-input bg-card px-3 text-sm"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Age */}
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Age</span>
            <Input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="25"
              className="bg-card"
            />
          </div>

          {/* Weight */}
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Weight</span>
            <div className="flex gap-1">
              <Input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="70"
                className="bg-card flex-1"
              />
              <select
                value={weightUnit}
                onChange={(e) => setWeightUnit(e.target.value as any)}
                className="w-16 h-10 rounded-md border border-input bg-card px-1 text-xs"
              >
                <option value="kg">kg</option>
                <option value="lbs">lbs</option>
              </select>
            </div>
          </div>

          {/* Height */}
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Height</span>
            <div className="flex gap-1">
              <Input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="170"
                className="bg-card flex-1"
              />
              <select
                value={heightUnit}
                onChange={(e) => setHeightUnit(e.target.value as any)}
                className="w-16 h-10 rounded-md border border-input bg-card px-1 text-xs"
              >
                <option value="cm">cm</option>
                <option value="ft">ft</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Upload Documents <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors"
        >
          <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-foreground font-medium">
            Drop files here or click to browse
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Prescriptions, lab reports, medical images • JPG, PNG, PDF • Max 10MB
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border"
              >
                {file.type.startsWith('image/') ? (
                  <ImageIcon className="w-5 h-5 text-primary shrink-0" />
                ) : (
                  <FileText className="w-5 h-5 text-primary shrink-0" />
                )}
                <span className="text-sm text-foreground truncate flex-1">{file.name}</span>
                <span className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(1)} MB
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                  className="w-6 h-6 rounded-full hover:bg-destructive/10 flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={!isValid || isLoading}
        className="w-full h-12 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold text-base"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Analyzing...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5" />
            Start Analysis
          </span>
        )}
      </Button>
    </div>
  );
};

export default HealthIntakeForm;
