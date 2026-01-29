import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { X, Image, FileText, FileCode, FileJson, File, FileType } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type FileType as ParsedFileType, getFileColor, formatFileSize } from '@/lib/fileParser';

interface FileChipProps {
  name: string;
  type: ParsedFileType;
  size?: number;
  previewUrl?: string;
  onRemove: () => void;
}

const getIcon = (type: ParsedFileType) => {
  switch (type) {
    case 'image':
      return Image;
    case 'pdf':
      return FileText;
    case 'docx':
      return FileType;
    case 'text':
      return FileText;
    case 'code':
      return FileCode;
    case 'data':
      return FileJson;
    default:
      return File;
  }
};

const FileChip = forwardRef<HTMLDivElement, FileChipProps>(({ name, type, size, previewUrl, onRemove }, ref) => {
  const Icon = getIcon(type);
  const colorClass = getFileColor(type);
  const isImage = type === 'image';
  
  // Truncate filename for display
  const displayName = name.length > 20 
    ? name.slice(0, 10) + '...' + name.slice(-7) 
    : name;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      className={cn(
        'group relative flex items-center gap-2 px-3 py-2 rounded-xl',
        'bg-card border border-border shadow-sm',
        'hover:border-primary/50 transition-all duration-200'
      )}
    >
      {/* Preview or Icon */}
      {isImage && previewUrl ? (
        <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
          <img src={previewUrl} alt={name} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
          'bg-muted'
        )}>
          <Icon className={cn('w-4 h-4', colorClass)} />
        </div>
      )}
      
      {/* File Info */}
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-medium text-foreground truncate" title={name}>
          {displayName}
        </span>
        {size && (
          <span className="text-xs text-muted-foreground">
            {formatFileSize(size)}
          </span>
        )}
      </div>
      
      {/* Remove Button */}
      <button
        onClick={onRemove}
        className={cn(
          'ml-1 p-1 rounded-full transition-all duration-200',
          'opacity-0 group-hover:opacity-100',
          'bg-destructive/10 hover:bg-destructive/20',
          'text-destructive'
        )}
      >
        <X className="w-3 h-3" />
      </button>
    </motion.div>
  );
});

FileChip.displayName = 'FileChip';

export default FileChip;
