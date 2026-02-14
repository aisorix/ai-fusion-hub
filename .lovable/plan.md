

# Redesign Sorix Health to Work Like Sorix Agro

## Overview
Rebuild Sorix Health to follow the same simple flow as Sorix Agro: **Intake Form -> Analysis Results -> Follow-up Chat**. Remove the current test-cost-fairness approach and replace it with a proper medical diagnosis tool that identifies the problem, suggests medicines, recommends tests if needed, and provides solutions -- all targeted at Bangladeshi users.

## Flow Change

Current flow: Intake -> Review Tests (costs) -> Results (fairness score, pie charts) -> Chat

New flow: **Intake -> Results (diagnosis, medicines, tests if serious) -> Chat**

The "review" step is completely removed. No more cost analysis, fairness scores, or pie/bar charts.

## What Changes

### 1. HealthPage.tsx - Simplify the Flow
- Remove the `review` step entirely (no more `ExtractedTest`, `HealthTestReview`)
- Change step type from `'intake' | 'review' | 'results' | 'chat'` to `'intake' | 'results' | 'chat'`
- Remove `extractedTests` state and `handleTestReviewConfirm`
- Update `AnalysisResult` type to match the new Agro-like schema:
  - `diagnosis`, `severity`, `severityScore`, `causes[]`
  - `medicines[]` (name, type, dosage, frequency, cost in BDT, etc.)
  - `preventionTips[]`, `recommendedTests[]` (only if serious)
  - `timeline`, `detailedAnalysis`
- Remove step indicators for "Review Tests"
- Keep the same 3 AI models from the current health edge function

### 2. HealthIntakeForm.tsx - Localize for Bangladesh
- Add Bangla text alongside English (like Agro form does)
- Keep existing fields: patient category, symptoms, gender, age, weight, height
- Add optional fields: existing medications, medical history, allergies
- Keep file upload for prescriptions/lab reports

### 3. HealthAnalysisResults.tsx - Complete Redesign
- Remove: pie charts, bar charts, fairness score, test cost breakdown
- Add (matching Agro pattern):
  - Diagnosis card with severity indicator
  - Severity score bar (like Agro)
  - Causes section
  - Medicine recommendations with BDT pricing (Bangladesh-available medicines)
  - Recommended tests section (only shown for serious conditions)
  - Prevention tips
  - Timeline (treatment duration, expected recovery)
  - Detailed analysis
  - Action buttons: New Analysis + Ask Follow-up Questions

### 4. health-analysis Edge Function - New Structured Prompt
- Replace the current JSON schema (tests/costs/fairness) with a new Agro-like schema
- New structured analysis prompt asks for:
  - Diagnosis, severity, causes
  - Medicine suggestions (Bangladesh-available, BDT pricing)
  - Recommended tests only when medically necessary
  - Prevention tips, timeline
- Keep the same 3 models: `google/gemma-3-27b-it`, `deepseek/deepseek-r1-0528`, `anthropic/claude-sonnet-4.5`
- Keep streaming chat mode unchanged

### 5. Cleanup
- Remove `HealthTestReview.tsx` (no longer needed)
- Remove unused chart imports from results
- Update `index.tsx` exports

## Technical Details

### New AnalysisResult Type (replaces current)
```typescript
export interface Medicine {
  name: string;
  type: string; // Antibiotic, Painkiller, Antacid, etc.
  dosage: string;
  frequency: string;
  duration: string;
  cost: number; // BDT
  warning: string;
}

export interface RecommendedTest {
  name: string;
  reason: string;
  urgency: 'routine' | 'soon' | 'urgent';
  estimatedCost: number; // BDT
}

export interface AnalysisResult {
  diagnosis: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  severityScore: number;
  causes: string[];
  medicines: Medicine[];
  recommendedTests: RecommendedTest[];
  preventionTips: string[];
  lifestyle: string[];
  timeline: { treatmentDuration: string; expectedRecovery: string };
  detailedAnalysis: string;
  whenToSeeDoctor: string;
}
```

### New Edge Function Prompt
The structured analysis prompt will request Bangladesh-specific medicine names and BDT pricing, with a focus on practical solutions rather than cost analysis. Tests are only recommended when the condition warrants them (serious symptoms, unclear diagnosis).

### Files Modified
- `src/pages/HealthPage.tsx` - Simplified flow, new types
- `src/components/health/HealthIntakeForm.tsx` - Minor Bangla additions
- `src/components/health/HealthAnalysisResults.tsx` - Complete rewrite (Agro-style)
- `src/components/health/HealthChatMode.tsx` - Minor type updates
- `src/components/health/index.tsx` - Remove HealthTestReview export
- `supabase/functions/health-analysis/index.ts` - New structured prompt and schema
- Delete: `src/components/health/HealthTestReview.tsx`
