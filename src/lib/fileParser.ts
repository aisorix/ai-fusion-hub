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
  | 'unknown';

export interface ParsedFile {
  name: string;
  type: FileType;
  mimeType: string;
  size: number;
  content: string;
  isImage: boolean;
}

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
