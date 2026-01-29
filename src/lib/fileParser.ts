// File Parser Utilities
// Handles file parsing and type detection for chat attachments

export type FileType = 
  | 'pdf'
  | 'doc'
  | 'docx'
  | 'txt'
  | 'csv'
  | 'json'
  | 'xml'
  | 'html'
  | 'js'
  | 'ts'
  | 'jsx'
  | 'tsx'
  | 'css'
  | 'scss'
  | 'py'
  | 'java'
  | 'cpp'
  | 'c'
  | 'go'
  | 'rust'
  | 'rb'
  | 'php'
  | 'sql'
  | 'md'
  | 'yaml'
  | 'image'
  | 'text'
  | 'code'
  | 'data'
  | 'unknown';

export interface ParsedFile {
  name: string;
  type: FileType;
  mimeType: string;
  size: number;
  content: string;
  isImage: boolean;
}

// Get color for file type icons
export const getFileColor = (type: FileType): string => {
  const colors: Record<string, string> = {
    pdf: 'text-red-500',
    doc: 'text-blue-500',
    docx: 'text-blue-500',
    txt: 'text-gray-500',
    csv: 'text-green-500',
    json: 'text-amber-500',
    xml: 'text-orange-500',
    html: 'text-orange-500',
    js: 'text-yellow-500',
    ts: 'text-blue-600',
    jsx: 'text-cyan-500',
    tsx: 'text-cyan-600',
    css: 'text-pink-500',
    scss: 'text-pink-600',
    py: 'text-blue-500',
    java: 'text-red-600',
    cpp: 'text-blue-700',
    c: 'text-blue-700',
    go: 'text-cyan-600',
    rust: 'text-orange-600',
    rb: 'text-red-500',
    php: 'text-purple-500',
    sql: 'text-blue-500',
    md: 'text-gray-600',
    yaml: 'text-purple-500',
    image: 'text-green-500',
    text: 'text-gray-500',
    code: 'text-blue-500',
    data: 'text-amber-500',
    unknown: 'text-gray-400',
  };
  return colors[type] || colors.unknown;
};

// Format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const FILE_TYPE_MAP: Record<string, FileType> = {
  '.pdf': 'pdf',
  '.doc': 'doc',
  '.docx': 'docx',
  '.txt': 'txt',
  '.csv': 'csv',
  '.json': 'json',
  '.xml': 'xml',
  '.html': 'html',
  '.htm': 'html',
  '.js': 'js',
  '.ts': 'ts',
  '.jsx': 'jsx',
  '.tsx': 'tsx',
  '.css': 'css',
  '.scss': 'scss',
  '.py': 'py',
  '.java': 'java',
  '.cpp': 'cpp',
  '.c': 'c',
  '.go': 'go',
  '.rs': 'rust',
  '.rb': 'rb',
  '.php': 'php',
  '.sql': 'sql',
  '.md': 'md',
  '.markdown': 'md',
  '.yaml': 'yaml',
  '.yml': 'yaml',
  '.png': 'image',
  '.jpg': 'image',
  '.jpeg': 'image',
  '.gif': 'image',
  '.webp': 'image',
  '.svg': 'image',
};

export const getFileType = (filename: string): FileType => {
  const ext = filename.toLowerCase().slice(filename.lastIndexOf('.'));
  return FILE_TYPE_MAP[ext] || 'unknown';
};

export const getAcceptedFileTypes = (): string => {
  return Object.keys(FILE_TYPE_MAP).join(',');
};

export const parseFile = async (file: File): Promise<ParsedFile> => {
  const type = getFileType(file.name);
  const isImage = type === 'image' || file.type.startsWith('image/');
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target?.result as string;
      resolve({
        name: file.name,
        type,
        mimeType: file.type,
        size: file.size,
        content,
        isImage,
      });
    };
    
    reader.onerror = () => {
      reject(new Error(`Failed to read file: ${file.name}`));
    };
    
    if (isImage) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
  });
};

export interface FormattedFile {
  name: string;
  type: FileType;
  mimeType: string;
  size: number;
  content: string;
  isImage: boolean;
}

export const formatFileForPrompt = (
  file: FormattedFile,
  index: number,
  total: number
): string => {
  const header = total > 1 
    ? `\n--- File ${index}/${total}: ${file.name} ---\n`
    : `\n--- File: ${file.name} ---\n`;
  
  const typeLabel = file.type.toUpperCase();
  
  return `${header}[Type: ${typeLabel}]\n\n${file.content}\n`;
};

export default {
  getFileType,
  getAcceptedFileTypes,
  parseFile,
  formatFileForPrompt,
};
