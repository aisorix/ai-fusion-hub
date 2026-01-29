/**
 * Universal File Parser
 * Handles parsing of various file types for AI analysis
 * Uses browser-native approaches for maximum compatibility
 */

export type FileType = 'image' | 'pdf' | 'docx' | 'text' | 'code' | 'data' | 'unknown';

export interface ParsedFile {
  name: string;
  type: FileType;
  mimeType: string;
  size: number;
  content: string; // Extracted text or base64 for images
  isImage: boolean;
}

// File extension to type mapping
const FILE_TYPE_MAP: Record<string, FileType> = {
  // Images
  '.jpg': 'image',
  '.jpeg': 'image',
  '.png': 'image',
  '.webp': 'image',
  '.gif': 'image',
  
  // Documents
  '.pdf': 'pdf',
  '.docx': 'docx',
  '.doc': 'docx',
  '.txt': 'text',
  '.md': 'text',
  '.rtf': 'text',
  
  // Code files
  '.js': 'code',
  '.ts': 'code',
  '.jsx': 'code',
  '.tsx': 'code',
  '.py': 'code',
  '.java': 'code',
  '.cpp': 'code',
  '.c': 'code',
  '.cs': 'code',
  '.go': 'code',
  '.rs': 'code',
  '.rb': 'code',
  '.php': 'code',
  '.swift': 'code',
  '.kt': 'code',
  '.sql': 'code',
  '.sh': 'code',
  '.bash': 'code',
  '.html': 'code',
  '.css': 'code',
  '.scss': 'code',
  '.less': 'code',
  '.xml': 'code',
  '.yaml': 'code',
  '.yml': 'code',
  
  // Data files
  '.json': 'data',
  '.csv': 'data',
  '.tsv': 'data',
};

// Get file type from extension
export const getFileType = (filename: string): FileType => {
  const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return FILE_TYPE_MAP[ext] || 'unknown';
};

// Get file icon based on type
export const getFileIcon = (type: FileType): string => {
  switch (type) {
    case 'image':
      return 'image';
    case 'pdf':
      return 'file-text';
    case 'docx':
      return 'file-type';
    case 'text':
      return 'file-text';
    case 'code':
      return 'file-code';
    case 'data':
      return 'file-json';
    default:
      return 'file';
  }
};

// Get file color based on type
export const getFileColor = (type: FileType): string => {
  switch (type) {
    case 'image':
      return 'text-blue-500';
    case 'pdf':
      return 'text-red-500';
    case 'docx':
      return 'text-blue-600';
    case 'text':
      return 'text-gray-500';
    case 'code':
      return 'text-green-500';
    case 'data':
      return 'text-amber-500';
    default:
      return 'text-muted-foreground';
  }
};

// Parse text-based files directly
const parseText = async (file: File): Promise<string> => {
  return await file.text();
};

// Convert image to base64
const parseImage = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Extract text from PDF using basic binary parsing
// This extracts readable text content from PDF files
const parsePDF = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const text = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
    
    // Extract text between stream...endstream or BT...ET blocks
    const textBlocks: string[] = [];
    
    // Try to find text content patterns in PDF
    const streamRegex = /stream\s*([\s\S]*?)\s*endstream/g;
    let match;
    
    while ((match = streamRegex.exec(text)) !== null) {
      const content = match[1];
      // Extract readable ASCII text
      const readable = content
        .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      if (readable.length > 20) {
        textBlocks.push(readable);
      }
    }
    
    // Also try simple text extraction
    const simpleText = text
      .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/(obj|endobj|stream|endstream|xref|trailer)/g, '\n')
      .split('\n')
      .filter(line => line.trim().length > 30)
      .join('\n');
    
    const result = textBlocks.length > 0 
      ? textBlocks.join('\n\n')
      : simpleText.slice(0, 50000); // Limit size
    
    if (result.trim().length < 100) {
      return `[PDF file: ${file.name} - This PDF appears to contain primarily images or scanned content. Text extraction is limited. The AI can still help if you describe what you're looking for.]`;
    }
    
    return result;
  } catch (error) {
    console.error('PDF parsing error:', error);
    return `[PDF file: ${file.name} - Unable to extract text. Please describe the content you need help with.]`;
  }
};

