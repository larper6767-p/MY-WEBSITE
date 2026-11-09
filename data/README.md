# Data files

- `site.json`: identity, strings, nav and social links used across pages
- `artworks.json`: the eight works. `accent` holds a palette token name from `css/tokens.css`. `year` is the numeric year shown; `meta` is the display string. `size` is null until real dimensions are supplied; the renderer hides the spec row while it is null
- `sketchbook.json`: covers plus eight spreads, one artwork per spread, in the same order as `artworks.json`
- `tracks.json`: empty until tracks are supplied

## Page elements

- `x`, `y`, `width`, `height` are percentages of the page box
- Every element carries `id`, `type`, `x`, `y`, `width`, `height`, `rotation`, `z`, `opacity`, `visible`. `mobile` holds overrides applied in phone mode
- Left and right pages are independent compositions. No element spans both pages, and an artwork image appears on one page per spread
- Element types:
  - `image`: references `artworkId` and `imageId`; `src`, size and alt come from `artworks.json`, nothing is copied here
  - `text`, `caption`: styled text; `text` is a literal string, `textSource` pulls live data
  - `stamp`: flat colour block with text; `tone` is the block colour, the text stays ink
  - `spec-list`: the renderer prints medium, size and year rows and skips null rows
- `textSource` tokens: `artwork/title`, `artwork/note`, `artwork/meta`, `artwork/index` (zero-padded position of the artwork), `site/identity/name`, `site/strings/kicker`
- `tone` is a token name from `css/tokens.css`: on text, caption and spec-list it is the text colour (vermilion only at display sizes, butter never as text); on stamp it is the block colour
