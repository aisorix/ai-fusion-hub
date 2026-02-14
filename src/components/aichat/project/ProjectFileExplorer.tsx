import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import {
  File, Folder, FolderOpen, Plus, Trash2, Pencil, Check, X,
  ChevronRight, ChevronDown, Save, FileCode, FilePlus, FolderPlus,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { type ProjectFile, detectLanguage } from '@/hooks/useProjectFiles';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useChatStore } from '@/stores/chatStore';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProjectFileExplorerProps {
  files: ProjectFile[];
  activeFile: ProjectFile | null;
  activeFileId: string | null;
  isSaving: boolean;
  isLoading: boolean;
  onSelectFile: (id: string) => void;
  onCreateFile: (name: string, path: string, isFolder: boolean) => Promise<ProjectFile | null>;
  onUpdateContent: (fileId: string, content: string) => Promise<boolean>;
  onRenameFile: (fileId: string, newName: string) => Promise<boolean>;
  onDeleteFile: (fileId: string) => Promise<boolean>;
  getFilesInPath: (path: string) => ProjectFile[];
}

const LANG_COLORS: Record<string, string> = {
  javascript: 'text-yellow-500', jsx: 'text-cyan-500', typescript: 'text-blue-500',
  tsx: 'text-blue-400', python: 'text-green-500', html: 'text-orange-500',
  css: 'text-purple-500', json: 'text-yellow-600', markdown: 'text-muted-foreground',
  sql: 'text-pink-500', bash: 'text-green-600', rust: 'text-orange-600',
  go: 'text-cyan-600', java: 'text-red-500', ruby: 'text-red-400',
};

// Memoized syntax highlighter to prevent re-renders
const MemoizedHighlighter = memo(({ content, language, theme }: { content: string; language: string; theme: string }) => (
  <SyntaxHighlighter
    language={language === 'plaintext' ? 'text' : language}
    style={theme === 'dark' ? oneDark : oneLight}
    customStyle={{
      margin: 0, padding: '12px 16px', fontSize: '13px',
      lineHeight: '1.6', minHeight: '100%', background: 'transparent',
    }}
    showLineNumbers
    lineNumberStyle={{ minWidth: '2.5em', paddingRight: '1em', color: 'hsl(var(--muted-foreground) / 0.4)' }}
  >
    {content || ' '}
  </SyntaxHighlighter>
));
MemoizedHighlighter.displayName = 'MemoizedHighlighter';

