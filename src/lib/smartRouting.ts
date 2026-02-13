// Smart Routing Logic for Cost Optimization and Smart Auto model
// Routes simple queries to cheaper models while maintaining user experience

import type { UserPlan, Model } from '@/stores/chatStore';

// Worker model IDs per plan (1x multiplier models for simple queries)
const WORKER_MODELS: Record<UserPlan, string> = {
  free: 'openai/gpt-4o-mini',
  basic: 'openai/gpt-5-nano',
  pro: 'openai/gpt-5-nano',
  premium: 'openai/gpt-5-nano',
};

// For backward compatibility
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

const SIMPLE_GREETING_REGEX = /^(hi|hello|hey|good morning|good afternoon|good evening|thanks|thank you|ok|okay|bye|goodbye|yes|no|sure|great|nice|cool)[\s!?.]*$/i;
const SIMPLE_FACTUAL_REGEX = /^(what is|who is|when is|where is|how many|how much|what's|who's|when's|where's|define|what does .+ mean)\s+.{1,50}[?]?$/i;

/**
 * Analyzes query complexity
 */
export function analyzeQueryComplexity(
  prompt: string, 
  conversationHistory?: { role: string; content: string }[]
): 'simple' | 'complex' {
  const trimmedPrompt = prompt.trim().toLowerCase();
  
  if (prompt.length < 60) {
    const hasComplexKeyword = COMPLEX_KEYWORDS.some(keyword => 
      trimmedPrompt.includes(keyword.toLowerCase())
    );
    
    if (!hasComplexKeyword) {
      if (SIMPLE_GREETING_REGEX.test(prompt.trim())) return 'simple';
      if (SIMPLE_FACTUAL_REGEX.test(prompt.trim())) return 'simple';
    }
  }
  
  const hasComplexKeyword = COMPLEX_KEYWORDS.some(keyword => 
    trimmedPrompt.includes(keyword.toLowerCase())
  );
  if (hasComplexKeyword) return 'complex';
  
  if (conversationHistory && conversationHistory.length > 0) {
    const recentMessages = conversationHistory.slice(-4);
    const hasComplexContext = recentMessages.some(msg => 
      COMPLEX_KEYWORDS.some(keyword => msg.content.toLowerCase().includes(keyword.toLowerCase()))
    );
    if (hasComplexContext) return 'complex';
  }
  
  if (prompt.includes('```') || prompt.includes('`')) return 'complex';
  if (prompt.split('\n').length > 3) return 'complex';
  if (prompt.length > 200) return 'complex';
  
  return 'simple';
}

/**
 * Determines if smart routing should downgrade to worker model
 */
export function shouldApplySmartRouting(
  selectedMultiplier: number,
  prompt: string,
  conversationHistory?: { role: string; content: string }[]
): boolean {
  if (selectedMultiplier <= 1) return false;
  const complexity = analyzeQueryComplexity(prompt, conversationHistory);
  return complexity === 'simple';
}

/**
 * Get the worker model backend ID for a given plan
 */
export function getWorkerModelForPlan(plan: UserPlan): string {
  return WORKER_MODELS[plan];
}

/**
 * Resolve Smart Auto model selection based on query complexity.
 * Dynamically picks from the user's actual available models.
 */
export function resolveSmartAutoModel(
  plan: UserPlan,
  prompt: string,
  availableModels: Model[],
  conversationHistory?: { role: string; content: string }[]
): { backendId: string; modelId: string; multiplier: number } {
  const complexity = analyzeQueryComplexity(prompt, conversationHistory);

  // Filter out smart-auto itself
  const realModels = availableModels.filter(m => m.id !== 'smart-auto');

  if (complexity === 'simple') {
    // Pick the first 1x model from user's available models
    const workerModel = realModels.find(m => m.multiplier <= 1);
    if (workerModel) {
      return { backendId: workerModel.backendId, modelId: workerModel.id, multiplier: workerModel.multiplier };
    }
  } else {
    // Pick the highest multiplier model from user's available models
    const sorted = [...realModels].sort((a, b) => b.multiplier - a.multiplier);
    if (sorted.length > 0) {
      return { backendId: sorted[0].backendId, modelId: sorted[0].id, multiplier: sorted[0].multiplier };
    }
  }

  // Fallback
  return { backendId: WORKER_MODELS[plan], modelId: realModels[0]?.id || 'gpt-4o', multiplier: 1 };
}

export default { analyzeQueryComplexity, shouldApplySmartRouting, WORKER_MODEL_ID, getWorkerModelForPlan, resolveSmartAutoModel };
