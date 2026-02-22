import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import type { Message } from '@/stores/chatStore';

const formatDate = (date: string): string => {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getModelLabel = (msg: Message): string => msg.modelName || 'Sorix AI';

// Strip emoji and non-latin chars that jsPDF can't render
const stripEmoji = (text: string): string =>
  text.replace(/[\u{1F000}-\u{1FFFF}|\u{2600}-\u{27BF}|\u{FE00}-\u{FEFF}|\u{1F900}-\u{1F9FF}|\u{200D}|\u{20E3}|\u{E0020}-\u{E007F}]/gu, '').replace(/\s{2,}/g, ' ').trim();

// Parse a line into segments: { text, bold, italic, code }
interface TextSegment {
  text: string;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
}

const parseInlineMarkdown = (line: string): TextSegment[] => {
  const segments: TextSegment[] = [];
  // Match **bold**, *italic*, `code`, and [n] citation refs
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: stripEmoji(line.slice(lastIndex, match.index)) });
    }
    if (match[2]) segments.push({ text: stripEmoji(match[2]), bold: true });
    else if (match[3]) segments.push({ text: stripEmoji(match[3]), italic: true });
    else if (match[4]) segments.push({ text: stripEmoji(match[4]), code: true });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < line.length) {
    segments.push({ text: stripEmoji(line.slice(lastIndex)) });
  }
  return segments.length ? segments : [{ text: stripEmoji(line) }];
};

