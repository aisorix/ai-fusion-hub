

## Fix Hero Typewriter Alignment & Cursor Position

### Problems (from screenshot)
1. The blinking cursor `|` is far to the right, separated from the typed text — caused by `minWidth: "12ch"` creating a wide fixed container
2. The second line ("Ecosystem — One Sub...") is left-shifted relative to the first line ("Your Complete AI Research") — caused by `whitespace-nowrap` + `text-left` on the fixed-width span preventing natural centering

### Solution
Instead of using a fixed `minWidth` container (which pushes the cursor away), use a different approach: make the entire second line a fixed width based on its longest rendered state, and let the typed text + cursor flow naturally together.

### Changes

**`src/components/Hero.jsx`** (lines 117-128)

1. Remove `whitespace-nowrap` from the second line wrapper — allow natural text centering
2. Remove the `inline-block text-left` with `minWidth` from the typed text span — this is what causes the cursor gap
3. Instead, wrap the entire second line (static + dynamic text) in a container that uses `inline-flex` with a fixed width calculated from the longest combination ("Ecosystem — One Subscription" / "ইকোসিস্টেম — এক সাবস্ক্রিপশন")
4. Keep cursor immediately after `typedText` with no gap

```jsx
<span className="block">
  <span 
    className="animated-gradient-text inline-block text-left"
    style={{ minWidth: language === "en" ? "32ch" : "28ch" }}
  >
    {language === "en" ? "Ecosystem — One " : "ইকোসিস্টেম — এক "}
    {typedText}
    <span className="hero-cursor">|</span>
  </span>
</span>
```

This keeps "Ecosystem — One" + typed text + cursor all in one inline-block container. The container has a fixed width matching the longest word, so the first line stays centered above it. The cursor sits right next to the last typed character.

### Result
- Cursor immediately follows typed text (no gap)
- Both lines center-align properly
- Text position stays stable during typing animation

