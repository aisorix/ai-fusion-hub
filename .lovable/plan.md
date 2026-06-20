# Plan: Workshop & Competition Detail Pages — Match Course Detail Design

Rewrite both `WorkshopDetailPage.tsx` and `CompetitionDetailPage.tsx` to mirror the high-fidelity Bangla layout already shipped on `CourseDetailPage.tsx` (matching the 9 attached screenshots).

## Files to change

1. **`src/pages/scholars/WorkshopDetailPage.tsx`** — full rewrite. Drop the Supabase fetch; use the static `WORKSHOPS` array from `WorkshopsPage.tsx` (lift it to `src/data/workshops.ts` so both pages share it). Match by `slug`, 404 → redirect to `/sorixscholars/workshops`.

2. **`src/pages/CompetitionDetailPage.tsx`** — full rewrite. Source data from `src/data/academy.ts` `competitions[]` matched by `slug`. Extend that entry with the same extra fields used below (problems, learnings, curriculum/timeline, mentor, FAQs, perks, pricing) — hard-coded per competition.

3. **`src/data/workshops.ts`** (new) — export the WORKSHOPS array + per-workshop extended content (problems, learnings, curriculum days, mentor, FAQs, perks, price/oldPrice, batch label, deadline timestamp).

## Section-by-section (both pages, same pattern)

1. **Hero (dark navy, grid bg)** — left: green pulse pill (`চলমান ব্যাচ: Batch 4` for workshop / `স্ট্যাটাস` pill for competition), big serif title (Bangla + English mix), Bangla tagline, 3 info pills (date / time / Google Meet OR prize / deadline / mode), primary yellow "সিট বুক করুন →" CTA + outline "📖 কারিকুলাম দেখুন" CTA. Right: rounded video placeholder card with play button overlay; below: live countdown ("রেজিস্ট্রেশন শেষ হতে বাকি: XX দিন : XX ঘণ্টা : XX মিনিট : XX সেকেন্ড") ticking via `useEffect` + `setInterval`. Smooth-scroll CTAs → `#enroll` / `#curriculum`.

2. **"কেন এই ওয়ার্কশপ/কম্পিটিশন আপনার প্রয়োজন?"** (light bg) — centered title with short blue underline, 2×2 grid of soft white cards with red ⚠ circle icon + Bangla problem text.

3. **"এই ওয়ার্কশপ/কম্পিটিশন থেকে যা যা শিখবেন/পাবেন"** (dark navy bg) — centered title + short blue underline, 2×2 dark glass cards with blue ▶ icon, title + Bangla description.

4. **"ওয়ার্কশপ কারিকুলাম" / "কম্পিটিশন রাউন্ডসমূহ"** (light bg) — centered title + blue underline + Bangla subtitle. Pill-tab selector (Day 1 / Day 2 / Day 3 for workshop, Round 1 / Round 2 / Final for competition) with Bangla numeral in blue square. Active tab gets blue gradient bg + shadow; inactive light. Selected tab reveals a white rounded card listing items with blue ● bullets in 2-column grid.

5. **"যাদের জন্য এই ওয়ার্কশপ" + "ওয়ার্কশপে যা যা প্রয়োজন"** (light bg, 2-col split cards) — two rounded cards side-by-side with icon header (Users / Target) and bulleted Bangla list (blue ● / blue ✓).

6. **"আপনার ইনস্ট্রাক্টর" / "আয়োজক"** (dark navy section) — rounded photo card on left (uses `founder-rakib.jpg`), big serif Bangla name, blue subtitle (role/institution), Bangla bio paragraph with left blue border.

7. **"শিক্ষার্থীদের মতামত"** (light bg) — horizontal scroll row of 4–6 white testimonial cards, each: 5 yellow stars, Bangla quote, blue circle avatar with first letter + name + "AI Workshop Participant" / "Competition Participant".

8. **"সচরাচর জিজ্ঞাসিত প্রশ্ন"** (light bg) — centered title + blue underline. Accordion list (first item open by default, blue ring + light blue bg when open; closed items white with grey `?` circle). Reuses `shadcn/ui` Accordion already in project.

9. **"এখনই রেজিস্ট্রেশন করুন"** (large dark enroll card, `id="enroll"`) — top blue→purple gradient border. Left: "ওয়ার্কশপে কী কী পাচ্ছেন?" + 6 ✓ Bangla checklist. Right: strikethrough old price (rose), giant white price (৳৪৭০ etc.), "সীমিত সময়ের জন্য" subtitle, "প্রোমো কোড (যদি থাকে)" input + dark "Apply" button (sonner toast), yellow "⚡ মাত্র ৯৯৮ টি সিট বাকি" line, big blue→purple gradient "রেজিস্ট্রেশন করুন →" CTA → opens existing `ContactModal` with the workshop/competition title as subject, footer row "🛡 সিকিউর পেমেন্ট    ⏱ লাইফটাইম অ্যাক্সেস".

10. **Sticky bottom bar** (mobile + desktop, fixed `bottom-4`) — dark pill: title + price + Batch pill + live countdown + yellow "সিট বুক করুন →" button (scrolls to `#enroll`).

## Button behavior
- Hero "সিট বুক করুন" / sticky CTA → smooth-scroll to `#enroll`.
- Hero "কারিকুলাম দেখুন" → smooth-scroll to `#curriculum`.
- Promo "Apply" → sonner toast `"শীঘ্রই আসছে"`.
- "রেজিস্ট্রেশন করুন" → opens `ContactModal` (subject = item title).
- Back link → `/sorixscholars/workshops` or `/sorixscholars/competitions`.
- Countdown computes from a hard-coded `deadline` ISO timestamp per item.

## Out of scope
- Real video playback (placeholder only).
- Real promo / payment.
- Editing `CourseDetailPage` or other pages.
- New imagery beyond `founder-rakib.jpg`.
