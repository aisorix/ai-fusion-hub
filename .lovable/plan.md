

## Fix Mobile Message Actions — Professional Polish

The floating action bar above user messages looks disconnected and unprofessional. The fix is to remove the floating bar approach on mobile and instead show the edit/copy icons inline below the message bubble (right-aligned), matching how assistant actions appear below their messages.

### Changes — `src/components/aichat/MessageBubble.tsx`

1. **User message actions (lines 162-168)**: Remove the absolute-positioned floating bar on mobile. Instead, render the edit/copy buttons as a right-aligned row below the user bubble (not floating/absolute), with no background/border/shadow — just subtle icons like the assistant actions.

   - Remove the `absolute -top-8 right-0 bg-muted/90 backdrop-blur-sm rounded-lg px-1 py-0.5 shadow-sm border border-border/50` mobile styling
   - Move the action buttons outside the bubble's relative container on mobile, placing them below the bubble in a `flex justify-end` row with `gap-0.5 pt-1` styling
   - Use the same `ActionButton` component used for assistant messages for consistency
   - On desktop, keep the existing absolute left-positioned hover behavior unchanged

2. **Overall approach**: Match the assistant message action pattern — clean inline icons below the content, always visible on mobile, hover-revealed on desktop. No floating pills or borders.

