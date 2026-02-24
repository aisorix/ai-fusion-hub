import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Slide } from '@/services/deckApi';
import type { DeckTheme } from './DeckThemePicker';

interface DeckActionsProps {
  slides: Slide[];
  title: string;
  theme: DeckTheme;
}

const themeColors: Record<string, { bg: string; text: string; accent: string }> = {
  dark: { bg: '#1a1a2e', text: '#ffffff', accent: '#00d4ff' },
  'cyan-blue': { bg: '#0891b2', text: '#ffffff', accent: '#22d3ee' },
  minimalist: { bg: '#ffffff', text: '#1a1a1a', accent: '#6366f1' },
  sunset: { bg: '#ea580c', text: '#ffffff', accent: '#f59e0b' },
  pearl: { bg: '#f3f4f6', text: '#111827', accent: '#6b7280' },
  vortex: { bg: '#000000', text: '#ffffff', accent: '#a3a3a3' },
  clementa: { bg: '#fef3c7', text: '#92400e', accent: '#d97706' },
  stratos: { bg: '#0f172a', text: '#ffffff', accent: '#94a3b8' },
  nova: { bg: '#3b82f6', text: '#ffffff', accent: '#a855f7' },
  twilight: { bg: '#fecdd3', text: '#881337', accent: '#e11d48' },
  creme: { bg: '#e7e5e4', text: '#44403c', accent: '#78716c' },
  lux: { bg: '#134e4a', text: '#a7f3d0', accent: '#34d399' },
  marine: { bg: '#115e59', text: '#ffffff', accent: '#2dd4bf' },
  consultant: { bg: '#f3f4f6', text: '#374151', accent: '#6b7280' },
  lavender: { bg: '#ddd6fe', text: '#4c1d95', accent: '#7c3aed' },
  indigo: { bg: '#312e81', text: '#ffffff', accent: '#818cf8' },
  gamma: { bg: '#fff1f2', text: '#ea580c', accent: '#f97316' },
  founder: { bg: '#581c87', text: '#ffffff', accent: '#a855f7' },
  atmosphere: { bg: '#f9a8d4', text: '#be185d', accent: '#ec4899' },
  blueberry: { bg: '#581c87', text: '#ffffff', accent: '#c084fc' },
  sage: { bg: '#dcfce7', text: '#14532d', accent: '#22c55e' },
  coal: { bg: '#134e4a', text: '#ffffff', accent: '#9ca3af' },
};

