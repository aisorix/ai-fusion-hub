
## Fix Settings Modal: Subscription and Payment History Tabs

### Problem
1. **Subscription and Payment History tabs show Plans & Tokens content** -- In `SettingsModal.tsx`, the `renderContent()` switch statement maps both `'subscription'` and `'payment'` cases to `<PlansTokensTab />` instead of their dedicated components.
2. **Missing imports** -- `SubscriptionTab` and `PaymentHistoryTab` are not imported in `SettingsModal.tsx`.
3. **Build error** -- `ChatSidebar.tsx` references `tool.comingSoon` but the `moreTools` array items don't have that property.

### Changes

#### 1. `src/components/aichat/SettingsModal.tsx`
- Import `SubscriptionTab` and `PaymentHistoryTab`
- Update `renderContent()` switch to route:
  - `'subscription'` -> `<SubscriptionTab />`
  - `'payment'` -> `<PaymentHistoryTab />`
  - `'plans'` -> `<PlansTokensTab />` (unchanged)

#### 2. `src/components/aichat/ChatSidebar.tsx`
- Remove the `tool.comingSoon` reference (lines 307-311) since none of the tools in the array have that property, fixing the TypeScript build error.

### Technical Details

**SettingsModal.tsx** -- The switch statement currently has:
```
case 'plans':
case 'subscription':
case 'payment':
  return <PlansTokensTab />;
```
This will be changed to three separate cases, each rendering its own component.

**ChatSidebar.tsx** -- The `moreTools` array type is inferred without `comingSoon`, so accessing it causes TS2339. The conditional block rendering the "COMING SOON" badge will be removed.
