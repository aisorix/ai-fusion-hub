import React, { useState, useRef, useCallback, KeyboardEvent } from 'react';
import { Send, Loader2, Plus, Image as ImageIcon, Camera, Paperclip, Settings2, Mic } from 'lucide-react';
import ToolsMenu from '@/components/aichat/ToolsMenu';
import TextareaAutosize from 'react-textarea-autosize';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useChatStore, type Attachment } from '@/stores/chatStore';
import { parseFile, getAcceptedFileTypes, getFileType } from '@/lib/fileParser';
import FileChip from '@/components/aichat/FileChip';
import { toast } from 'sonner';
import { useAutoFocusInput } from '@/hooks/useAutoFocusInput';

interface DeckPromptBarProps {
  onGenerate: (prompt: string, attachments?: Attachment[]) => void;
  isGenerating: boolean;
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

const DeckPromptBar: React.FC<DeckPromptBarProps> = ({ onGenerate, isGenerating }) => {
  const [prompt, setPrompt] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const { user } = useChatStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const sizeLimit = FILE_SIZE_LIMITS[user.plan] || FILE_SIZE_LIMITS.free;

  useAutoFocusInput(
    textareaRef,
    [attachments.length, isParsing, showAttachMenu, showToolsMenu],
    isGenerating,
  );

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
    if (!prompt.trim() || isGenerating) return;
    onGenerate(prompt.trim(), attachments.length > 0 ? attachments : undefined);
    setAttachments([]);
    setPrompt('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const hasContent = prompt.trim().length > 0;

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

      <div className={cn(
        'relative flex flex-col rounded-3xl border transition-all duration-200',
        'bg-muted/40 border-border/50',
        'focus-within:border-primary/40 focus-within:bg-muted/60',
        'shadow-sm px-2 sm:px-3 pt-1 pb-1.5'
      )}>
        <TextareaAutosize
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your presentation..."
          disabled={isGenerating}
          minRows={1}
          maxRows={6}
          className={cn(
            'w-full px-2 sm:px-3 pt-2.5 pb-1 bg-transparent resize-none focus:outline-none',
            'text-[15px] sm:text-base text-foreground placeholder:text-muted-foreground/70',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        />

        <div className="flex items-center justify-between gap-1 mt-1">
          <div className="flex items-center gap-1 min-w-0">
            <div className="relative">
              <button
                type="button"
                onClick={() => { setShowAttachMenu(!showAttachMenu); setShowToolsMenu(false); }}
                disabled={isGenerating}
                className={cn(
                  'p-2 rounded-full transition-all duration-200',
                  'hover:bg-background text-muted-foreground hover:text-foreground',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  showAttachMenu && 'bg-background text-foreground'
                )}
                aria-label="Attach"
              >
                <Plus className={cn('w-5 h-5 transition-transform duration-200', showAttachMenu && 'rotate-45')} />
              </button>
              <AnimatePresence>
                {showAttachMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute top-full left-0 mt-2 rounded-xl shadow-xl overflow-hidden bg-popover border border-border backdrop-blur-xl min-w-[220px] z-[100]"
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
                    <button type="button" onClick={() => imageInputRef.current?.click()} className="flex items-center gap-3 px-4 py-3 w-full hover:bg-accent transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center"><ImageIcon className="w-4 h-4 text-blue-500" /></div>
                      <span className="text-sm">Upload Image</span>
                    </button>
                    <button type="button" onClick={() => cameraInputRef.current?.click()} className="flex items-center gap-3 px-4 py-3 w-full hover:bg-accent transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center"><Camera className="w-4 h-4 text-purple-500" /></div>
                      <span className="text-sm">Take Photo</span>
                    </button>
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-3 px-4 py-3 w-full hover:bg-accent transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center"><Paperclip className="w-4 h-4 text-green-500" /></div>
                      <span className="text-sm">Attach File</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => { setShowToolsMenu(!showToolsMenu); setShowAttachMenu(false); }}
                disabled={isGenerating}
                className={cn(
                  'flex items-center gap-1.5 pl-2 pr-3 py-1.5 rounded-full border text-sm font-medium select-none whitespace-nowrap transition-colors',
                  showToolsMenu
                    ? 'bg-background text-foreground border-border'
                    : 'border-border/60 text-muted-foreground hover:text-foreground hover:bg-background'
                )}
              >
                <Settings2 className="w-4 h-4" />
                <span>Tools</span>
              </button>
              <ToolsMenu open={showToolsMenu} onClose={() => setShowToolsMenu(false)} direction="down" />
            </div>
          </div>

          <div className="flex items-center gap-0.5 shrink-0">
            {!hasContent && (
              <button
                type="button"
                aria-label="Voice"
                className="p-2 sm:p-2.5 rounded-full hover:bg-background text-muted-foreground hover:text-primary transition-colors relative"
              >
                <Mic className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-green-500 rounded-full" />
              </button>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!hasContent || isGenerating}
              className={cn(
                'p-2 sm:p-2.5 rounded-full transition-all duration-200',
                hasContent
                  ? 'bg-foreground text-background hover:opacity-90'
                  : 'bg-muted text-muted-foreground opacity-50',
                'disabled:opacity-30 disabled:cursor-not-allowed'
              )}
            >
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeckPromptBar;
