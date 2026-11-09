# Phases

Approved order for the branch (updated when the site structure changed to five static pages, then to a single scrollable page). One phase at a time, stop for approval after each report.

- Phase 0 Audit and approvals — done
- Phase 1 Design foundation: tokens, base styles, styleguide — done
- Phase 2 Content and data (site, artworks, sketchbook, tracks) — approved, plus the six-spread fix
- Phase 3 Sketchbook core at `/sketchbook/`: renderer, vendored StPageFlip and fonts locally, arrow-key fix, phone portrait mode, nav/footer/back-to-Beyond on the page — approved
- Phase 4 Sketchbook finishing: lightbox inspect with Escape, layout mode polish, direct links to spreads — approved
- Phase 5 Home, About and Beyond as a single scrollable page (originally three separate pages, merged), shared nav and footer, old root page retired — approved
- Phase 6 Listening room: turntable, tracks.json playback, colour per track — built, pending approval
- Phase 7 Polish, performance, accessibility, browser tests
- Phase 8 Deploy: only now consider merging redesign into `main`

## Dropped for now (from the handoff)

- The selected-work gallery, work detail pages, the marquee and the interests-as-separate-page idea.
- The gallery can return later as an About block (see docs/content-todo.md).
- Work pages with real URLs (work.html?id=) remain an option if the gallery comes back.

## Notes

- Cobalt is kept as a reserved token in `css/tokens.css` but is not used in the active design. Maroon replaced it everywhere.
- Home, About and Beyond were merged into one scrollable page (`index.html`) with anchor nav. The separate `/about/` and `/beyond/` pages were removed.
