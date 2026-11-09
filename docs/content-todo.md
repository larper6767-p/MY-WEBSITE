# Content to do

Everything below is still needed from you. Nothing here is invented; data files use `[PLACEHOLDER: ...]` until it arrives.

## Personal

- Short bio text (identity.bio in data/site.json)
- Location, where you want it shown (identity.location)
- A contact email, if the new pages should show any (identity.email)
- The colophon line for the sketchbook back cover. Today the code reads a property that does not exist and the page shows the word "undefined" (data/sketchbook.json, back cover placeholder)

## Home page (data/site.json, home)

- The big intro heading, for example "Hello, I'm ..."
- One sentence about what you do and enjoy
- One or two small photos (alt text, real files in assets/)

## About page (data/site.json, about)

- Intro paragraph
- The story text block (heading and paragraphs)
- Education rows: year + school or course, plus a heading for the list
- Interests as short tags, plus a heading
- "Currently exploring" items, plus a heading
- One large photo with a mono caption
- If the selected-work gallery ever comes back, it plugs in here as another About block (gallery was dropped from the plan for now)

## Beyond page (data/site.json, beyond)

- One line for the sketchbook object ("Open" call to action has no extra words needed)
- One line for the listening room object

## Listening room (data/tracks.json)

- Track titles, artists, albums
- Spotify track links (or track IDs) for each song
- Album art images (files in assets/)
- Your notes for each track
- Mood tags for each track
- Colour pick per track (maroon, vermilion or butter)

## Works (8 entries in data/artworks.json)

- Dimensions/physical size for every work. The size field is null in data/artworks.json and the spec row is hidden until you supply it
- Alt text. Each image currently uses the auto-generated "title — medium, year" string; a real one-sentence description per image reads better
- Observation on "WIP": if it stayed unfinished, say whether a title change is wanted. Kept verbatim otherwise

## Listening room

- Real tracks: title, artist, a Spotify track/album URI for the official embed, your personal note per track, a mood tag, and artwork where you want something other than the album art. The specification you approved lives in the Phase 0 plan; data/tracks.json stays empty until then
- Anything about the room itself that should appear as intro text

## Files you are sending

- docs/handoff.md and docs/references/ were not in the repo when I finished this phase. I will read them as soon as they land before any page layout work, and reconcile anything the handoff changes

## Image exports

See docs/export-images.md. Sizes I need exported per artwork are listed there; no new files have to be committed for the data model to work, since it falls back to the original full-size file.

## Social preview

- A single preview image (at least 1200x630 px) for og:image and twitter:card on all pages. Until supplied, the tags are omitted.
