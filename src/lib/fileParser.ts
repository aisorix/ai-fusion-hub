export type FileType = 
  | 'pdf' 
  | 'doc' 
  | 'docx' 
  | 'txt' 
  | 'md' 
  | 'json' 
  | 'csv' 
  | 'xlsx' 
  | 'xls'
  | 'ppt'
  | 'pptx'
  | 'code'
  | 'image'
  | 'unknown';

export const getFileType = (fileName: string): FileType => {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  
  const typeMap: Record<string, FileType> = {
    pdf: 'pdf',
    doc: 'doc',
    docx: 'docx',
    txt: 'txt',
    md: 'md',
    json: 'json',
    csv: 'csv',
    xlsx: 'xlsx',
    xls: 'xls',
    ppt: 'ppt',
    pptx: 'pptx',
    js: 'code',
    ts: 'code',
    jsx: 'code',
    tsx: 'code',
    py: 'code',
    java: 'code',
    cpp: 'code',
    c: 'code',
    css: 'code',
    html: 'code',
    sql: 'code',
    sh: 'code',
    yaml: 'code',
    yml: 'code',
    xml: 'code',
    png: 'image',
    jpg: 'image',
    jpeg: 'image',
    gif: 'image',
    webp: 'image',
    svg: 'image',
    bmp: 'image',
  };

  return typeMap[ext] || 'unknown';
};

export const getFileIcon = (fileType: FileType): string => {
  const iconMap: Record<FileType, string> = {
    pdf: '📄',
    doc: '📝',
    docx: '📝',
    txt: '📃',
    md: '📋',
    json: '🔧',
    csv: '📊',
    xlsx: '📊',
    xls: '📊',
    ppt: '📽️',
    pptx: '📽️',
    code: '💻',
    image: '🖼️',
    unknown: '📎',
  };

  return iconMap[fileType];
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export const readFileAsText = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

export const readFileAsDataURL = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
