import React, { useState, useRef, useCallback } from 'react';
import { Send, Wand2, Plus, Image as ImageIcon, Camera, Paperclip, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useChatStore, type Attachment } from '@/stores/chatStore';
import { parseFile, getAcceptedFileTypes, getFileType } from '@/lib/fileParser';
import FileChip from '@/components/aichat/FileChip';
import TextareaAutosize from 'react-textarea-autosize';
import { toast } from 'sonner';

interface Props {
  onGenerate: (prompt: string, attachments?: Attachment[]) => void;
  isGenerating: boolean;
  disabled?: boolean;
}

const FILE_SIZE_LIMITS: Record<string, number> = {
  free: 1 * 1024 * 1024,
  basic: 5 * 1024 * 1024,
  pro: 10 * 1024 * 1024,
  premium: 15 * 1024 * 1024,
};

const formatSize = (bytes: number): string => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
};

const ImaginePromptBar: React.FC<Props> = ({ onGenerate, isGenerating, disabled }) => {
  const [prompt, setPrompt] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const { user } = useChatStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const sizeLimit = FILE_SIZE_LIMITS[user.plan] || FILE_SIZE_LIMITS.free;

  const processFiles = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    setIsParsing(true);
    for (const file of files) {
      if (file.size > sizeLimit) {
        toast.error(`${file.name} exceeds ${formatSize(sizeLimit)} limit`);
        continue;
      }
      try {
        const fileType = getFileType(file.name);
        if (fileType === 'image' || file.type.startsWith('image/')) {
          const parsed = await parseFile(file);
          setAttachments(prev => [...prev, { type: 'image', url: parsed.content, name: file.name, size: file.size, fileType: 'image' }]);
        } else {
          const parsed = await parseFile(file);
          if (parsed.content.length >= 10) {
            setAttachments(prev => [...prev, { type: 'file', url: '', name: file.name, size: file.size, parsedContent: parsed.content, fileType: parsed.type }]);
          } else {
            toast.error(`${file.name} appears empty`);
          }
        }
      } catch {
        toast.error(`Failed to process ${file.name}`);
      }
    }
    setIsParsing(false);
  }, [sizeLimit]);

  const handleSubmit = () => {
    if (!prompt.trim() || isGenerating || disabled) return;
    onGenerate(prompt.trim(), attachments.length > 0 ? attachments : undefined);
    setAttachments([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full">
      {/* Attachment previews */}
      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 mb-3"
          >
            {attachments.map((att, i) => (
              <FileChip
                key={i}
                name={att.name}
                type={att.fileType || 'unknown'}
                size={att.size}
                previewUrl={att.type === 'image' ? att.url : undefined}
                onRemove={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {isParsing && (
        <div className="flex items-center gap-2 mb-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Processing files...
        </div>
      )}

      {/* Hidden inputs */}
      <input ref={imageInputRef} type="file" accept="image/*" multiple className="hidden"
        onChange={async (e) => { await processFiles(Array.from(e.target.files || []).filter(f => f.type.startsWith('image/'))); e.target.value = ''; setShowAttachMenu(false); }} />
      <input ref={fileInputRef} type="file" accept={getAcceptedFileTypes()} multiple className="hidden"
        onChange={async (e) => { await processFiles(Array.from(e.target.files || [])); e.target.value = ''; setShowAttachMenu(false); }} />
      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden"
        onChange={async (e) => { await processFiles(Array.from(e.target.files || []).filter(f => f.type.startsWith('image/'))); e.target.value = ''; setShowAttachMenu(false); }} />

      {/* Deck-style glow wrapper */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 via-pink-500/20 to-primary/30 rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity" />
        <div className="relative flex items-center gap-2 bg-card border border-border rounded-2xl px-2 py-2">
          {/* Plus button */}
          <div className="relative">
              <button
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                disabled={isGenerating || disabled}
                className={cn(
                  'p-1.5 rounded-full transition-all duration-200',
                  'hover:bg-accent text-muted-foreground hover:text-foreground',
                  'disabled:opacity-50',
                  showAttachMenu && 'bg-accent text-foreground'
                )}
              >
                <Plus className={cn('w-4 h-4 transition-transform duration-200', showAttachMenu && 'rotate-45')} />
              </button>
              <AnimatePresence>
                {showAttachMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute top-full left-0 mt-2 rounded-xl shadow-xl overflow-hidden bg-popover border border-border backdrop-blur-xl min-w-[200px] z-[100]"
                  >
                    <div className="px-4 py-2 border-b border-border bg-muted/50">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-muted-foreground">Max file size</span>
                        <span className={cn(
                          'text-xs font-medium px-1.5 py-0.5 rounded',
                          user.plan === 'premium' && 'bg-amber-500/10 text-amber-500',
                          user.plan === 'pro' && 'bg-purple-500/10 text-purple-500',
                          user.plan === 'basic' && 'bg-blue-500/10 text-blue-500',
                          user.plan === 'free' && 'bg-muted text-muted-foreground'
                        )}>
                          {formatSize(sizeLimit)}
                        </span>
                      </div>
                    </div>
                    <button onClick={() => imageInputRef.current?.click()} className="flex items-center gap-3 px-4 py-3 w-full hover:bg-accent transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center"><ImageIcon className="w-4 h-4 text-blue-500" /></div>
                      <span className="text-sm">Upload Image</span>
                    </button>
                    <button onClick={() => cameraInputRef.current?.click()} className="flex items-center gap-3 px-4 py-3 w-full hover:bg-accent transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center"><Camera className="w-4 h-4 text-purple-500" /></div>
                      <span className="text-sm">Take Photo</span>
                    </button>
                    <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-3 px-4 py-3 w-full hover:bg-accent transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center"><Paperclip className="w-4 h-4 text-green-500" /></div>
                      <span className="text-sm">Attach File</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
          </div>

          <Wand2 className="w-4 h-4 text-primary shrink-0" />
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the image you want to create..."
            disabled={isGenerating || disabled}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 border-none focus:outline-none focus:ring-0 disabled:opacity-50"
          />
          <button
            onClick={handleSubmit}
            disabled={!prompt.trim() || isGenerating || disabled}
            className={cn(
              'shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all',
              prompt.trim() && !isGenerating && !disabled
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20'
                : 'bg-muted text-muted-foreground'
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImaginePromptBar;
