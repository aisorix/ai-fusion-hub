import React from 'react';
import { Download, FileImage, FileText, FileCode } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface FlowExportActionsProps {
  code: string;
}

const FlowExportActions: React.FC<FlowExportActionsProps> = ({ code }) => {
  if (!code.trim()) return null;

  const getSvgElement = (): SVGElement | null => {
    return document.querySelector('#diagram-preview-container svg') as SVGElement | null;
  };

  const getSvgDimensions = (svg: SVGElement) => {
    const bbox = svg.getBBox();
    const w = parseFloat(svg.getAttribute('width') || '') || bbox.width || 800;
    const h = parseFloat(svg.getAttribute('height') || '') || bbox.height || 600;
    return { width: Math.ceil(w), height: Math.ceil(h) };
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
    const { width, height } = getSvgDimensions(svg);
    const cloned = svg.cloneNode(true) as SVGElement;
    cloned.setAttribute('width', String(width));
    cloned.setAttribute('height', String(height));
    const svgData = new XMLSerializer().serializeToString(cloned);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const w = img.naturalWidth || width;
      const h = img.naturalHeight || height;
      canvas.width = w * 2;
      canvas.height = h * 2;
      ctx.scale(2, 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
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
    const { width, height } = getSvgDimensions(svg);
    const cloned = svg.cloneNode(true) as SVGElement;
    cloned.setAttribute('width', String(width));
    cloned.setAttribute('height', String(height));
    const svgData = new XMLSerializer().serializeToString(cloned);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const w = img.naturalWidth || width;
      const h = img.naturalHeight || height;
      canvas.width = w * 2;
      canvas.height = h * 2;
      ctx.scale(2, 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: w > h ? 'landscape' : 'portrait',
        unit: 'px',
        format: [w, h],
      });
      pdf.addImage(imgData, 'PNG', 0, 0, w, h);
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
