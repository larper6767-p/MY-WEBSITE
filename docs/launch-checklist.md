# Launch checklist

## Content still needed

Everything in `docs/content-todo.md`. Quick summary:

- Home: intro heading, one-line description, 1-2 small photos
- About: intro paragraph, story text, education rows, interests tags, currently-exploring items, one large photo
- Beyond: one-line descriptions for sketchbook and listening room objects
- Sketchbook: colophon line for the back cover, real photos for the cover placeholder
- Listening room: track titles, artists, albums, Spotify track IDs, album art, notes, moods, colour picks
- Personal: short bio, location, contact email
- Dimensions for all 8 artworks (size field is null, spec row hidden)

## Placeholder audit

Run this command to list every remaining placeholder:

```
grep -rn "\[PLACEHOLDER" --include="*.html" --include="*.json" --include="*.css" --include="*.js" .
```

On Windows (PowerShell):

```
Select-String -Path "index.html","sketchbook/index.html","listening-room/index.html","data/*.json" -Pattern "\[PLACEHOLDER"
```

## Phase 8 merge plan

1. Do not merge until all content is supplied and manually checked.
2. Before merging, update `.github/workflows/pages.yml` so that `main` deploys to the root and the redesign branch is no longer published separately.
3. Merge `redesign` into `main` via a pull request. Do not force-push.
4. After merge, the live site at the root URL will show the new site. The `/redesign/` path will stop being updated.
5. Keep the `redesign` branch for a week after merge in case a rollback is needed. Delete it after.
6. If a custom domain is added: configure it in the GitHub Pages settings, add a `CNAME` file to the repo root with the domain name, and update any absolute URLs in the metadata (og:image, etc.) to use the custom domain.

## Known risks

- **Safari touch and 100vh:** Safari's dynamic toolbar changes the viewport height. The sketchbook uses `aspect-ratio` and `container-type: size` which should adapt, but `100vh` in other places may cause layout shifts. Fallback: use `dvh` units where supported, with `vh` as fallback.
- **StPageFlip on iOS:** The library's touch handling may conflict with Safari's native swipe gestures. Fallback: the no-flip CSS stacks pages as a static gallery (already implemented). Arrow keys and buttons still work.
- **Spotify embeds blocked by privacy settings:** Some browsers or extensions block third-party iframes. Fallback: the "Preview not available yet" state and the track list still work without embeds. The room is about the notes and the turntable, not the embed.
- **Font loading:** Self-hosted woff2 files should load fast, but on slow connections there may be a flash of unstyled text. `font-display: swap` is set. Fallback: system fonts are specified in the font stack.
- **WebP support:** All modern browsers support WebP. Very old browsers (IE11) will not load images. Fallback: the `src` attribute points to the original JPEG/PNG, which loads if srcset is not supported.
- **IntersectionObserver for scroll-spy:** Supported in all modern browsers. Fallback: the nav still works as anchor links without the spy.

- [ ] Home section fits in one viewport without horizontal scroll
- [ ] Nav stays on one row with readable mono text
- [ ] About blocks stack in a sensible reading order
- [ ] Beyond objects are full-width and tappable (44px minimum)
- [ ] Sketchbook opens at the first spread, two pages visible
- [ ] Arrow keys and swipe work in the sketchbook
- [ ] Inspector opens on tap, Escape closes, focus returns
- [ ] Listening room turntable spins, track selection updates colour
- [ ] Spotify embeds load (or show "Preview not available yet")
- [ ] Reduced motion: no spin, no swing, no flips, no smooth scroll
- [ ] All text is readable at 375px
- [ ] No horizontal scroll on any page
- [ ] Footer social links are tappable
- [ ] 404 page shows for unknown URLs
