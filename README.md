# RoomSprout

Your room. More you.

An English-language Expo / React Native prototype with a green, brown, and cream palette, original room imagery, and a companion landing page prepared for Vercel.

## Run

```sh
npm ci
npm start
```

Open the project in an SDK-compatible Expo Go app or a development build. Use `npm run web` for the web development server. Native camera behavior still requires a real device check.

```sh
npm run build:web
npm run preview
```

- Website: `http://127.0.0.1:4173/`
- Interactive app: `http://127.0.0.1:4173/studio`

## Included

- Discover screen with room inspiration and style directions.
- Guided three-angle photo capture or library selection, with removal and permission/error handling.
- Style selection and bounded whole-rupiah budget input.
- Pre-designed sample makeover, palette, tips, and additions that fit the sample budget.
- Locally saved sample concepts and decor bookmarks.
- Searchable decor ideas and explicit Shopee/Tokopedia search links.
- Responsive landing page with working prototype access and clear app availability.

## Deliberate prototype boundaries

No account, database, AI API, photo upload, room measurement, video scanning, checkout, affiliate attribution, or live product feeds. Selected photos remain in memory on the device for the current app session. Only sample concept metadata and bookmarks are persisted in AsyncStorage. Clearing browser/app storage removes the collection; it does not sync across devices.

Room and product photos are generated concept imagery. Price estimates are illustrative; store links open searches for similar items, not exact verified listings. The landing page does not pretend that signed app downloads exist.

## Does it need a database?

This milestone does not. Local state plus AsyncStorage covers the prototype. A real AI integration requires a server-side endpoint to protect API keys and enforce request limits, but a database is not inherently required for a first stateless analysis request. Add a database and private object storage when introducing accounts, cross-device room history, catalog administration, or paid usage. Establish retention and deletion rules before uploading personal room photos.

## Verification

```sh
npm run check
npx expo-doctor
npm run build:web
npm run preview
npx playwright install chromium
npm run test:browser
```

The browser check uses `http://localhost:8081` by default. For the production preview, set `ROOMSPROUT_URL=http://127.0.0.1:4173`. If using installed Chrome, set `ROOMSPROUT_BROWSER_CHANNEL=chrome`. Screenshots go to `docs/screenshots/`. The test browser uses a separate temporary profile.

`npm test` validates budget boundaries, sample shopping totals, and encoded marketplace destinations. The browser check covers real file selection/removal, the sample flow, validation, local persistence, bookmarks, search states, external destination, and responsive layouts.

## Vercel

Import `medissl/room-sprout`, select framework **Other**, and use the repository root. `vercel.json` sets the build command to `npm run build:web`, exports `dist`, and provides SPA rewrites. No environment variables are needed for this prototype. Confirm the target project and environment before publishing. App-store links should be added only after signed builds are actually available.

## Expo delivery

`eas.json` includes development, internal preview (Android APK), and production profiles. The bundle IDs are proposed identifiers and must be confirmed before the first store submission. EAS account/project linking, signing, and store releases have not been performed.

## Current dependency advisories

The installed Expo 58 toolchain reports five high-severity npm audit findings involving Expo CLI, its signing-certificate dependency, `node-forge`, and `zod`. At implementation time npm proposed a downgrade to Expo 44 rather than a compatible fix. No forced downgrade or incompatible major override was applied. These findings remain open and must be reassessed before publishing or signing production builds; they are not resolved by the successful Expo compatibility checks.

## Next milestone

Review the visual prototype on a real phone, approve the core direction, then connect one secure photo-to-recommendation flow with explicit consent, limits, cost handling, and a trustworthy product source. Keep 3D room scanning and live shopping integrations separate until that flow is validated.
