

## Fix Attachment Menu Position in Deck and Imagine

The attachment menu currently opens **above** the input bar (`bottom-full`), causing it to overlap with content and get clipped. Change both to open **below** the Plus button instead.

### Changes

**1. `src/components/deck/DeckPromptBar.tsx`**
- Line 138: Change popup position from `bottom-full left-0 mb-2` to `top-full left-0 mt-2`
- Change animation direction from `y: 10` to `y: -10` for initial/exit (popup slides down instead of up)

**2. `src/components/imagine/ImaginePromptBar.tsx`**
- Line 146: Change popup position from `bottom-full left-0 mb-2` to `top-full left-0 mt-2`
- Change animation direction from `y: 10` to `y: -10` for initial/exit

Both menus will now appear cleanly below the input bar, fully visible without clipping.

