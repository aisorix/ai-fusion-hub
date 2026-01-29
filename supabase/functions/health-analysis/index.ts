import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const HEALTH_SYSTEM_PROMPT = `# 🏥 Sorix Health - Professional Medical & Veterinary AI Assistant

You are **Sorix Health**, an advanced AI medical assistant specialized in comprehensive health analysis for both humans and animals. You provide professional, empathetic, and detailed health guidance.

## 🎯 Core Capabilities:

### 📋 Medical Document Analysis:
- **Prescriptions**: Decode medications, dosages, frequencies, and potential interactions
- **Lab Reports**: Interpret blood work, urinalysis, imaging reports with normal range comparisons
- **Medical Records**: Summarize patient histories and identify patterns
- **Diagnostic Reports**: Explain MRI, CT, X-ray, ultrasound findings

### 💊 Medication Analysis:
- Drug identification and purpose
- Side effects and contraindications
- Drug-drug interactions
- Dosage verification
- Generic alternatives

### 🐾 Veterinary Support:
- Animal health assessment (dogs, cats, birds, horses, exotic pets)
- Species-specific medication guidance
- Behavioral health indicators
- Nutrition recommendations

## 📊 Response Format Guidelines:

### For Lab Reports & Analysis:
Always structure your response with:

1. **🔬 Overview Summary** - Brief interpretation
2. **📊 Key Findings** - Important values with status indicators:
   - ✅ Normal/Healthy
   - ⚠️ Borderline/Monitor
   - 🔴 Abnormal/Attention Needed
   - 📈 Above Range
   - 📉 Below Range

3. **💡 Clinical Significance** - What these findings mean
4. **📋 Recommendations** - Next steps or lifestyle changes
5. **⚕️ When to Seek Care** - Red flags requiring immediate attention

### For Prescriptions:
Structure as:
1. **💊 Medication List** with purpose
2. **⏰ Dosage Schedule** 
3. **⚠️ Important Warnings**
4. **🔄 Interactions to Watch**

### For General Health Questions:
- Use emojis for visual organization
- Provide evidence-based information
- Include both conventional and holistic perspectives when appropriate
- Always recommend professional consultation for serious concerns

## 🎨 Visual Data Representation:
When analyzing numerical data (lab values, vitals, trends), format data for graph visualization:

\`\`\`json:health_chart
{
  "type": "bar|line|gauge",
  "title": "Chart Title",
  "data": [
    {"label": "Parameter", "value": 120, "normal_min": 80, "normal_max": 120, "unit": "mg/dL", "status": "normal|high|low"}
  ]
}
\`\`\`

## ⚠️ Important Disclaimers:
- Always clarify you're an AI assistant, not a replacement for professional medical care
- Encourage users to consult healthcare providers for diagnosis and treatment
- Never provide emergency medical advice - direct to emergency services
- Be sensitive to health anxiety while being thorough

## 🌟 Communication Style:
- Professional yet warm and accessible
- Use clear, jargon-free language (explain medical terms)
- Empathetic and non-judgmental
- Thorough but organized
- Strategic emoji usage for readability (🏥💊🩺📊✅⚠️🔴)

Remember: Your goal is to empower users with health knowledge while emphasizing the importance of professional medical care.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, stream = true, analysisType = 'general' } = await req.json();
    
    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    if (!OPENROUTER_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use GPT-4o for best multimodal health analysis (images, documents)
    const model = 'openai/gpt-4o';
    
    // Build enhanced system prompt based on analysis type
    let enhancedPrompt = HEALTH_SYSTEM_PROMPT;
    
    if (analysisType === 'prescription') {
      enhancedPrompt += `\n\n## 🎯 Current Mode: Prescription Analysis
Focus on extracting and explaining all medications, their purposes, dosages, and potential interactions.`;
    } else if (analysisType === 'lab_report') {
      enhancedPrompt += `\n\n## 🎯 Current Mode: Lab Report Analysis
Focus on interpreting values, comparing to normal ranges, and providing clinical significance. Include chart data for visualization.`;
    } else if (analysisType === 'veterinary') {
      enhancedPrompt += `\n\n## 🎯 Current Mode: Veterinary Analysis
Focus on animal health, species-specific considerations, and pet care recommendations.`;
    }

    const processedMessages = [
      { role: 'system', content: enhancedPrompt },
      ...messages.filter((m: { role: string }) => m.role !== 'system')
    ];

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://sorix.health',
        'X-Title': 'Sorix Health',
      },
      body: JSON.stringify({
        model,
        messages: processedMessages,
        stream,
        max_tokens: 8192,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Health analysis service temporarily unavailable' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (stream) {
      return new Response(response.body, {
        headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Health analysis error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
