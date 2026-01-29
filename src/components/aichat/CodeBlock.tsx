import React, { useState, useCallback, memo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Terminal, ChevronDown, ChevronUp, Play, Loader2, X } from 'lucide-react';
import copy from 'copy-to-clipboard';
import { useChatStore } from '@/stores/chatStore';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  language?: string;
  children: string;
}

const languageDisplayNames: Record<string, string> = {
  javascript: 'JavaScript',
  js: 'JavaScript',
  typescript: 'TypeScript',
  ts: 'TypeScript',
  python: 'Python',
  py: 'Python',
  java: 'Java',
  cpp: 'C++',
  'c++': 'C++',
  c: 'C',
  csharp: 'C#',
  cs: 'C#',
  go: 'Go',
  golang: 'Go',
  rust: 'Rust',
  rs: 'Rust',
  ruby: 'Ruby',
  rb: 'Ruby',
  php: 'PHP',
  swift: 'Swift',
  kotlin: 'Kotlin',
  kt: 'Kotlin',
  scala: 'Scala',
  sql: 'SQL',
  mysql: 'MySQL',
  postgresql: 'PostgreSQL',
  html: 'HTML',
  css: 'CSS',
  scss: 'SCSS',
  sass: 'Sass',
  less: 'Less',
  json: 'JSON',
  yaml: 'YAML',
  yml: 'YAML',
  xml: 'XML',
  markdown: 'Markdown',
  md: 'Markdown',
  bash: 'Bash',
  sh: 'Shell',
  shell: 'Shell',
  zsh: 'Zsh',
  powershell: 'PowerShell',
  ps1: 'PowerShell',
  dockerfile: 'Dockerfile',
  docker: 'Docker',
  jsx: 'JSX',
  tsx: 'TSX',
  vue: 'Vue',
  svelte: 'Svelte',
  graphql: 'GraphQL',
  gql: 'GraphQL',
  regex: 'Regex',
  lua: 'Lua',
  perl: 'Perl',
  r: 'R',
  matlab: 'MATLAB',
  julia: 'Julia',
  haskell: 'Haskell',
  hs: 'Haskell',
  elixir: 'Elixir',
  ex: 'Elixir',
  erlang: 'Erlang',
  clojure: 'Clojure',
  clj: 'Clojure',
  fsharp: 'F#',
  fs: 'F#',
  dart: 'Dart',
  objectivec: 'Objective-C',
  objc: 'Objective-C',
  groovy: 'Groovy',
  ini: 'INI',
  toml: 'TOML',
  makefile: 'Makefile',
  cmake: 'CMake',
  nginx: 'Nginx',
  apache: 'Apache',
  diff: 'Diff',
  git: 'Git',
  latex: 'LaTeX',
  tex: 'LaTeX',
  csv: 'CSV',
  plaintext: 'Plain Text',
  text: 'Plain Text',
  txt: 'Plain Text',
};

// Languages that can be executed
const executableLanguages = ['javascript', 'js', 'python', 'py'];

const normalizeLanguage = (lang: string): string => {
  const lower = lang.toLowerCase();
  const aliases: Record<string, string> = {
    js: 'javascript',
    ts: 'typescript',
    py: 'python',
    rb: 'ruby',
    rs: 'rust',
    cs: 'csharp',
    'c++': 'cpp',
    golang: 'go',
    yml: 'yaml',
    md: 'markdown',
    sh: 'bash',
    zsh: 'bash',
    ps1: 'powershell',
    hs: 'haskell',
    ex: 'elixir',
    clj: 'clojure',
    fs: 'fsharp',
    objc: 'objectivec',
    kt: 'kotlin',
    gql: 'graphql',
    tex: 'latex',
    txt: 'plaintext',
    text: 'plaintext',
  };
  return aliases[lower] || lower;
};

