# Google Play — release assets & checklist

Everything you need to submit **Maică-ta Clicker** to the Google Play Console.

## Files here

| File | What it is | Dimensions | Play requirement |
|---|---|---|---|
| `icon-512.png` | App icon | 512×512 | Required (512×512, 32-bit PNG, ≤1 MB, full-bleed) |
| `feature-graphic.png` | Store feature graphic | 1024×500 | Required (1024×500 PNG/JPG) |
| `screenshot-1-main.png` | Screenshot — main click screen | 1080×1920 | Screenshots (min 2, this set has 3) |
| `screenshot-2-buildings.png` | Screenshot — buildings/upgrades | 1080×1920 | ✓ |
| `screenshot-3-achievements.png` | Screenshot — achievements | 1080×1920 | ✓ |
| `listing.md` | Title + short/full description | — | Copy-paste text |
| `privacy-policy.md` | Privacy policy text | — | Needs to be hosted at a URL |
| `content-rating.md` | IARC questionnaire answers | — | Guide for the rating form |
| `generate.html` | Asset generator (source of truth) | — | Regenerate the PNGs if you tweak |

## The images are generated, not hand-drawn

All five PNGs are drawn programmatically from `generate.html` (Canvas2D), so they
match the game's palette (dark green `#0c1410`, lime `#a3e635`, gold `#f5c542`).

**Before submitting, open the PNGs and eyeball them.** The one thing worth
checking is the **emoji** (🧓 👵 🎰 etc.) — they render from your browser's
emoji font, so on a Windows machine they come out as color emoji, but confirm
they didn't fall back to monochrome/tofu in your environment.

To tweak colors, text, or layout:

1. Edit the `draw*` functions in `store/generate.html`.
2. Serve it and open it in a browser (it runs anywhere, no build step):
   ```bash
   npm.cmd run dev            # then open http://localhost:5173/store/generate.html
   ```
3. In the browser console, run `MTC.icon()`, `MTC.feature()`, etc. to download
   each PNG.

## Replace screenshots with real captures (optional, recommended)

The three screenshots are styled mockups of the real UI. For maximum
authenticity, you can instead capture the actual game:

1. Run the app (`npm run dev`), open it in Chrome DevTools device mode.
2. Set a 360×800 viewport (or use the Android emulator at 1080×1920).
3. Screenshot the main screen, buildings panel, and achievements tab.

## Play Console checklist

1. **App name:** `Maică-ta Clicker`
2. **Default language:** English (US) — the listing copy is in `listing.md`.
3. **Category:** Games → Casual (or Simulation).
4. **Content rating:** answer per `content-rating.md` — expect "Everyone".
5. **Privacy policy:** host `privacy-policy.md` at a public URL (GitHub Pages,
   a Gist, or any static host) and paste that URL into Play Console. Fill in
   the `[DATE]` and `[YOUR EMAIL]` placeholders first.
6. **Data safety form:** declare **"No data collected"** — the game is fully
   offline and stores only local progress (no accounts, ads, or analytics).
7. **Target audience:** all ages; no ads; no purchases (unless you later add
   in-app purchases, which would change the data-safety + pricing answers).
8. **APK:** the `android` Gradle project (see `../android/`) produces the AAB/APK.
   For the Play Store you'll submit a **signed AAB**, not the debug APK from CI.

## Release-signing (for the Play build)

The CI workflow (`../.github/workflows/build.yml`) builds a *debug* APK for
sideloading. For Play you need a **signed AAB**:

1. Generate a keystore: `keytool -genkey -v -keystore release.keystore ...`
2. Add a `signingConfig` in `android/app/build.gradle` and switch the build to
   `assembleRelease` → produces `app-release.aab`.
3. Upload that AAB in Play Console (or enable Play App Signing).
