

## Fix Attachment Popup Overlapping Model/Style Sections

### Problem
The attachment popup opens downward correctly, but it appears **behind** the Model and Style sections below the prompt bar because those sections sit in the normal document flow above the popup's stacking context.

### Fix

**`src/components/imagine/ImaginePromptBar.tsx`**

The popup already has `z-50` but the parent `<div className="relative">` (the plus button wrapper) doesn't establish a high enough stacking context. The popup needs a higher z-index to float above the Model and Style sections that come after the prompt bar in the page layout.

- **Line 146**: Change `z-50` to `z-[100]` on the popup menu to ensure it renders above all subsequent content on the page.

Additionally, the parent prompt bar wrapper needs `relative z-[60]` so the stacking context is above sibling sections:

**`src/pages/ImaginePage.tsx`**

- **Line 116**: Wrap `ImaginePromptBar` in a div with `relative z-[60]` so its dropdown portal stays above the Model and Style sections below.

Two tiny changes across two files.