// ===== FILE TREE ITEM =====
const FileTreeItem = ({
  file, depth, isActive, expandedFolders, onToggleFolder, onSelect, onRename, onDelete, files, onCreateFile,
}: {
  file: ProjectFile; depth: number; isActive: boolean;
  expandedFolders: Set<string>;
  onToggleFolder: (id: string) => void; onSelect: (id: string) => void;
  onRename: (id: string, name: string) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  files: ProjectFile[];
  onCreateFile: (name: string, path: string, isFolder: boolean) => Promise<ProjectFile | null>;
}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(file.name);
  const [showActions, setShowActions] = useState(false);

  const isExpanded = expandedFolders.has(file.id);
  const folderPath = file.path === '/' ? `/${file.name}` : `${file.path}/${file.name}`;
  const children = file.is_folder ? files.filter(f => f.path === folderPath) : [];

  const handleRename = async () => {
    if (renameValue.trim() && renameValue !== file.name) {
      await onRename(file.id, renameValue.trim());
    }
    setIsRenaming(false);
  };

  return (
    <div>
      <div
        className={cn(
          'group flex items-center gap-1 py-1 px-2 rounded-md cursor-pointer transition-colors text-sm',
          isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50 text-foreground',
        )}
        style={{ paddingLeft: `${8 + depth * 16}px` }}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
        onClick={() => file.is_folder ? onToggleFolder(file.id) : onSelect(file.id)}
      >
        {file.is_folder ? (
          <>
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5 shrink-0 text-muted-foreground" /> : <ChevronRight className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />}
            {isExpanded ? <FolderOpen className="w-4 h-4 shrink-0 text-amber-500" /> : <Folder className="w-4 h-4 shrink-0 text-amber-500" />}
          </>
        ) : (
          <>
            <span className="w-3.5" />
            <FileCode className={cn('w-4 h-4 shrink-0', LANG_COLORS[file.language] || 'text-muted-foreground')} />
          </>
        )}

        {isRenaming ? (
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <input
              autoFocus
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') setIsRenaming(false); }}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 text-xs px-1 py-0.5 rounded bg-muted border border-border focus:outline-none focus:ring-1 focus:ring-primary/50 min-w-0"
            />
            <button onClick={(e) => { e.stopPropagation(); handleRename(); }} className="p-0.5 hover:bg-muted rounded"><Check className="w-3 h-3 text-green-500" /></button>
            <button onClick={(e) => { e.stopPropagation(); setIsRenaming(false); }} className="p-0.5 hover:bg-muted rounded"><X className="w-3 h-3" /></button>
          </div>
        ) : (
          <span className="truncate text-xs flex-1">{file.name}</span>
        )}

        {showActions && !isRenaming && (
          <div className="flex items-center gap-0.5 shrink-0">
            {file.is_folder && (
              <button onClick={(e) => { e.stopPropagation(); const n = prompt('File name:'); if (n) onCreateFile(n, folderPath, false); }} className="p-0.5 rounded hover:bg-muted/80">
                <FilePlus className="w-3 h-3 text-muted-foreground" />
              </button>
            )}
            <button onClick={(e) => { e.stopPropagation(); setRenameValue(file.name); setIsRenaming(true); }} className="p-0.5 rounded hover:bg-muted/80">
              <Pencil className="w-3 h-3 text-muted-foreground" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); if (confirm(`Delete ${file.name}?`)) onDelete(file.id); }} className="p-0.5 rounded hover:bg-destructive/10">
              <Trash2 className="w-3 h-3 text-destructive" />
            </button>
          </div>
        )}
      </div>

      {/* Children - CSS transition instead of AnimatePresence */}
      {file.is_folder && isExpanded && (
        <div className="overflow-hidden animate-in slide-in-from-top-1 duration-150">
          {children
            .sort((a, b) => (a.is_folder === b.is_folder ? a.name.localeCompare(b.name) : a.is_folder ? -1 : 1))
            .map(child => (
              <FileTreeItem
                key={child.id}
                file={child}
                depth={depth + 1}
                isActive={false}
                expandedFolders={expandedFolders}
                onToggleFolder={onToggleFolder}
                onSelect={onSelect}
                onRename={onRename}
                onDelete={onDelete}
                files={files}
                onCreateFile={onCreateFile}
              />
            ))}
        </div>
      )}
    </div>
  );
};

