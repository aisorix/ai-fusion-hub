

## Fix All Remaining Missing Bangla Translations

After a thorough audit, I found hardcoded English strings across **14 files** — in settings tabs, chat page components, the share modal, and several landing page components that use inline `language === 'en' ? ... : ...` but still have some English-only strings.

### Files to Update

**Chat Page Components (6 files):**

| File | Hardcoded English Strings |
|------|--------------------------|
| `ProfileTab.tsx` | "Profile Information", "Manage your basic profile details", "Profile picture", "Click to upload a new photo", "Full name", "Phone", "Email", "Email cannot be changed", "Sign Out", "Delete Account", "This action is permanent...", "Update Profile", "Cancel", "Delete Forever" |
| `ReportBugTab.tsx` | "Report a Bug", "Help us improve...", all BUG_TYPES labels/descriptions, SEVERITY_LEVELS labels, "Bug Title", "Description", "Steps to Reproduce", "Your Email", "Submit Bug Report", "Submitting...", "Need immediate assistance?" |
| `HelpCenterTab.tsx` | "Help Center", "Find answers...", "Search for help...", all QUICK_LINKS labels/descriptions, all FAQ_ITEMS questions/answers, all SUPPORT_OPTIONS labels, "Still need help?", "Contact Support", "Copy Email", "Quick Links", "Get More Help", "Frequently Asked Questions" |
| `TermsTab.tsx` | "Terms of Use", "Please read these terms carefully", all TERMS_SECTIONS titles/content, "View Full Terms", "Privacy Policy", "Welcome to AI Sorix..." |
| `SubscriptionTab.tsx` | "We're sad to see you go", "Continue", "Never mind", CANCELLATION_REASONS labels, "Accept Offer & Stay", "Help us improve", "Submit Bug Report", all status badges, all action labels |
| `PaymentHistoryTab.tsx` | "Payment History", "View all your past transactions", "No payment history", "Your payment transactions will appear here...", "Total transactions", "Total spent", plan names |
| `ShareModal.tsx` | "Share & Collaborate", "Share Link", "Anyone with this link...", "Invite Members", "Enter email address", "Commenter", "Viewer", "Members", "Copied", "Copy" |
| `MessageBubble.tsx` | "Writing", "Show thinking", "Hide thinking", "Analyzing your query...", "Cancel", "Save & Send" |
| `ChatInput.tsx` | "Drop files here", "Images, PDFs, code files, and more", "Processing files...", "Health Mode Active - Always consult professionals", "Disable", "Live Voice Mode" |

### Implementation Approach

Rather than adding 200+ keys to the translation files, I will use the **inline ternary pattern** (`language === 'bn' ? 'বাংলা' : 'English'`) that is already used extensively in RolesSection, ProductivityGains, Faqs, ContactUs, AboutUs, Testimonials, and Features. This keeps translations co-located with the components and avoids bloating the central dictionary.

For components that already use `useChatStore` language, I'll add the ternary directly. For settings tabs that don't yet import language, I'll add `const { language } = useChatStore()`.

### Changes Per File

**1. `src/components/aichat/settings/ProfileTab.tsx`** — Add `useChatStore` language import, replace all 14 hardcoded strings with `language === 'bn'` ternaries (Profile Information, Full name, Phone, Email, Sign Out, Delete Account, Update Profile, Cancel, Delete Forever, etc.)

**2. `src/components/aichat/settings/ReportBugTab.tsx`** — Add language import, translate BUG_TYPES array, SEVERITY_LEVELS labels, form labels, placeholder text, submit button text, support email note

**3. `src/components/aichat/settings/HelpCenterTab.tsx`** — Add language import, translate QUICK_LINKS, FAQ_ITEMS, SUPPORT_OPTIONS, section headings, search placeholder, contact card text

**4. `src/components/aichat/settings/TermsTab.tsx`** — Add language import, translate section titles, introduction paragraph, footer button labels (the legal content itself stays in English as it's a legal document, but UI chrome gets translated)

**5. `src/components/aichat/settings/SubscriptionTab.tsx`** — Add language ternaries for all UI labels: status badges, cancellation flow text, action buttons, offer card text

**6. `src/components/aichat/settings/PaymentHistoryTab.tsx`** — Translate header, empty state, summary labels

**7. `src/components/aichat/ShareModal.tsx`** — Add language import, translate header, labels, placeholder, role options, "Copied"/"Copy" button

**8. `src/components/aichat/MessageBubble.tsx`** — Add language from store, translate "Writing", "Show/Hide thinking", "Cancel", "Save & Send"

**9. `src/components/aichat/ChatInput.tsx`** — Translate "Drop files here", "Processing files...", health mode disclaimer, "Disable"

**10. `src/components/aichat/ExportDropdown.tsx`** — Translate "All Assets (ZIP)" label and title

### Total Scope
- ~10 component files updated with inline Bangla translations
- No changes to translation dictionary files (using inline ternary pattern)
- Covers all settings tabs, share modal, message actions, chat input, and export dropdown