// ─── PDF ────────────────────────────────────────────────────────────────
export const generatePDF = async (message: Message): Promise<Blob> => {
  const pdf = new jsPDF();
  const pw = pdf.internal.pageSize.getWidth();
  const ph = pdf.internal.pageSize.getHeight();
  const m = 20;
  const cw = pw - m * 2;
  let y = 25;

  const checkPage = (need: number) => {
    if (y + need > ph - 25) { pdf.addPage(); y = 25; }
  };

  // ── Title (model name) ──
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.setTextColor(20, 20, 20);
  pdf.text(stripEmoji(getModelLabel(message)), m, y);
  y += 7;

  // ── Timestamp ──
  if (message.createdAt) {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(130, 130, 130);
    pdf.text(formatDate(message.createdAt), m, y);
  }
  y += 10;

  // ── Separator ──
  pdf.setDrawColor(210, 210, 210);
  pdf.line(m, y, pw - m, y);
  y += 10;

  // ── Render inline segments on one logical line ──
  const renderSegments = (segments: TextSegment[], x: number, maxW: number) => {
    // For simplicity, join text, apply dominant style per-line wrapping
    const fullText = segments.map(s => s.text).join('');
    const hasBold = segments.some(s => s.bold);

    if (hasBold && segments.length <= 2 && segments[0]?.bold) {
      // Entire line is bold (heading-like)
      pdf.setFont('helvetica', 'bold');
    } else {
      pdf.setFont('helvetica', 'normal');
    }
    pdf.setFontSize(11);
    pdf.setTextColor(30, 30, 30);

    const wrapped = pdf.splitTextToSize(fullText, maxW);
    wrapped.forEach((wl: string) => {
      checkPage(6);
      pdf.text(wl, x, y);
      y += 5.5;
    });
  };

  // ── Body ──
  const lines = message.content.split('\n');
  let inCodeBlock = false;

  for (const line of lines) {
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) {
      pdf.setFont('courier', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(50, 50, 50);
      const clean = stripEmoji(line);
      const wrapped = pdf.splitTextToSize(clean, cw - 16);
      wrapped.forEach((wl: string) => {
        checkPage(7);
        pdf.setFillColor(245, 245, 245);
        pdf.rect(m, y - 4, cw, 6, 'F');
        pdf.text(wl, m + 5, y);
        y += 5;
      });
    } else if (line.startsWith('### ')) {
      checkPage(10);
      y += 3;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.setTextColor(20, 20, 20);
      pdf.text(stripEmoji(line.replace(/^###\s+/, '')), m, y);
      y += 7;
    } else if (line.startsWith('## ')) {
      checkPage(10);
      y += 4;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(13);
      pdf.setTextColor(20, 20, 20);
      pdf.text(stripEmoji(line.replace(/^##\s+/, '')), m, y);
      y += 7;
    } else if (line.startsWith('# ')) {
      checkPage(12);
      y += 4;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(20, 20, 20);
      pdf.text(stripEmoji(line.replace(/^#\s+/, '')), m, y);
      y += 8;
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const content = line.replace(/^[-*]\s+/, '');
      const segments = parseInlineMarkdown(content);
      const fullText = '\u2022  ' + segments.map(s => s.text).join('');
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      pdf.setTextColor(30, 30, 30);
      const wrapped = pdf.splitTextToSize(fullText, cw - 10);
      wrapped.forEach((wl: string) => {
        checkPage(6);
        pdf.text(wl, m + 6, y);
        y += 5.5;
      });
    } else if (line.trim() === '') {
      y += 4;
    } else {
      const segments = parseInlineMarkdown(line);
      renderSegments(segments, m, cw);
    }
  }

  // ── Citations ──
  if (message.citations && message.citations.length > 0) {
    y += 8;
    checkPage(20);
    pdf.setDrawColor(210, 210, 210);
    pdf.line(m, y, pw - m, y);
    y += 8;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(40, 40, 40);
    pdf.text('Sources', m, y);
    y += 7;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(60, 100, 180);
    message.citations.forEach((url, i) => {
      checkPage(6);
      const label = `[${i + 1}] ${url}`;
      const wrapped = pdf.splitTextToSize(label, cw);
      wrapped.forEach((wl: string) => {
        pdf.text(wl, m, y);
        y += 4.5;
      });
    });
  }

  // ── Page numbers ──
  const pages = pdf.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(160, 160, 160);
    pdf.text(`${i} / ${pages}`, pw - m, ph - 10, { align: 'right' });
  }

  return pdf.output('blob');
};

// ─── Markdown ───────────────────────────────────────────────────────────
export const generateMarkdown = (message: Message): string => {
  const modelLabel = getModelLabel(message);
  const timestamp = message.createdAt ? formatDate(message.createdAt) : '';
  let md = `# ${modelLabel}\n`;
  if (timestamp) md += `_${timestamp}_\n`;
  md += `\n---\n\n${message.content}\n`;

  if (message.citations && message.citations.length > 0) {
    md += `\n---\n\n### Sources\n\n`;
    message.citations.forEach((url, i) => {
      md += `${i + 1}. ${url}\n`;
    });
  }
  return md;
};

// ─── DOCX ───────────────────────────────────────────────────────────────
export const generateDOCX = async (message: Message): Promise<Blob> => {
  const children: Paragraph[] = [];
  const modelLabel = getModelLabel(message);
  const timestamp = message.createdAt ? formatDate(message.createdAt) : '';

  // Title
  children.push(new Paragraph({
    children: [new TextRun({ text: modelLabel, bold: true, size: 28, color: '222222' })],
    spacing: { after: 60 },
  }));

  if (timestamp) {
    children.push(new Paragraph({
      children: [new TextRun({ text: timestamp, size: 18, color: '888888', italics: true })],
      spacing: { after: 200 },
    }));
  }

  // Separator
  children.push(new Paragraph({
    children: [new TextRun({ text: '─'.repeat(50), color: 'CCCCCC', size: 16 })],
    spacing: { before: 100, after: 200 },
  }));

  // Body
  const lines = message.content.split('\n');
  let inCode = false;
  for (const line of lines) {
    if (line.startsWith('```')) { inCode = !inCode; continue; }
    if (inCode) {
      children.push(new Paragraph({
        children: [new TextRun({ text: line, font: 'Consolas', size: 19, color: '333333' })],
        spacing: { after: 40 },
        shading: { type: 'clear' as any, fill: 'F3F4F6' },
      }));
    } else if (line.startsWith('## ')) {
      children.push(new Paragraph({
        children: [new TextRun({ text: line.replace(/^##\s+/, ''), bold: true, size: 24, color: '222222' })],
        spacing: { before: 200, after: 100 },
      }));
    } else if (line.startsWith('# ')) {
      children.push(new Paragraph({
        children: [new TextRun({ text: line.replace(/^#\s+/, ''), bold: true, size: 26, color: '222222' })],
        spacing: { before: 240, after: 120 },
      }));
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      children.push(new Paragraph({
        children: [new TextRun({ text: `•  ${line.replace(/^[-*]\s+/, '')}`, size: 22, color: '333333' })],
        spacing: { after: 60 },
        indent: { left: 360 },
      }));
    } else if (line.trim() === '') {
      children.push(new Paragraph({ children: [], spacing: { after: 100 } }));
    } else {
      const clean = line.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1').replace(/`(.*?)`/g, '$1');
      children.push(new Paragraph({
        children: [new TextRun({ text: clean, size: 22, color: '333333' })],
        spacing: { after: 80 },
      }));
    }
  }

  // Citations
  if (message.citations && message.citations.length > 0) {
    children.push(new Paragraph({
      children: [new TextRun({ text: '─'.repeat(50), color: 'CCCCCC', size: 16 })],
      spacing: { before: 300, after: 200 },
    }));
    children.push(new Paragraph({
      children: [new TextRun({ text: 'Sources', bold: true, size: 24, color: '444444' })],
      spacing: { after: 120 },
    }));
    message.citations.forEach((url, i) => {
      children.push(new Paragraph({
        children: [new TextRun({ text: `[${i + 1}] ${url}`, size: 18, color: '4A7FC1' })],
        spacing: { after: 60 },
      }));
    });
  }

  const doc = new Document({ sections: [{ children }] });
  return await Packer.toBlob(doc);
};

// ─── ZIP ────────────────────────────────────────────────────────────────
export const generateZIP = async (message: Message): Promise<Blob> => {
  const zip = new JSZip();
  zip.file('answer.pdf', await generatePDF(message));
  zip.file('answer.md', generateMarkdown(message));
  zip.file('answer.docx', await generateDOCX(message));
  zip.file('answer.txt', message.content);
  return await zip.generateAsync({ type: 'blob' });
};

// ─── Download triggers ──────────────────────────────────────────────────
const timestamp = () => new Date().toISOString().slice(0, 10);

export const exportAsPDF = async (message: Message) => {
  saveAs(await generatePDF(message), `sorix-answer-${timestamp()}.pdf`);
};

export const exportAsMarkdown = (message: Message) => {
  const md = generateMarkdown(message);
  saveAs(new Blob([md], { type: 'text/markdown;charset=utf-8' }), `sorix-answer-${timestamp()}.md`);
};

export const exportAsDOCX = async (message: Message) => {
  saveAs(await generateDOCX(message), `sorix-answer-${timestamp()}.docx`);
};

export const exportAsZIP = async (message: Message) => {
  saveAs(await generateZIP(message), `sorix-answer-${timestamp()}.zip`);
};
