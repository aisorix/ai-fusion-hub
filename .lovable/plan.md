

# Remove User-Facing Notifications and Daily Limit Badges

## What Changes

Remove all informational toast messages and daily usage badges that create unnecessary friction for users. The backend logic (daily limits, multiplier tracking) stays intact -- only the visible notifications and badges are removed.

## Changes by File

### 1. `src/hooks/useAIChat.ts`
Remove these toast notifications:
- "Super-Intelligence Model" warning (shown when selecting high-multiplier models)
- "Optimized Response" toast (shown when smart routing reduces token deduction)
- "Daily Limit Reached" toast (shown when a model's daily cap is hit)

The daily limit check will still silently block the message -- instead of showing a toast, the send function will simply return early without sending.

### 2. `src/components/aichat/ModelSelector.tsx`
Remove the `{dailyRemaining}/day` badge from both desktop and mobile model list items. The multiplier badge (e.g., "4x", "6.5x") will remain as it helps users understand token costs.

### 3. `src/components/aichat/WindowModelSelector.tsx`
Same change -- remove the `{dailyRemaining}/day` badge from the multi-window model selector items.

### 4. `src/stores/chatStore.ts` (minor)
Remove `getDailyUsageRemaining` from the store's public API if no longer consumed by UI. The internal `dailyModelUsage` tracking and `incrementDailyUsage` logic remain for backend enforcement.

## What Stays
- Token usage warnings at 80% and 100% (important billing alerts)
- Error toasts for network/auth/server failures (needed for debugging)
- Multiplier badges in model selectors (helps users pick cost-efficient models)
- All backend daily limit enforcement logic (just silent now)
