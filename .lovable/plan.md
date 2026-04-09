
## Fix Hero Title Second Line Centering

### Problem
The second line ("Ecosystem — One Workspace") appears left-shifted because it uses `text-left` on an `inline-block` container with a fixed `minWidth`. The `text-left` was added to keep the typewriter text anchored, but it breaks the visual centering with the first line.

### Solution
Change the approach: instead of `text-left` on the inline-block, use `text-center` to match the parent's centering. To prevent the "Ecosystem — One" text from shifting during typing, we keep the fixed `minWidth` but center the content within it.

**`src/components/Hero.jsx`** (line 121)
- Change `text-left` to `text-center` on the animated-gradient-text span
- This centers the second line content within its fixed-width container, aligning it visually with the first line above

```jsx
<span className="block">
  <span 
    className="animated-gradient-text inline-block text-center"
    style={{ minWidth: language === "en" ? "32ch" : "28ch" }}
  >
    {language === "en" ? "Ecosystem — One " : "ইকোসিস্টেম — এক "}
    {typedText}
    <span className="hero-cursor">|</span>
  </span>
</span>
```

### Result
Both lines center-align perfectly. The fixed-width container still prevents layout shift during typing, but content is centered within it.
