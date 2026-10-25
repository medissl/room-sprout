# RoomSprout design

## Guides and brief

Read both global guides at `~/.codex/AGENTS.md` and `~/.codex/DESIGN.md`, plus the repository AGENTS.md. The global design guide's mobile reference sources are Mobbin, Page Flows, and Figma Community.

The user explicitly selected **Creative studio: tactile collages, bold clean type, unusual layouts**. The earlier retail/editorial direction with oversized serif type and full-screen room photography was rejected. Do not restore it as the default art direction.

## Current direction

A small creative studio for styling a first bedroom or rental. The room is a working mood board: a tilted photographic snapshot, material swatches, and a separate photographic object cutout. These are native interactive elements, never a flattened mockup.

- Cream `#F5F1E7`, paper `#FFFCF5`, forest `#263E2E`, pastel sage `#CCD6B5`, warm brown `#785B45`.
- DM Sans bold with tight tracking for short headings and the wordmark; regular and medium for controls and prices. No decorative serif.
- Home: compact brand header, “Make room / for you”, a proportional layered room board, one primary action, and a horizontal mood selector. Selecting a mood changes the board in place.
- Finds: staggered object compositions, an arched sage lamp surface, shaped textile photographs, and an isolated ceramic/olive cutout. Prices, saves, search, and categories remain functional.
- Navigation: a compact forest dock with a cream selected surface and text labels. Main controls have at least 44-point touch targets.
- Keep the interface quiet enough to use: no filler badges, explanatory paragraphs, decorative interface icons, eyebrow text, em dashes, fake social proof, or repetitive feature-card sections.
- Preserve visible sample/estimated-price labels. No claims of live AI analysis, exact marketplace matches, or released download builds.

## References actually inspected

The global guide lists reference libraries, not a ready-made visual theme. This pass used them as follows:

1. [Shuffles general browsing on Page Flows](https://pageflows.com/post/ios/general-browsing/shuffles/). Inspected the accessible Home, Profile, and Editor previews: image-led collections and a canvas built from separate elements. Recording dated October 2022; used as composition evidence, not current platform guidance.
2. [Phantom mobile introduction on Mobbin](https://mobbin.com/screens/542d8942-272f-4f0b-9158-a065e4acae93). Inspected the actual accessible introduction screen after the user signed in: a concentrated cluster of layered objects, short bold copy, and an obvious action hierarchy. Adapted the compositional principle; its finance content, purple palette, icons, and account flow do not belong in RoomSprout.
3. [Fixtured mobile introduction on Mobbin](https://mobbin.com/screens/afe89433-34fb-4e6d-a751-68b076bd1932). Inspected the accessible sports app introduction: offset tangible panels with controlled rotation and strong type. This is a graphic composition reference, not an interior-design workflow reference.
4. [Decorify in Figma Community](https://www.figma.com/community/file/1388729321633474968/decorify-ai-interior-design-app-ui-kit). The page loaded after an initial timeout. Inspected its public cover preview and product information. Rejected the busy icon/card/upsell pattern for this brief. No paid kit, editable file, or third-party assets were purchased or copied.
5. [Cosmos on Mobbin](https://mobbin.com/apps/cosmos-ios-8bfdb726-e2c2-4305-8185-7e915a61d351/d6636d6d-7212-4fbd-983f-c2e5f8e1a9d7/screens). Verified the signed-in page and accessible splash preview. Full older-app access is Pro-only for this account. The splash is not evidence of its collection workflows.

Earlier Zara Home and Cosmos website research informed the rejected editorial iteration. It is not the primary reference set for the current mobile design.

## Assets and review

[Asset paths and generation prompts](docs/ASSETS.md) record the two original transparent cutouts. Preserve their alpha. UI, labels, swatches, controls, and shadows are live components. No reference-site assets were copied.

Inspect the actual running app, including mood changes, sample capture, budget errors, saved rooms, search, empty results, and product routes. Screenshots prefixed `creative-` show the current iteration; earlier screenshots document preceding layouts. [Verification](docs/VERIFICATION.md) distinguishes browser checks, native bundle checks, and outstanding device work.

## Interaction contract

The approved visual direction stays in place. See [the UX audit](docs/UX.md) for the eight-rule framework and completed journeys. Keep three studio destinations. Setup is one resumable workspace; settings are edited within a plan. Reference editing returns directly to that plan, and product details close to their original context. Close preserves drafts; Done finishes the task. Removals offer Undo. Do not restore chains of generic Back screens or duplicate destination shortcuts.

Room identities are independent of style and budget. Local drafts, photo previews, item selections and favorites must survive reload. Clips explicitly remain session-only. Never present a sample style reference as AI analysis of a room.
