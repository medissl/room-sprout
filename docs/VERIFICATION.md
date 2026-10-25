# Prototype verification

Checked on 25 October 2026.

## Completed UX prototype

- Research: Shneiderman's eight rules from the University of Maryland, supported by NN/g user-control guidance. Findings and decisions are in docs/UX.md.
- Nine focused tests passed, including legacy migration, room identity, draft/photo round trips, invalid storage, affordability and ordered write recovery. Typecheck and ESLint passed.
- Expo Doctor passed 20/20 checks with the added image, video and silent-camera modules.
- Current production web export and iOS/Android JavaScript bundle exports passed. These are not signed installation binaries.
- Live in-app-browser walkthrough at 320 × 668 passed: legacy collection preservation; sample setup; invalid-budget blocking; Close/reopen/reload of an unfinished draft; custom item removal/addition; item Undo; live totals; inline budget lowering and recovery; Done closure; room deletion and Undo; saved custom mixes after reload.
- Selected two real JPEG files, compressed them through the Expo API, removed/restored a preview, and reopened the draft after reload. Both previews persisted and displayed in the room/reference comparison.
- Verified direct reference editing returned to the existing plan without repeating style selection.
- Selected the 5.055-second MP4 fixture and inspected the actual video element: readyState 4, muted true, paused true. The clip-based flow reached the plan. Switching reference views worked; after reload the explicit session-only replacement state appeared while the plan remained saved.
- Verified search reset, intersecting Saved/category filters, empty-state recovery and product context. Marketplace URL encoding is covered by the catalog tests. The embedded browser did not expose a popup from the initial imperative web link, so web destinations now use ordinary accessible anchors; native store opening retains error handling.
- The native permission introspection showed no iOS microphone usage description and an Android RECORD_AUDIO removal entry. The original microphone expansion was rejected by automatic approval review; muted camera-only recording is the completed safer path. No microphone approval is pending.
- The browser regression script was rewritten for the completed flow and passed a syntax check. This turn used the actual CUA browser walkthrough rather than running the separate headless suite. Its wider viewport scenarios remain reproducible, not newly claimed as executed.
- New screenshots prefixed ux- document this iteration. Older visual captures below belong to earlier designs.

Remaining release checks: actual phone recording and permissions, native playback, VoiceOver/TalkBack, signed installation, and the upstream dependency advisories already recorded in README. Styling and product prices remain explicitly illustrative; live AI and catalog matching require backend work.

Final web link inspection confirmed both encoded Shopee/Tokopedia hrefs. Closing product details restored the lamp query. Invalid-product and unknown-page recovery were exercised successfully.

## Latest creative studio revision

- Re-read the global AGENTS.md and DESIGN.md and recorded the user's chosen creative studio direction in project DESIGN.md.
- Inspected actual public Shuffles previews, the loaded Figma Community cover, and accessible Mobbin introduction screens after the user signed in. Access limits are recorded in DESIGN.md.
- TypeScript, Expo ESLint, and all three catalog tests passed after the revision.
- Current web, iOS, and Android exports passed. Native exports are bundles, not signed builds or device tests.
- Live in-app-browser checks passed: mood selection changes the board, empty and matching search, a bookmark round trip and reload, blocked invalid budget, valid sample flow, and saved-room persistence across reload.
- The web review caught missing selected-state announcements. Mood radios now expose aria-checked, the navigation uses selected tabs within a tablist, and disabled/busy controls use supported ARIA props. Checked state was verified in the rendered DOM.
- Current visual evidence: creative-home.png, creative-finds.png, and creative-overview.png. Inspected the 353px-wide phone canvas in the 1280 × 720 browser view. Earlier responsive captures below belong to previous layouts.
- Removed unused serif-font, gradient, and material-circle dependencies/components. No AI service, database, publication, or marketplace catalog was added.

## Earlier prototype checks

- TypeScript, Expo ESLint, and three focused catalog tests passed.
- Expo Doctor passed all 20 compatibility/configuration checks.
- Production web export passed.
- Android and iOS Hermes bundle exports passed. These are JavaScript bundles, not signed store binaries or proof of device behavior.
- Headless Chrome checked the actual production website and app: library file selection/removal, sample flow, invalid and valid budgets, saving a concept across reload, decor bookmarks, search empty states, and the Shopee search destination. No page exceptions occurred.
- Screenshots captured at 390px for the core app flow and 320px, 768px, 1024px, and 1440px for responsive checks. Website sections were also captured at desktop and mobile sizes.
- Rendered review corrected image sizing, removed the duplicate mobile preview header, replaced generic icons with text controls, removed eyebrow labels, cut explanatory blocks, and changed Finds to a staggered photographic catalog.
- Original product imagery is labeled as conceptual. No photos are sent to a server. No real AI inference or live catalog integration is claimed.

Still needed before release: real phone camera/permission tests, VoiceOver/TalkBack testing, EAS signing and install checks, reassessment of the five upstream Expo toolchain audit findings documented in README, and approval to publish.

Graphify was queried; the new repository was not indexed. GitHub confirmed the empty `medissl/room-sprout` repository. Vercel projects were inspected; this prototype has not been deployed.

## Reference-led revision

Reviewed rendered Zara Home, Cosmos Explore, and the accessible Pinterest recording on Page Flows. Generated two dedicated mobile concepts, then implemented the room canvas, numbered product touchpoints, tactile material samples, editorial typography, and an interactive still-life shopping board. Final live review used the in-app browser with a proportioned phone canvas. Product routing, bookmark saving, search, filter switching, invalid budget handling, and saving a room across reload were exercised again in that browser. Earlier complete-flow and responsive screenshots document the preceding layout; `room-canvas-live.png` and `finds-board-live.png` are the current visual evidence.
