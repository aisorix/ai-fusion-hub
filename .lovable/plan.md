# Imagine prompt bar — full-width parity with main ChatInput

The Imagine page input is currently rendered inside `<div className="relative z-[60]">` which **shrinks to content**, so it appears as a small narrow box (image 2). The main ChatInput (image 1) spans the full width of its container with `+`, Tools pill, mic, and Send.

## Changes

**File: `src/pages/ImaginePage.tsx`**
- Replace the wrapper `<div className="relative z-[60]">` with `<div className="relative z-[60] w-full">` so the prompt bar fills the `max-w-2xl` column.

**File: `src/components/imagine/ImaginePromptBar.tsx`**
- Add a Mic button to the bottom-right cluster, mirroring the ChatInput layout:
  - Wrap the existing Send button in `<div className="flex items-center gap-0.5 shrink-0">`
  - Insert a Mic button (visual only — uses Web Speech API for dictation if available, falls back to no-op) styled identically to ChatInput's mic: `p-2 sm:p-2.5 rounded-full hover:bg-background text-muted-foreground hover:text-primary relative`, with a green status dot `absolute top-1 right-1 w-1.5 h-1.5 bg-green-500 rounded-full`.
  - Mic appears only when prompt is empty (matches main chat behavior).
- Already has: `+` button, Tools pill, downward popup, Send button — keep as-is.

## Outcome
The Imagine prompt bar will look exactly like image 1: wide container, `+` and Tools on the bottom-left, Mic (green dot) and Send on the bottom-right, attach popup expanding downward.
