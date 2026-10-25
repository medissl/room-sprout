# RoomSprout UX completion

Research and implementation: 25 October 2026.

## Framework

The requested eight rules match [Ben Shneiderman's Eight Golden Rules](https://www.cs.umd.edu/~ben/goldenrules.html), using the current version published by the University of Maryland. They are design heuristics to validate in context, not a certification. [NN/g's guidance on user control](https://www.nngroup.com/articles/user-control-and-freedom/) also supports clear exits, expected Back behavior, and undo.

| Principle              | Applied in this prototype                                                             |
| ---------------------- | ------------------------------------------------------------------------------------- |
| Consistency            | One setup vocabulary, shared controls, three stable studio destinations.              |
| Inclusive use          | Large targets, keyboard-operable controls, selected-state semantics, muted playback.  |
| Feedback               | Actual save status, media counts, selection changes, live totals and notices.         |
| Completion             | Preview leads to one plan workspace; Done waits for storage and returns to My rooms.  |
| Error prevention       | Input validation, budget-aware additions, bounded media, safe storage migration.      |
| Reversibility          | Undo for room, photo, piece and bookmark removal; editing preserves other choices.    |
| User agency            | Close keeps work, references can change directly, product dismissal restores context. |
| Reduced memory demands | Names, budgets, photo previews and selected pieces remain with each room.             |

## Audit findings and resulting changes

- Removed the duplicate home shortcut to My rooms and the navigation shortcut hidden in palette swatches.
- Replaced Capture → Preferences → Result → Preferences loops with one two-part setup workspace and settings inside the plan.
- Replaced generic Back headers with a single workspace Close. Native/browser Back remains available. A product opens as one dismissible detail view.
- Replaced style/budget-derived room IDs with independent room identities. Two rooms can use the same style and budget.
- Preserved earlier saved rooms and favorites through a validated migration using the existing storage key.
- Added automatic local drafts, recognizable room names, compressed reference previews, explicit saving/error states, retry, and serialized writes.
- Added photo preview selection/removal, reversible removal, silent native clip recording, local clip selection, muted preview, and a sample path.
- Kept capture input and styling settings together. Reference edits from an existing plan return directly to it without repeating style selection.
- Added editable room settings and an item mix with a visible estimated total. Additions that exceed the remaining budget are unavailable. Lowering a budget never silently removes chosen pieces; the user can remove pieces or request an affordable mix and undo it.
- Made catalog search available immediately. Saved, category and query filters combine predictably. Empty states provide a reset instead of a dead end.
- Preserved catalog query/scroll context beneath product details, with explicit Shopee/Tokopedia search actions and store-opening recovery.
- Added appropriate missing-room, missing-product, empty-collection and missing-clip states.

## Core journeys

1. Discover → Style my room → Photos / Clip / Sample → style, name and budget → editable plan → Done → My rooms.
2. Close setup → reopen the draft in My rooms or Continue my room → resume with previous values.
3. Open a saved plan → edit its settings, references or pieces in context → Done.
4. Finds → search/filter/save → product detail → external marketplace search or Close → same catalog context.
5. Remove a room/photo/piece/bookmark → Undo restores it.

## Prototype boundary

All styling is explicitly sample styling. No inference, paid service, live product matching, account system or cloud database was added. Photos are compressed into bounded JPEG previews stored on this device; camera originals are not uploaded. Clips stay in their current session, with an explicit replacement path after reload. Plans, selected pieces and other room settings persist independently.

Microphone access remains disabled. An attempted permission expansion was rejected by automatic approval review; the completed alternative uses a muted CameraView, Android audio recording disabled, and an explicit audio permission block. Native configuration inspection confirmed no iOS microphone usage entry and an Android removal entry for RECORD_AUDIO.

## Validation

See [verification](VERIFICATION.md) for exact checks and their limits. Browser walkthroughs are heuristic verification, not a usability study with independent participants. Physical camera/permission behavior, VoiceOver/TalkBack and signed-device installation remain release checks.
