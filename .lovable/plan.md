# Compliance & Payments Polish

Scope: landing/pricing, footer, about, payment modal, refund policy, T&C — all bilingual (EN/BN), professional.

## 1. Landing page — remove "We Accept Multiple Payment Methods" section
- `src/components/Pricing.jsx` (≈ lines 730–860): delete the entire "Secure Payments" block (header + gateway cards + accepted methods grid). Keep pricing tiers + FAQ.

## 2. Footer — add SSLCommerz "Pay With" strip (image 2)
- `src/components/Footer.jsx`: add a new bottom row above the copyright line showing the SSLCommerz-verified payment-methods strip.
- Save the uploaded image (image-340.png) as a Lovable asset: `src/assets/sslcommerz-paywith.png.asset.json` via `lovable-assets create` (no binary in repo).
- Render as a single responsive `<img>` with alt "Verified by SSLCommerz — accepted payment methods", `loading="lazy"`, bordered card, light bg so the strip reads on dark footer.

## 3. About Us — Trade License section
- `src/pages/AboutUsPage.jsx`: add a "Legal & Compliance" card with placeholder fields (user will edit later):
  - Trade License No: `TRAD/DNCC/XXXXXX/2025`
  - Issuing Authority: Dhaka North City Corporation
  - BIN/TIN: `XXXXXXXXX-XXXX`
  - Registered Address: placeholder
- Bilingual labels, small print "Subject to update".

## 4. Refund Policy — switch to "7-Day Usage-Based Guarantee"
- `src/pages/RefundPolicy.jsx`: rewrite section 2 from "No-Refund" to **"7-Day Refund Guarantee"**:
  - Full refund within 7 days of purchase **if usage is under a defined threshold** (≤ 10% of monthly token/credit quota AND no premium tool export).
  - After 7 days OR threshold exceeded → non-refundable.
  - Yearly plans: pro-rata refund within 7 days only.
  - Coupons / promo purchases: non-refundable.
- Update related sections (cancellation, exceptions) for consistency. Keep bilingual.

## 5. Payment system — SSLCommerz only
- `src/components/PaymentModal.tsx`: remove bKash and Stripe gateway cards + their handler branches. Auto-select SSLCommerz (no selector needed if only one) — keep a single branded card so users see what's used.
- Update copy: "Secure checkout via SSLCommerz".
- Do NOT delete `bkash-payment` / `stripe-payment` edge functions (left dormant for future).
- Pricing currency stays BDT.

## 6. Coupon code field in PaymentModal
- Add an "Have a coupon? (optional)" collapsible input above the Pay button.
- On submit, call existing `coupons` table via a new lightweight edge function `validate-coupon` (reads code, returns `{valid, discount_type, discount_value, final_amount}`); if `coupons` table query is sufficient with RLS, do client-side `.select().eq('code', x).eq('is_active', true)` from `supabase` with anon — confirm RLS allows read of active coupons; otherwise edge fn.
- Apply discount to `totalPrice` before passing to SSLCommerz; pass `coupon_code` in payment metadata so webhook records it.
- Show applied discount line in plan summary; allow remove.

## 7. Checkout consent tickbox (T&C / Refund / Privacy)
- In `PaymentModal.tsx`, above Pay button add a required checkbox:
  - EN: "I have read and agree to the [Terms & Conditions], [Refund Policy], and [Privacy Policy]. I understand my subscription will auto-renew unless cancelled."
  - BN equivalent.
  - Links open `/terms`, `/refund-policy`, `/privacy-policy` in new tab.
- Pay button disabled until checked. Validate on click with toast.

## 8. Terms & Conditions — auto-renewal clause
- `src/pages/TermsOfService.jsx`: add/extend a "Subscription & Auto-Renewal" section:
  - Subscriptions renew automatically at end of billing cycle at then-current price.
  - User can cancel anytime from Settings → Plans before renewal date.
  - Failed renewal → 3-day grace, then downgrade to Free.
  - Bilingual.

## Out of scope (deliberate)
- No DB migrations (coupons table already exists).
- bKash/Stripe edge functions left in place (dormant).
- No changes to admin dashboard.

## Files touched
- edit: `src/components/Pricing.jsx`, `src/components/Footer.jsx`, `src/pages/AboutUsPage.jsx`, `src/pages/RefundPolicy.jsx`, `src/pages/TermsOfService.jsx`, `src/components/PaymentModal.tsx`
- new: `src/assets/sslcommerz-paywith.png.asset.json`
- maybe new: `supabase/functions/validate-coupon/index.ts` (only if RLS blocks anon coupon reads)

Ready to implement on approval.