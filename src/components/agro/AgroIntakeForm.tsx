import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Upload, X, FileText, Image as ImageIcon, Loader2,
  Leaf, Camera, MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { CropData } from '@/pages/AgroPage';

interface AgroIntakeFormProps {
  onSubmit: (data: CropData) => void;
  isLoading: boolean;
}

const cropTypes = [
  'ধান (Rice)', 'গম (Wheat)', 'ভুট্টা (Maize)', 'পাট (Jute)',
  'শাকসবজি (Vegetables)', 'ফল (Fruits)', 'মরিচ (Chili)', 'পেঁয়াজ (Onion)',
  'রসুন (Garlic)', 'আলু (Potato)', 'টমেটো (Tomato)', 'বেগুন (Brinjal)',
  'আম (Mango)', 'লিচু (Litchi)', 'কলা (Banana)', 'Other',
];

const regions = [
  'ঢাকা (Dhaka)', 'চট্টগ্রাম (Chittagong)', 'রাজশাহী (Rajshahi)',
  'খুলনা (Khulna)', 'বরিশাল (Barishal)', 'সিলেট (Sylhet)',
  'রংপুর (Rangpur)', 'ময়মনসিংহ (Mymensingh)',
];

const seasons = [
  { id: 'kharif1', label: 'খরিফ-১ (Pre-Kharif / Mar-Jun)' },
  { id: 'kharif2', label: 'খরিফ-২ (Kharif / Jul-Oct)' },
  { id: 'rabi', label: 'রবি (Rabi / Nov-Feb)' },
];

const AgroIntakeForm: React.FC<AgroIntakeFormProps> = ({ onSubmit, isLoading }) => {
  const [cropType, setCropType] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [region, setRegion] = useState('');
  const [season, setSeason] = useState('');
  const [landArea, setLandArea] = useState('');
  const [cropAge, setCropAge] = useState('');
  const [previousTreatments, setPreviousTreatments] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

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
      cropType,
      problemDescription,
      region,
      season,
      landArea,
      cropAge,
      previousTreatments,
      files,
      fileContents,
    });
  };

  const isValid = problemDescription.trim().length > 0 || files.length > 0;

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6 pb-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg"
        >
          <Leaf className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-foreground">আপনার ফসলের সমস্যা জানান</h2>
        <p className="text-sm text-muted-foreground">
          ফসলের সমস্যা বর্ণনা করুন, ছবি আপলোড করুন — AI বিশ্লেষণ করবে
        </p>
      </div>

      {/* Crop Type */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">ফসলের ধরন (Crop Type)</label>
        <select
          value={cropType}
          onChange={(e) => setCropType(e.target.value)}
          className="w-full h-11 rounded-xl border border-input bg-card px-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50"
        >
          <option value="">Select crop type...</option>
          {cropTypes.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Problem Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">সমস্যার বিবরণ (Problem Description) *</label>
        <Textarea
          value={problemDescription}
          onChange={(e) => setProblemDescription(e.target.value)}
          placeholder="আপনার ফসলের সমস্যা বর্ণনা করুন...&#10;&#10;উদাহরণ:&#10;• ধানের পাতায় বাদামী দাগ পড়েছে&#10;• গাছের পাতা হলুদ হয়ে যাচ্ছে&#10;• পোকামাকড়ের আক্রমণ&#10;• ফলন কমে যাচ্ছে"
          className="min-h-[120px] bg-card border-border"
        />
      </div>

      {/* Region & Season */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3 h-3" /> এলাকা (Region)
          </span>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full h-10 rounded-md border border-input bg-card px-3 text-sm"
          >
            <option value="">Select region...</option>
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">মৌসুম (Season)</span>
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="w-full h-10 rounded-md border border-input bg-card px-3 text-sm"
          >
            <option value="">Select season...</option>
            {seasons.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {/* Optional Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">জমির পরিমাণ (Land Area)</span>
          <Input
            value={landArea}
            onChange={(e) => setLandArea(e.target.value)}
            placeholder="e.g. 2 bigha"
            className="bg-card"
          />
        </div>
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">ফসলের বয়স (Crop Age)</span>
          <Input
            value={cropAge}
            onChange={(e) => setCropAge(e.target.value)}
            placeholder="e.g. 45 days"
            className="bg-card"
          />
        </div>
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">আগের চিকিৎসা (Previous Treatments)</span>
          <Input
            value={previousTreatments}
            onChange={(e) => setPreviousTreatments(e.target.value)}
            placeholder="e.g. Carbendazim spray"
            className="bg-card"
          />
        </div>
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          ছবি আপলোড করুন <span className="text-muted-foreground font-normal">(optional but recommended)</span>
        </label>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-emerald-500/30 rounded-xl p-6 text-center cursor-pointer hover:border-emerald-500/60 hover:bg-emerald-500/5 transition-colors"
        >
          <Upload className="w-8 h-8 mx-auto text-emerald-500/60 mb-2" />
          <p className="text-sm text-foreground font-medium">
            ফাইল টেনে আনুন বা ক্লিক করুন
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            ফসলের ছবি, মাটির ছবি, পোকামাকড়ের ছবি • JPG, PNG • Max 10MB
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Camera Button */}
        <Button
          variant="outline"
          onClick={() => cameraInputRef.current?.click()}
          className="w-full gap-2 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/5"
        >
          <Camera className="w-4 h-4" />
          ক্যামেরা দিয়ে ছবি তুলুন (Take Photo)
        </Button>
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border"
              >
                {file.type.startsWith('image/') ? (
                  <ImageIcon className="w-5 h-5 text-emerald-500 shrink-0" />
                ) : (
                  <FileText className="w-5 h-5 text-emerald-500 shrink-0" />
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
        className="w-full h-12 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold text-base"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            বিশ্লেষণ করা হচ্ছে... (Analyzing...)
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Leaf className="w-5 h-5" />
            বিশ্লেষণ শুরু করুন (Start Analysis)
          </span>
        )}
      </Button>
    </div>
  );
};

export default AgroIntakeForm;
