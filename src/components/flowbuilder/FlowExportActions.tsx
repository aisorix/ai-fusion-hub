import React from 'react';
import { Download, FileImage, FileText, FileCode } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface FlowExportActionsProps {
  code: string;
}

const FlowExportActions: React.FC<FlowExportActionsProps> = ({ code }) => {
  if (!code.trim()) return null;

  const getSvgElement = (): SVGElement | null => {
    const container = document.querySelector('[data-diagram-container] svg');
    return container as SVGElement | null;
  };

  const exportSVG = () => {
    const svg = getSvgElement();
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diagram.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPNG = async () => {
    const svg = getSvgElement();
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      ctx.scale(2, 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, img.width, img.height);
      ctx.drawImage(img, 0, 0);
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = 'diagram.png';
      a.click();
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const exportPDF = async () => {
    const svg = getSvgElement();
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      ctx.scale(2, 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, img.width, img.height);
      ctx.drawImage(img, 0, 0);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: img.width > img.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [img.width, img.height],
      });
      pdf.addImage(imgData, 'PNG', 0, 0, img.width, img.height);
      pdf.save('diagram.pdf');
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <div className="flex items-center gap-1.5">
      <button onClick={exportPNG} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/50 bg-muted/20 text-xs text-muted-foreground hover:text-foreground hover:border-border transition-all" title="Export PNG">
        <FileImage className="w-3.5 h-3.5" /> PNG
      </button>
      <button onClick={exportSVG} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/50 bg-muted/20 text-xs text-muted-foreground hover:text-foreground hover:border-border transition-all" title="Export SVG">
        <FileCode className="w-3.5 h-3.5" /> SVG
      </button>
      <button onClick={exportPDF} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/50 bg-muted/20 text-xs text-muted-foreground hover:text-foreground hover:border-border transition-all" title="Export PDF">
        <FileText className="w-3.5 h-3.5" /> PDF
      </button>
    </div>
  );
};

export default FlowExportActions;
