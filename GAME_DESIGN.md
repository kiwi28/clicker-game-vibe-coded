# Maică-ta Clicker — Game Design Document

> A single-player 2D browser clicker built around the "maică-ta" inside joke.
> Everything is meant to be light, fast, and fun — a gift/bait for a Discord friend.

---

## 1. One-liner

Click "maică-ta" to earn **Mame**, spend them on increasingly absurd upgrades, and
watch a tiny pixel mom grow into a comedy empire.

## 2. Genre & scope

- **Genre:** Incremental / idle clicker
- **Players:** Single-player (meant to be shared/screenshotted to a friend)
- **Platform:** Browser, single `index.html` + optional `style.css` + `game.js`
- **Session:** Playable in a few minutes, keeps you coming back via idle income
- **Tone:** Romanian Discord banter — playful roasting, never mean

## Language rules

- **UI text is English** — every button, label, tab, description, tooltip,
  achievement name, and in-game message is written in English.
- **Exempt from English:** the currency name **`Mame`** and the **roast lines**
  (the floating "maică-ta" speech bubbles) stay in Romanian — they are the joke.
- The document `lang` attribute is `en`.

## 3. Core loop (the 10-second summary)

```
CLICK "maică-ta" ──▶ earn Mame ──▶ buy Upgrades ──▶ more Mame per second ──▶
                                            │
                                            └──▶ unlock achievements & bigger jokes
```

The loop:
1. **Click** the mom avatar → +1 Mame (plus a random roast speech bubble)
2. **Spend** Mame on upgrades → passive Mame/sec
3. **Scale** — upgrades multiply each other, numbers get silly
4. **Chase** achievements and the occasional rare event (Golden Maică-ta)

## 4. Currency: "Mame"

- **Name:** `Mame` (singular `Mamă`, but displayed as `Mame` everywhere for simplicity)
- **Symbol:** a tiny mom emoji or `M`
- **Display rules:**
  - `< 1,000` → show raw number (`847 Mame`)
  - `>= 1,000` → abbreviate: `1.2K`, `3.4M`, `1.1B`, `2.9T` (K/M/B/T)
- **Two income sources:**
  1. **Click income** — `+1` base per click, multiplied by click upgrades
  2. **Passive income** — `Mame/sec` from owned upgrades, ticks every 0.1s
- **No "prestige" in v1** — keep the numbers bounded so a friend can "finish" it.

## 5. Clicking & feel

- Clickable target: pixel-art **mom avatar** at the center of the screen.
- Each click:
  - floats a **roast bubble** upward from the click point (random from a pool)
  - shows a `+N Mame` popup
  - plays a tiny "bonk" or wobble animation on the avatar
- **Roast bubble pool** (rotate through these):
  - *"maică-ta"*
  - *"da' ce zici mă"*
  - *"auzi la el"*
  - *"câte kg?"*
  - *"stai să sun pe maică-ta"*
  - *"i-a sunat telefonul"*
  - *"se aude de la parter"*
