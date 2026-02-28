

## Reorder Features: Show Tools Below Tokens in All Pricing Displays

The user wants Sorix tools (Health, Agro, Legends, Deck) listed immediately after the token count row, not at the bottom of the feature list. This applies to all 3 pricing locations.

### Changes

**1. `src/components/Pricing.jsx`** — Reorder `features` arrays in all 4 plans
- Move Sorix Legends, Sorix Health, Sorix Agro, Sorix Deck entries to positions 1-4 (right after the tokens row)
- Keep all other features (Web Search, Voice AI, File Upload, etc.) below the tools

**2. `src/components/aichat/UpgradePlanModal.tsx`** — Same reordering in all 4 plan `features` arrays
- Move Sorix tools to positions 1-4 after tokens row

**3. `src/components/aichat/settings/PlansTokensTab.tsx`** — Move the "Free Tools for Everyone" section above the "Need more tokens?" info card (it's already a separate section, just reorder if needed — currently tools section is already below tokens, which is correct)

All 3 files get the same reordering: `Tokens → Sorix Health → Sorix Agro → Sorix Legends → Sorix Deck → Web Search → Voice AI → ...`

