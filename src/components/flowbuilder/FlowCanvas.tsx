import React, { useEffect, useRef, useState, useCallback } from 'react';
import mermaid from 'mermaid';
import { ZoomIn, ZoomOut, RotateCcw, Code2, Eye } from 'lucide-react';

interface FlowCanvasProps {
  code: string;
  onCodeChange: (code: string) => void;
  isGenerating: boolean;
}

const FlowCanvas: React.FC<FlowCanvasProps> = ({ code, onCodeChange, isGenerating }) => {
  const diagramRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<'code' | 'preview'>('preview');
  const renderIdRef = useRef(0);

  const renderDiagram = useCallback(async () => {
    if (!code.trim() || !diagramRef.current) return;
    const id = ++renderIdRef.current;

    try {
      mermaid.initialize({
        startOnLoad: false,
        theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
        securityLevel: 'loose',
        fontFamily: 'inherit',
      });

      const uniqueId = `mermaid-${Date.now()}-${id}`;
      const { svg } = await mermaid.render(uniqueId, code.trim());
      if (id !== renderIdRef.current) return;
      if (diagramRef.current) {
        diagramRef.current.innerHTML = svg;
        setRenderError(null);
      }
    } catch (err: any) {
      if (id !== renderIdRef.current) return;
      setRenderError(err.message || 'Invalid Mermaid syntax');
    }
  }, [code]);

  useEffect(() => {
    const timer = setTimeout(renderDiagram, 500);
    return () => clearTimeout(timer);
  }, [renderDiagram]);

  return (
    <div className="flex-1 flex flex-col md:flex-row gap-0 border border-border/60 rounded-2xl overflow-hidden bg-card">
      {/* Mobile tabs */}
      <div className="flex md:hidden border-b border-border">
        <button
          onClick={() => setMobileTab('code')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${mobileTab === 'code' ? 'text-violet-500 border-b-2 border-violet-500' : 'text-muted-foreground'}`}
        >
          <Code2 className="w-3.5 h-3.5" /> Code
        </button>
        <button
          onClick={() => setMobileTab('preview')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${mobileTab === 'preview' ? 'text-violet-500 border-b-2 border-violet-500' : 'text-muted-foreground'}`}
        >
          <Eye className="w-3.5 h-3.5" /> Preview
        </button>
      </div>

      {/* Code Editor */}
      <div className={`${mobileTab === 'code' ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-[40%] border-r border-border/40`}>
        <div className="px-3 py-2 border-b border-border/40 flex items-center gap-2">
          <Code2 className="w-3.5 h-3.5 text-violet-500" />
          <span className="text-xs font-medium text-muted-foreground">Mermaid Code</span>
        </div>
        <textarea
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          className="flex-1 p-3 bg-transparent text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none resize-none min-h-[300px]"
          placeholder="Mermaid code will appear here..."
          spellCheck={false}
        />
      </div>

      {/* Preview */}
      <div className={`${mobileTab === 'preview' ? 'flex' : 'hidden'} md:flex flex-col flex-1`}>
        <div className="px-3 py-2 border-b border-border/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-3.5 h-3.5 text-violet-500" />
            <span className="text-xs font-medium text-muted-foreground">Preview</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setZoom(z => Math.max(0.25, z - 0.25))} className="p-1 hover:bg-muted rounded text-muted-foreground"><ZoomOut className="w-3.5 h-3.5" /></button>
            <span className="text-[10px] text-muted-foreground w-10 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(3, z + 0.25))} className="p-1 hover:bg-muted rounded text-muted-foreground"><ZoomIn className="w-3.5 h-3.5" /></button>
            <button onClick={() => setZoom(1)} className="p-1 hover:bg-muted rounded text-muted-foreground"><RotateCcw className="w-3.5 h-3.5" /></button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 min-h-[300px]">
          {isGenerating ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-3 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
              <p className="text-xs text-muted-foreground">Generating diagram...</p>
            </div>
          ) : renderError ? (
            <div className="text-center p-4">
              <p className="text-xs text-destructive mb-1">Syntax Error</p>
              <p className="text-[10px] text-muted-foreground max-w-xs">{renderError}</p>
            </div>
          ) : !code.trim() ? (
            <p className="text-xs text-muted-foreground">Your diagram will appear here</p>
          ) : (
            <div
              id="diagram-preview-container"
              ref={diagramRef}
              style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
              className="transition-transform"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FlowCanvas;
