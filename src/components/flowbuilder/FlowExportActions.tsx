import React from 'react';
import { FileImage, FileText, FileCode } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface FlowExportActionsProps {
  code: string;
}

const STYLE_PROPS = [
  'fill', 'stroke', 'stroke-width', 'stroke-dasharray', 'stroke-linecap', 'stroke-linejoin',
  'opacity', 'fill-opacity', 'stroke-opacity',
  'font-family', 'font-size', 'font-weight', 'font-style',
  'text-anchor', 'dominant-baseline', 'color',
  'visibility', 'display',
];

const cloneWithInlineStyles = (original: SVGElement): SVGElement => {
  const clone = original.cloneNode(true) as SVGElement;
  const origEls = original.querySelectorAll('*');
  const cloneEls = clone.querySelectorAll('*');

  origEls.forEach((origEl, i) => {
    const cloneEl = cloneEls[i] as HTMLElement | SVGElement;
    if (!cloneEl) return;
    const computed = window.getComputedStyle(origEl);
    STYLE_PROPS.forEach((prop) => {
      const val = computed.getPropertyValue(prop);
      if (val && val !== '' && val !== 'none' && val !== 'normal' && val !== 'auto') {
        (cloneEl as HTMLElement).style.setProperty(prop, val);
      }
    });
  });

  return clone;
};

const prepareSvgForExport = (svg: SVGElement): { clone: SVGElement; width: number; height: number } => {
  const clone = cloneWithInlineStyles(svg);
  const svgEl = svg as unknown as SVGSVGElement;

  const bbox = svgEl.getBBox();
  const pad = 20;
  const width = Math.ceil(bbox.width + bbox.x + pad * 2);
  const height = Math.ceil(bbox.height + bbox.y + pad * 2);

  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  clone.setAttribute('width', String(width));
  clone.setAttribute('height', String(height));
  clone.setAttribute('viewBox', `0 0 ${width} ${height}`);

  // Add white background rect as first child
  const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bgRect.setAttribute('width', String(width));
  bgRect.setAttribute('height', String(height));
  bgRect.setAttribute('fill', '#ffffff');
  clone.insertBefore(bgRect, clone.firstChild);

  return { clone, width, height };
};

const getSvgElement = (): SVGElement | null => {
  return document.querySelector('#diagram-preview-container svg') as SVGElement | null;
};

const FlowExportActions: React.FC<FlowExportActionsProps> = ({ code }) => {
  if (!code.trim()) return null;

  const exportSVG = () => {
    const svg = getSvgElement();
    if (!svg) return;
    const { clone } = prepareSvgForExport(svg);
    const svgData = new XMLSerializer().serializeToString(clone);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diagram.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderToCanvas = (callback: (canvas: HTMLCanvasElement, w: number, h: number) => void) => {
    const svg = getSvgElement();
    if (!svg) return;
    const { clone, width, height } = prepareSvgForExport(svg);
    const svgData = new XMLSerializer().serializeToString(clone);
    const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);

    const img = new Image();
    img.onload = () => {
      const scale = 2;
      const canvas = document.createElement('canvas');
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext('2d')!;
      ctx.scale(scale, scale);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      callback(canvas, width, height);
    };
    img.src = dataUrl;
  };

  const exportPNG = () => {
    renderToCanvas((canvas) => {
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = 'diagram.png';
      a.click();
    });
  };

  const exportPDF = () => {
    renderToCanvas((canvas, w, h) => {
      const margin = 30;
      const pdf = new jsPDF({
        orientation: w > h ? 'landscape' : 'portrait',
        unit: 'px',
        format: [w + margin * 2, h + margin * 2],
      });
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', margin, margin, w, h);
      pdf.save('diagram.pdf');
    });
  };

  return (
    <div className="flex items-center gap-1 md:gap-1.5">
      <button onClick={exportPNG} className="flex items-center gap-1 md:gap-1.5 px-1.5 py-1 md:px-3 md:py-1.5 rounded-lg border border-border/50 bg-muted/20 text-xs text-muted-foreground hover:text-foreground hover:border-border transition-all" title="Export PNG">
        <FileImage className="w-3.5 h-3.5" /> <span className="hidden md:inline">PNG</span>
      </button>
      <button onClick={exportSVG} className="flex items-center gap-1 md:gap-1.5 px-1.5 py-1 md:px-3 md:py-1.5 rounded-lg border border-border/50 bg-muted/20 text-xs text-muted-foreground hover:text-foreground hover:border-border transition-all" title="Export SVG">
        <FileCode className="w-3.5 h-3.5" /> <span className="hidden md:inline">SVG</span>
      </button>
      <button onClick={exportPDF} className="flex items-center gap-1 md:gap-1.5 px-1.5 py-1 md:px-3 md:py-1.5 rounded-lg border border-border/50 bg-muted/20 text-xs text-muted-foreground hover:text-foreground hover:border-border transition-all" title="Export PDF">
        <FileText className="w-3.5 h-3.5" /> <span className="hidden md:inline">PDF</span>
      </button>
    </div>
  );
};

export default FlowExportActions;
