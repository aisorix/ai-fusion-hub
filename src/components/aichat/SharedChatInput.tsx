// Shared Chat Input for Multi-Window Mode
// Full file upload support matching main ChatInput

import React, { useState, useRef, useCallback } from "react";
import { Send, Square, Loader2, Mic, Image as ImageIcon, Paperclip, Upload, X, Plus, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TextareaAutosize from "react-textarea-autosize";
import { useChatStore, type Attachment, type UserPlan } from "@/stores/chatStore";
import { cn } from "@/lib/utils";
import { parseFile, getAcceptedFileTypes, getFileType } from "@/lib/fileParser";
import FileChip from "./FileChip";
import { toast } from "sonner";

interface SharedChatInputProps {
  onSend?: (content: string, attachments?: Attachment[]) => void;
  onSendToAll?: (content: string) => void;
  onOpenVoiceMode?: () => void;
  isStreaming?: boolean;
  isAnyStreaming?: boolean;
  onStopStreaming?: () => void;
  placeholder?: string;
  language?: string;
  userPlan?: UserPlan;
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

const SharedChatInput = ({
  onSend,
  onSendToAll,
  onOpenVoiceMode,
  isStreaming,
  isAnyStreaming,
  onStopStreaming,
  placeholder = "Ask all models at once...",
  language,
  userPlan = "free",
}: SharedChatInputProps) => {
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const streaming = isStreaming || isAnyStreaming || false;
  const sizeLimit = FILE_SIZE_LIMITS[userPlan] || FILE_SIZE_LIMITS.free;

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
        if (fileType === "image" || file.type.startsWith("image/")) {
          const parsed = await parseFile(file);
          setAttachments((prev) => [
            ...prev,
            { type: "image", url: parsed.content, name: file.name, size: file.size, fileType: "image" },
          ]);
        } else {
          const parsed = await parseFile(file);
          if (parsed.content.length >= 10) {
            setAttachments((prev) => [
              ...prev,
              { type: "file", url: "", name: file.name, size: file.size, parsedContent: parsed.content, fileType: parsed.type },
            ]);
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

  const handleSend = useCallback(() => {
    if (streaming || (!input.trim() && attachments.length === 0)) return;
    if (onSend) onSend(input.trim(), attachments);
    if (onSendToAll) onSendToAll(input.trim());
    setInput("");
    setAttachments([]);
    setShowAttachMenu(false);
    textareaRef.current?.focus();
  }, [input, streaming, onSend, onSendToAll, attachments]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const handlePaste = useCallback(async (e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items);
    const imageItems = items.filter((item) => item.type.startsWith("image/"));
    if (imageItems.length === 0) return;
    e.preventDefault();
    setIsParsing(true);
    for (const item of imageItems) {
      const file = item.getAsFile();
      if (!file) continue;
      try {
        const parsed = await parseFile(file);
        setAttachments((prev) => [
          ...prev,
          { type: "image", url: parsed.content, name: `pasted-${Date.now()}.png`, size: file.size, fileType: "image" },
        ]);
      } catch {}
    }
    setIsParsing(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) await processFiles(files);
  }, [processFiles]);

  return (
    <div
      ref={dropZoneRef}
      className="w-full max-w-4xl mx-auto px-4 relative"
      onDragEnter={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "copy"; }}
      onDragLeave={(e) => {
        e.preventDefault();
        if (dropZoneRef.current && !dropZoneRef.current.contains(e.relatedTarget as Node)) setIsDragOver(false);
      }}
      onDrop={handleDrop}
    >
      {/* Drag overlay */}
      <AnimatePresence>
        {isDragOver && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 rounded-2xl bg-primary/10 backdrop-blur-sm border-2 border-dashed border-primary flex flex-col items-center justify-center gap-2 pointer-events-none"
          >
            <Upload className="w-8 h-8 text-primary" />
            <p className="text-sm font-medium text-primary">Drop files here</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden file inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={async (e) => {
          await processFiles(Array.from(e.target.files || []).filter((f) => f.type.startsWith("image/")));
          e.target.value = "";
          setShowAttachMenu(false);
        }}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept={getAcceptedFileTypes()}
        multiple
        className="hidden"
        onChange={async (e) => {
          await processFiles(Array.from(e.target.files || []));
          e.target.value = "";
          setShowAttachMenu(false);
        }}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={async (e) => {
          await processFiles(Array.from(e.target.files || []).filter((f) => f.type.startsWith("image/")));
          e.target.value = "";
          setShowAttachMenu(false);
        }}
      />

      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 mb-3"
          >
            {attachments.map((att, index) => (
              <FileChip
                key={index}
                name={att.name}
                type={att.fileType || "unknown"}
                size={att.size}
                previewUrl={att.type === "image" ? att.url : undefined}
                onRemove={() => setAttachments((prev) => prev.filter((_, i) => i !== index))}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Parsing indicator */}
      {isParsing && (
        <div className="flex items-center gap-2 mb-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Processing files...
        </div>
      )}

      <div
        className={cn(
          "relative flex items-end rounded-2xl border transition-all duration-200",
          "bg-card border-border",
          "focus-within:border-primary/50 focus-within:shadow-lg",
          "shadow-lg",
        )}
      >
      {/* Attach menu */}
        <div className="relative">
          <button
            onClick={() => setShowAttachMenu(!showAttachMenu)}
            disabled={streaming}
            className={cn(
              "p-2.5 m-1 rounded-full transition-all duration-200",
              "hover:bg-accent text-muted-foreground hover:text-foreground",
              "disabled:opacity-50",
              showAttachMenu && "bg-accent text-foreground",
            )}
          >
            <Plus className={cn("w-5 h-5 transition-transform duration-200", showAttachMenu && "rotate-45")} />
          </button>
          <AnimatePresence>
            {showAttachMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute bottom-full left-1 mb-2 rounded-xl shadow-xl overflow-hidden bg-popover border border-border backdrop-blur-xl z-50 min-w-[200px]"
              >
                <div className="px-4 py-2 border-b border-border bg-muted/50">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">Max file size</span>
                    <span className={cn(
                      "text-xs font-medium px-1.5 py-0.5 rounded",
                      userPlan === "premium" && "bg-amber-500/10 text-amber-500",
                      userPlan === "pro" && "bg-purple-500/10 text-purple-500",
                      userPlan === "basic" && "bg-blue-500/10 text-blue-500",
                      userPlan === "free" && "bg-muted text-muted-foreground",
                    )}>
                      {formatSize(sizeLimit)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="flex items-center gap-3 px-4 py-3 w-full hover:bg-accent transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <ImageIcon className="w-4 h-4 text-blue-500" />
                  </div>
                  <span className="text-sm">Upload Image</span>
                </button>
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex items-center gap-3 px-4 py-3 w-full hover:bg-accent transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Camera className="w-4 h-4 text-purple-500" />
                  </div>
                  <span className="text-sm">Take Photo</span>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-3 px-4 py-3 w-full hover:bg-accent transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Paperclip className="w-4 h-4 text-green-500" />
                  </div>
                  <span className="text-sm">Attach File</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <TextareaAutosize
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={placeholder}
          disabled={streaming}
          minRows={1}
          maxRows={4}
          className={cn(
            "flex-1 py-4 px-2 bg-transparent resize-none focus:outline-none",
            "text-base text-foreground placeholder:text-muted-foreground",
            "disabled:opacity-50 disabled:cursor-not-allowed",
          )}
        />

        {onOpenVoiceMode && (
          <button
            onClick={onOpenVoiceMode}
            className={cn("p-3 rounded-xl transition-all duration-200", "hover:bg-accent text-muted-foreground hover:text-primary")}
          >
            <Mic className="w-5 h-5" />
          </button>
        )}

        <button
          onClick={streaming ? onStopStreaming : handleSend}
          disabled={!streaming && !input.trim() && attachments.length === 0}
          className={cn(
            "p-3 m-1.5 rounded-xl transition-all duration-200",
            input.trim() || streaming || attachments.length > 0
              ? "bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-lg"
              : "bg-muted text-muted-foreground",
            "disabled:opacity-50 disabled:cursor-not-allowed",
          )}
        >
          {streaming ? <Square className="w-5 h-5" /> : <Send className="w-5 h-5" />}
        </button>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-3">
        Compare responses from multiple AI models side by side
      </p>
    </div>
  );
};

export default SharedChatInput;
