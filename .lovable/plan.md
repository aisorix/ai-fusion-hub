

## Fix Hero Title: Move "Ecosystem" to First Line, Keep Only "One [word]" on Second Line

### Current State
- Line 1: "Your Complete AI Research & Automation Ecosystem" (from `heroTitle1`)
- Line 2: "Ecosystem — One [Platform/Workspace/Subscription]" (hardcoded in Hero.jsx)

"Ecosystem" appears twice.

### Changes

**`src/components/Hero.jsx`** (lines 119-122)
- Remove "Ecosystem — " / "ইকোসিস্টেম — এক " from the animated line
- Change to just `"One "` / `"এক "`
- The `heroTitle1` translation already contains "Ecosystem" so it stays on the first line

```jsx
// Line 121 — change from:
{language === "en" ? "Ecosystem — One " : "ইকোসিস্টেম — এক "}
// to:
{language === "en" ? "One " : "এক "}
```

No other files change. Colors, gradient, animation, cursor all remain exactly the same.