const DeckActions: React.FC<DeckActionsProps> = ({ slides, title, theme }) => {
  const [exporting, setExporting] = useState<string | null>(null);

  if (slides.length === 0) return null;

  const safeTitle = title.replace(/\s+/g, '_').replace(/[^\w-]/g, '');

  const handleExportPDF = async () => {
    setExporting('pdf');
    try {
      const { default: jsPDF } = await import('jspdf');
      const colors = themeColors[theme] || themeColors.dark;
      const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: [960, 540] });

      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        if (i > 0) doc.addPage([960, 540], 'landscape');

        // Background
        doc.setFillColor(colors.bg);
        doc.rect(0, 0, 960, 540, 'F');

        // Slide number badge
        doc.setFontSize(10);
        doc.setTextColor(colors.accent);
        doc.text(`Slide ${slide.slide_number}`, 30, 35);

        if (slide.layout === 'full-image') {
          // Image as background if available
          if (slide.image_url) {
            try {
              const imgData = await loadImageAsBase64(slide.image_url);
              doc.addImage(imgData, 'JPEG', 0, 0, 960, 540);
              // Dark overlay for text
              doc.setFillColor(0, 0, 0);
              doc.setGState(new (doc as any).GState({ opacity: 0.5 }));
              doc.rect(0, 350, 960, 190, 'F');
              doc.setGState(new (doc as any).GState({ opacity: 1 }));
            } catch {
              // skip image
            }
          }
          doc.setFontSize(28);
          doc.setTextColor('#ffffff');
          doc.text(slide.heading, 40, 440, { maxWidth: 880 });
        } else if (slide.layout === 'split') {
          // Left side: text
          doc.setFontSize(22);
          doc.setTextColor(colors.text);
          doc.text(slide.heading, 40, 80, { maxWidth: 420 });

          doc.setFontSize(13);
          let bulletY = 120;
          slide.bullet_points.forEach((bp) => {
            doc.text(`•  ${bp}`, 50, bulletY, { maxWidth: 400 });
            bulletY += 28;
          });

          // Right side: image
          if (slide.image_url) {
            try {
              const imgData = await loadImageAsBase64(slide.image_url);
              doc.addImage(imgData, 'JPEG', 490, 40, 440, 460);
            } catch {
              // skip
            }
          }
        } else {
          // text-only
          doc.setFontSize(24);
          doc.setTextColor(colors.text);
          doc.text(slide.heading, 40, 80, { maxWidth: 880 });

          doc.setFontSize(14);
          let bulletY = 130;
          slide.bullet_points.forEach((bp) => {
            doc.text(`•  ${bp}`, 50, bulletY, { maxWidth: 860 });
            bulletY += 30;
          });
        }
      }

      doc.save(`${safeTitle}.pdf`);
      toast.success('PDF exported successfully');
    } catch (err) {
      console.error('PDF export error:', err);
      toast.error('Failed to export PDF');
    } finally {
      setExporting(null);
    }
  };

  const handleExportPPTX = async () => {
    setExporting('pptx');
    try {
      const PptxGenJS = (await import('pptxgenjs')).default;
      const pptx = new PptxGenJS();
      pptx.title = title;
      pptx.layout = 'LAYOUT_WIDE'; // 13.33 x 7.5 inches

      const colors = themeColors[theme] || themeColors.dark;

      for (const slide of slides) {
        const pptSlide = pptx.addSlide();
        pptSlide.background = { color: colors.bg.replace('#', '') };

        // Slide number
        pptSlide.addText(`Slide ${slide.slide_number}`, {
          x: 0.3, y: 0.2, w: 2, h: 0.3,
          fontSize: 9, color: colors.accent.replace('#', ''),
          fontFace: 'Arial',
        });

        if (slide.layout === 'full-image') {
          if (slide.image_url) {
            try {
              const imgData = await loadImageAsBase64(slide.image_url);
              pptSlide.addImage({ data: imgData, x: 0, y: 0, w: '100%', h: '100%' });
            } catch {
              // skip
            }
          }
          // Heading overlay
          pptSlide.addShape('rect' as any, {
            x: 0, y: 5.0, w: '100%', h: 2.5,
            fill: { color: '000000', transparency: 50 },
          });
          pptSlide.addText(slide.heading, {
            x: 0.5, y: 5.2, w: 12, h: 1.5,
            fontSize: 32, color: 'FFFFFF', fontFace: 'Arial',
            bold: true, valign: 'middle',
          });
        } else if (slide.layout === 'split') {
          // Left: text
          pptSlide.addText(slide.heading, {
            x: 0.4, y: 0.7, w: 5.8, h: 1,
            fontSize: 24, color: colors.text.replace('#', ''),
            fontFace: 'Arial', bold: true,
          });

          const bulletText = slide.bullet_points.map((bp) => ({
            text: bp,
            options: {
              fontSize: 13,
              color: colors.text.replace('#', ''),
              fontFace: 'Arial',
              bullet: true,
              paraSpaceAfter: 6,
            },
          }));
          pptSlide.addText(bulletText as any, {
            x: 0.4, y: 1.8, w: 5.8, h: 4.5,
            valign: 'top',
          });

          // Right: image
          if (slide.image_url) {
            try {
              const imgData = await loadImageAsBase64(slide.image_url);
              pptSlide.addImage({ data: imgData, x: 6.6, y: 0.5, w: 6.3, h: 6.5 });
            } catch {
              // skip
            }
          }
        } else {
          // text-only
          pptSlide.addText(slide.heading, {
            x: 0.5, y: 0.8, w: 12, h: 1.2,
            fontSize: 28, color: colors.text.replace('#', ''),
            fontFace: 'Arial', bold: true,
          });

          const bulletText = slide.bullet_points.map((bp) => ({
            text: bp,
            options: {
              fontSize: 15,
              color: colors.text.replace('#', ''),
              fontFace: 'Arial',
              bullet: true,
              paraSpaceAfter: 8,
            },
          }));
          pptSlide.addText(bulletText as any, {
            x: 0.5, y: 2.2, w: 12, h: 4.5,
            valign: 'top',
          });
        }
      }

      await pptx.writeFile({ fileName: `${safeTitle}.pptx` });
      toast.success('PPTX exported successfully');
    } catch (err) {
      console.error('PPTX export error:', err);
      toast.error('Failed to export PPTX');
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={handleExportPDF}
        disabled={!!exporting}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors disabled:opacity-50"
      >
        {exporting === 'pdf' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
        Export PDF
      </button>
      <button
        onClick={handleExportPPTX}
        disabled={!!exporting}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 transition-colors disabled:opacity-50"
      >
        {exporting === 'pptx' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileSpreadsheet className="w-3.5 h-3.5" />}
        Export PPTX
      </button>
      <button
        onClick={() => {
          const blob = new Blob([JSON.stringify({ title, slides }, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${safeTitle}.json`;
          a.click();
          URL.revokeObjectURL(url);
        }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-muted hover:bg-muted/80 text-foreground transition-colors"
      >
        <Download className="w-3.5 h-3.5" />
        JSON
      </button>
    </div>
  );
};

/** Convert image URL to base64 data URI */
async function loadImageAsBase64(url: string): Promise<string> {
  // If already base64
  if (url.startsWith('data:image')) return url;

  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export default DeckActions;
