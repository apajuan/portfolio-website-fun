# fun things

The `/fun` corner of my site, where small side projects live. It's a plain landing page that lists the things I've built for no particular reason, plus the projects themselves. The main portfolio lives at [raphaeldilag.xyz](https://raphaeldilag.xyz).

No framework, no build step. Just HTML, CSS, and a bit of vanilla JavaScript.

## What's here

```
index.html      landing page listing the projects
styles.css      styles for the landing page
app.js          theme toggle + the drifting-letters hero canvas
typingabuse/    cadence, a typing speed test
```

### cadence

A minimalist typing test. It tracks words per minute, accuracy, raw speed, and consistency, draws a WPM-over-time graph when you finish, and remembers your personal bests per settings combo in `localStorage`.

Settings you can change:

- **Mode** — timed (15/30/60/120s), fixed word count (10/25/50/100), or quotes (short/medium/long)
- **Difficulty** — common words, a wider standard set, a brutal vocabulary list, or code snippets
- **Punctuation and numbers** — sprinkle them in for the word modes
- **Feedback** — how much the test heckles you while you type, from mild up to unhinged, or silent if you'd rather it kept quiet

Hold `tab` to reset, `enter` for the next test. Everything runs in the browser and nothing leaves it.

## Running it locally

It's static, so any file server works. From the project root:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`. Opening `index.html` straight from disk mostly works too, though the preview iframe on the landing page behaves better over http.

## Notes

The landing page and cadence share the same design tokens and the same `apa-theme` key in `localStorage` as the main portfolio, so the color theme carries across all three. Both respect `prefers-reduced-motion`: the hero letters hold still and the animations back off.

© Juan Raphael A. Dilag
