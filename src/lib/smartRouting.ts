// Smart Routing Logic for Cost Optimization
// Routes simple queries to cheaper models while maintaining user experience

// The worker model ID for simple queries (1x multiplier)
export const WORKER_MODEL_ID = 'openai/gpt-5-nano';

// Complex keywords that require keeping the selected high-tier model
const COMPLEX_KEYWORDS = [
  'code', 'script', 'function', 'bug', 'error', 'debug', 'fix',
  'analyze', 'compare', 'solve', 'math', 'derivative', 'integral', 'calculus',
  'essay', 'summary', 'summarize', 'write', 'explain in detail',
  'translate', 'refactor', 'optimize', 'implement', 'algorithm',
  'database', 'sql', 'api', 'json', 'xml', 'regex', 'pattern',
  'review', 'critique', 'evaluate', 'research', 'investigate'
];

// Simple greeting patterns
const SIMPLE_GREETING_REGEX = /^(hi|hello|hey|good morning|good afternoon|good evening|thanks|thank you|ok|okay|bye|goodbye|yes|no|sure|great|nice|cool)[\s!?.]*$/i;

// Simple factual question patterns
const SIMPLE_FACTUAL_REGEX = /^(what is|who is|when is|where is|how many|how much|what's|who's|when's|where's|define|what does .+ mean)\s+.{1,50}[?]?$/i;

/**
 * Analyzes query complexity to determine if it should be routed to a cheaper model
 * @param prompt - The user's input prompt
 * @param conversationHistory - Previous messages for context (optional)
 * @returns 'simple' | 'complex'
 */
export function analyzeQueryComplexity(
  prompt: string, 
  conversationHistory?: { role: string; content: string }[]
): 'simple' | 'complex' {
  const trimmedPrompt = prompt.trim().toLowerCase();
  
  // Check if prompt is too short (simple)
  if (prompt.length < 60) {
    // But check for complex keywords first
    const hasComplexKeyword = COMPLEX_KEYWORDS.some(keyword => 
      trimmedPrompt.includes(keyword.toLowerCase())
    );
    
    if (!hasComplexKeyword) {
      // Check if it's a simple greeting
      if (SIMPLE_GREETING_REGEX.test(prompt.trim())) {
        return 'simple';
      }
      
      // Check if it's a simple factual question
      if (SIMPLE_FACTUAL_REGEX.test(prompt.trim())) {
        return 'simple';
      }
    }
  }
  
  // Check for complex keywords
  const hasComplexKeyword = COMPLEX_KEYWORDS.some(keyword => 
    trimmedPrompt.includes(keyword.toLowerCase())
  );
  
  if (hasComplexKeyword) {
    return 'complex';
  }
  
  // Check conversation history for ongoing complex tasks
  if (conversationHistory && conversationHistory.length > 0) {
    const recentMessages = conversationHistory.slice(-4);
    const hasComplexContext = recentMessages.some(msg => 
      COMPLEX_KEYWORDS.some(keyword => 
        msg.content.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    
    if (hasComplexContext) {
      return 'complex';
    }
  }
  
  // Check for code blocks or technical content
  if (prompt.includes('```') || prompt.includes('`')) {
    return 'complex';
  }
  
  // Check for multi-line input (likely complex)
  if (prompt.split('\n').length > 3) {
    return 'complex';
  }
  
  // Check for long input (complex reasoning needed)
  if (prompt.length > 200) {
    return 'complex';
  }
  
  // Default to simple for short, non-keyword prompts
  return 'simple';
}

/**
 * Determines if smart routing should be applied
 * @param selectedMultiplier - The multiplier of the selected model
 * @param prompt - The user's input prompt
 * @param conversationHistory - Previous messages for context
 * @returns Whether to downgrade to worker model
 */
export function shouldApplySmartRouting(
  selectedMultiplier: number,
  prompt: string,
  conversationHistory?: { role: string; content: string }[]
): boolean {
  // Only apply if user selected a premium model (multiplier > 1)
  if (selectedMultiplier <= 1) {
    return false;
  }
  
  // Check query complexity
  const complexity = analyzeQueryComplexity(prompt, conversationHistory);
  
  return complexity === 'simple';
}

export default { analyzeQueryComplexity, shouldApplySmartRouting, WORKER_MODEL_ID };
