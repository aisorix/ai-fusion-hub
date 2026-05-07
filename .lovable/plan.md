# Fix support-chat fallback model issue

## Problem
The `support-chat` edge function uses the Lovable AI Gateway with an invalid fallback model (`deepseek/deepseek-v3.2`). When the primary `openai/gpt-5-mini` fails, the fallback also fails, leaving users with a generic error message.

## Solution
Switch `support-chat` to use the OpenRouter API directly, consistent with every other AI edge function in the project.

## Changes

### 1. Refactor `supabase/functions/support-chat/index.ts`
- Import the shared `openrouterChatWithFallback` helper from `../_shared/openrouter.ts`
- Remove the inline `callModel` function that calls Lovable AI Gateway
- Set primary model to `google/gemini-2.5-flash` (fast, cost-effective for support queries)
- Set fallback model to `google/gemini-2.5-pro` (higher quality if flash fails)
- Keep the existing `SYSTEM_PROMPT`, CORS headers, message trimming, and response formatting unchanged
- Update error logging to reference OpenRouter instead of "AI Gateway"

### 2. Deploy the updated edge function
- Deploy `support-chat` so the change is live immediately

## Technical details
- The shared `openrouterChatWithFallback` helper already handles 429/5xx retry logic, so the manual fallback code in support-chat can be removed entirely
- No database or secret changes are required — `OPENROUTER_API_KEY` is already configured
- The function remains `verify_jwt = false` (public) so guest users can still access support
