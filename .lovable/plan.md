## Goal
Update Sorix Agent's CommandCenter input bar to match the reference layout (image 2):
- Split bottom controls into **left cluster** (+, Tools, Apps, Model) and **right cluster** (Mic, Send)
- Re-add the **4-model picker** as a pill inside the input bar (same MODELS list already in code: Gemini 2.5 Pro, Claude Sonnet 4, GPT-5 Mini, Llama 3.3 70B)

## Changes — `src/components/cowork/CommandCenter.tsx`

1. **Bottom controls layout (lines 349–510)**
   - Wrap Mic + Send in their own right-side `<div className="flex items-center gap-0.5 sm:gap-1 shrink-0">` so `justify-between` pushes them to the right corner (like main ChatInput).
   - Left cluster keeps: Plus, Tools, Apps, **+ new Model picker pill**.

2. **Add Model picker pill** (placed after Apps, before the right cluster)
   - Button shows `<Cpu className="w-4 h-4" />` + `currentModel.short` + `<ChevronDown />`.
   - Click toggles `showModelPicker` (already in state); uses `closeAllPopovers()` pattern.
   - Popover (absolute, `bottom-full mb-2`, z-[100], same styling as Attach menu) lists all 4 MODELS; clicking calls `setSelectedModel(m.id)` then closes.
   - On mobile, hide the label text (`hidden sm:inline`) to save space.

3. No other files affected. State (`showModelPicker`, `selectedModel`, `setSelectedModel`) and MODELS array already exist — just wiring UI.

## Result
Input bar matches reference: `+  Tools  Apps  Model` on the left, `Mic  Send` pinned to the right corner. Users can switch between the 4 agent models from inside the input.
