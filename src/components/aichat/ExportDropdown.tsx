import React, { useState } from 'react';
import { Download, FileText, File, FileArchive, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { Message } from '@/stores/chatStore';
import {
  exportAsPDF,
  exportAsMarkdown,
  exportAsDOCX,
  exportAsZIP,
} from '@/lib/exportUtils';

interface ExportDropdownProps {
  messages: Message[];
  theme: 'light' | 'dark';
}

const ExportDropdown = ({ messages, theme }: ExportDropdownProps) => {
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const handleExport = async (type: 'pdf' | 'markdown' | 'docx' | 'zip') => {
    if (messages.length === 0) {
      toast.error('No messages to export');
      return;
    }

    setIsExporting(type);
    try {
      switch (type) {
        case 'pdf':
          await exportAsPDF(messages);
          toast.success('PDF exported successfully!');
          break;
        case 'markdown':
          exportAsMarkdown(messages);
          toast.success('Markdown exported successfully!');
          break;
        case 'docx':
          await exportAsDOCX(messages);
          toast.success('DOCX exported successfully!');
          break;
        case 'zip':
          await exportAsZIP(messages);
          toast.success('ZIP archive exported successfully!');
          break;
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error(`Failed to export as ${type.toUpperCase()}`);
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            'p-2 rounded-lg transition-all duration-150',
            'text-muted-foreground',
            theme === 'dark'
              ? 'hover:bg-secondary hover:text-foreground'
              : 'hover:bg-secondary hover:text-foreground'
          )}
          title="Export"
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className={cn(
          'w-48',
          theme === 'dark' ? 'bg-card border-border' : 'bg-card border-border'
        )}
      >
        <DropdownMenuItem
          onClick={() => handleExport('pdf')}
          disabled={isExporting !== null}
          className="flex items-center gap-3 cursor-pointer"
        >
          <FileText className="w-4 h-4 text-red-500" />
          <span>PDF</span>
          {isExporting === 'pdf' && (
            <Loader2 className="w-3 h-3 ml-auto animate-spin" />
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => handleExport('markdown')}
          disabled={isExporting !== null}
          className="flex items-center gap-3 cursor-pointer"
        >
          <FileText className="w-4 h-4 text-gray-500" />
          <span>Markdown</span>
          {isExporting === 'markdown' && (
            <Loader2 className="w-3 h-3 ml-auto animate-spin" />
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => handleExport('docx')}
          disabled={isExporting !== null}
          className="flex items-center gap-3 cursor-pointer"
        >
          <File className="w-4 h-4 text-blue-500" />
          <span>DOCX</span>
          {isExporting === 'docx' && (
            <Loader2 className="w-3 h-3 ml-auto animate-spin" />
          )}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={() => handleExport('zip')}
          disabled={isExporting !== null}
          className="flex items-center gap-3 cursor-pointer"
        >
          <FileArchive className="w-4 h-4 text-amber-500" />
          <span>All Assets (ZIP)</span>
          {isExporting === 'zip' && (
            <Loader2 className="w-3 h-3 ml-auto animate-spin" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportDropdown;
