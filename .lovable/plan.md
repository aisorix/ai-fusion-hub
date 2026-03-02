

## Bangla Translation: Mobile Fit & Missing Strings Audit

### Findings

After reviewing all components, the translation coverage is solid on the landing page and desktop chat sidebar. However, there are significant gaps in the **MobileSidebar** and a few missing keys in translation dictionaries.

### Issues Found

**1. MobileSidebar (`src/components/aichat/MobileSidebar.tsx`) — 12+ hardcoded English strings**
- Line 220: `"Premium AI Platform"` — hardcoded
- Line 232: `"New chat"` — hardcoded
- Line 243: `"Search chats"` placeholder — hardcoded
- Line 257: `"Multi-Window Chat"` — hardcoded
- Line 264: `"More Tools"` — hardcoded
- Line 292: `"Free"` badge — hardcoded
- Line 311: `"Projects"` — hardcoded
- Line 323: `"History"` — hardcoded
- Line 337: `"Today"` — hardcoded
- Line 344: `"This Week"` — hardcoded
- Line 350: `"Older"` — hardcoded
- Line 378: `"Upgrade"` — hardcoded
- Line 386: `"Home"` — hardcoded
- Lines 176-181: Tool names/descriptions hardcoded in English (Sorix Agro, Sorix Health, etc.)

**2. Missing translation keys in `LanguageContext.jsx`**
- `qwenSubtitle`, `qwenDesc`, `llamaSubtitle`, `llamaDesc` — used in Workflow.jsx with fallbacks
- `home` key for mobile sidebar
- `sorixDeck`, `sorixDeckDesc`, `sorixImagine`, `sorixImagineDesc` — tool descriptions

**3. Missing translation keys in `translations.ts`**
- `home` — for mobile sidebar "Home" button
- `free` — for the "Free" badge in tool list
- `sorixDeck`, `sorixDeckDesc`, `sorixImagine`, `sorixImagineDesc`

**4. Mobile text fit concerns**
- Bangla text is generally ~20-30% wider than English. Current layout uses `truncate`, `whitespace-nowrap`, and `min-w-0` properly in most places.
- The Pricing card mobile scroll (280px fixed width) is tight but functional — Bangla feature text may need `text-[10px]` instead of `text-xs` on some items.
- The AnnouncementBanner already uses `whitespace-nowrap` and compact sizing — OK.

### Plan

**File 1: `src/contexts/LanguageContext.jsx`** — Add ~8 missing keys:
- `en`: `home: 'Home'`, `qwenSubtitle`, `qwenDesc`, `llamaSubtitle`, `llamaDesc`, `sorixDeck: 'Sorix Deck'`, `sorixDeckDesc`, `sorixImagine: 'Sorix Imagine'`, `sorixImagineDesc`
- `bn`: Bangla equivalents for all

**File 2: `src/lib/translations.ts`** — Add ~6 missing keys:
- `home`, `free`, `sorixDeck`, `sorixDeckDesc`, `sorixImagine`, `sorixImagineDesc`, `multiWindowChat` (already exists), `moreTools` (already exists)

**File 3: `src/components/aichat/MobileSidebar.tsx`** — Replace all 12+ hardcoded strings with translation calls:
- Import `useTranslation` from `@/lib/translations` and use `useChatStore` language
- Replace `"New chat"` → `t('newChat')`, `"Search chats"` → `t('searchChats')`, etc.
- Make tool names/descriptions use translated keys
- Replace `"History"`, `"Today"`, `"This Week"`, `"Older"`, `"Upgrade"`, `"Home"`, `"Premium AI Platform"`, `"Projects"`, `"Free"` badge, `"More Tools"`, `"Multi-Window Chat"`

**File 4: `src/components/Workflow.jsx`** — Replace fallback strings with proper `t()` keys (now that we add them)

### No layout changes needed
The existing CSS patterns (`truncate`, `min-w-0`, `text-[10px]`, `whitespace-nowrap`, fixed card widths with scroll) handle Bangla text width well. No overflow fixes required.

