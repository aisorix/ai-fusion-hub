import React, { memo, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import CodeBlock from './CodeBlock';
import { HealthAnalysisChart } from '@/components/health';
import { cn } from '@/lib/utils';
import 'katex/dist/katex.min.css';

// Parse health chart data from code blocks
const parseHealthChart = (code: string): any | null => {
  try {
    const parsed = JSON.parse(code);
    if (parsed.type && parsed.title && parsed.data) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
};

interface MarkdownRendererProps {
  content: string;
}

const markdownComponents = {
  code: ({ node, inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    const codeString = String(children).replace(/\n$/, '');
    
    // Check for health_chart code blocks
    if (language === 'health_chart' || className?.includes('health_chart')) {
      const chartData = parseHealthChart(codeString);
      if (chartData) {
        return <HealthAnalysisChart chartData={chartData} />;
      }
    }
    
    // Check for json:health_chart format
    if (language === 'json:health_chart') {
      const chartData = parseHealthChart(codeString);
      if (chartData) {
        return <HealthAnalysisChart chartData={chartData} />;
      }
    }
    
    if (!inline && (match || String(children).includes('\n'))) {
      return (
        <CodeBlock language={language}>
          {codeString}
        </CodeBlock>
      );
    }
    
    return (
      <code
        className="px-1.5 py-0.5 bg-secondary/80 rounded-md text-sm font-mono text-primary border border-border/50"
        {...props}
      >
        {children}
      </code>
    );
  },
  
  p: ({ children }: any) => (
    <p className="mb-4 last:mb-0 leading-7 text-[15px]">{children}</p>
  ),
  
  h1: ({ children }: any) => (
    <h1 className="text-2xl font-bold mb-4 mt-8 first:mt-0 text-foreground flex items-center gap-2">
      <span className="w-1.5 h-6 bg-primary rounded-full" />
      {children}
    </h1>
  ),
  
  h2: ({ children }: any) => (
    <h2 className="text-xl font-bold mb-3 mt-6 first:mt-0 text-foreground flex items-center gap-2">
      <span className="w-1 h-5 bg-primary/70 rounded-full" />
      {children}
    </h2>
  ),
  
  h3: ({ children }: any) => (
    <h3 className="text-lg font-semibold mb-2 mt-5 first:mt-0 text-foreground">{children}</h3>
  ),
  
  h4: ({ children }: any) => (
    <h4 className="text-base font-semibold mb-2 mt-4 first:mt-0 text-foreground">{children}</h4>
  ),
  
  ul: ({ children }: any) => (
    <ul className="list-none mb-4 space-y-2 ml-0">{children}</ul>
  ),
  
  ol: ({ children, start }: any) => (
    <ol className="list-none mb-4 space-y-2 ml-0 counter-reset-list" start={start}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            'data-index': (start || 1) + index
          });
        }
        return child;
      })}
    </ol>
  ),
  
  li: ({ children, ordered, 'data-index': dataIndex, ...props }: any) => {
    const isOrdered = dataIndex !== undefined;
    return (
      <li className="leading-7 text-[15px] flex gap-3 items-start" {...props}>
        {isOrdered ? (
          <span className="flex-shrink-0 w-6 h-6 rounded-md bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center mt-0.5">
            {dataIndex}
          </span>
        ) : (
          <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-3" />
        )}
        <span className="flex-1">{children}</span>
      </li>
    );
  },
  
  blockquote: ({ children }: any) => (
    <blockquote className="border-l-4 border-primary/50 pl-4 py-2 my-4 bg-primary/5 rounded-r-lg">
      <div className="text-muted-foreground italic">{children}</div>
    </blockquote>
  ),
  
  table: ({ children }: any) => (
    <div className="overflow-x-auto my-6 rounded-xl border border-border shadow-sm">
      <table className="min-w-full border-collapse">
        {children}
      </table>
    </div>
  ),
  
  thead: ({ children }: any) => (
    <thead className="bg-muted/70">{children}</thead>
  ),
  
  th: ({ children }: any) => (
    <th className="border-b border-border px-4 py-3 text-left font-semibold text-sm text-foreground">
      {children}
    </th>
  ),
  
  tbody: ({ children }: any) => (
    <tbody className="divide-y divide-border/50">{children}</tbody>
  ),
  
  tr: ({ children }: any) => (
    <tr className="hover:bg-muted/30 transition-colors">{children}</tr>
  ),
  
  td: ({ children }: any) => (
    <td className="px-4 py-3 text-sm">
      {children}
    </td>
  ),
  
  a: ({ href, children }: any) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary hover:underline underline-offset-2 font-medium"
    >
      {children}
    </a>
  ),
  
  hr: () => <hr className="border-border my-8" />,
  
  strong: ({ children }: any) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  
  em: ({ children }: any) => (
    <em className="italic">{children}</em>
  ),
  
  img: ({ src, alt }: any) => (
    <img 
      src={src} 
      alt={alt} 
      className="max-w-full rounded-xl my-4 border border-border shadow-sm"
    />
  ),
  
  // Checkbox for task lists
  input: ({ type, checked, ...props }: any) => {
    if (type === 'checkbox') {
      return (
        <span className={cn(
          'inline-flex items-center justify-center w-5 h-5 rounded border-2 mr-2',
          checked 
            ? 'bg-green-500 border-green-500 text-white' 
            : 'border-border bg-background'
        )}>
          {checked && (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </span>
      );
    }
    return <input type={type} {...props} />;
  }
};

const MarkdownRenderer = memo(({ content }: MarkdownRendererProps) => {
  return (
    <div className="prose-custom">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});

MarkdownRenderer.displayName = 'MarkdownRenderer';

export default MarkdownRenderer;
