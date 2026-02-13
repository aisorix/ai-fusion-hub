import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Estimate tokens: ~4 characters per token
const estimateTokens = (text: string): number => {
  return Math.ceil(text.length / 4);
};

const PROJECT_SYSTEM_PROMPT = `You are Sorix Project Assistant, an expert AI developer and project manager. You help users create, develop, and manage their projects professionally.

## Your Capabilities:
- **Project Planning**: Break down projects into actionable tasks and milestones
- **Code Generation**: Write clean, professional code in any language
- **Architecture Design**: Design scalable, maintainable system architectures
- **Problem Solving**: Debug issues and optimize solutions
- **Documentation**: Create clear technical documentation
- **Best Practices**: Apply industry standards and design patterns

## Response Guidelines:
1. **Be Proactive**: Anticipate user needs and suggest improvements
2. **Be Thorough**: Provide complete, production-ready solutions
3. **Be Clear**: Use proper formatting, code blocks, and structure
4. **Be Practical**: Focus on actionable, implementable solutions
5. **Track Progress**: Reference previous conversations when relevant

## For Code:
- Use proper syntax highlighting with language identifiers
- Include helpful comments
- Follow language-specific conventions
- Consider error handling and edge cases

## For Planning:
- Break work into clear phases
- Estimate complexity when possible
- Identify dependencies and blockers
- Suggest testing strategies

Always maintain a professional, expert tone while being helpful and encouraging.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    const authClient = createClient(SUPABASE_URL, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } }
    });
    const { data: { user: authUser }, error: authError } = await authClient.auth.getUser();
    if (authError || !authUser) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { projectId, message, conversationHistory, userId } = await req.json();

    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service is not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!projectId || !message || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: projectId, message, userId" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get project details for context
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', userId)
      .maybeSingle();

    if (projectError || !project) {
      console.error("Project fetch error:", projectError);
      return new Response(
        JSON.stringify({ error: "Project not found or access denied" }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build context-aware system prompt
    const contextPrompt = `${PROJECT_SYSTEM_PROMPT}

## Current Project Context:
- **Project Name**: ${project.name}
- **Description**: ${project.description || 'No description provided'}
- **Status**: ${project.status}
- **Created**: ${new Date(project.created_at).toLocaleDateString()}

Focus your responses on helping with this specific project.`;

    // Build messages array with conversation history
    const messages = [
      { role: 'system', content: contextPrompt },
      ...(conversationHistory || []).map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    // Calculate input tokens
    const inputTokens = messages.reduce((acc, msg) => acc + estimateTokens(msg.content), 0);

    console.log(`Project AI: project=${project.name}, input_tokens=${inputTokens}`);

    // Call Lovable AI Gateway with streaming
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Lovable AI error: ${response.status} - ${errorText}`);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds to continue." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: `AI service error: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return streaming response
    return new Response(response.body, {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Input-Tokens': inputTokens.toString(),
      },
    });

  } catch (error) {
    console.error("Project AI error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
