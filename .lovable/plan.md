## Scope

A large multi-area update covering plan access, voice (STT/TTS), tools gating, safety banners, account/profile management with soft-delete + recovery, and a "Sorix Codex" rebrand of the Projects section. All changes will be applied on desktop and mobile.

---

## 1. Plan-tier access updates

**Chat LLMs — unlock for all paid tiers**
- Update `src/lib/smartRouting.ts` and `ModelSelector` gating so every model currently unlocked for `premium` is also unlocked for `premium_plus`, `max`, `enterprise` (no extra gates above premium).
- Verify `useSubscription`/`planAccess.meetsPlan` already covers this; remove any `=== "premium"` strict checks and switch to `meetsPlan(plan, "premium")`.

**Sorix Agent — available on every paid plan**
- `src/pages/CoWorkPage.tsx` + agent route guard: drop the premium-only lock; allow `basic | pro | premium | premium_plus | max | enterprise`. Free plan still locked (shows upgrade CTA).

**Sorix Imagine — 3 free renders, then upgrade (Cineshoot-style)**
- New `imagine_free_renders_used` column on `profiles` + `increment_imagine_free_render()` RPC mirroring the existing cineshoot pattern.
- `imagine-generate` edge function: if user is on free tier and `< 3` renders, allow and increment; else 402.
- `ImaginePage.tsx`: show "Free trial: X of 3 renders left" banner; show upgrade modal when exhausted.

**Cineshoot — clarify trial banner**
- Banner copy update: "2 free renders for everyone. Full access requires **Sorix Premium Plus, Max, or Enterprise**."

---

## 2. Voice fixes

**STT (speech-to-text)**
- Replace current OpenAI Whisper path in `supabase/functions/stt-transcribe` with **Google `chirp-3`** via Lovable AI Gateway (`google/chirp-3`). Keep browser `SpeechRecognition` as silent fallback.
- Improve `useVoiceDictation.ts`: ensure mic stream stops on `stop`/`cancel`, drop stale "Failed to fetch" toasts, return clean transcript.
- Apply to every prompt bar that uses `VoiceDictationButton`: ChatInput, Imagine, Cineshoot, FlowBuilder, Deck, Health, Agro, Agent, Legends, Scholars chat.

**TTS (text-to-speech) — fix non-stop voice on close**
- `useTtsPlayback.ts`: on `stop()` call `window.speechSynthesis.cancel()` AND pause/clear the `<audio>` element AND abort the in-flight fetch via `AbortController`. Ensure unmount also cancels.
- Close button on TTS UI calls the same unified `stop()`.

---

## 3. Safety banners (Health & Agro)

Add a prominent **Bangla** warning banner at the top of `HealthPage.tsx` and `AgroPage.tsx`:

> ⚠️ সতর্কতা: ডাক্তার / কৃষি বিশেষজ্ঞের অনুমতি ছাড়া কোনো ঔষধ বা চিকিৎসা গ্রহণ করবেন না। এই টুলটি কেবল তথ্যমূলক সহায়তা প্রদান করে — চূড়ান্ত সিদ্ধান্ত পেশাদারের পরামর্শ অনুযায়ী নিন।

Styled with amber/red gradient, icon, bold heading, dismissible per-session only (re-shows next visit). Same banner on mobile.

---

## 4. Profile & Account (chat-side parity with Scholars + soft-delete)

**Chat-side Settings → Profile**
- Mirror the Scholars profile editor: full name, phone (with country code), email (read-only), avatar upload — same layout/styles as screenshot 2.

**Soft-delete with 30-day recovery**
- New table `account_deletion_requests` (user_id, reason, requested_at, scheduled_purge_at, status: pending|cancelled|purged) with RLS + GRANTs + service_role for cron.
- Add `deleted_at` + `deletion_scheduled_at` on `profiles`.
- Delete flow modal: 3-step
  1. "Why are you leaving?" (radio list + free text)
  2. Confirm — explain "Account will be recoverable for 30 days, then permanently deleted."
  3. Final confirm + sign-out.
- On login during the 30-day window: show "Your account is scheduled for deletion on {date}. Recover account?" banner with one-click restore.
- Edge function `account-delete-request` (schedule) + `account-delete-recover` + scheduled `account-delete-purge` (cron daily) using service role.
- Mirror same flow in the **Scholars** profile page.

---

## 5. "Sorix Codex" rebrand (Projects → Sorix Codex)

- Rename "Projects" everywhere in UI copy → **Sorix Codex** (sidebar, page titles, breadcrumbs, More Tools page, empty states, dashboards). Keep DB table/URL slugs as `projects` to avoid migration risk; only UI strings change.
- Chat sidebar tools order: **Cineshoot → Sorix Codex → More Tools**.
- Add Sorix Codex card to the **More Tools** page and the chat-input tools menu.
- Mobile: same rename + same ordering in the mobile drawer.

---

## 6. Mobile parity

Every change above (banners, profile editor, delete flow, codex rename, voice button states, trial banners, plan gating) is verified on `<md` breakpoints using `h-[100dvh]`, safe-area insets, and the existing horizontal-scroll patterns.

---

## Technical notes

- DB migrations: `profiles.imagine_free_renders_used`, `profiles.deleted_at`, `profiles.deletion_scheduled_at`, new `account_deletion_requests` table with grants + RLS + update trigger, new RPCs `increment_imagine_free_render`, `request_account_deletion(reason)`, `recover_account()`.
- Edge functions: update `stt-transcribe` (chirp-3), update `imagine-generate`, new `account-delete-request` / `account-delete-recover` / `account-delete-purge` (cron).
- Frontend: `useTtsPlayback.ts` AbortController + speechSynthesis.cancel; `useVoiceDictation.ts` track stop; `ImaginePage.tsx` trial banner; `CineshootPage.tsx` banner copy; `HealthPage.tsx` / `AgroPage.tsx` Bangla warning; `ChatSettings` profile editor + delete modal; Scholars profile delete modal; Projects→Sorix Codex string rename across `src/**`; sidebar reorder.
- No changes to existing chat business logic beyond model unlocking.

---

## Out of scope (call out for confirmation if needed)

- Actual hard-purge cron requires Supabase pg_cron — will be wired but you must enable the scheduled trigger once.
- Email notifications for "account scheduled for deletion" / "recovered" can be added in a follow-up.
