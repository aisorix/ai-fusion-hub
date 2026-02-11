

## Sorix Health - Full Implementation Plan

### Overview
Build a complete dedicated Sorix Health tool that opens as a separate view (like a new tab) when users click "Sorix Health" in the sidebar. It collects patient information, symptoms, and medical documents, then provides professional-grade analysis with visualizations. Free for all users with no token deduction.

### Architecture

The Health tool will be a new view mode within the chat page (similar to how multi-window chat works), triggered from the sidebar. It will have a multi-step wizard flow:

```text
Step 1: Intake Form          Step 2: Review Tests        Step 3: Analysis Results
+---------------------+     +---------------------+     +------------------------+
| Describe Symptoms   |     | Review Extracted    |     | Analysis Results       |
| Patient Info        | --> | Tests & Costs       | --> | Cost Summary Cards     |
| Upload Prescription |     | Add/Remove/Edit     |     | Pie Chart Distribution |
| [Analyze]           |     | [Confirm & Analyze] |     | Bar Chart Comparison   |
+---------------------+     +---------------------+     | Fairness Score         |
                                                         | Test Detail Cards      |
                                                         +------------------------+
```

### Files to Create

#### 1. `src/pages/HealthPage.tsx` - Main Health Tool Page
- New route `/health` (protected)
- Full-page layout with sidebar integration
- Manages the multi-step wizard state

#### 2. `src/components/health/HealthIntakeForm.tsx` - Step 1: Data Collection
- **Symptoms textarea** with placeholder examples
- **Patient Information section**: Gender (Male/Female/Other), Age, Weight (kg/lbs), Height (cm/ft)
- **Patient category**: Men, Women, Kids, Pregnant Women
- **Upload section**: Drag-and-drop for images (JPG, PNG) and PDFs (max 10MB)
- Supports prescription photos, lab reports, medical images
- "Analyze" button to proceed

#### 3. `src/components/health/HealthTestReview.tsx` - Step 2: Review Extracted Tests
- Editable table of extracted tests with name and cost (BDT currency)
- Add/Remove/Edit test entries
- Total cost calculation
- "Start Over" and "Confirm & Analyze" buttons

#### 4. `src/components/health/HealthAnalysisResults.tsx` - Step 3: Results Display
- **Analysis summary** text paragraph
- **Cost summary cards**: Total Cost, Necessary Cost, Potential Savings (with color coding)
- **Pie chart**: Test Category Distribution (Necessary/Optional/Unnecessary)
- **Bar chart**: Cost Comparison (Total vs Necessary)
- **Fairness Score**: 0-100 gauge with label (Poor/Fair/Good/Excellent)
- **Test Detail Cards**: Each test with:
  - Color-coded left border (red=unnecessary, orange=optional, green=necessary)
  - Warning/info icon
  - Test name, category badge, cost in BDT
  - Explanation paragraph

#### 5. `src/components/health/HealthChatMode.tsx` - Ongoing Chat After Analysis
- After initial analysis, users can continue asking health questions
- Chat interface specific to health context
- Retains patient context from intake form

#### 6. Update `supabase/functions/health-analysis/index.ts` - Edge Function
- Switch to using the 3 specified models via OpenRouter:
  - `deepseek/deepseek-r1-0528` (primary reasoning)
  - `anthropic/claude-sonnet-4.5` (detailed analysis)
  - `google/gemma-3-27b-it` (fast general)
- Add a new endpoint mode for structured analysis (returns JSON for charts/cards)
- Keep streaming mode for follow-up chat
- Enhanced system prompt for structured output (test extraction, cost analysis, fairness scoring)

### Files to Modify

#### 7. `src/components/aichat/ChatSidebar.tsx`
- Add `onClick` handler for "Sorix Health" tool button
- Navigate to `/health` route when clicked

#### 8. `src/App.jsx`
- Add new route: `/health` -> `<HealthPage />` (protected)

#### 9. `src/stores/chatStore.ts`
- No changes needed for token deduction (health is free)

### Key Design Decisions

- **Futuristic UI**: Glassmorphism cards, gradient borders, animated transitions using framer-motion, neon accents matching the existing design system
- **Free for everyone**: The health edge function will NOT trigger any token deduction logic
- **3 AI models via OpenRouter**: The edge function will use the specified models. The primary model for analysis will be `deepseek/deepseek-r1-0528` for deep reasoning, with fallback to `google/gemma-3-27b-it`
- **Image/PDF support**: Files are converted to base64 on the client side and sent to the edge function as multimodal content
- **Structured JSON output**: The edge function returns structured JSON for test extraction, cost analysis, and visualization data, parsed on the frontend to render charts

### Technical Details

**Edge Function Changes:**
- Add `mode: 'structured_analysis' | 'chat'` parameter
- For structured analysis, use a system prompt that enforces JSON output with schema: `{ summary, tests: [{name, cost, category, explanation}], totalCost, necessaryCost, savings, fairnessScore, fairnessLabel, categoryDistribution }`
- Model selection: Try `deepseek/deepseek-r1-0528` first, fallback to `anthropic/claude-sonnet-4.5`, then `google/gemma-3-27b-it`
- No token deduction on the frontend for health requests

**HealthIntakeForm fields:**
- `symptoms: string` (textarea)
- `gender: 'male' | 'female' | 'other'`
- `patientCategory: 'men' | 'women' | 'kids' | 'pregnant'`
- `age: number`
- `weight: number`, `weightUnit: 'kg' | 'lbs'`
- `height: number`, `heightUnit: 'cm' | 'ft'`
- `files: File[]` (images and PDFs, max 10MB each)

**Recharts visualizations:**
- PieChart for test category distribution
- BarChart for cost comparison
- Custom gauge component for fairness score (using Progress bar with color gradient)

**Responsive design:**
- Mobile-first with scroll-based layout
- Cards stack vertically on mobile, grid on desktop
- Sticky header with back button and step indicator

