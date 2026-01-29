import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// GPT-4o-mini for all multimodal analysis (images, files, documents)
const ATTACHMENT_MODEL = 'openai/gpt-4o-mini';
const DEFAULT_MODEL = 'openai/gpt-4o'; // Fallback for regular chat

// Professional system prompt for universal file analysis with emoji support
const SYSTEM_PROMPT = `You are AI Sorix, a world-class document analyst and expert assistant with advanced capabilities in analyzing any type of file or content.

## 🎯 Response Style Guidelines (CRITICAL):
You MUST use emojis strategically throughout your responses for better user experience, like a professional AI assistant:

### Emoji Usage Rules:
1. **Start responses with relevant emoji** - Match the topic (💡 for ideas, 🚀 for launches, 📊 for data, etc.)
2. **Use emojis for section headers** - Make content scannable and engaging
3. **Highlight key points with emojis** - ✅ for success, ⚠️ for warnings, 💡 for tips
4. **Keep it professional** - Don't overuse, 2-4 emojis per paragraph max
5. **Match the context** - Serious topics get fewer emojis, creative topics get more

### Common Emoji Patterns:
- 🎯 Goals/Objectives | 📋 Lists/Tasks | 💡 Ideas/Tips
- ✅ Success/Done | ❌ Errors/Issues | ⚠️ Warnings
- 🚀 Launch/Deploy | 🔧 Fix/Configure | 📦 Install/Package
- 📊 Data/Stats | 📈 Growth | 📉 Decline
- 🔐 Security | 🔑 Authentication | 👤 Users
- 💻 Code/Tech | 🌐 Web | 📱 Mobile
- ⏰ Time/Schedule | 📅 Dates | 🎉 Celebrations
- 🇧🇩 Bangladesh | ✨ Special/Magic | 🔥 Hot/Trending

## Your Expertise Areas:
- **📄 Document Analysis**: PDFs, Word documents, text files - extract key insights, summarize, analyze structure
- **🖼️ Image Analysis**: Photos, screenshots, diagrams, charts, infographics - describe content, extract text (OCR), analyze visual elements
- **💻 Code Analysis**: All programming languages - review, explain, debug, suggest improvements, identify patterns
- **📊 Data Analysis**: JSON, CSV, spreadsheets - identify patterns, statistics, anomalies, provide insights
- **🔧 Technical Documents**: Architecture diagrams, flowcharts, technical specs - interpret and explain

## CRITICAL: Multi-File Analysis Rules
When the user uploads MULTIPLE files:
1. **📁 Acknowledge ALL files**: Start by listing all attached files you received
2. **🔍 Analyze EACH file**: Provide analysis for every file, not just the first one
3. **📌 Reference by name**: Always cite the specific filename when discussing content (e.g., "In report.pdf...")
4. **🔗 Compare when relevant**: If files are related, compare and cross-reference them
5. **📋 Structured response**: Use clear headings for each file's analysis:
   
   ### 📄 [filename1.ext]
   [Analysis of first file]
   
   ### 📄 [filename2.ext]
   [Analysis of second file]
   
   ### 🔗 Cross-File Insights (if applicable)
   [Connections, comparisons, or combined insights]

## Response Guidelines:
1. **🎯 Be Precise**: Provide accurate, detailed analysis based on the actual content
2. **📋 Be Structured**: Use clear headings, bullet points, and organized formatting
3. **📌 Cite Sources**: Reference specific parts of files, line numbers for code, sections of documents
4. **✅ Be Actionable**: Provide concrete recommendations when applicable
5. **✨ Use Markdown**: Format responses with proper syntax highlighting, tables, and formatting

## 🖼️ For Images:
- Describe what you see in detail
- Extract any visible text
- Identify objects, people, text, UI elements, diagrams
- Analyze composition, layout, or design if relevant

## 💻 For Code:
- Use proper syntax highlighting with language identifiers
- Explain the logic and purpose
- Identify potential issues or improvements
- Reference specific line numbers when discussing code

## 📄 For Documents:
- Summarize key points first
- Provide detailed analysis as needed
- Quote relevant passages when citing
- Identify main themes, arguments, or data points

Always maintain a professional, expert tone while being helpful, thorough, and engaging with appropriate emoji usage! 🚀`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, model, stream = true, userPlan } = await req.json();
    
    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    if (!OPENROUTER_API_KEY) {
      console.error("OPENROUTER_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "OpenRouter API key is not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare messages with system prompt
    const processedMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.filter((m: any) => m.role !== 'system')
    ];
    
    // Check if we have image content - ALWAYS use GPT-4o for vision
    const hasImages = processedMessages.some((m: any) => 
      Array.isArray(m.content) && m.content.some((c: any) => c.type === 'image_url')
    );
    
    // Check if we have file/document content
    const hasFiles = processedMessages.some((m: any) => 
      typeof m.content === 'string' && (
        m.content.includes('📄 FILE:') || 
        m.content.includes('--- FILE CONTENT ---') ||
        m.content.includes('[Attached')
      )
    );
    
    // Always use GPT-4o-mini for attachments
    let selectedModel = model || DEFAULT_MODEL;
    
    if (hasImages || hasFiles) {
      selectedModel = ATTACHMENT_MODEL;
      if (hasImages) {
        console.log(`🖼️ Image detected - using ${selectedModel}`);
      }
      if (hasFiles) {
        console.log(`📄 File detected - using ${selectedModel}`);
      }
    }
    
    console.log(`Calling OpenRouter with model: ${selectedModel}, messages count: ${processedMessages.length}, stream: ${stream}`);

    // Check if this is a Perplexity/search model that returns citations
    const isSearchModel = selectedModel.includes('perplexity') || selectedModel.includes('sonar');

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://aisorix.com",
        "X-Title": "AI Sorix - Universal Document Analyst"
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: processedMessages,
        stream: stream,
        max_tokens: 8192,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenRouter API error: ${response.status} - ${errorText}`);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Insufficient credits. Please add funds to your OpenRouter account." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 401) {
        return new Response(
          JSON.stringify({ error: "Authentication failed. Please check your API key." }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: `API error: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (stream) {
      // For search models, we need to buffer and extract citations at the end
      if (isSearchModel && response.body) {
        // Create a transform stream to capture citations
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();
        let citations: string[] = [];

        const transformStream = new TransformStream({
          transform(chunk, controller) {
            const text = decoder.decode(chunk, { stream: true });
            const lines = text.split('\n');
            
            for (const line of lines) {
              if (line.startsWith('data: ') && line.length > 6) {
                const jsonStr = line.slice(6).trim();
                if (jsonStr === '[DONE]') {
                  // Append citations event before [DONE]
                  if (citations.length > 0) {
                    const citationsEvent = `data: ${JSON.stringify({ citations })}\n\n`;
                    controller.enqueue(encoder.encode(citationsEvent));
                  }
                  controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                  continue;
                }
                
                try {
                  const parsed = JSON.parse(jsonStr);
                  
                  // Extract citations from the response
                  if (parsed.citations && Array.isArray(parsed.citations)) {
                    citations = parsed.citations;
                    console.log(`📚 Found ${citations.length} citations`);
                  }
                } catch {
                  // Ignore parse errors
                }
              }
              
              // Forward the original line
              controller.enqueue(encoder.encode(line + '\n'));
            }
          }
        });

        const transformedStream = response.body.pipeThrough(transformStream);
        
        return new Response(transformedStream, {
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
          },
        });
      }

      // Return streaming response for non-search models
      console.log("Returning streaming response");
      return new Response(response.body, {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        },
      });
    } else {
      // Return non-streaming response with citations included
      const data = await response.json();
      console.log("Returning non-streaming response");
      
      // Include citations in the response if available
      if (data.citations) {
        console.log(`📚 Found ${data.citations.length} citations in response`);
      }
      
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error("Chat function error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
