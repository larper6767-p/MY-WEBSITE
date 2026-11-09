# Content to do

Everything below is still needed from you. Nothing here is invented; data files use `[PLACEHOLDER: ...]` until it arrives.

## Personal

- Short bio text (identity.bio in data/site.json)
- Location, where you want it shown (identity.location)
- A contact email, if the new pages should show any (identity.email)
- The colophon line for the sketchbook back cover. Today the code reads a property that does not exist and the page shows the word "undefined" (data/sketchbook.json, back cover placeholder)

## Works (8 entries in data/artworks.json)

- Dimensions/physical size for every work. The old site left these fields empty, the new data file carries a placeholder per work
- Alt text. Each image currently uses the auto-generated "title — medium, year" string; a real one-sentence description per image reads better
- Observation on "WIP": if it stayed unfinished, say whether a title change is wanted. Kept verbatim otherwise

## Listening room

- Real tracks: title, artist, a Spotify track/album URI for the official embed, your personal note per track, a mood tag, and artwork where you want something other than the album art. The specification you approved lives in the Phase 0 plan; data/tracks.json stays empty until then
- Anything about the room itself that should appear as intro text

## Files you are sending

- docs/handoff.md and docs/references/ were not in the repo when I finished this phase. I will read them as soon as they land before any page layout work, and reconcile anything the handoff changes

## Image exports

See docs/export-images.md. Sizes I need exported per artwork are listed there; no new files have to be committed for the data model to work, since it falls back to the original full-size file.
