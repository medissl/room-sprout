# RoomSprout design direction

An English-language room styling app for young adults making small, attainable changes to bedrooms, rentals, and first apartments. The first milestone is a polished interactive Expo prototype, not a live AI service.

## Direction

Use an immersive room canvas and a tactile interior material board. Full-width room photography, functional numbered product touchpoints, and overlapping linen/wood samples provide the identity. Keep copy and controls secondary to the room.

- Cream `#F7F5ED`: main canvas. Paper `#FFFDF7`: quiet surfaces.
- Forest `#294938`: headings, primary actions. Sage `#DDE5D5`: selection.
- Brown `#785B45`: supporting warmth. Ink `#2F382E`: readable body labels.
- Cormorant Garamond medium for editorial titles and the wordmark, with DM Sans for controls and prices. The serif is justified by the interior-journal art direction and the reviewed Zara Home reference, rather than used as generic decoration.
- 24-point mobile gutters, 4/8-point spacing rhythm, 14–18-point media corners, 44-point minimum main controls.
- Room photography leads. Product details use consistent concept photography, explicitly distinct from store listings.
- The landing page leads with editorial typography and a wide room photograph. The app home is a room canvas; Finds is an interactive still-life collection, with conventional results only when searching/filtering.
- Low motion: press feedback and native navigation. No decorative particles, infinite animation, or parallax.
- English copy, Indonesian rupiah estimates, Shopee and Tokopedia search destinations.
- The user's cream/pastel art direction is intentionally light.

## Reference research

- [Cosmos](https://www.cosmos.so/): image-led discovery and personal collections.
- [Are.na](https://www.are.na/): clear capture/collect language and a content-first product.
- [The Socialite Family](https://www.thesocialitefamily.com/fr-fr): home materials and the relationship between room inspiration and individual objects.

These references informed product and visual direction; no proprietary UI or assets were copied. Room and product imagery was generated specifically for this prototype.

### Rendered reference review

- [Zara Home](https://www.zarahome.com/id/): inspected the actual image-dominant editorial composition and quiet navigation.
- [Cosmos Explore](https://www.cosmos.so/explore): inspected collection covers, visual rhythm, and the relationship between collections and individual elements.
- [Pinterest on Page Flows](https://pageflows.com/post/ios/searching/pinterest/): inspected the accessible recorded mobile search/discovery screens. The recording is dated February 2022; it informed hierarchy rather than current platform conventions.
- [Mobbin](https://mobbin.com/): inspected the public reference-library entry point. No gated app screens were accessed.

Two generated screen concepts in `docs/concepts/` established the visual direction before its Expo implementation. The live app uses real components and separate project-bound photographs, not a flattened screen mockup.

## Honest states

Never imply a sample concept was generated from a user's photo. Never label estimates as live prices, marketplace searches as exact product matches, or unreleased app builds as available downloads. No invented reviews, usage counts, or endorsements.

## Review requirements

Inspect the running app and website. Test 320px, 390px, 768px, 1024px, and 1440px widths. Verify images, small-screen navigation, photo selection, budget errors, saved states, empty searches, and external link destinations. Actual phone camera permissions, native interaction, and signed EAS builds require device validation in the next milestone.

## Explicit user refinements

No eyebrow labels, generic interface icons, em dashes, explanatory blocks, or repetitive card layouts. Use the original brand mark only. Keep copy short and functional. Put detailed prototype limitations in documentation or a collapsed disclosure, while retaining essential sample/price/privacy labels. Room and product photography carry the visual identity. Navigation and save actions use clear text.
