

## Add Sorix Agent Quick-Access Button to Chat Header

Add a small icon button next to the ModelSelector in the chat page header that navigates users directly to `/cowork` (Sorix Agent page).

### Changes

**`src/components/aichat/ChatArea.tsx`**
- Import `Bot` icon from lucide-react and `Button` from UI
- Add a Sorix Agent icon button to the right side of the header, next to the ModelSelector
- The button navigates to `/cowork` on click
- Style: small ghost button with a cyan/teal gradient icon matching the Sorix Agent branding, with a tooltip-like title attribute "Sorix Agent"
- Position the header as `justify-between` with the model selector centered and the agent button on the right

### Layout
```text
[                    ] [ Smart Auto v ] [ 🤖 Agent ]
```

The header changes from `justify-center` to a 3-column layout: empty left spacer, centered ModelSelector, right-aligned Agent button.

