

## Add Social Platform Connectors to Sorix Co-Work

Add Facebook, Instagram, WhatsApp, WhatsApp Business, and other major platforms to the connector panel alongside the existing Google Drive, Gmail, LinkedIn, and Twitter connectors.

### Changes

**1. `src/stores/coworkStore.ts`**
- Expand `ConnectorService` type to include: `facebook`, `instagram`, `whatsapp`, `whatsapp_business`, `youtube`, `telegram`, `slack`, `discord`, `pinterest`, `tiktok`
- Add all new connectors to the default `connectors` array with `coming_soon` status, appropriate labels and icon keys

**2. `src/components/cowork/ConnectorPanel.tsx`**
- Import additional lucide icons: `Facebook`, `Instagram`, `MessageCircle`, `Youtube`, `Send`, `Hash`, `Pin`, `Music`
- Add all new icons to the `iconMap`
- Add a scrollable container (`max-h` with `overflow-y-auto`) since the list is now longer

### New Connectors List

| Service | Label | Icon | Status |
|---------|-------|------|--------|
| facebook | Facebook | Facebook icon | coming_soon |
| instagram | Instagram | Instagram icon | coming_soon |
| whatsapp | WhatsApp | MessageCircle | coming_soon |
| whatsapp_business | WhatsApp Business | MessageCircle | coming_soon |
| youtube | YouTube | Youtube icon | coming_soon |
| telegram | Telegram | Send icon | coming_soon |
| slack | Slack | Hash icon | coming_soon |
| discord | Discord | Hash icon | coming_soon |
| pinterest | Pinterest | Pin icon | coming_soon |
| tiktok | TikTok | Music icon | coming_soon |

Only 2 files modified. All new connectors show "Coming Soon" badge matching existing pattern.