// ===== MAIN COMPONENT =====
const ProjectFileExplorer: React.FC<ProjectFileExplorerProps> = ({
  files, activeFile, activeFileId, isSaving, isLoading,
  onSelectFile, onCreateFile, onUpdateContent, onRenameFile, onDeleteFile, getFilesInPath,
}) => {
  const { theme } = useChatStore();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [editedContent, setEditedContent] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showNewInput, setShowNewInput] = useState<'file' | 'folder' | null>(null);
  const [newName, setNewName] = useState('');
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (activeFile) {
      setEditedContent(activeFile.content);
      setHasUnsavedChanges(false);
    }
  }, [activeFileId, activeFile?.content]);

  const handleContentChange = useCallback((value: string) => {
    setEditedContent(value);
    setHasUnsavedChanges(true);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      if (activeFileId) {
        onUpdateContent(activeFileId, value);
        setHasUnsavedChanges(false);
      }
    }, 2000);
  }, [activeFileId, onUpdateContent]);

  const handleManualSave = useCallback(async () => {
    if (activeFileId && hasUnsavedChanges) {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      const ok = await onUpdateContent(activeFileId, editedContent);
      if (ok) setHasUnsavedChanges(false);
    }
  }, [activeFileId, hasUnsavedChanges, editedContent, onUpdateContent]);

  const handleCreateNew = useCallback(async () => {
    if (!newName.trim() || !showNewInput) return;
    await onCreateFile(newName.trim(), '/', showNewInput === 'folder');
    setNewName('');
    setShowNewInput(null);
  }, [newName, showNewInput, onCreateFile]);

  const toggleFolder = useCallback((id: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const rootFiles = getFilesInPath('/');

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleManualSave();
    }
  }, [handleManualSave]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="flex h-full border-l border-border bg-card/30">
      {/* File Tree Sidebar */}
      <div className="w-52 border-r border-border flex flex-col shrink-0">
        <div className="flex items-center justify-between px-3 py-2 border-b border-border">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Files</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setShowNewInput('file')} className="p-1 rounded hover:bg-muted transition-colors" title="New File">
              <FilePlus className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            <button onClick={() => setShowNewInput('folder')} className="p-1 rounded hover:bg-muted transition-colors" title="New Folder">
              <FolderPlus className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="py-1">
            {showNewInput && (
              <div className="flex items-center gap-1 px-2 py-1">
                {showNewInput === 'folder' ? <Folder className="w-4 h-4 text-amber-500 shrink-0" /> : <File className="w-4 h-4 text-muted-foreground shrink-0" />}
                <input
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleCreateNew(); if (e.key === 'Escape') setShowNewInput(null); }}
                  placeholder={showNewInput === 'folder' ? 'folder name' : 'filename.ext'}
                  className="flex-1 text-xs px-1.5 py-0.5 rounded bg-muted border border-border focus:outline-none focus:ring-1 focus:ring-primary/50 min-w-0"
                />
                <button onClick={handleCreateNew} className="p-0.5 hover:bg-muted rounded"><Check className="w-3 h-3 text-green-500" /></button>
                <button onClick={() => setShowNewInput(null)} className="p-0.5 hover:bg-muted rounded"><X className="w-3 h-3" /></button>
              </div>
            )}

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              </div>
            ) : rootFiles.length === 0 && !showNewInput ? (
              <div className="text-center py-8 px-3">
                <FileCode className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" />
                <p className="text-[10px] text-muted-foreground">No files yet</p>
                <button onClick={() => setShowNewInput('file')} className="text-[10px] text-primary hover:underline mt-1">Create one</button>
              </div>
            ) : (
              rootFiles
                .sort((a, b) => (a.is_folder === b.is_folder ? a.name.localeCompare(b.name) : a.is_folder ? -1 : 1))
                .map(file => (
                  <FileTreeItem
                    key={file.id} file={file} depth={0}
                    isActive={activeFileId === file.id}
                    expandedFolders={expandedFolders}
                    onToggleFolder={toggleFolder} onSelect={onSelectFile}
                    onRename={onRenameFile} onDelete={onDeleteFile}
                    files={files} onCreateFile={onCreateFile}
                  />
                ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Code Editor Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {activeFile ? (
          <>
            <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2 min-w-0">
                <FileCode className={cn('w-4 h-4 shrink-0', LANG_COLORS[activeFile.language] || 'text-muted-foreground')} />
                <span className="text-xs font-medium text-foreground truncate">{activeFile.name}</span>
                <span className="text-[10px] text-muted-foreground">{activeFile.language}</span>
                {hasUnsavedChanges && <span className="w-2 h-2 rounded-full bg-amber-500" title="Unsaved changes" />}
              </div>
              <div className="flex items-center gap-1.5">
                {isSaving && <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />}
                <Button size="sm" variant="ghost" onClick={handleManualSave} disabled={!hasUnsavedChanges || isSaving} className="h-7 text-xs gap-1">
                  <Save className="w-3 h-3" /> Save
                </Button>
              </div>
            </div>

            <div className="flex-1 relative overflow-hidden">
              <div className="absolute inset-0 overflow-auto">
                <MemoizedHighlighter content={editedContent} language={activeFile.language} theme={theme} />
              </div>
              <textarea
                ref={editorRef}
                value={editedContent}
                onChange={(e) => handleContentChange(e.target.value)}
                spellCheck={false}
                className="absolute inset-0 w-full h-full resize-none bg-transparent text-transparent caret-foreground p-3 pl-[4.5em] font-mono text-[13px] leading-[1.6] focus:outline-none overflow-auto z-10"
                style={{ caretColor: 'hsl(var(--foreground))' }}
              />
            </div>

            <div className="flex items-center justify-between px-3 py-1 border-t border-border bg-muted/20 text-[10px] text-muted-foreground">
              <span>{activeFile.language} • {editedContent.split('\n').length} lines</span>
              <span>Ctrl+S to save • Auto-saves after 2s</span>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <FileCode className="w-12 h-12 mx-auto mb-3 text-muted-foreground/20" />
              <p className="text-sm text-muted-foreground">Select a file to edit</p>
              <p className="text-xs text-muted-foreground/60 mt-1">or create a new file from the sidebar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectFileExplorer;
