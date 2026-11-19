# A Little World of Tejaswinni

A personal, browser-based experience built as a hybrid of real landscape photography and a real-time Three.js environment.

## Visual direction

The opening environment now uses a real alpine-lake photograph as its landscape plate, with a real-time WebGL foreground. The foreground loads a textured Scots pine GLB model and uses real-time camera parallax, lighting, fog, shadows and subtle ambient particles. The atlas and discovery scenes use photographic environments rather than the original hand-drawn SVG valley.

The experience is intentionally a hybrid: photography carries the natural detail and atmosphere; Three.js adds depth, camera response and interactive environmental elements. It is not a full terrain scan or a first-person open-world game.

## Places

- **The Wild Garden** — a photographic alpine meadow with a small growth interaction.
- **Cloud Nine Café** — a warm cabin / lakeside scene and a gentle mood choice.
- **The Long Way Round** — a misty forest path and a route-finding interaction.
- **The Quiet Observatory** — a real night-sky landscape and a small constellation interaction.
- **Field Notes** — a local record of discoveries.
- **A little keepsake** — a downloadable postcard from the experience.

There is no timer, forced order, account or backend. Progress is stored locally in the visitor's browser. No music autoplay or required sound.

## Technology

- Semantic HTML, CSS and vanilla JavaScript
- Three.js WebGL renderer
- GLTFLoader for the textured pine model
- Unsplash photography for the environmental plates
- Canvas 2D ambient layer retained for lightweight atmospheric detail
- Browser local storage for journey progress

Three.js is loaded from jsDelivr. The site retains a photographic CSS fallback if WebGL cannot be initialized.

## Image and model credits

- Mountain lake background: Sergey Pesterev, Unsplash
- Alpine meadow: Daniel Pintilei, Unsplash
- Cabin / lakeside interior: Hendrik Morkel, Unsplash
- Forest path: Oleksii Rozanov, Unsplash
- Night sky over Spiti: Ashwini Chaudhary, Unsplash
- Scots pine GLB: Innerscene, released under CC0

Photographs are used under the Unsplash License. The Scots pine model is CC0. Please retain these credits if redistributing the project.

## Run locally

Open `index.html` in a browser through a local server:

```bash
python -m http.server 8000
```

Then visit http://localhost:8000.

## Deployment

The production domain is unchanged:

https://a-little-world-of-tejaswinni.vercel.app

The photorealistic hybrid work is isolated on the `feat/photorealistic-hybrid-world` branch and has not been merged into production.
