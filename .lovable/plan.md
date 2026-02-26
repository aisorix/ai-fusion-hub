

## Fix: Show Edit & Copy Actions on Mobile User Messages

The issue is in `src/components/aichat/MessageBubble.tsx` line 162. The user message edit/copy buttons are explicitly hidden on mobile with `!isMobile`. On mobile there's no hover, so these actions should always be visible.

### Changes — `src/components/aichat/MessageBubble.tsx`

1. **Line 162**: Remove `!isMobile` from the condition — change `{showActions && !isEditing && !isMobile && (` to `{(showActions || isMobile) && !isEditing && (`
2. **Line 163**: Adjust positioning for mobile — the `-left-20` absolute positioning works on desktop but needs to also work on mobile. Change to use responsive positioning so buttons appear above the bubble on mobile instead of to the left.
3. **Line 282-287**: For assistant message actions, similarly make them always visible on mobile — change `showActions ? "opacity-100" : "opacity-0"` to `showActions || isMobile ? "opacity-100" : "opacity-0"`

This ensures both user and assistant message actions are accessible on mobile, matching the desktop experience.

