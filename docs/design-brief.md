# Design brief

Reference material for the redesign, supplied by the owner on 2025-11-09. It replaces `docs/handoff.md` and the four reference images, which never arrived. Where it conflicts with the site-structure message (five static pages), the structure message wins.

## Visual references

1. Artist homepage: warm off-white page, tiny top nav, large intro with the first name in italics, a small portrait overlapping a small artwork on the right, a scrolling text strip at the bottom. Gallery view: artworks of different sizes side by side on white with arrow buttons and a small top-left caption (year, series). Project page: large artwork with a big title below.
2. Art-book spreads: warm white paper, running header top left, small text column and a small photograph top right, footer labels at the bottom, lots of empty paper.
3. Real sketchbook spreads: dense pages of drawings, handwritten notes, swatches, photos and cut-outs; every spread different; mostly small items with whitespace.
4. Designer homepage: off-white page, centred bold name and title, mono numbered project list scattered asymmetrically, small stacked photos at the right edge with underlined links. About page: big heading, short text, large photo bottom left, education block in mono type on the right.

## Tone

Clean, editorial, lots of space, small captions and numbered labels, thin rules, large art. Our own twist: colourful flat blocks, not beige minimalism. Physical-book details belong in the sketchbook and listening room only.

## Sketchbook

Independent left and right pages, a different composition per spread, page numbers, small captions, minimal transitions. Pages are positioned elements (image, text, caption, shape) with percentage coordinates. Keep artwork as DOM, never screenshots. Click artwork to inspect, Escape closes, arrow keys navigate.

## Listening room

Minimal turntable as the main visual; track list and current selection beside it. Never sync the animation to Spotify playback. No autoplay.

## Accessibility and performance

Alt text, keyboard navigation, reduced motion, readable contrast, reserved image dimensions, lazy loading.
