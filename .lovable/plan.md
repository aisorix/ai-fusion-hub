

## Fix Typewriter Text Position Shift

### Problem
The "Ecosystem — One" text shifts horizontally as the rotating word (Platform/Workspace/Subscription) types and deletes, because the typed text changes width and the entire line is centered together.

### Solution
Keep "Ecosystem — One" fixed in place by giving the rotating word a fixed-width container. The longest word is "Subscription" — we reserve that width so the static text never moves.

### Changes

**`src/components/Hero.jsx`** (lines 119-127)
- Wrap the rotating word span in an `inline-block` container with a fixed `min-width` based on the longest word
- Use `text-left` on the rotating word container so characters type from the left edge
- Use a `ch`-based width or a manual min-width to reserve space for "Subscription" (12 chars in English, ~সাবস্ক্রিপশন in Bengali)

```jsx
<span className="whitespace-nowrap">
  <span className="animated-gradient-text">
    {language === "en" ? "Ecosystem — One " : "ইকোসিস্টেম — এক "}
  </span>
  <span className="animated-gradient-text inline-block text-left" style={{ minWidth: language === "en" ? "12ch" : "10ch" }}>
    {typedText}
  </span>
  <span className="hero-cursor animated-gradient-text">|</span>
</span>
```

### Result
"Ecosystem — One" stays perfectly still. Only the rotating word animates in its reserved space. The cursor follows the typed text naturally.

