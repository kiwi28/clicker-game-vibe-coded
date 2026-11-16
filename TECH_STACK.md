# Tech Stack

Decisions for **Maică-ta Clicker**. Goal: fast iteration, TypeScript-first,
mobile-first, zero runtime surprises.

## Summary

| Concern | Choice |
|---|---|
| Language | TypeScript — `strict: true`, **no `any`** |
| Build tool | Vite (`vanilla-ts` template) |
| Game engine | **None** — DOM + CSS |
| Optional renderer | Pixi.js — *later, only if needed* |
| State management | Single typed object (no store library) |
| Linting | ESLint + `typescript-eslint` |
| Formatting | Prettier |
| Tests | Vitest (pure logic only) |
| Deployment | Static hosting (GitHub Pages / Vercel / Netlify) |

## Engine decision: Pixi.js / Phaser / none?

| Option | Verdict | Why |
|---|---|---|
| **Phaser** | ❌ Not recommended | Full scene/physics framework. A clicker is ~95% UI; the scene graph is overhead with little payoff, and canvas UI is harder to make responsive/accessible. |
| **Pixi.js** | ⚠️ Optional later | Excellent renderer for particles/sprites (floating bubbles, golden-mom glow, click bursts). But HUD/upgrades stay in DOM anyway, and v1 effects are doable with CSS. |
| **DOM + CSS** | ✅ Chosen | Clickers are DOM-native. Responsive + mobile-first + accessibility for free. Instant iteration, tiny bundle. |

**Decision:** build v1 with DOM + CSS. Add Pixi.js only if we later need canvas
particles or sprite animation that CSS can't do cheaply.

## Mobile-first (non-negotiable)

- Design for **~360px width** first, then scale up.
- Minimum tap target **44×44px** (prefer 48px).
- Spacing/typography via `clamp()` and `rem`, never fixed px.
- `touch-action: manipulation` and `user-select: none` on the click target to
  prevent double-tap zoom and text selection.
- Use `100dvh` for full-height layout (handles mobile browser chrome).
- Single-column on mobile; at `min-width: 768px` the upgrade panel becomes a
  right sidebar.
- Test in Chrome DevTools device emulation (iPhone SE, Pixel 7, iPad).

## Project structure

```
ai-slop-game/
├─ index.html
├─ package.json
├─ tsconfig.json
├─ eslint.config.js
├─ vite.config.ts
├─ GAME_DESIGN.md
├─ TECH_STACK.md
├─ TYPESCRIPT_RULES.md
└─ src/
   ├─ main.ts        # entry — wires UI + loop
   ├─ game.ts        # state, tick, buy logic
   ├─ types.ts       # all shared types (no any)
   ├─ upgrades.ts    # upgrade/building definitions
   ├─ storage.ts     # save/load with type guards
   ├─ format.ts      # typed number formatting (K/M/B/T)
   ├─ ui.ts          # DOM rendering
   └─ style.css      # mobile-first styles
```

## Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "typecheck": "tsc --noEmit",
    "lint": "eslint .",
    "test": "vitest run"
  }
}
```

Note: `build` runs `tsc --noEmit` **before** bundling — a type gate so a build
fails if any type (or `any`) sneaks in.

## Build & deploy

1. `npm run build` → type-checks, then emits static files to `dist/`.
2. Deploy `dist/` to any static host. No server or runtime deps.

## Why this stack

- **Vite** gives instant HMR and zero-config TypeScript.
- **TypeScript strict** catches bugs in the math-heavy logic (cost scaling,
  income ticks, save data) before they ship.
- **No engine** keeps the bundle small and the responsive/accessibility story trivial.
- **Static deploy** means you can send a friend a link immediately.
