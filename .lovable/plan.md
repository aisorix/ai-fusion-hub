# Sorix Scholars — Dashboard, Profile, Certificate System

Build a complete learner workspace inside `/sorixscholars`: a dashboard with enrollments + progress, a profile editor, an upgraded certificate hub with PDF download + verification, and automatic certificate issuance when a learner finishes a course/workshop/competition. Visual style matches the existing courses/workshops pages (Plus Jakarta Sans, soft cards, Bangla/English toggle).

---

## 1. Database changes (one migration)

Extend `public.user_certificates`:
- `certificate_number text unique` — human-readable ID, format `SS-YYYY-XXXXXX` (e.g. `SS-2026-A4F19K`)
- `recipient_name text` — snapshot of name at issue time (so renames don't change old certs)
- `issuer_name text default 'Rakib Eslam'`
- `issuer_title text default 'Founder & CEO, AI Sorix Limited'`
- `metadata jsonb default '{}'` — for description / extra fields

New table `public.user_enrollments`:
- `user_id uuid` (FK auth.users)
- `kind text check in ('course','workshop','competition')`
- `source_slug text` — slug of the item
- `title text`
- `progress int default 0` (0–100)
- `status text default 'in_progress'` ('in_progress' | 'completed')
- `enrolled_at`, `completed_at`, `updated_at`
- Unique `(user_id, kind, source_slug)`
- GRANTs + RLS: user can SELECT/INSERT/UPDATE their own; service_role full.

RPCs (SECURITY DEFINER, search_path = public):
- `enroll_item(_kind, _slug, _title)` — upsert enrollment for `auth.uid()`.
- `update_progress(_kind, _slug, _progress)` — clamps 0–100; if 100 → marks completed_at + status, then auto-issues certificate by inserting into `user_certificates` (only if one doesn't already exist for that user+kind+slug); generates `certificate_number` server-side.
- `verify_certificate(_number text)` — public (granted to anon + authenticated); returns `{ valid, recipient_name, title, kind, issued_at, certificate_number, issuer_name, issuer_title }` or `{ valid:false }`. No user_id leak.

Update existing `user_certificates` policy to also allow public SELECT only through the verify RPC (keep table RLS user-only, RPC bypasses).

Make `certificates` policy add public-read of minimal columns? No — use RPC only.

Add public GRANT EXECUTE on `verify_certificate` to `anon, authenticated`; others to `authenticated` + `service_role`.

Backfill: for existing rows in `user_certificates`, populate `certificate_number` = `SS-<year>-<6 random hex>` and `recipient_name` from profiles.full_name.

---

## 2. Certificate PDF (shared utility)

New `src/lib/certificateGenerator.ts` exporting `generateCertificatePdf(cert)`. Recreates the design in image 2 exactly:
- Landscape A4, cream `#F5EBD6` background.
- Brown ornamental corner brackets (drawn with jsPDF lines/rects) + simple daisy clusters (small circles + petals) in 4 corners.
- Big serif "CERTIFICATE" (Times Bold), subtitle "OF COMPLETION" (or "OF PARTICIPATION" for competitions).
- "THIS CERTIFICATE IS PROUDLY PRESENTED TO".
- Recipient name in cursive (use jsPDF's `times` italic at 48pt as best-available script font; document limitation — embedding a true script font like "Great Vibes" requires adding a base64 TTF, which we'll do via a small `greatVibes.ts` font file loaded with `doc.addFileToVFS` + `doc.addFont` for an authentic look).
- Body paragraph: "for successfully completing the {kind} '{title}' organized by AI Sorix Limited, showing curiosity, effort and a passion for learning."
- Signature block: cursive "Rakib Eslam" + thin divider + "Founder & CEO, AI Sorix Limited".
- Footer-left: `Certificate No: SS-2026-A4F19K`  ·  `Issued: June 20, 2026`  ·  `Verify at aisorix.com/verify/SS-2026-A4F19K`.

Replace the inline PDF code in `ScholarsCertificates.tsx` with this util. Reuse on dashboard, certificates page, and verify page.

---

## 3. Pages & routes

Add to `src/App.jsx` under `/sorixscholars`:
- `dashboard` → `ScholarsDashboard.tsx` (auth-gated; redirect to /login if signed-out)
- `profile` → `ScholarsProfile.tsx` (auth-gated)
- `verify` and `verify/:number` → `CertificateVerifyPage.tsx` (public)

Keep `certificates` route. Add navbar/footer links so both navbar and footer point to certificates (already there) + dashboard + profile (in user dropdown).

### 3a. `ScholarsDashboard.tsx` (`/sorixscholars/dashboard`)
- Header: greeting "স্বাগতম, {firstName} 👋" + small "Edit profile" button → `/sorixscholars/profile`.
- 4 stat cards: Enrolled courses, Workshops attended, Competitions joined, Certificates earned.
- 3 tabbed sections (Courses / Workshops / Competitions):
  - Each item card shows: thumb (kind icon), title, status pill, progress bar (`progress %`), enrolled date, "Continue" → detail page, and if status=in_progress an "Mark complete" button (calls `update_progress(_,_,100)` → toast "🎉 Certificate issued").
  - Empty state for each tab with a CTA to browse.
- "Recent certificates" row: latest 3 cards with Download PDF.

### 3b. `ScholarsProfile.tsx` (`/sorixscholars/profile`)
- Avatar uploader (drag/click) → uploads to existing `profile-avatars` storage bucket (path `{user_id}/avatar.{ext}`, public URL → `profiles.avatar_url`).
- Form fields: Full name, Email (read-only, with "Change email" calling `supabase.auth.updateUser({ email })`), Phone (country code + number, reusing existing columns), Bio (optional, add `bio text` to profiles in same migration).
- Password section: "Change password" → `supabase.auth.updateUser({ password })`.
- Save → updates `profiles`; sonner toast on success.

### 3c. `ScholarsCertificates.tsx` (upgrade)
- Same Plus Jakarta layout as today, but:
  - Sorted newest-first (already), badge "NEW" if issued in last 7 days.
  - Each card shows certificate number prominently, kind icon, title, issued date, "Download PDF" (new util) + "Verify" link → `/sorixscholars/verify/{number}` + "Copy link" button (sonner toast).
  - Empty state CTAs unchanged.

### 3d. `CertificateVerifyPage.tsx` (`/sorixscholars/verify` and `/verify/:number`)
- Hero: "Verify a Sorix Scholars certificate" + an input box (auto-filled when `:number` present).
- On submit → calls `verify_certificate` RPC.
- Valid result: green success card showing recipient name, title, kind, issued date, certificate number, issuer; "Download a copy" button (re-renders PDF from returned data).
- Invalid: red card "No certificate found with this number."
- Page styled like courses/workshops listing pages.

---

## 4. Navbar / Footer / triggers

- Navbar user dropdown (currently has "আমার সার্টিফিকেট" + "ড্যাশবোর্ড" pointing to `/dashboard`): change Dashboard to `/sorixscholars/dashboard`, add "প্রোফাইল / Profile" item above logout.
- Footer "গুরুত্বপূর্ণ লিংক": add "Verify certificate" → `/sorixscholars/verify` and "ড্যাশবোর্ড" → `/sorixscholars/dashboard` (only when signed in is fine — but easier to always show).
- On course/workshop/competition detail pages, "Enroll" / "Register" buttons (currently open ContactModal) — also call `enroll_item` RPC when the user is authenticated, so it shows in the dashboard. ContactModal flow stays for unauthenticated leads.

---

## 5. Out of scope

- Real lesson-by-lesson progress tracking (we expose only manual "Mark complete" + RPC; future lesson UI can call `update_progress`).
- Public certificate "share" image (PDF download covers the request).
- Editing certificates after issue (immutable by design).
- Embedding a custom signature image (cursive font via embedded Great Vibes TTF approximates image 2's hand-written look).
