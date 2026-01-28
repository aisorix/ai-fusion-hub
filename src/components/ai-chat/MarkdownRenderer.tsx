import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { CodeBlock } from './CodeBlock';
import { HealthAnalysisChart } from '../health/HealthAnalysisChart';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer = memo(({ content, className }: MarkdownRendererProps) => {
  // Check for health analysis data in the content
  const healthDataMatch = content.match(/```health-chart\n([\s\S]*?)\n```/);
  let healthData = null;
  let cleanContent = content;

  if (healthDataMatch) {
    try {
      healthData = JSON.parse(healthDataMatch[1]);
      cleanContent = content.replace(healthDataMatch[0], '');
    } catch (e) {
      console.error('Failed to parse health data:', e);
    }
  }

  return (
    <div className={cn('prose prose-sm dark:prose-invert max-w-none', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const codeContent = String(children).replace(/\n$/, '');

            if (!inline && language) {
              return (
                <CodeBlock
                  code={codeContent}
                  language={language}
                />
              );
            }

            return (
              <code
                className={cn(
                  'px-1.5 py-0.5 rounded bg-muted font-mono text-sm',
                  className
                )}
                {...props}
              >
                {children}
              </code>
            );
          },
          pre({ children }) {
            return <>{children}</>;
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-4 rounded-lg border border-border">
                <table className="w-full border-collapse">{children}</table>
              </div>
            );
          },
          thead({ children }) {
            return <thead className="bg-muted/50">{children}</thead>;
          },
          th({ children }) {
            return (
              <th className="px-4 py-2 text-left font-semibold border-b border-border">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="px-4 py-2 border-b border-border/50">{children}</td>
            );
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 underline underline-offset-2"
              >
                {children}
              </a>
            );
          },
          ul({ children }) {
            return <ul className="list-disc pl-4 space-y-1 my-2">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal pl-4 space-y-1 my-2">{children}</ol>;
          },
          li({ children }) {
            return <li className="leading-relaxed">{children}</li>;
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-primary/50 pl-4 italic text-muted-foreground my-4">
                {children}
              </blockquote>
            );
          },
          h1({ children }) {
            return <h1 className="text-2xl font-bold mt-6 mb-3">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="text-xl font-bold mt-5 mb-2">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="text-lg font-semibold mt-4 mb-2">{children}</h3>;
          },
          p({ children }) {
            return <p className="leading-relaxed mb-3 last:mb-0">{children}</p>;
          },
          hr() {
            return <hr className="my-4 border-border" />;
          },
        }}
      >
        {cleanContent}
      </ReactMarkdown>

      {healthData && <HealthAnalysisChart data={healthData} />}
    </div>
  );
});

MarkdownRenderer.displayName = 'MarkdownRenderer';
