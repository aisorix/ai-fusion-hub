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
1. **🔬 Overview Summary**
2. **📊 Key Findings** with status indicators: ✅ Normal, ⚠️ Borderline, 🔴 Abnormal, 📈 Above, 📉 Below
3. **💡 Clinical Significance**
4. **📋 Recommendations**
5. **⚕️ When to Seek Care**

### For Prescriptions:
1. **💊 Medication List** with purpose
2. **⏰ Dosage Schedule**
3. **⚠️ Important Warnings**
4. **🔄 Interactions to Watch**

## ⚠️ Important Disclaimers:
- Always clarify you're an AI assistant, not a replacement for professional medical care
- Encourage users to consult healthcare providers for diagnosis and treatment
- Never provide emergency medical advice - direct to emergency services

## 🌟 Communication Style:
- Professional yet warm and accessible
- Use clear, jargon-free language (explain medical terms)
- Empathetic and non-judgmental
- Strategic emoji usage for readability`;

const STRUCTURED_ANALYSIS_PROMPT = `You are Sorix Health AI. Given patient information, symptoms, and optionally uploaded medical documents (prescriptions, lab reports), you must respond with ONLY a valid JSON object (no markdown, no code fences).

Your response must follow this exact schema:
{
  "summary": "A 2-3 paragraph professional medical analysis summary",
  "tests": [
    {
      "name": "Test name",
      "cost": 500,
      "category": "necessary|optional|unnecessary",
      "explanation": "Why this test is recommended or not"
    }
  ],
  "totalCost": 5000,
  "necessaryCost": 3000,
  "savings": 2000,
  "fairnessScore": 75,
  "fairnessLabel": "Good",
  "categoryDistribution": [
    {"name": "Necessary", "value": 5},
    {"name": "Optional", "value": 3},
    {"name": "Unnecessary", "value": 2}
  ],
  "detailedAnalysis": "Detailed medical analysis with recommendations, lifestyle changes, etc."
}

Rules:
- Costs should be in BDT (Bangladeshi Taka)
- fairnessScore: 0-100 (how fair/necessary the prescribed tests are)
- fairnessLabel: "Poor" (0-39), "Fair" (40-59), "Good" (60-79), "Excellent" (80-100)
- If no tests/prescriptions are provided, generate recommended tests based on symptoms
- category must be exactly "necessary", "optional", or "unnecessary"
- Respond ONLY with the JSON object, nothing else`;

const MODELS = [
  'deepseek/deepseek-r1-0528',
  'anthropic/claude-sonnet-4.5',
  'google/gemma-3-27b-it',
];

async function callModel(apiKey: string, model: string, messages: any[], stream: boolean) {
  return await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://sorix.health',
      'X-Title': 'Sorix Health',
    },
    body: JSON.stringify({
      model,
      messages,
      stream,
      max_tokens: 8192,
      temperature: 0.7,
    }),
  });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { mode, messages, stream = true, analysisType = 'general', patientData, tests, files } = body;

    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    if (!OPENROUTER_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // === STRUCTURED ANALYSIS MODE ===
    if (mode === 'structured_analysis' || mode === 'detailed_analysis') {
      let userContent = '';

      if (patientData) {
        userContent += `Patient Information:\n- Gender: ${patientData.gender}\n- Age: ${patientData.age}\n- Category: ${patientData.patientCategory}\n- Weight: ${patientData.weight} ${patientData.weightUnit}\n- Height: ${patientData.height} ${patientData.heightUnit}\n\nSymptoms/Concerns:\n${patientData.symptoms}\n\n`;
      }

      if (tests && tests.length > 0) {
        userContent += `Existing Tests:\n${tests.map((t: any) => `- ${t.name}: ৳${t.cost} (${t.category})`).join('\n')}\n\n`;
        userContent += 'Please provide a detailed analysis of these tests, verify their necessity, and calculate fairness score.\n';
      }

      // Build messages with multimodal content if files exist
      const apiMessages: any[] = [
        { role: 'system', content: STRUCTURED_ANALYSIS_PROMPT },
      ];

      if (files && files.length > 0) {
        const contentParts: any[] = [{ type: 'text', text: userContent || 'Please analyze these medical documents.' }];
        for (const file of files) {
          if (file.base64 && (file.type?.startsWith('image/') || file.type === 'application/pdf')) {
            contentParts.push({
              type: 'image_url',
              image_url: { url: file.base64 },
            });
          }
        }
        apiMessages.push({ role: 'user', content: contentParts });
      } else {
        apiMessages.push({ role: 'user', content: userContent });
      }

      // Try models in order
      let lastError = '';
      for (const model of MODELS) {
        try {
          console.log(`Trying model: ${model}`);
          const response = await callModel(OPENROUTER_API_KEY, model, apiMessages, false);

          if (!response.ok) {
            const errText = await response.text();
            console.error(`Model ${model} failed: ${response.status} ${errText}`);
            lastError = errText;
            continue;
          }

          const data = await response.json();
          let content = data.choices?.[0]?.message?.content || '';

          // Clean up response - remove markdown code fences and thinking tags
          content = content.replace(/```json\s*/g, '').replace(/```\s*/g, '');
          content = content.replace(/<think>[\s\S]*?<\/think>/g, '');
          content = content.trim();

          // Try to extract JSON
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return new Response(JSON.stringify(parsed), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          // If no JSON found, return as summary
          return new Response(JSON.stringify({
            summary: content,
            tests: [],
            totalCost: 0,
            necessaryCost: 0,
            savings: 0,
            fairnessScore: 0,
            fairnessLabel: 'N/A',
            categoryDistribution: [],
            detailedAnalysis: content,
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } catch (err) {
          console.error(`Model ${model} error:`, err);
          lastError = String(err);
          continue;
        }
      }

      return new Response(
        JSON.stringify({ error: `All models failed. Last error: ${lastError}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // === STREAMING CHAT MODE (default) ===
    const model = 'google/gemma-3-27b-it'; // Fast model for chat

    let enhancedPrompt = HEALTH_SYSTEM_PROMPT;
    if (analysisType === 'prescription') {
      enhancedPrompt += '\n\n## 🎯 Current Mode: Prescription Analysis\nFocus on medications, dosages, and interactions.';
    } else if (analysisType === 'lab_report') {
      enhancedPrompt += '\n\n## 🎯 Current Mode: Lab Report Analysis\nFocus on interpreting values and clinical significance.';
    } else if (analysisType === 'veterinary') {
      enhancedPrompt += '\n\n## 🎯 Current Mode: Veterinary Analysis\nFocus on animal health and species-specific care.';
    }

    const processedMessages = [
      { role: 'system', content: enhancedPrompt },
      ...(messages || []).filter((m: { role: string }) => m.role !== 'system'),
    ];

    const response = await callModel(OPENROUTER_API_KEY, model, processedMessages, stream);

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