// Extract text from DOCX (ZIP containing XML)
const parseDOCX = async (file: File): Promise<string> => {
  try {
    // DOCX is a ZIP file, we can read it using the browser
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    
    // Check for ZIP signature
    if (bytes[0] !== 0x50 || bytes[1] !== 0x4B) {
      return `[Document file: ${file.name} - Format not recognized. Please try a .txt or .md file.]`;
    }
    
    // Find word/document.xml content by looking for the XML patterns
    const text = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
    
    // Extract text between <w:t> tags (Word text elements)
    const textRegex = /<w:t[^>]*>([^<]*)<\/w:t>/g;
    const paragraphRegex = /<\/w:p>/g;
    
    let content = text;
    const textParts: string[] = [];
    let match;
    
    while ((match = textRegex.exec(content)) !== null) {
      textParts.push(match[1]);
    }
    
    // Add paragraph breaks
    let result = textParts.join('');
    result = result.replace(/([.!?])\s*/g, '$1\n');
    
    if (result.trim().length < 50) {
      // Fallback: extract any readable text
      result = text
        .replace(/<[^>]+>/g, ' ')
        .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 50000);
    }
    
    if (result.trim().length < 100) {
      return `[DOCX file: ${file.name} - Limited text extracted. File may contain complex formatting or images.]`;
    }
    
    return result;
  } catch (error) {
    console.error('DOCX parsing error:', error);
    return `[DOCX file: ${file.name} - Unable to extract text. Please try saving as .txt format.]`;
  }
};

// Main parse function
export const parseFile = async (file: File): Promise<ParsedFile> => {
  const type = getFileType(file.name);
  const isImage = type === 'image';
  
  let content = '';
  
  try {
    switch (type) {
      case 'image':
        content = await parseImage(file);
        break;
      case 'pdf':
        content = await parsePDF(file);
        break;
      case 'docx':
        content = await parseDOCX(file);
        break;
      case 'text':
      case 'code':
      case 'data':
        content = await parseText(file);
        break;
      default:
        // Try to read as text for unknown types
        try {
          content = await parseText(file);
        } catch {
          content = '[Unable to parse file content]';
        }
    }
  } catch (error) {
    console.error(`Error parsing ${file.name}:`, error);
    content = `[Error parsing file: ${error instanceof Error ? error.message : 'Unknown error'}]`;
  }
  
  return {
    name: file.name,
    type,
    mimeType: file.type,
    size: file.size,
    content,
    isImage,
  };
};

// Format file content for AI prompt
export const formatFileForPrompt = (parsedFile: ParsedFile, fileIndex?: number, totalFiles?: number): string => {
  if (parsedFile.isImage) {
    return ''; // Images are sent as vision payload, not text
  }
  
  const extension = parsedFile.name.substring(parsedFile.name.lastIndexOf('.'));
  const languageHint = parsedFile.type === 'code' ? extension.slice(1) : '';
  const fileLabel = totalFiles && totalFiles > 1 
    ? `[FILE ${fileIndex}/${totalFiles}] ${parsedFile.name}` 
    : parsedFile.name;
  
  return `
═══════════════════════════════════════════════════════
📄 FILE: ${fileLabel}
   Type: ${parsedFile.type.toUpperCase()} | Size: ${formatFileSize(parsedFile.size)}
═══════════════════════════════════════════════════════
${languageHint ? `[Language: ${languageHint}]\n` : ''}\`\`\`${languageHint}
${parsedFile.content}
\`\`\`
═══════════════════════════════════════════════════════
`;
};

// Get accepted file types for input
export const getAcceptedFileTypes = (): string => {
  return [
    // Images
    '.jpg', '.jpeg', '.png', '.webp', '.gif',
    // Documents
    '.pdf', '.docx', '.doc', '.txt', '.md', '.rtf',
    // Code
    '.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.cpp', '.c', '.cs', '.go', '.rs', '.rb', '.php', '.swift', '.kt', '.sql', '.sh', '.html', '.css', '.scss', '.xml', '.yaml', '.yml',
    // Data
    '.json', '.csv', '.tsv',
  ].join(',');
};

// Format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
