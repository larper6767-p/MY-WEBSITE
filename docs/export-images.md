# Image export process

The site ships originals as fallback, WebP files as the normal format. This is a documented process for now, no export script and no new tools are required.

## Export settings

- Format: WebP
- Widths, per image: 480, 900 and 1600 pixels wide (height per aspect, no cropping)
- Encode: Squoosh.app (browser, no install) with default WebP options, quality 80. Photoshop or Krita export also fine if they write real WebP with correct pixel sizes

## Naming

For artwork `wip`, image `plate`:

- `wip-plate-w480.webp`
- `wip-plate-w900.webp`
- `wip-plate-w1600.webp`

Put the files next to the originals in `assets/`. Generate width and height from the exported file, never reuse the original's numbers, and add one object per width to the `images[].variants` array in `data/artworks.json`:

```json
"variants": [
  { "file": "assets/wip-plate-w480.webp", "width": 480, "height": 354 }
]
```

Leave `width`/`height` on the base image as the original's dimensions. Renderers use variants when present and the original otherwise, so the site works before a single WebP is exported.

## Why these widths

480 covers phones and the small content column, 900 covers tablets and half the sketchbook spread scale, 1600 covers the full-width desktop uses. Anything larger than 1600 wide is over budget for a 2 MB original like `ass.jpg` and stays an original-only fallback until you say otherwise.
