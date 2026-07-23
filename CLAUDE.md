# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The `/fun` corner of a personal site — a static landing page that lists small side projects, plus the projects themselves. No framework, no build step, no package.json. Just hand-written HTML, CSS, and vanilla JS. The main portfolio lives separately at raphaeldilag.xyz.

## Commands

There is no build, lint, or test tooling. To work on it:

```bash
python3 -m http.server 8000        # serve from repo root, then open http://localhost:8000
node --check app.js                # syntax-check a JS file (closest thing to a linter)
```

Serve over http rather than opening `index.html` from disk — the landing page's `.thing` cards embed each project via a live `<iframe>`, which behaves better over http. Every project is static, so any file server works.

## Layout

```
index.html / styles.css / app.js   the /fun landing page
typingabuse/                       "cadence" — a typing speed test (the substantial project)
businesscard/                      bundler-generated single-file prototype
bananaaah/                         hand-authored banana-pudding landing page (index.html + styles.css + app.js + assets/ + fonts/)
```

Each project is a **fully self-contained subdirectory** with its own `index.html` and assets. Projects share no code or CSS with the landing page or with each other — treat each directory as its own little site.

`businesscard/` is a machine-generated bundle (look for the `__bundler_` markers and an embedded/base64 payload). Don't hand-edit it as if it were source; it's build output from an external tool. `bananaaah/` was originally a bundle too, but has been unpacked into clean vanilla source — self-hosted fonts under `fonts/`, images under `assets/`, no React/no framework/no build. Its only JS (`app.js`) is progressive enhancement (logo spin-on-click, hover style swaps); the FAQ is native `<details>`.

## Adding a project to the landing page

Create the project as a self-contained subdirectory, then add a `.thing` card to the `.things` section of `index.html`. Copy an existing card: bump the `num` (`001`, `002`, …), point both the `<a href>` and the preview `<iframe src>` at the project's **directory** (e.g. `href="bananaaah/"`, not `bananaaah/index.html` — links are directory-style for cleaner URLs; this requires serving over http), and fill in name / org / blurb / tags. The card renders a scaled-down live iframe of the real page as its thumbnail (`transform: scale(0.25)`), so the preview is the actual project, not a screenshot.

## Two independent theme systems (important)

The landing page and cadence each implement their own light/dark theming, and they do **not** interoperate — despite what the README says about a shared `apa-theme` key:

- **Landing page** (`app.js`): stores under localStorage key `apa-theme`, toggles a `data-theme="light|dark"` attribute on `<html>`, defaults to `light`, uses a green-forward palette (`--accent: #7fb487`, plus `--err`, `--faint`, …). An inline script in `index.html`'s `<head>` applies the stored theme before first paint to avoid a flash.
- **cadence** (`typingabuse/game.js`): stores theme inside its own `hostility.v1` localStorage blob, toggles a `.light` class on `<html>`, defaults to the OS `prefers-color-scheme`, uses a cool-slate palette (`--accent: #8b97ad`, plus `--error`, `--border`, `--text-dim`, `--bg-soured`, …).

So changing the theme in one does not carry to the other, and their CSS custom-property names differ. If you touch theming, update the right system — the token names are not shared.

Both respect `prefers-reduced-motion`: the landing hero holds still and animations back off.

## cadence (`typingabuse/`) architecture

The whole app is one ~1500-line IIFE in `game.js` (strict mode, no dependencies). It's a Monkeytype-style typing test whose gimmick is that it **heckles you as you type**. Worth understanding before editing:

- **State lives in two plain objects**: `S` (the run — words, keystroke log `S.keyLog`, timers, samples) and `H` (heckler state — cooldowns, decks). `store` is the persisted layer (localStorage key `hostility.v1`): settings, per-config personal bests (`store.bests`), lifetime test count and wpm sum for the running average.

- **Content is data-driven.** The insult copy lives in big config tables near the top — `HECKLES` (keyed by trigger → cruelty tier), `INJECT`, `EULOGY`, `PB_BEAT`. To change what it says, edit those tables, not the logic.

- **Heckling is an event bus.** `fire(name, ctx)` is the single entry point; `TRIGGERS` defines each trigger's cooldown and random chance. `fire` enforces a global rate limit and a settle-in delay, draws a line without replacement (shuffled `H.decks`), interpolates `{tokens}` via `fillLine`, and routes to `showToast` (rides the caret) or `showMargin` (long lines, when there's room). Triggers are raised from the input handlers and the rAF `tick()` loop (stalls, slowdowns, typo streaks, etc.).

- **Word injection is the centerpiece.** `maybeInject()` rewrites upcoming (not-yet-reached) words in the text with short insults — but only when `isSlumping()` says the player has actually slowed or gone sloppy relative to their own pace. A clean, fast run is left alone. Keep that invariant: injection punishes slumps, not competence.

- **"Misery" is ambient UI souring.** `updateMisery()` creeps a 0→1 value from recent errors/idle/slowness and lerps the live CSS vars (`--bg-live`, `--dim-live`, `--caret-live`) toward soured counterparts. Subliminal, never snaps.

- **Settings are config-driven too.** `SETTING_DEFS` declares every control; `renderSettings()` builds the settings bar from it with proper radiogroup/switch a11y and roving tabindex. Changing any setting calls `newTest()`. Note the deliberate misdirection: user-facing labels are innocuous ("feedback", "surprises", `CRUELTY_LABELS`) so the roast stays a surprise, while internal keys (`cruelty`, `injection`, `unhinged`) keep the real names.

- **Rendering is rAF-batched.** Caret position + line scrolling are computed in a single `updateCaretNow()` (scheduled via `scheduleCaret()`) to avoid layout thrash. Audio is synthesized with WebAudio (no sound files) and scheduled relative to the actual keypress timestamp so the rhythm doesn't drift.

- **Input has two paths.** Desktop goes through `keydown` (which `preventDefault`s and feeds `handleChar`); soft keyboards/IME go through the ghost `<input>`'s `input` event. Hold `Tab` mid-run to wind up a reset ring; `Enter` starts the next test; a grace window after results swallows momentum keystrokes so you don't blow past the stats.

### Content guardrail (design invariant)

The heckles have a hard rule stated in a comment block and it must hold for any new copy: **every line attacks the typing, never the person.** No slurs, nothing about body or identity, nothing bleak — "delete the app" is the ceiling, and the `mild` tier never borrows from `unhinged`. Keep new lines within that boundary.
