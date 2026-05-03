## Goal

Make the Sorix Agent prompt bar match the main chat input UX (image 1), with two agent-specific additions:
1. Model selector lives **inside** the input bar (left of Tools).
2. New **Integrations** button next to Tools that opens the connected/available apps menu.
3. Mic stays on the **left side only** for the agent (next to + / Tools / Model / Integrations), unlike main chat where it's on the right.
4. Attachment popup matches image 3 (Upload Image / Take Photo / Attach File with Max file size pill).
5. On mobile, the Integrations popup appears as a clean centered/anchored modal — not awkwardly clipped.

## Files to change

**`src/components/cowork/CommandCenter.tsx`** — replace the existing minimal input section (lines ~210–254) and the header model picker (lines ~63–115):

- Remove the model picker from the header. The header stays clean with just the avatar, title, and status.
- Build a new prompt-bar component inline, modeled directly on `src/components/aichat/ChatInput.tsx` (the stacked Gemini-style layout, `rounded-3xl`, `bg-muted/40`, `TextareaAutosize` with `minRows=1 maxRows=6`, Enter-to-send).
- **Bottom controls layout (left → right):**
  - `+` attach button → opens attachment popover (Upload Image / Take Photo / Attach File + Max file size pill matching image 3 styling, copied from `ChatInput.tsx` lines 595–658). Attachments stored locally in component state; passed alongside the prompt to `sendMessage`.
  - `Tools` pill button (visual parity only — opens a small "Coming soon" / agent tools placeholder, or reuses `ToolsMenu` if appropriate; if tool list is agent-specific we'll start with just the button styled identically).
  - **Model selector pill** (`Cpu` icon + short name + chevron) — same `MODELS` list already in this file, opens an upward popover above the input.
  - **Integrations pill** (`Plug` icon + label "Apps" + count badge of connected providers) — opens an upward popover listing the Nango catalog from `INTEGRATIONS` (`@/components/integrations/integrationsCatalog`) with connect/disconnect via `useIntegrations`, plus the custom integrations from `useCustomIntegrations`, plus a "Manage all" link to `/agent/integrations`. Essentially a compact version of `ConnectorPanel` rendered inside a popover.
  - **Mic** button (left cluster, agent-only) — opens voice mode (or shows toast "Coming soon" if no handler wired yet). Has the small green dot indicator like main chat.
- **Right cluster:** Send/Stop button only.
- Disclaimer line below stays (`Sorix Agent can make mistakes…`).
- All popovers (attach, model, integrations) use `AnimatePresence` + click-outside backdrop (`fixed inset-0 z-40`) and open **upward** (`bottom-full mb-2`). Use `z-[100]` on the popover panel.

**`src/components/cowork/CoWorkLayout.tsx`** — improve the mobile Integrations popup (lines 78–117):

- Replace the current `inset-x-4 top-16` floating card (which feels off-screen) with a bottom-sheet style modal: `fixed inset-x-0 bottom-0 max-h-[85vh] rounded-t-3xl` with a drag handle bar at top, animated up from the bottom (`initial={{ y: '100%' }} animate={{ y: 0 }}`).
- Keep the existing header (Connectors title + close X) and `ConnectorPanel` body. Increase inner scroll to `max-h-[calc(85vh-56px)]`.
- Backdrop unchanged.
- Since the new Integrations pill on the input bar already covers the use case in-place, we can also **remove the top-bar `Plug` button on mobile** to avoid duplication (keep desktop monitor toggle).

## Out of scope

- No backend changes. Reuses `useIntegrations`, `useCustomIntegrations`, `useCoWorkAgent`, existing `MODELS`.
- Attachments for the agent are wired into the UI but `useCoWorkAgent.sendMessage` already only accepts text — we'll prepend a short note like `[Attached: file.pdf]` to the prompt for now (full multimodal agent attachments can be a follow-up).

## Visual reference

- Image 1: stacked rounded-3xl input, `+` and `Tools` pill on the bottom-left, mic+send on bottom-right → we mirror this layout but move mic to the left cluster and add Model + Integrations pills.
- Image 2: current header model dropdown → moves into the input bar.
- Image 3: attachment popup style → reuse exact markup from `ChatInput.tsx`.

Approve and I'll implement.