

# Fix Projects Badge and Legends Token Limit

## Issue 1: Remove "PRO" badge from Projects sidebar button
The Projects button in the sidebar currently shows a "PRO" text badge. This needs to be removed as shown in the screenshot -- the button should just show the icon and "Projects" text, plus the lock icon for free users.

**File:** `src/components/aichat/ChatSidebar.tsx` (line 483)
- Remove the `<span>` element that renders the "PRO" badge
- Keep the lock icon for free users

## Issue 2: Sorix Legends must respect user token limits
Currently, Sorix Legends deducts tokens (3x multiplier) after each message but never checks if the user has exceeded their limit. This means users can keep chatting indefinitely even after hitting their token cap.

**File:** `src/components/legends/LegendChat.tsx`
- Before sending a message, check if `user.tokensUsed >= user.tokensLimit && user.tokensLimit > 0`
- If the limit is reached, block the message and show the UpgradePlanModal instead
- Import and render the UpgradePlanModal component
- Also check after each response -- if the new deduction pushes usage to 100%, show the upgrade modal

**File:** `supabase/functions/legends-chat/index.ts`
- Add server-side token limit enforcement (check `subscriptions` table for `tokens_used` vs plan limits before processing)
- Deduct tokens from the database `subscriptions.tokens_used` after streaming completes (currently only the frontend Zustand store is updated, not the database)

## Technical Details

### ChatSidebar.tsx change
Remove line 483:
```
<span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">PRO</span>
```

### LegendChat.tsx changes
- Import `UpgradePlanModal` from `@/components/aichat/UpgradePlanModal`
- Add `showUpgradeModal` state
- Add token limit check at the start of `sendMessage()`:
  - If `user.tokensUsed >= user.tokensLimit && user.tokensLimit > 0`, set `showUpgradeModal(true)` and return
- Render `<UpgradePlanModal>` in the component JSX

### legends-chat edge function changes
- Look up user's subscription from the `subscriptions` table
- Define `PLAN_TOKEN_LIMITS` map (free: 5000, basic: 800000, pro: 1500000, premium: 3000000)
- Check if `tokens_used >= limit` before calling OpenRouter -- return a `TOKEN_LIMIT_REACHED` error if exceeded
- After streaming completes, update `subscriptions.tokens_used` with the 3x multiplied token count
