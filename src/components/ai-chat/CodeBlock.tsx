import React, { useState, useCallback, memo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Play, ChevronDown, ChevronUp, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChatStore } from '@/stores/chatStore';
import { cn } from '@/lib/utils';
import copy from 'copy-to-clipboard';

interface CodeBlockProps {
  code: string;
  language: string;
}

export const CodeBlock = memo(({ code, language }: CodeBlockProps) => {
  const { theme } = useChatStore();
  const [copied, setCopied] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCopy = useCallback(() => {
    copy(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  const handleRun = useCallback(async () => {
    if (language !== 'javascript' && language !== 'js') return;

    setIsRunning(true);
    setError(null);
    setOutput(null);

    try {
      // Create a sandboxed environment
      const logs: string[] = [];
      const mockConsole = {
        log: (...args: any[]) => logs.push(args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ')),
        error: (...args: any[]) => logs.push(`Error: ${args.join(' ')}`),
        warn: (...args: any[]) => logs.push(`Warning: ${args.join(' ')}`),
        info: (...args: any[]) => logs.push(`Info: ${args.join(' ')}`),
      };

      // Execute in a try-catch with timeout
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
      const fn = new AsyncFunction('console', code);
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Execution timed out (5s)')), 5000)
      );
      
      await Promise.race([fn(mockConsole), timeoutPromise]);

      setOutput(logs.length > 0 ? logs.join('\n') : 'No output');
    } catch (err: any) {
      setError(err.message || 'Execution failed');
    } finally {
      setIsRunning(false);
    }
  }, [code, language]);

  const lineCount = code.split('\n').length;
  const canRun = language === 'javascript' || language === 'js';

  return (
    <div className="rounded-lg overflow-hidden border border-border my-3 group">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground uppercase">
            {language}
          </span>
          {lineCount > 20 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? (
                <>
                  <ChevronDown className="h-3 w-3 mr-1" />
                  Expand ({lineCount} lines)
                </>
              ) : (
                <>
                  <ChevronUp className="h-3 w-3 mr-1" />
                  Collapse
                </>
              )}
            </Button>
          )}
        </div>

        <div className="flex items-center gap-1">
          {canRun && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs gap-1"
              onClick={handleRun}
              disabled={isRunning}
            >
              {isRunning ? (
                <div className="h-3 w-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <Play className="h-3 w-3" />
              )}
              Run
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs gap-1"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-green-500" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                Copy
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Code */}
      <div className={cn(collapsed && 'max-h-32 overflow-hidden relative')}>
        <SyntaxHighlighter
          language={language}
          style={theme === 'dark' ? oneDark : oneLight}
          customStyle={{
            margin: 0,
            padding: '1rem',
            fontSize: '0.875rem',
            lineHeight: 1.5,
            background: theme === 'dark' ? '#1e1e1e' : '#f8f8f8',
          }}
          showLineNumbers={lineCount > 5}
          wrapLines
        >
          {code}
        </SyntaxHighlighter>
        {collapsed && (
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background to-transparent" />
        )}
      </div>

      {/* Output */}
      {(output || error) && (
        <div className="border-t border-border">
          <div className="flex items-center gap-2 px-4 py-2 bg-muted/30">
            <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Output</span>
          </div>
          <pre className={cn(
            'p-4 text-sm font-mono overflow-x-auto',
            error ? 'text-red-500 bg-red-500/10' : 'text-foreground bg-muted/20'
          )}>
            {error || output}
          </pre>
        </div>
      )}
    </div>
  );
});

CodeBlock.displayName = 'CodeBlock';
