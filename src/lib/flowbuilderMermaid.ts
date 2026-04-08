/**
 * Sanitize AI-generated Mermaid code to fix common syntax issues.
 */
export function sanitizeMermaid(code: string): string {
  if (!code) return code;

  let cleaned = code;

  // Remove accidental code fences
  cleaned = cleaned.replace(/```mermaid\s*/gi, '').replace(/```\s*/g, '');

  // Fix reserved keyword "default" used as classDef name
  cleaned = cleaned.replace(/classDef\s+default\s+/gi, 'classDef baseStyle ');
  cleaned = cleaned.replace(/class\s+([^\n;]+)\s+default\s*;/gi, 'class $1 baseStyle;');
  cleaned = cleaned.replace(/:::default\b/g, ':::baseStyle');

  // Fix reserved keyword "class" or "style" used as classDef name
  cleaned = cleaned.replace(/classDef\s+class\s+/gi, 'classDef clsStyle ');
  cleaned = cleaned.replace(/classDef\s+style\s+/gi, 'classDef stlStyle ');

  // Remove trailing whitespace on lines (can cause parse issues)
  cleaned = cleaned.replace(/[ \t]+$/gm, '');

  // Collapse multiple blank lines to one
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  return cleaned.trim();
}
