import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import type { Message } from '@/stores/chatStore';

// Format timestamp
const formatDate = (date: string): string => {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Generate clean PDF - simple text only
export const generatePDF = async (messages: Message[]): Promise<Blob> => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPosition = 25;

  // Set default font
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(30, 30, 30);

  messages.forEach((message, index) => {
    const isUser = message.role === 'user';
    const roleName = isUser ? 'You' : 'Assistant';
    const timestamp = message.createdAt ? formatDate(message.createdAt) : '';

    // Check if we need a new page
    if (yPosition > pageHeight - 40) {
      pdf.addPage();
      yPosition = 25;
    }

    // Role name (bold)
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(60, 60, 60);
    pdf.text(roleName, margin, yPosition);
    
    // Timestamp (light)
    if (timestamp) {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(120, 120, 120);
      pdf.text(`  ${timestamp}`, margin + pdf.getTextWidth(roleName), yPosition);
    }
    
    yPosition += 6;

    // Message content
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(30, 30, 30);
    
    const contentLines = pdf.splitTextToSize(message.content, contentWidth);
    contentLines.forEach((line: string) => {
      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = 25;
      }
      pdf.text(line, margin, yPosition);
      yPosition += 5;
    });

    yPosition += 8; // Space between messages
  });

  // Simple page numbers
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`${i} / ${pageCount}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
  }

  return pdf.output('blob');
};

// Generate clean Markdown - simple text only
export const generateMarkdown = (messages: Message[]): string => {
  let markdown = '';

  messages.forEach((message, index) => {
    const isUser = message.role === 'user';
    const roleName = isUser ? 'You' : 'Assistant';
    const timestamp = message.createdAt ? formatDate(message.createdAt) : '';
    
    markdown += `**${roleName}**`;
    if (timestamp) {
      markdown += ` _${timestamp}_`;
    }
    markdown += `\n\n${message.content}\n\n`;
    
    if (index < messages.length - 1) {
      markdown += `---\n\n`;
    }
  });

  return markdown.trim();
};

// Generate clean DOCX - simple text only
export const generateDOCX = async (messages: Message[]): Promise<Blob> => {
  const children: Paragraph[] = [];

  messages.forEach((message, index) => {
    const isUser = message.role === 'user';
    const roleName = isUser ? 'You' : 'Assistant';
    const timestamp = message.createdAt ? formatDate(message.createdAt) : '';

    // Role label with timestamp
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: roleName,
            bold: true,
            size: 22,
            color: '333333',
          }),
          ...(timestamp ? [
            new TextRun({
              text: `  ${timestamp}`,
              size: 18,
              color: '888888',
              italics: true,
            }),
          ] : []),
        ],
        spacing: { before: index === 0 ? 0 : 300, after: 120 },
      })
    );

    // Message content - split by paragraphs
    const paragraphs = message.content.split('\n');
    paragraphs.forEach((para) => {
      if (para.trim()) {
        // Handle code blocks
        if (para.includes('```') || para.startsWith('    ')) {
          const codeContent = para.replace(/```[\w]*\n?/g, '').replace(/```/g, '');
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: codeContent.trim(),
                  font: 'Consolas',
                  size: 20,
                  color: '333333',
                }),
              ],
              spacing: { after: 80 },
            })
          );
        } else {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: para.trim(),
                  size: 22,
                  color: '333333',
                }),
              ],
              spacing: { after: 80 },
            })
          );
        }
      }
    });

    // Simple separator between messages
    if (index < messages.length - 1) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: '─'.repeat(40),
              color: 'CCCCCC',
              size: 16,
            }),
          ],
          alignment: AlignmentType.LEFT,
          spacing: { before: 200, after: 200 },
        })
      );
    }
  });

  const doc = new Document({
    sections: [
      {
        children,
      },
    ],
  });

  return await Packer.toBlob(doc);
};

// Generate ZIP with all formats
export const generateZIP = async (messages: Message[]): Promise<Blob> => {
  const zip = new JSZip();

  // Add PDF
  const pdfBlob = await generatePDF(messages);
  zip.file('conversation.pdf', pdfBlob);

  // Add Markdown
  const markdown = generateMarkdown(messages);
  zip.file('conversation.md', markdown);

  // Add DOCX
  const docxBlob = await generateDOCX(messages);
  zip.file('conversation.docx', docxBlob);

  // Add simple text file
  let plainText = '';
  messages.forEach((message) => {
    const roleName = message.role === 'user' ? 'You' : 'Assistant';
    plainText += `${roleName}:\n${message.content}\n\n`;
  });
  zip.file('conversation.txt', plainText.trim());

  return await zip.generateAsync({ type: 'blob' });
};

// Export functions that trigger download
export const exportAsPDF = async (messages: Message[]) => {
  const blob = await generatePDF(messages);
  const timestamp = new Date().toISOString().slice(0, 10);
  saveAs(blob, `conversation-${timestamp}.pdf`);
};

export const exportAsMarkdown = (messages: Message[]) => {
  const markdown = generateMarkdown(messages);
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  const timestamp = new Date().toISOString().slice(0, 10);
  saveAs(blob, `conversation-${timestamp}.md`);
};

export const exportAsDOCX = async (messages: Message[]) => {
  const blob = await generateDOCX(messages);
  const timestamp = new Date().toISOString().slice(0, 10);
  saveAs(blob, `conversation-${timestamp}.docx`);
};

export const exportAsZIP = async (messages: Message[]) => {
  const blob = await generateZIP(messages);
  const timestamp = new Date().toISOString().slice(0, 10);
  saveAs(blob, `conversation-${timestamp}.zip`);
};