const CodeBlock = memo(({ language, children }: CodeBlockProps) => {
  const { theme } = useChatStore();
  const [copied, setCopied] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleCopy = useCallback(() => {
    copy(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [children]);

  const runJavaScript = useCallback((code: string): Promise<string> => {
    return new Promise((resolve) => {
      const logs: string[] = [];
      const originalConsole = { ...console };
      
      // Override console methods
      const captureLog = (...args: any[]) => {
        logs.push(args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
      };
      
      console.log = captureLog;
      console.info = captureLog;
      console.warn = (...args) => logs.push(`⚠️ ${args.join(' ')}`);
      console.error = (...args) => logs.push(`❌ ${args.join(' ')}`);
      
      try {
        // Create a safe execution context
        const result = new Function(`
          'use strict';
          ${code}
        `)();
        
        if (result !== undefined) {
          logs.push(`→ ${typeof result === 'object' ? JSON.stringify(result, null, 2) : result}`);
        }
        
        resolve(logs.length > 0 ? logs.join('\n') : '✓ Code executed successfully (no output)');
      } catch (err) {
        resolve(`❌ Error: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        // Restore console
        Object.assign(console, originalConsole);
      }
    });
  }, []);

  const runPython = useCallback(async (code: string): Promise<string> => {
    // For Python, we'll show a message since we can't run it in browser
    // In a real app, this would call a backend service
    return `🐍 Python execution requires a backend service.\n\nCode preview:\n${code.split('\n').slice(0, 5).join('\n')}${code.split('\n').length > 5 ? '\n...' : ''}`;
  }, []);

  const handleRun = useCallback(async () => {
    const normalizedLang = normalizeLanguage(language || '');
    setIsRunning(true);
    setOutput(null);
    setError(null);
    
    try {
      let result: string;
      
      if (normalizedLang === 'javascript') {
        result = await runJavaScript(children);
      } else if (normalizedLang === 'python') {
        result = await runPython(children);
      } else {
        result = 'Execution not supported for this language';
      }
      
      setOutput(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Execution failed');
    } finally {
      setIsRunning(false);
    }
  }, [language, children, runJavaScript, runPython]);

  const clearOutput = useCallback(() => {
    setOutput(null);
    setError(null);
  }, []);
  
  const displayLanguage = language ? normalizeLanguage(language) : 'plaintext';
  const languageName = languageDisplayNames[language?.toLowerCase() || ''] || 
                       languageDisplayNames[displayLanguage] || 
                       displayLanguage;
  const lines = children.split('\n');
  const hasMultipleLines = lines.length > 1;
  const isLongCode = lines.length > 20;
  const canExecute = executableLanguages.includes(displayLanguage);
  
  return (
    <div className={cn(
      'relative group my-4 rounded-xl overflow-hidden border',
      theme === 'dark' 
        ? 'bg-[hsl(220,20%,10%)] border-border/50' 
        : 'bg-[hsl(220,20%,97%)] border-border'
    )}>
      {/* Header */}
      <div className={cn(
        'flex items-center justify-between px-4 py-2.5',
        theme === 'dark' 
          ? 'bg-[hsl(220,20%,14%)] border-b border-border/50' 
          : 'bg-[hsl(220,15%,93%)] border-b border-border'
      )}>
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium text-foreground">
            {languageName}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          {/* Run Button for executable languages */}
          {canExecute && (
            <button
              onClick={handleRun}
              disabled={isRunning}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-all',
                theme === 'dark'
                  ? 'hover:bg-green-500/20 text-green-400 hover:text-green-300'
                  : 'hover:bg-green-500/10 text-green-600 hover:text-green-700',
                isRunning && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Running...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Run</span>
                </>
              )}
            </button>
          )}

          {isLongCode && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={cn(
                'flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-md transition-all',
                theme === 'dark'
                  ? 'hover:bg-white/10 text-muted-foreground hover:text-foreground'
                  : 'hover:bg-black/5 text-muted-foreground hover:text-foreground'
              )}
            >
              {isCollapsed ? (
                <>
                  <ChevronDown className="w-3 h-3" />
                  <span>Expand</span>
                </>
              ) : (
                <>
                  <ChevronUp className="w-3 h-3" />
                  <span>Collapse</span>
                </>
              )}
            </button>
          )}
          
          <button
            onClick={handleCopy}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-all',
              theme === 'dark'
                ? 'hover:bg-white/10 text-muted-foreground hover:text-foreground'
                : 'hover:bg-black/5 text-muted-foreground hover:text-foreground',
              copied && 'text-green-500 hover:text-green-500'
            )}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Code */}
      <div className={cn(
        'overflow-x-auto transition-all duration-300',
        isCollapsed && 'max-h-[200px] overflow-hidden relative'
      )}>
        <SyntaxHighlighter
          language={displayLanguage}
          style={theme === 'dark' ? oneDark : oneLight}
          customStyle={{
            margin: 0,
            padding: '1rem 1.25rem',
            background: 'transparent',
            fontSize: '0.8125rem',
            lineHeight: '1.7'
          }}
          showLineNumbers={hasMultipleLines && lines.length > 3}
          lineNumberStyle={{
            minWidth: '2.5em',
            paddingRight: '1em',
            color: theme === 'dark' ? 'hsl(220,15%,35%)' : 'hsl(220,10%,65%)',
            userSelect: 'none'
          }}
          wrapLines={true}
        >
          {children}
        </SyntaxHighlighter>
        
        {/* Collapsed gradient overlay */}
        {isCollapsed && (
          <div className={cn(
            'absolute bottom-0 left-0 right-0 h-16 pointer-events-none',
            theme === 'dark'
              ? 'bg-gradient-to-t from-[hsl(220,20%,10%)] to-transparent'
              : 'bg-gradient-to-t from-[hsl(220,20%,97%)] to-transparent'
          )} />
        )}
      </div>
      
      {/* Footer for long code when collapsed */}
      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className={cn(
            'w-full py-2 text-xs font-medium text-primary hover:underline transition-colors',
            theme === 'dark' ? 'bg-[hsl(220,20%,12%)]' : 'bg-[hsl(220,15%,95%)]'
          )}
        >
          Show {lines.length - 10} more lines
        </button>
      )}

      {/* Output Panel */}
      {(output || error) && (
        <div className={cn(
          'border-t',
          theme === 'dark' ? 'border-border/50' : 'border-border'
        )}>
          <div className={cn(
            'flex items-center justify-between px-4 py-2',
            theme === 'dark' ? 'bg-[hsl(220,20%,12%)]' : 'bg-[hsl(220,15%,94%)]'
          )}>
            <span className={cn(
              'text-xs font-medium',
              error ? 'text-red-500' : 'text-green-500'
            )}>
              {error ? '❌ Error' : '✓ Output'}
            </span>
            <button
              onClick={clearOutput}
              className={cn(
                'p-1 rounded hover:bg-white/10 transition-colors',
                theme === 'dark' ? 'text-muted-foreground' : 'text-muted-foreground'
              )}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <pre className={cn(
            'px-4 py-3 text-xs overflow-x-auto whitespace-pre-wrap font-mono',
            theme === 'dark' ? 'bg-[hsl(220,20%,8%)]' : 'bg-[hsl(220,20%,98%)]',
            error ? 'text-red-400' : 'text-foreground'
          )}>
            {error || output}
          </pre>
        </div>
      )}
    </div>
  );
});

CodeBlock.displayName = 'CodeBlock';

export default CodeBlock;
