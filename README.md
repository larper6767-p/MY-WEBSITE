# Personal Portfolio Website

A personal portfolio website built with plain HTML, CSS and JavaScript. No frameworks, no build tools. Designed as a warm, editorial site with a sketchbook you can flip through and a listening room with a turntable.

## Structure

```
/
├── index.html              # Home, About and Beyond (single scrollable page)
├── 404.html                # Custom 404 page
├── favicon.svg             # Site favicon
├── css/
│   ├── tokens.css          # Design tokens (colours, type, spacing)
│   ├── base.css            # Base styles, focus, reduced motion
│   ├── fonts.css           # Self-hosted font faces
│   ├── pages.css           # Shared page styles (nav, footer, sections)
│   ├── sketchbook.css      # Sketchbook flip-book styles
│   ├── listening-room.css  # Listening room styles
│   └── styleguide.css      # Style guide (dev reference)
├── js/
│   ├── pages.js            # Shared page script (nav, blocks, scroll-spy)
│   ├── sketchbook.js       # Sketchbook renderer (StPageFlip)
│   ├── listening-room.js   # Listening room (turntable, tracks, embeds)
│   └── styleguide.js       # Style guide interactions
├── data/
│   ├── site.json           # Identity, strings, nav, home, about, beyond, social
│   ├── artworks.json       # 8 artworks with images, metadata, variants
│   ├── sketchbook.json     # Covers and 6 spreads (positioned elements)
│   └── tracks.json         # 3 placeholder tracks
├── assets/                 # Artwork images and WebP variants
├── vendor/
│   ├── page-flip/          # StPageFlip 2.0.7 (MIT)
│   └── fonts/              # Self-hosted woff2 fonts (OFL)
├── sketchbook/
│   └── index.html          # Flip-book sketchbook
├── listening-room/
│   └── index.html          # Listening room with turntable
├── styleguide/
│   └── index.html          # Design token reference (noindex)
├── docs/                   # Design brief, phases, content todo, launch checklist
└── .github/workflows/      # GitHub Pages deploy
```

## Pages

- **Home** (`/`): intro, short line, photos, then About and Beyond sections on the same page
- **Sketchbook** (`/sketchbook/`): flip-book with 6 spreads, 8 artworks, lightbox, hash links, layout mode
- **Listening room** (`/listening-room/`): turntable, track list, Spotify embeds

## Development

No build step. Serve the root directory with any static server:

```
npx serve .
```

Or use Python:

```
python -m http.server 8000
```

## Deployment

Deployed via GitHub Pages. The `redesign` branch publishes to `/redesign/` on the Pages site. Merge to `main` only in Phase 8.

## Design

- Warm paper base (`#F4F1EA`), ink text (`#1B1A19`), flat colour blocks
- Accents: maroon, vermilion, butter (cobalt is reserved, not used)
- Self-hosted fonts: Syne, DM Sans, IBM Plex Mono, Caveat
- WCAG AA contrast for every text/background pair
- Respects `prefers-reduced-motion`

## Content

All personal content is marked with `[PLACEHOLDER: ...]`. See `docs/content-todo.md` for the full list and `docs/content-intake.md` for a fill-in template.

## License

Personal project. Fonts and libraries retain their own licences (OFL for fonts, MIT for StPageFlip).
