// Export utilities for chat messages
// Handles exporting conversations to various formats

import type { Message } from '@/stores/chatStore';

// Convert messages to plain text
export const exportToText = (messages: Message[]): string => {
  return messages
    .map((msg) => {
      const role = msg.role === 'user' ? 'You' : 'Sorix AI';
      const timestamp = new Date(msg.createdAt).toLocaleString();
      return `[${timestamp}] ${role}:\n${msg.content}\n`;
    })
    .join('\n---\n\n');
};

// Convert messages to Markdown
export const exportToMarkdown = (messages: Message[]): string => {
  let md = '# AI Sorix Chat Export\n\n';
  md += `*Exported on ${new Date().toLocaleString()}*\n\n---\n\n`;

  messages.forEach((msg) => {
    const role = msg.role === 'user' ? '**You**' : '**Sorix AI**';
    const timestamp = new Date(msg.createdAt).toLocaleString();
    md += `### ${role} *${timestamp}*\n\n`;
    md += `${msg.content}\n\n---\n\n`;
  });

  return md;
};

// Convert messages to JSON
export const exportToJson = (messages: Message[]): string => {
  const exportData = {
    exportedAt: new Date().toISOString(),
    messages: messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.createdAt,
      attachments: msg.attachments?.map(att => ({
        type: att.type,
        name: att.name,
        size: att.size,
      })),
    })),
  };

  return JSON.stringify(exportData, null, 2);
};

// Trigger file download
export const downloadFile = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Export handlers
export const exportChat = (messages: Message[], format: 'text' | 'markdown' | 'json'): void => {
  const timestamp = new Date().toISOString().split('T')[0];
  
  switch (format) {
    case 'text':
      downloadFile(exportToText(messages), `sorix-chat-${timestamp}.txt`, 'text/plain');
      break;
    case 'markdown':
      downloadFile(exportToMarkdown(messages), `sorix-chat-${timestamp}.md`, 'text/markdown');
      break;
    case 'json':
      downloadFile(exportToJson(messages), `sorix-chat-${timestamp}.json`, 'application/json');
      break;
  }
};

// Alias functions for compatibility with uploaded components
export const exportAsMarkdown = (messages: Message[]): void => {
  const timestamp = new Date().toISOString().split('T')[0];
  downloadFile(exportToMarkdown(messages), `sorix-chat-${timestamp}.md`, 'text/markdown');
};

export const exportAsPDF = async (messages: Message[]): Promise<void> => {
  // PDF export requires additional libraries - for now, export as text
  const timestamp = new Date().toISOString().split('T')[0];
  const content = exportToText(messages);
  downloadFile(content, `sorix-chat-${timestamp}.txt`, 'text/plain');
  console.log('PDF export not fully implemented - exported as text instead');
};

export const exportAsDOCX = async (messages: Message[]): Promise<void> => {
  // DOCX export requires additional libraries - for now, export as markdown
  const timestamp = new Date().toISOString().split('T')[0];
  const content = exportToMarkdown(messages);
  downloadFile(content, `sorix-chat-${timestamp}.md`, 'text/markdown');
  console.log('DOCX export not fully implemented - exported as markdown instead');
};

export const exportAsZIP = async (messages: Message[]): Promise<void> => {
  // ZIP export requires additional libraries - for now, export as JSON
  const timestamp = new Date().toISOString().split('T')[0];
  const content = exportToJson(messages);
  downloadFile(content, `sorix-chat-${timestamp}.json`, 'application/json');
  console.log('ZIP export not fully implemented - exported as JSON instead');
};

export default {
  exportToText,
  exportToMarkdown,
  exportToJson,
  downloadFile,
  exportChat,
  exportAsMarkdown,
  exportAsPDF,
  exportAsDOCX,
  exportAsZIP,
};
