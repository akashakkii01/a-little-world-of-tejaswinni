# A Little World of Tejaswinni ✦

**The Living Atlas** is a small, interactive world built as a thoughtful digital surprise. It is designed as one connected journey rather than a collection of unrelated sections.

## The experience

- **A personal invitation** — a quiet opening scene and a letter in an envelope.
- **The illustrated atlas** — one hand-drawn valley with four places to discover.
- **The Wild Garden** — help a tiny flower grow through a small, tactile interaction.
- **Cloud Nine Café** — choose the weather of the day; the colour palette of the world responds.
- **The Long Way Round** — choose a trail and follow its three footprints to find the hidden path.
- **The Quiet Observatory** — connect five stars and complete a small constellation.
- **Field Notes** — a saved record of discoveries, with the final page opening after all four places are found.
- **A little keepsake** — create and save a postcard-style card from the experience.

The journey is open-ended: there is no timer, forced order, account, or backend. Progress is stored locally in the visitor's browser.

## Design and interaction principles

- One visual world, with each interaction contributing to the same journey.
- Illustrated 2D scenes and small, purposeful motion rather than a heavy 3D runtime.
- Responsive layouts for desktop and mobile.
- Keyboard-operable controls, visible focus states, semantic dialogs, and reduced-motion support.
- No music autoplay or required sound.

## Technology

- Semantic HTML
- CSS, custom SVG illustration and responsive layouts
- Vanilla JavaScript
- Canvas 2D for a lightweight ambient particle layer
- Browser local storage for journey progress

No build step, backend, API key, or account is required. Google Fonts are loaded remotely with system fallbacks.

## Run locally

Open index.html in a browser, or start a local server:

```bash
python -m http.server 8000
```

Then visit http://localhost:8000.

## Deploy

The repository is configured as a static site on Vercel. The production domain is unchanged:

https://a-little-world-of-tejaswinni.vercel.app

---

Made with care, for Tejaswinni. ♡
