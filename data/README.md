# Data files

- `site.json`: identity, strings, nav and social links used across pages. `nav` feeds no renderer directly: nav and footer are repeated in each HTML file (see the snippet below) and `nav` records the same numbers and targets for reference
- `artworks.json`: the eight works. `accent` holds a palette token name from `css/tokens.css`. `year` is the numeric year shown; `meta` is the display string. `size` is null until real dimensions are supplied; the renderer hides the spec row while it is null
- `sketchbook.json`: covers plus six spreads, in the same work order as `artworks.json`. A spread holds one artwork (`artworkId`) or a group (`artworkIds`, spread 5 groups three paper sketches). Every work keeps its own plate number in the index either way
- `tracks.json`: three placeholder tracks (all fields bracketed). Fields: id, title, artist, album, art (null until supplied), spotifyId (placeholder until supplied), note, mood, color (a token name: maroon, vermilion or butter), order. Selecting a track updates the room colour and loads its Spotify embed (lazy, only after selection).

## Shared nav and footer

Every HTML page repeats this markup so pages work without JavaScript. Links are relative, never leading with "/", because the preview serves the site under a subpath.

```html
<nav class="site-nav" aria-label="Main">
  <p class="site-nav-word">carpediemsnutz</p>
  <ul class="site-nav-list">
    <li><a href="#home">01 Home</a></li>
    <li><a href="#about">02 About</a></li>
    <li><a href="#beyond">03 Beyond</a></li>
  </ul>
</nav>
```

The three sections live on one page, so the links are anchors. On sub-pages (sketchbook, listening room) the same nav points at `../`, `../#about` and `../#beyond`, and marks `03 Beyond` as current.

```html
<footer class="footer">
  <p class="footer-line">[PLACEHOLDER: copyright line]</p>
  <div class="footer-social" id="social" aria-label="Social media"></div>
</footer>
```

The social links are filled by the page's small script from `site.json`.

## Page-shaped keys in site.json

All still `[PLACEHOLDER: ...]` where personal. `href` values are written as the final public paths, without a leading slash; each page resolves them for its own depth.

```json
"nav": [ { "label": "Home", "number": "01", "href": "index.html" }, ... ]
"home": {
  "heading": "[PLACEHOLDER: Hello, I'm name.]",
  "line": "[PLACEHOLDER: one sentence about what I do and enjoy]",
  "photos": [ { "src": null, "alt": "[PLACEHOLDER: ...]", "width": 480, "height": 600 } ]
}
"about": {
  "heading": "About",
  "intro": "[PLACEHOLDER: one short intro paragraph]",
  "blocks": [
    { "type": "text",   "heading": "...", "paragraphs": ["..."] },
    { "type": "photo",  "src": null, "alt": "...", "caption": "...", "width": 900, "height": 600 },
    { "type": "list",   "heading": "...", "rows": [ { "year": "...", "label": "..." } ] },
    { "type": "tags",   "heading": "...", "items": ["..."] }
  ]
}
"beyond": {
  "heading": "Beyond the portfolio.",
  "subline": "Two little corners of my world.",
  "sketchbook": { "title": "The sketchbook", "blurb": "[PLACEHOLDER: short description]" },
  "listening": { "title": "The listening room", "blurb": "[PLACEHOLDER: short description]" }
}
```

Adding an About block later is a data change only: the About page renders `type` generically.

## Simple sketchbook links

The book writes the open position into the URL hash on every settled turn, so ordinary browser Back and Forward work and spreads can be shared:

- `#cover` — front cover
- `#spread-1` … `#spread-6` — a spread (spread numbers match the counter)
- `#back` — back cover

An unknown hash is ignored and the book opens at the cover.

## Layout editor (dev only)

Append `?layout` to the sketchbook URL to draw outlines on every element and enable drag-to-move and corner-resize handles. A "Copy spread JSON" button dumps the open spread (or cover) as JSON you can paste back into `data/sketchbook.json`. The editor is not part of the public site.

## Asset paths

Image paths inside the JSON files are site-root relative (`assets/78.png`). The sketchbook renderer sits one folder down, so it prefixes `../` when building tags (this is what makes everything work under the `/redesign/` subpath).

## Page elements

- `x`, `y`, `width`, `height` are percentages of the page box
- Every element carries `id`, `type`, `x`, `y`, `width`, `height`, `rotation`, `z`, `opacity`, `visible`. `mobile` holds overrides applied in phone mode
- Left and right pages are independent compositions. No element spans both pages, and an artwork image appears on one page per spread
- Element types:
  - `image`: references `artworkId` and `imageId`; `src`, size and alt come from `artworks.json`, nothing is copied here. `fit: contain` keeps the whole artwork inside the box with paper margins around it; `fit: cover` fills the box edge to edge and is used only where the artwork's shape matches the page (spread 3)
  - `text`, `caption`: styled text; `text` is a literal string, `textSource` pulls live data. Fonts are `display`, `body`, `mono`, `hand`
  - `stamp`: small flat colour block with text; `tone` is the block colour, the text stays ink
  - `block`: a flat colour rectangle with no text; `tone` is the fill colour
  - `spec-list`: the renderer prints medium, size and year rows and skips null rows
- Any element may carry `artworkId` when its `textSource` refers to artwork data; a grouped spread resolves it per element
- `textSource` tokens: `artwork/title`, `artwork/note`, `artwork/meta`, `artwork/index` (zero-padded position of the artwork), `site/identity/name`, `site/strings/kicker`
- `tone` is a token variable name from `css/tokens.css`: colour tokens (paper, ink, white, muted, stone, maroon, vermilion, butter) and on-colour tokens (on-vermilion, on-maroon, on-butter). On text and caption it is the text colour; on stamp and block it is the fill colour. Vermilion only at display sizes, butter never as text
