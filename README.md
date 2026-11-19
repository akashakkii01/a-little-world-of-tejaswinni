# A Little World of Tejaswinni ✦

A cinematic, interactive little universe built as a thoughtful digital surprise.

## Version 2 — Hybrid dreamworld

The experience blends a soft, storybook aesthetic with cinematic depth and playful exploration.

### What's inside
- Animated night-sky canvas with subtle twinkling stars and pointer parallax
- CSS-built floating island, moon, tiny house, trees and a little guide character
- Three interactive portal rooms: softer days, quiet nights and bright beginnings
- An interactive five-flower garden with individual wishes
- A constellation mini-discovery: find three stars to unlock a hidden letter
- Four letter cards with thoughtful messages
- Scroll progress, reveal transitions, responsive navigation and reduced-motion support
- Keyboard-accessible buttons and modal dialog; no account or backend required

## Tech
- Semantic HTML, modern CSS and vanilla JavaScript
- Canvas 2D for the ambient starfield
- CSS transforms and keyframes for the floating island and scene
- IntersectionObserver for scroll reveals
- No framework, build step, external JavaScript runtime or API keys

Google Fonts are loaded remotely; the page falls back to system fonts if unavailable.

## Run locally
Open `index.html` in a browser, or start a local server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploy
The repository is a static site. Import it into Vercel with the project root as the root directory and the framework preset set to **Other**. No build command or output directory is required.

---

Made with a little extra thought, just for Tejaswinni. ♡