- **Weight gag:** a persistent "kg" counter on the mom. Each click she gains
  weight, and her avatar grows and changes per fatness stage — see
  [Fatness stages](#fatness-stages).

## Fatness stages

`kg` drives a 10-stage fatness progression (stages 0–9). Each stage changes the
mom's emoji, makes it bigger, and grants a compounding click bonus.

| Stage | kg needed | Title | Emoji |
|------:|----------:|-------|-------|
| 0 | 0 | Regular mom | 🧓 |
| 1 | 10 | Well-fed | 👵 |
| 2 | 50 | Chunky | 🐷 |
| 3 | 150 | Hefty | 🐮 |
| 4 | 400 | Absolute unit | 🦛 |
| 5 | 1,000 | Local legend | 🐘 |
| 6 | 2,500 | Two seats on the bus | 🦣 |
| 7 | 6,000 | The lift beeps | 🐋 |
| 8 | 15,000 | Gravitational pull | 🌍 |
| 9 | 40,000 | Own orbit | 🪐 |

**Formulas**

- **Stage** = the highest stage whose `kg needed` ≤ current `kg`.
- **Emoji scale** (linear within a stage): `scaleFactor(kg) = 1 + progress`,
  where `progress` = `(kg − stage.minKg) / (nextStage.minKg − stage.minKg)`,
  clamped to `[0, 1]`. Each stage starts at 1× and reaches 2× at the next
  stage, then resets to 1×.
- **Click bonus** (compounded): `bonusMultiplier(stage) = 1.15^stage`
  (stage 0 = 1.00× … stage 9 ≈ 3.52×). Applied to click income:
  `clickGain = baseClickPower × bonusMultiplier(stage)`.

**Decisions**

- `kg` grows **+1 per click** for now; buildings adding `kg/sec` is a future
  decision (not in v1).
- The bonus applies to **click income only** for now; extending it to passive
  income is a future decision.
- Stage `kg needed`, title, and emoji are config data in `src/fatness.ts`;
  scale and bonus are formulas of the stage index.

## 6. Advancements / Upgrades

Upgrades are the heart of a clicker. Each one is a joke. Split into two types:

### 6.1 Click upgrades (improve per-click value)
| # | Name | Effect | Cost (base) |
|---|------|--------|-------------|
| 1 | Slap | +1 per click | 15 Mame |
| 2 | Palmă dublă | +2 per click | 100 Mame |
| 3 | Papuc | +8 per click | 1,100 Mame |
| 4 | Roast Legend | +25 per click | 12,000 Mame |
| 5 | Apel video cu maică-ta | +100 per click | 130,000 Mame |

### 6.2 Passive upgrades (Mame/sec generators)
| # | Building | Joke | Mame/sec |
|---|----------|------|----------|
| 1 | Maică-ta la sală | she's working out | +1 |
| 2 | Maică-ta la bingo | full house | +4 |
| 3 | Maică-ta la piață | haggling master | +12 |
| 4 | Maică-ta la TV | reality show | +40 |
| 5 | Maică-ta în lift | the lift goes down | +150 |
| 6 | Maică-ta pe OLX | re-sold at a profit | +600 |
| 7 | Maică-ta cu antena | full broadcast | +3,000 |
| 8 | Maică-ta în autobuz | takes two seats | +12,000 |

- Each building has a **cost that scales** (`cost × 1.15` per purchase) and a
  **"owned" count** shown next to it.
- Buying the first of a building "unlocks" it visually on screen.

## 7. Achievements (milestones)

Fun pop-up badges, each grants a tiny bonus (e.g. +5% global) or is purely
cosmetic. Suggestions:

- **First Click** — first click
- **100 Mame** — first 100 Mame
- **First Building** — buy your first building
- **Over 100 kg** — mom hits 100 kg
- **Bingo!** — own 10 Bingo buildings
- **Listed on OLX** — list your mom on OLX
- **Antenna Installed** — give your mom an antenna
- **One Million Mame** — 1M total Mame earned
- **Your Mom on TV** — own 25 TV buildings
- **Legend** — all upgrades purchased

## 8. Rare events (spice)

- **Golden Maică-ta** — once every ~2–5 minutes, a golden mom appears for ~10s.
  Clicking her gives `50 × (current click power)`. Adds urgency and delight.

## 9. Progression path (the "story" of numbers)

- **Early (0–5 min):** clicking feels rewarding; buy first few buildings.
- **Mid (5–20 min):** passive income takes over; buy expensive click upgrades;
  first achievements pop.
- **Late (20–60 min):** big multipliers (OLX / antena), chase Golden Maică-ta,
  hit 1M Mame, unlock "Legend".

## 10. Save data

- Auto-save to `localStorage` every 5s and on `visibilitychange`.
- Store: `mame`, `clickPower`, `buildings` (owned counts), `achievements`,
  `totalEarned`, `kg`, `lastSeen` timestamp.
- On load, grant **offline income** = `(Mame/sec) × time away × 0.5` (capped at
  8h), shown as a "maică-ta a muncit cât ai lipsit" message.

## 11. UI / layout

```
┌──────────────────────────────────────────────┐
│  Mame: 12.4K   (+340/sec)          [kg: 87] │  ← top HUD
├──────────────────────────────────────────────┤
│                                              │
│           ( clickable MOM avatar )           │  ← main click area
│            [ roast bubbles float ]           │
│                                              │
├───────────────────────────┬──────────────────┤
│  UPGRADES  (click)         │  ACHIEVEMENTS   │  ← right sidebar / tabs
│  BUILDINGS (passive)       │  (badges)       │
└───────────────────────────┴──────────────────┘
```

- **Mobile-first** — design for ~360px first, scale up. Big tap targets (min
  44px, prefer 48px). Single-column on mobile; upgrade panel becomes a right
  sidebar at `min-width: 768px`. Uses `clamp()`/`rem`, `100dvh`,
  `touch-action: manipulation`.
- Dark theme, playful pixel font, emoji for icons to avoid custom art.

## 12. Tech stack

Full details in [`TECH_STACK.md`](./TECH_STACK.md) and
[`TYPESCRIPT_RULES.md`](./TYPESCRIPT_RULES.md). Summary:

- **Language:** TypeScript, `strict: true`, **no `any`** (enforced by ESLint + `tsc`).
- **Build:** Vite (`vanilla-ts` template) — instant HMR, static output.
- **Rendering:** DOM + CSS (no engine). Phaser is overkill for a clicker; Pixi.js
  is optional later if we need canvas particles.
- **Files:**
  - `index.html` — structure
  - `src/main.ts` — entry point
  - `src/game.ts` — game state, loop, upgrades, save
  - `src/types.ts` — shared types (no `any`, no `unknown` leaking)
  - `src/upgrades.ts` — upgrade/building definitions
  - `src/storage.ts` — save/load via type guards
  - `src/format.ts` — typed number formatting (K/M/B/T)
  - `src/ui.ts` — DOM rendering & updates
  - `src/style.css` — layout & theme (mobile-first)
- **Game loop:** `requestAnimationFrame` for rendering + a 100ms tick for income.
- **State:** a single typed `GameState` object; all mutations through typed
  functions (no `any`, no untyped `JSON.parse` — use a schema + type guard).
- **Art:** emoji + CSS (🧓 or a `<div>`-drawn mom) to avoid image assets.
- **Responsive:** mobile-first (see §11).

## 13. Milestones / build order

1. **M1 — Core click:** clickable mom, +1 Mame, floating roast bubble, HUD.
2. **M2 — Passive income:** buildings list, Mame/sec tick, buy logic, cost scaling.
3. **M3 — Click upgrades:** click-power upgrades, `+N` popups.
4. **M4 — Achievements:** badge list + popup, first 5 achievements.
5. **M5 — Save & offline:** localStorage save/load, offline income message.
6. **M6 — Polish:** weight gag, Golden Maică-ta, number formatting, mobile layout.

## 14. Balance notes (v1 targets)

- Aim for **~15–30 min** to "complete" all upgrades.
- Early buildings cheap and fast (buy one every few seconds early on).
- Clicking stays relevant through mid-game via click upgrades.
- Golden Maică-ta gives a noticeable but not game-breaking spike.

---

*Status: design draft — ready to implement.*
