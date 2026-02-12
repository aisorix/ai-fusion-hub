
## Sorix Agro + Health Mobile Fix + Analysis History + Profile Picture Display

### Overview
This plan covers 4 major items:
1. Build **Sorix Agro** -- a dedicated agricultural analysis tool for Bangladeshi farmers
2. Fix **Sorix Health** mobile/tablet responsiveness
3. Add **analysis history** for both Health and Agro tools
4. Show **user profile pictures** in Navbar and sidebar (instead of just initials)

---

### 1. Sorix Agro -- New Agricultural Tool

#### New Files to Create

**`src/pages/AgroPage.tsx`** -- Main page with multi-step wizard
- Same architecture as HealthPage: Intake -> Analysis Results -> Follow-up Chat
- No "Review Tests" step (not applicable for agriculture)
- Steps: **Crop Info -> Analysis Results -> Chat**
- Green/emerald color theme (vs Health's red/pink)
- Protected route at `/agro`

**`src/components/agro/AgroIntakeForm.tsx`** -- Data collection
- **Crop type** selector (Rice, Wheat, Vegetables, Fruits, Jute, etc. -- common Bangladesh crops)
- **Problem description** textarea (symptoms on crops, pest issues, disease)
- **Location/Region** selector (divisions of Bangladesh)
- **Season** selector (Kharif/Rabi/Pre-Kharif)
- **Optional info**: Land area, crop age, previous treatments
- **File upload**: Photos of affected crops, soil, pests (drag-drop, camera, file picker)
- Same base64 conversion logic as HealthIntakeForm

**`src/components/agro/AgroAnalysisResults.tsx`** -- Results display
- **Diagnosis summary card**: What the problem is
- **Severity indicator**: Low/Medium/High/Critical with color coding
- **Recommended medicines/pesticides**: Name, dosage, application method, cost in BDT
- **Prevention tips**: Card list of preventive measures
- **Alternative treatments**: Organic/natural alternatives
- **Timeline card**: When to apply treatment, expected recovery time
- Uses futuristic card design with glassmorphism and gradient accents

**`src/components/agro/AgroChatMode.tsx`** -- Follow-up chat
- Same streaming chat architecture as HealthChatMode
- Retains crop/problem context from intake
- Green-themed branding (Leaf icon)

**`src/components/agro/index.tsx`** -- Barrel exports

**`src/services/agroApi.ts`** -- API service
- Same SSE streaming pattern as healthApi.ts
- Calls new `agro-analysis` edge function

**`supabase/functions/agro-analysis/index.ts`** -- Edge function
- Uses 3 OpenRouter models: `deepseek/deepseek-r1-0528`, `google/gemini-3-pro-preview`, `google/gemma-3n-e4b-it`
- Two modes: `structured_analysis` (returns JSON) and `chat` (streaming)
- Structured analysis prompt enforces JSON schema:
  ```
  {
    "diagnosis": "...",
    "severity": "low|medium|high|critical",
    "severityScore": 0-100,
    "causes": ["..."],
    "medicines": [{ name, type, dosage, applicationMethod, frequency, cost, isBiological }],
    "preventionTips": ["..."],
    "alternativeTreatments": ["..."],
    "timeline": { treatmentDuration, expectedRecovery },
    "detailedAnalysis": "..."
  }
  ```
- System prompt specialized for Bangladesh agriculture: local crop diseases, pesticide brands available in BD, BDT pricing
- Model fallback chain: deepseek -> gemini-3-pro -> gemma-3n
- JWT verification disabled in config.toml

#### Files to Modify

**`src/App.jsx`** -- Add `/agro` route (protected)

**`src/components/aichat/ChatSidebar.tsx`** -- Add onClick for "Sorix Agro" to navigate to `/agro`

**`src/components/aichat/MobileSidebar.tsx`** -- Add onClick handlers for Agro and Health tools

**`supabase/config.toml`** -- Add `[functions.agro-analysis]` with `verify_jwt = false`

---

### 2. Fix Sorix Health Mobile/Tablet Responsiveness

The current HealthPage uses `h-screen` which doesn't account for mobile browser address bars. The step indicator is hidden on mobile (`hidden md:flex`).

**`src/pages/HealthPage.tsx`**:
- Change `h-screen` to `h-[100dvh]` (dynamic viewport height, matching ChatPage pattern)
- Add mobile step indicator (simplified dots or compact pills visible on small screens)
- Ensure the header is properly sized for mobile

**`src/components/health/HealthIntakeForm.tsx`**:
- Already uses responsive grid (`grid-cols-2 md:grid-cols-4`), should be fine
- Add `pb-safe` or extra bottom padding for mobile safe area

**`src/components/health/HealthAnalysisResults.tsx`**:
- Charts already use ResponsiveContainer -- should scale
- Ensure sticky action buttons don't overlap mobile UI

**`src/components/health/HealthChatMode.tsx`**:
- Ensure input area respects mobile keyboard/safe area

---

### 3. Analysis History for Health and Agro

#### Database Migration
Create a new `analysis_history` table to store past analyses:

```sql
CREATE TABLE public.analysis_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  tool text NOT NULL CHECK (tool IN ('health', 'agro')),
  title text NOT NULL,
  input_data jsonb NOT NULL DEFAULT '{}',
  result_data jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.analysis_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own history"
  ON public.analysis_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own history"
  ON public.analysis_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own history"
  ON public.analysis_history FOR DELETE
  USING (auth.uid() = user_id);
```

#### New Components

**`src/components/health/HealthHistory.tsx`** -- History panel for Health tool
- List of past analyses with date, summary preview
- Click to view full results
- Delete individual entries

**`src/components/agro/AgroHistory.tsx`** -- History panel for Agro tool
- Same pattern as HealthHistory
- Shows crop type, diagnosis preview, date

#### Integration
- Both HealthPage and AgroPage save analysis results to `analysis_history` table after successful analysis
- Add a "History" button in the header of each tool page that opens a side panel or modal showing past analyses
- Uses Supabase client to read/write history with RLS

---

### 4. Profile Picture Display

Currently, the Navbar and sidebar show user initials. We need to show the actual profile picture (from Google OAuth `user_metadata.avatar_url` or from the uploaded avatar in `profile-avatars` bucket).

#### Files to Modify

**`src/components/Navbar.jsx`**:
- Fetch profile from `profiles` table to get `avatar_url`
- If `avatar_url` exists, show `<img>` instead of initials div
- Fallback chain: `profiles.avatar_url` -> `user.user_metadata.avatar_url` -> initials
- Apply to both desktop and mobile user avatar sections

**`src/components/aichat/ChatSidebar.tsx`**:
- Same avatar fallback logic in the bottom profile section and collapsed sidebar avatar
- Fetch profile data or pass it through context/store

**`src/components/aichat/MobileSidebar.tsx`**:
- Same avatar display logic in the bottom user section

#### Helper Hook (New File)

**`src/hooks/useUserProfile.ts`**:
- Fetches the user's profile from `profiles` table (avatar_url, full_name, phone)
- Caches the result using React Query or local state
- Returns `{ avatarUrl, fullName, isLoading }`
- Fallback to `user.user_metadata.avatar_url` if no custom avatar

---

### Technical Details

**Edge function `agro-analysis` system prompt** will be specialized for:
- Bangladesh crop diseases (blast, blight, stem borer, BPH, etc.)
- Local pesticide/medicine brands (ACI, Syngenta BD, BRAC Agro, etc.)
- Pricing in BDT
- Seasonal recommendations for Bangladesh climate
- Support for both Bangla and English descriptions

**Responsive design approach**:
- All new Agro components will use `100dvh` for full-height layouts
- Mobile-first CSS with Tailwind breakpoints (`md:`, `lg:`)
- Touch-friendly targets (minimum 44px tap areas)
- Safe area padding for iOS notch/home indicator

**File count summary**:
- 7 new files (AgroPage, 3 Agro components, agroApi, agro edge function, useUserProfile hook)
- 2 new component files (HealthHistory, AgroHistory)
- 1 database migration
- ~8 files modified (App.jsx, ChatSidebar, MobileSidebar, Navbar, HealthPage, HealthIntakeForm, HealthAnalysisResults, HealthChatMode, config.toml)
