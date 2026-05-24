import React, { useState, useCallback, useRef } from 'react';
import { useAutoFocusInput } from '@/hooks/useAutoFocusInput';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Mic, Send, X, Image as ImageIcon, Paperclip, Square, Sparkles, Camera, Loader2, Upload, Heart, Settings2 } from 'lucide-react';
import VoiceDictationButton from '@/components/voice/VoiceDictationButton';
import TextareaAutosize from 'react-textarea-autosize';
import { isSubmitEnter } from '@/lib/inputHelpers';
import { useChatStore } from '@/stores/chatStore';
import { cn } from '@/lib/utils';
import { translations } from '@/lib/translations';
import { parseFile, getAcceptedFileTypes, getFileType } from '@/lib/fileParser';
import FileChip from './FileChip';
import { HealthFeaturesModal } from '@/components/health';
import { toast } from 'sonner';
import ToolsMenu from './ToolsMenu';

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
  onOpenVoiceMode?: () => void;
  onStop?: () => void;
}

const ChatInput = ({ onSend, disabled, onOpenVoiceMode, onStop }: ChatInputProps) => {
  const [input, setInput] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [parseProgress, setParseProgress] = useState({ current: 0, total: 0, fileName: '' });
  const [isDragOver, setIsDragOver] = useState(false);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  
  const {
    isStreaming,
    pendingAttachments,
    addAttachment,
    removeAttachment,
    language,
    user,
    isHealthMode,
    healthAnalysisType,
    setHealthMode,
    setHealthAnalysisType
  } = useChatStore();

  // File size limits by plan (in bytes)
  const FILE_SIZE_LIMITS: Record<string, number> = {
    free: 1 * 1024 * 1024,      // 1 MB
    basic: 5 * 1024 * 1024,     // 5 MB
    pro: 10 * 1024 * 1024,      // 10 MB
    premium: 15 * 1024 * 1024,  // 15 MB
  };

  const getFileSizeLimit = useCallback(() => {
    return FILE_SIZE_LIMITS[user.plan] || FILE_SIZE_LIMITS.free;
  }, [user.plan]);

  const formatSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
  };

  const validateFileSize = useCallback((file: File): { valid: boolean; message?: string } => {
    const limit = getFileSizeLimit();
    if (file.size > limit) {
      const planNames: Record<string, string> = {
        free: 'Free',
        basic: 'Basic', 
        pro: 'Pro',
        premium: 'Premium'
      };
      return {
        valid: false,
        message: `${file.name} (${formatSize(file.size)}) exceeds your ${planNames[user.plan]} plan limit of ${formatSize(limit)}. Upgrade for larger files!`
      };
    }
    return { valid: true };
  }, [getFileSizeLimit, user.plan]);
  
  const t = translations[language as keyof typeof translations] || translations.en;

  useAutoFocusInput(
    textareaRef,
    [pendingAttachments.length, isParsing, isStreaming, showAttachMenu, showToolsMenu],
    isCameraActive || showHealthModal || !!disabled,
    true,
  );
  
  const handleSend = useCallback(() => {
    if (isStreaming || disabled || isParsing) return;
    if (!input.trim() && pendingAttachments.length === 0) return;
    
    onSend(input);
    setInput('');
    setShowAttachMenu(false);
    textareaRef.current?.focus();
  }, [input, isStreaming, disabled, isParsing, pendingAttachments.length, onSend]);
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (isSubmitEnter(e)) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  // Handle paste for clipboard images (supports multiple images)
  const handlePaste = useCallback(async (e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items);
    const imageItems = items.filter(item => item.type.startsWith('image/'));
    
    if (imageItems.length === 0) return; // Let normal paste happen for text
    
    e.preventDefault(); // Prevent default only if we have images
    
    if (isStreaming || disabled) {
      toast.error('Cannot paste while processing');
      return;
    }
    
    setIsParsing(true);
    
    const baseTimestamp = Date.now();
    let successCount = 0;
    let failCount = 0;
    let sizeExceededCount = 0;
    
    // Process all images in parallel for better performance
    const promises = imageItems.map(async (item, index) => {
      const file = item.getAsFile();
      if (!file) return;
      
      // Validate file size
      const sizeCheck = validateFileSize(file);
      if (!sizeCheck.valid) {
        sizeExceededCount++;
        return;
      }
      
      try {
        const parsed = await parseFile(file);
        addAttachment({
          type: 'image',
          url: parsed.content,
          name: `pasted-image-${baseTimestamp}-${index + 1}.png`,
          size: file.size,
          parsedContent: undefined,
          fileType: 'image'
        });
        successCount++;
      } catch (error) {
        console.error('Error processing pasted image:', error);
        failCount++;
      }
    });
    
    await Promise.all(promises);
    
    // Show appropriate toast messages
    if (successCount > 0) {
      if (successCount === 1) {
        toast.success('Image pasted from clipboard');
      } else {
        toast.success(`${successCount} images pasted from clipboard`);
      }
    }
    
    if (sizeExceededCount > 0) {
      const limit = getFileSizeLimit();
      toast.error(
        `${sizeExceededCount} image${sizeExceededCount > 1 ? 's' : ''} exceeded the ${formatSize(limit)} limit for your plan`,
        { duration: 5000 }
      );
    }
    
    if (failCount > 0) {
      toast.error(`Failed to process ${failCount} image${failCount > 1 ? 's' : ''}`);
    }
    
    setIsParsing(false);
  }, [isStreaming, disabled, addAttachment, validateFileSize, getFileSizeLimit]);

  // Process dropped or selected files
  const processFiles = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    
    setIsParsing(true);
    setParseProgress({ current: 0, total: files.length, fileName: '' });
    
    let skippedCount = 0;
    let processedCount = 0;
    
    for (const file of files) {
      // Update progress
      setParseProgress({ current: processedCount, total: files.length, fileName: file.name });
      
      // Validate file size
      const sizeCheck = validateFileSize(file);
      if (!sizeCheck.valid) {
        toast.error(sizeCheck.message, { duration: 5000 });
        skippedCount++;
        processedCount++;
        continue;
      }
      
      try {
        const fileType = getFileType(file.name);
        
        if (fileType === 'image' || file.type.startsWith('image/')) {
          const parsed = await parseFile(file);
          if (!parsed.content || parsed.content.length === 0) {
            throw new Error('Failed to read image data');
          }
          addAttachment({
            type: 'image',
            url: parsed.content,
            name: file.name,
            size: file.size,
            parsedContent: undefined,
            fileType: 'image'
          });
          toast.success(`${file.name} attached`);
        } else {
          const parsed = await parseFile(file);
          
          if (parsed.content.includes('[Error parsing file') || parsed.content.includes('Unable to')) {
            toast.error(`Could not extract text from ${file.name}. Try a different format.`, { duration: 5000 });
          } else if (parsed.content.length < 10) {
            toast.error(`${file.name} appears to be empty or unreadable`, { duration: 5000 });
          } else {
            addAttachment({
              type: 'file',
              url: '',
              name: file.name,
              size: file.size,
              parsedContent: parsed.content,
              fileType: parsed.type
            });
            toast.success(`${file.name} ready for analysis`);
          }
        }
      } catch (error) {
        console.error('Error processing file:', error);
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        if (errorMsg.includes('quota') || errorMsg.includes('storage')) {
          toast.error(`Storage full. Please clear browser data or use smaller files.`, { duration: 6000 });
        } else {
          toast.error(`Failed to process ${file.name}: ${errorMsg}`, { duration: 5000 });
        }
      }
      
      processedCount++;
    }
    
    setParseProgress({ current: 0, total: 0, fileName: '' });
    setIsParsing(false);
  }, [addAttachment, validateFileSize]);

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isStreaming || disabled) return;
    setIsDragOver(true);
  }, [isStreaming, disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set isDragOver to false if we're leaving the drop zone entirely
    if (dropZoneRef.current && !dropZoneRef.current.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isStreaming || disabled) return;
    e.dataTransfer.dropEffect = 'copy';
  }, [isStreaming, disabled]);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    if (isStreaming || disabled) return;
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await processFiles(files);
    }
  }, [isStreaming, disabled, processFiles]);
  
  // Handle image file selection
  const handleImageSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    await processFiles(files.filter(f => f.type.startsWith('image/')));
    e.target.value = '';
    setShowAttachMenu(false);
  }, [processFiles]);
  
  // Handle document file selection
  const handleDocumentSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    await processFiles(files);
    e.target.value = '';
    setShowAttachMenu(false);
  }, [processFiles]);

  // Camera capture functionality
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
      setShowAttachMenu(false);
    } catch (err) {
      console.error('Camera access denied:', err);
      cameraInputRef.current?.click();
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        addAttachment({
          type: 'image',
          url: dataUrl,
          name: `camera-${Date.now()}.jpg`,
          size: Math.round(dataUrl.length * 0.75),
          parsedContent: undefined,
          fileType: 'image'
        });
        stopCamera();
      }
    }
  }, [addAttachment, stopCamera]);

  const handleCameraCapture = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    await processFiles(files.filter(f => f.type.startsWith('image/')));
    e.target.value = '';
  }, [processFiles]);
  
  return (
    <div 
      ref={dropZoneRef}
      className="w-full max-w-3xl mx-auto px-2 sm:px-4 relative"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag & Drop Overlay */}
      <AnimatePresence>
        {isDragOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              'absolute inset-0 z-50 rounded-2xl',
              'bg-primary/10 backdrop-blur-sm',
              'border-2 border-dashed border-primary',
              'flex flex-col items-center justify-center gap-3',
              'pointer-events-none'
            )}
          >
            <motion.div
              initial={{ scale: 0.8, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center"
            >
              <Upload className="w-8 h-8 text-primary" />
            </motion.div>
            <div className="text-center">
             <p className="text-lg font-medium text-primary">{language === 'bn' ? 'ফাইল এখানে ড্রপ করুন' : 'Drop files here'}</p>
              <p className="text-sm text-muted-foreground">
                {language === 'bn' ? 'ছবি, PDF, কোড ফাইল এবং আরও অনেক কিছু' : 'Images, PDFs, code files, and more'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Camera Viewfinder */}
      <AnimatePresence>
        {isCameraActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 bg-black flex flex-col"
          >
            <video
              ref={videoRef}
              className="flex-1 object-cover"
              autoPlay
              playsInline
              muted
            />
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-center gap-6 bg-gradient-to-t from-black/80 to-transparent">
              <button
                onClick={stopCamera}
                className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <button
                onClick={capturePhoto}
                className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-xl hover:scale-105 transition-transform"
              >
                <div className="w-14 h-14 rounded-full border-4 border-black/20" />
              </button>
              <div className="w-12 h-12" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attachment Previews with File Chips */}
      <AnimatePresence>
        {pendingAttachments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 mb-3"
          >
            {pendingAttachments.map((att, index) => (
              <FileChip
                key={index}
                name={att.name}
                type={att.fileType || 'unknown'}
                size={att.size}
                previewUrl={att.type === 'image' ? att.url : undefined}
                onRemove={() => removeAttachment(index)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Parsing Indicator with Progress */}
      <AnimatePresence>
        {isParsing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3"
          >
            <div className="px-3 py-2.5 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  <span className="text-sm text-primary font-medium">
                    {language === 'bn' ? 'ফাইল প্রসেস হচ্ছে...' : 'Processing files...'}
                  </span>
                </div>
                {parseProgress.total > 1 && (
                  <span className="text-xs text-primary/70">
                    {parseProgress.current + 1} / {parseProgress.total}
                  </span>
                )}
              </div>
              
              {/* Progress bar */}
              <div className="h-1.5 bg-primary/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: parseProgress.total > 0 
                      ? `${((parseProgress.current + 1) / parseProgress.total) * 100}%`
                      : '100%'
                  }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              </div>
              
              {/* Current file name */}
              {parseProgress.fileName && (
                <p className="text-xs text-primary/70 mt-1.5 truncate">
                  {parseProgress.fileName}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Input Container - Gemini-style stacked layout */}
      <div className={cn(
        'relative flex flex-col rounded-3xl border transition-all duration-200',
        'bg-muted/40 border-border/50',
        'focus-within:border-primary/40 focus-within:bg-muted/60',
        'shadow-sm px-2 sm:px-3 pt-1 pb-1.5',
        isDragOver && 'border-primary bg-primary/5'
      )}>
        {/* Image Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageSelect}
          className="hidden"
        />

        {/* Document Input - Universal File Types */}
        <input
          ref={documentInputRef}
          type="file"
          accept={getAcceptedFileTypes()}
          multiple
          onChange={handleDocumentSelect}
          className="hidden"
        />

        {/* Camera input for mobile fallback */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleCameraCapture}
          className="hidden"
        />

        {/* Textarea - top row, full width */}
        <TextareaAutosize
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={t.askAnything + '...'}
          disabled={isStreaming || disabled || isParsing}
          minRows={1}
          maxRows={6}
          enterKeyHint="enter"
          inputMode="text"
          className={cn(
            'w-full px-2 sm:px-3 pt-2.5 pb-1 bg-transparent resize-none focus:outline-none',
            'text-[15px] sm:text-base text-foreground placeholder:text-muted-foreground/70',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        />

        {/* Bottom controls row */}
        <div className="flex items-center justify-between gap-1 mt-1">
          {/* Left cluster: + and Tools */}
          <div className="flex items-center gap-1 min-w-0">
            {/* Plus Button */}
            <div className="relative">
              <button
                onClick={() => { setShowAttachMenu(!showAttachMenu); setShowToolsMenu(false); }}
                disabled={isStreaming || disabled || isParsing}
                className={cn(
                  'p-2 rounded-full transition-all duration-200',
                  'hover:bg-background text-muted-foreground hover:text-foreground',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  showAttachMenu && 'bg-background text-foreground'
                )}
                aria-label="Attach"
              >
                <Plus className={cn(
                  'w-5 h-5 transition-transform duration-200',
                  showAttachMenu && 'rotate-45'
                )} />
              </button>

              {/* Attachment Menu */}
              <AnimatePresence>
                {showAttachMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className={cn(
                      'absolute bottom-full left-0 mb-2 rounded-xl shadow-xl overflow-hidden z-50',
                      'bg-popover border border-border backdrop-blur-xl min-w-[220px]'
                    )}
                  >
                    {/* Plan limit indicator */}
                    <div className="px-4 py-2 border-b border-border bg-muted/50">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-muted-foreground">
                          {language === 'bn' ? 'সর্বোচ্চ ফাইল সাইজ' : 'Max file size'}
                        </span>
                        <span className={cn(
                          'text-xs font-medium px-1.5 py-0.5 rounded',
                          user.plan === 'premium' && 'bg-amber-500/10 text-amber-500',
                          user.plan === 'pro' && 'bg-purple-500/10 text-purple-500',
                          user.plan === 'basic' && 'bg-blue-500/10 text-blue-500',
                          user.plan === 'free' && 'bg-muted text-muted-foreground'
                        )}>
                          {formatSize(getFileSizeLimit())}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-3 px-4 py-3 w-full transition-colors hover:bg-accent"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <ImageIcon className="w-4 h-4 text-blue-500" />
                      </div>
                      <span className="text-sm whitespace-nowrap">
                        {language === 'bn' ? 'ছবি আপলোড করুন' : 'Upload Image'}
                      </span>
                    </button>
                    <button
                      onClick={startCamera}
                      className="flex items-center gap-3 px-4 py-3 w-full transition-colors hover:bg-accent"
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <Camera className="w-4 h-4 text-purple-500" />
                      </div>
                      <span className="text-sm whitespace-nowrap">
                        {language === 'bn' ? 'ক্যামেরা থেকে ছবি' : 'Take Photo'}
                      </span>
                    </button>
                    <button
                      onClick={() => documentInputRef.current?.click()}
                      className="flex items-center gap-3 px-4 py-3 w-full transition-colors hover:bg-accent"
                    >
                      <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <Paperclip className="w-4 h-4 text-green-500" />
                      </div>
                      <span className="text-sm whitespace-nowrap">
                        {language === 'bn' ? 'ফাইল সংযুক্ত করুন' : 'Attach File'}
                      </span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Tools Button */}
            <div className="relative">
              <button
                onClick={() => { setShowToolsMenu(!showToolsMenu); setShowAttachMenu(false); }}
                disabled={isStreaming || disabled}
                className={cn(
                  'flex items-center gap-1.5 pl-2 pr-3 py-1.5 rounded-full transition-all duration-200',
                  'border border-border/60 text-muted-foreground hover:text-foreground hover:bg-background',
                  'text-sm font-medium whitespace-nowrap min-w-0',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  showToolsMenu && 'bg-background text-foreground border-border'
                )}
                aria-label="Tools"
              >
                <Settings2 className="w-4 h-4 shrink-0" />
                <span className="truncate">
                  {language === 'bn' ? 'টুলস' : 'Tools'}
                </span>
              </button>

              <ToolsMenu open={showToolsMenu} onClose={() => setShowToolsMenu(false)} />
            </div>
          </div>

          {/* Right cluster: mic and send */}
          <div className="flex items-center gap-0.5 shrink-0">
            {/* Voice-to-text dictation (Whisper) */}
            {!isStreaming && (
              <VoiceDictationButton
                onTranscript={(t) => setInput((prev) => (prev ? prev.trimEnd() + ' ' + t : t))}
                disabled={disabled}
                language={language === 'bn' ? 'bn' : 'en'}
              />
            )}


            {/* Send/Stop Button */}
            <button
              onClick={isStreaming ? (onStop || (() => {})) : handleSend}
              disabled={disabled || isParsing || (!isStreaming && !input.trim() && pendingAttachments.length === 0)}
              className={cn(
                'p-2 sm:p-2.5 rounded-full transition-all duration-200',
                input.trim() || pendingAttachments.length > 0 || isStreaming
                  ? 'bg-foreground text-background hover:opacity-90'
                  : 'bg-muted text-muted-foreground opacity-50',
                'disabled:opacity-30 disabled:cursor-not-allowed'
              )}
            >
              {isParsing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isStreaming ? (
                <Square className="w-4 h-4" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Disclaimer - Minimal on mobile */}
      <div className="flex items-center justify-center gap-1.5 mt-2 pb-1 sm:pb-2">
        <p className="text-[10px] sm:text-xs text-muted-foreground/60 text-center">
          {isHealthMode 
            ? (language === 'bn' ? '🏥 হেলথ মোড সক্রিয় - সর্বদা পেশাদারদের সাথে পরামর্শ করুন' : '🏥 Health Mode Active - Always consult professionals')
            : t.sorixCanMakeMistakes
          }
        </p>
        {isHealthMode && (
          <button
            onClick={() => setHealthMode(false)}
            className="text-[10px] sm:text-xs text-rose-500 hover:text-rose-600 font-medium"
          >
            {language === 'bn' ? 'নিষ্ক্রিয়' : 'Disable'}
          </button>
        )}
      </div>
      
      {/* Health Features Modal */}
      <HealthFeaturesModal
        isOpen={showHealthModal}
        onClose={() => setShowHealthModal(false)}
        onEnableHealthMode={(analysisType) => {
          setHealthMode(true);
          setHealthAnalysisType(analysisType);
          const labels = {
            general: 'General Health',
            prescription: 'Prescription Analysis',
            lab_report: 'Lab Report Interpretation',
            veterinary: 'Veterinary'
          };
          toast.success(`🏥 ${labels[analysisType]} Mode enabled!`);
        }}
      />
    </div>
  );
};

export default ChatInput;
