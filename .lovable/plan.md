
## Sorix Legends - Chat with Historical Legends

### Overview
Build a dedicated "Sorix Legends" tool at `/legends` that lets users chat with 10 famous historical/specialist personas. Each persona has a unique avatar image, personality, and speaking style. Uses `deepseek/deepseek-r1-0528` via OpenRouter with 3x token deduction. Includes conversation history saved to the `analysis_history` table.

Also includes two fixes:
- Sorix Agro: make it free (no token deduction) 
- Sorix Health: optimize for faster responses

---

### New Files to Create

#### 1. Avatar Images (copy uploaded images to src/assets/legends/)
- `src/assets/legends/jc_bose.png` -- from user-uploads://image-129.png
- `src/assets/legends/humayun.png` -- from user-uploads://image-130.png
- `src/assets/legends/nazrul.png` -- from user-uploads://image-131.png
- `src/assets/legends/jobs.png` -- from user-uploads://image-132.png
- `src/assets/legends/einstein.png` -- from user-uploads://image-133.png
- `src/assets/legends/tesla.png` -- from user-uploads://image-134.png
- `src/assets/legends/kalam.png` -- from user-uploads://image-135.png
- `src/assets/legends/bcs_coach.png` -- from user-uploads://image-136.png
- `src/assets/legends/legal_bot.png` -- from user-uploads://image-137.png
- `src/assets/legends/finance_bot.png` -- from user-uploads://image-138.png

#### 2. `src/pages/LegendsPage.tsx` -- Main Legends Page
- Two views: **Persona Grid** (default) and **Chat View** (when a persona is selected)
- Header with back-to-chat link, tool branding (amber/gold theme), and History button
- Persona grid organized into 3 sections: "Bengali Legends", "Global Icons", "Specialists"
- Each persona card shows avatar image, name, role, description, and a "Chat" button
- When a persona is selected, transitions to a full chat interface
- History panel (same slide-out pattern as Health/Agro) using `analysis_history` table with `tool: 'legends'`
- Responsive: cards in grid on desktop, stacked on mobile

#### 3. `src/components/legends/LegendCard.tsx` -- Persona Card Component
- Glassmorphism card with avatar image (circular), name, role badge, description
- Hover animation with scale and glow effect
- "Must Have" badge for Steve Jobs
- Color-coded category indicator (amber for Bengali, blue for Global, purple for Specialists)

#### 4. `src/components/legends/LegendChat.tsx` -- Chat Interface with a Legend
- Full chat interface similar to HealthChatMode/AgroChatMode
- Shows the legend's avatar and name in assistant message headers
- Supports image uploads (user can share images for context)
- Uses markdown rendering (react-markdown) for rich responses
- Streaming responses via SSE
- Back button to return to persona grid
- System prompt injects the persona's identity, speaking style, knowledge domain, and instructs the AI to roleplay authentically

#### 5. `src/components/legends/LegendHistory.tsx` -- History Panel
- Same pattern as HealthHistory/AgroHistory
- Shows past conversations grouped by persona
- Click to resume/view, delete individual entries

#### 6. `src/components/legends/index.tsx` -- Barrel exports

#### 7. `src/services/legendsApi.ts` -- API Service
- Same SSE streaming pattern as agroApi.ts
- Calls the new `legends-chat` edge function

#### 8. `supabase/functions/legends-chat/index.ts` -- Edge Function
- Uses ONLY `deepseek/deepseek-r1-0528` via OpenRouter
- Streaming chat mode only (no structured analysis needed)
- Receives `personaId` parameter to select the correct system prompt
- Each persona has a detailed system prompt defining:
  - Their identity, era, achievements
  - Speaking style (e.g., Humayun Ahmed uses gentle, philosophical Bangla-English; Nazrul uses passionate, rebellious language; Einstein uses playful analogies; Jobs uses minimalist, product-focused language)
  - Knowledge domain boundaries
  - Example phrases and mannerisms
- Supports multimodal input (images) for context
- CORS headers, no JWT verification

#### 9. Persona System Prompts (inside the edge function)
Each persona gets a unique system prompt. Examples:

**Humayun Ahmed**: "You are Humayun Ahmed, the beloved Bangladeshi novelist. You speak in a gentle, philosophical mix of Bangla and English. You often reference your characters like Himu and Misir Ali. You tell stories to explain points..."

**Steve Jobs**: "You are Steve Jobs. You speak with conviction about simplicity, design, and making a dent in the universe. You challenge assumptions. You use phrases like 'insanely great' and 'one more thing'..."

**The BCS Cadre**: "You are an expert BCS exam preparation coach. You specialize in Bangladesh General Knowledge, Bangla Grammar, English, Math, and all BCS cadre subjects. You provide structured study plans..."

---

### Files to Modify

#### 10. `src/App.jsx`
- Add route: `/legends` -> `<LegendsPage />` (protected)

#### 11. `src/components/aichat/ChatSidebar.tsx`
- Add onClick for "Sorix Legends" tool: `navigate('/legends')`

#### 12. `src/components/aichat/MobileSidebar.tsx`
- Add onClick for "Sorix Legends": `navigate('/legends'); onClose();`

#### 13. `supabase/config.toml`
- Add `[functions.legends-chat]` with `verify_jwt = false`

---

### Sorix Health Speed Optimization

#### 14. `supabase/functions/health-analysis/index.ts`
- For structured analysis mode, use `google/gemma-3-27b-it` as the PRIMARY model (fastest) instead of `deepseek/deepseek-r1-0528` (slowest due to reasoning)
- Keep DeepSeek as fallback only
- Reduce `max_tokens` from 8192 to 4096 for structured analysis (JSON output is compact)
- Add `temperature: 0.3` for structured mode (more deterministic = faster)
- For streaming chat mode, already using `gemma-3-27b-it` which is fast -- no change needed

#### 15. Health Chat Enhancement
- Ensure the "Continue Chat" button after analysis connects to a specialist context
- The chat mode system prompt should mention "You are now acting as a specialist doctor for this patient's condition"

---

### Sorix Agro Free Confirmation
- Sorix Agro is already free (no token deduction logic exists in the frontend for it)
- No code changes needed -- the edge function is called directly without any token tracking

---

### Token Deduction for Legends (3x)
The token deduction for Legends will be handled in the frontend. The `LegendChat` component will:
- After each successful response, calculate token usage and call the chatStore's token deduction with a 3x multiplier
- This follows the same pattern used in the main chat for model-based multipliers

---

### Technical Details

**Legends Edge Function System Prompts** will include:
- Persona-specific vocabulary and speaking patterns
- Historical accuracy about their life events and achievements
- Domain expertise boundaries (Einstein won't give legal advice, etc.)
- Instruction to stay in character at all times
- Support for both English and Bangla responses where appropriate

**Responsive Design**:
- Persona grid: 1 column mobile, 2 columns tablet, 3 columns desktop
- Chat view: full width on all devices
- Avatar images: circular with border, 80px on desktop, 64px on mobile
- Touch-friendly card interactions (min 44px tap targets)

**History Integration**:
- Saves to `analysis_history` with `tool: 'legends'`
- `title` field stores the persona name
- `input_data` stores `{ personaId, lastMessages }` (last 3 messages for preview)
- `result_data` stores the full message history

**File count**: 10 image files, 6 new code files, 4 modified files, 1 edge function update
