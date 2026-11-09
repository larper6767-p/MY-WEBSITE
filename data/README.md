# Data files

- `site.json`: identity, strings, nav and social links used across pages
- `artworks.json`: the eight works. `accent` holds a palette token name from `css/tokens.css`. `year` is the numeric year shown; `meta` is the display string. `size` is null until real dimensions are supplied; the renderer hides the spec row while it is null
- `sketchbook.json`: covers plus six spreads, in the same work order as `artworks.json`. A spread holds one artwork (`artworkId`) or a group (`artworkIds`, spread 5 groups three paper sketches). Every work keeps its own plate number in the index either way
- `tracks.json`: empty until tracks are supplied

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
- `tone` is a token variable name from `css/tokens.css`: colour tokens (paper, ink, white, muted, stone, maroon, vermilion, cobalt, butter) and on-colour tokens (on-vermilion, on-cobalt). On text and caption it is the text colour; on stamp and block it is the fill colour. Vermilion only at display sizes, butter never as text
