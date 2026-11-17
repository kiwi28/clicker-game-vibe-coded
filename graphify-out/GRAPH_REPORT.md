# Graph Report - ai-slop-game  (2026-11-17)

## Corpus Check
- 29 files · ~22,442 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 20 file(s) not represented in the graph (top: .xml 10, (none) 4, .properties 2)
- WARNING: 20 of 95 files seen (21%) have no supported extractor and are missing from this graph entirely. It may look complete while representing only part of the codebase.

## Summary
- 322 nodes · 600 edges · 19 communities (9 shown, 10 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6a64c144`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- main.ts
- compilerOptions
- package.json
- pattern.ts
- ui.ts
- game.ts
- with
- vite-env.d.ts
- ExampleInstrumentedTest.java
- render
- audio.ts
- MainActivity.java

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 18 edges
2. `setupPlayerControls()` - 16 edges
3. `init()` - 10 edges
4. `render()` - 9 edges
5. `with` - 9 edges
6. `activateMusic()` - 8 edges
7. `renderHud()` - 8 edges
8. `renderMoms()` - 8 edges
9. `BuildingId` - 7 edges
10. `ensureMusic()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `doMomClick()` --calls--> `clickMom()`  [EXTRACTED]
  src/main.ts → src/game.ts
- `frame()` --calls--> `tick()`  [EXTRACTED]
  src/main.ts → src/game.ts
- `DevState` --references--> `BuildingId`  [EXTRACTED]
  src/ui.ts → src/types.ts
- `setupPlayerControls()` --indirect_call--> `nextTrack()`  [INFERRED]
  src/player.ts → src/audio.ts
- `setupPlayerControls()` --indirect_call--> `previousTrack()`  [INFERRED]
  src/player.ts → src/audio.ts

## Import Cycles
- None detected.

## Communities (19 total, 10 thin omitted)

### Community 0 - "main.ts"
Cohesion: 0.10
Nodes (24): checkAchievements(), getAchievement(), isLastStageComplete(), createInitialState(), passivePerSecond(), prestige(), resetState(), checkAndShowAchievements() (+16 more)

### Community 1 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution, noEmit (+11 more)

### Community 2 - "package.json"
Cohesion: 0.07
Nodes (25): config, dependencies, @capacitor/android@^8.6.2, @capacitor/core@^8.6.2, @tabler/icons@^3.52.0, devDependencies, @capacitor/cli@^8.6.2, typescript@~5.6.3 (+17 more)

### Community 3 - "pattern.ts"
Cohesion: 0.43
Nodes (6): applyClickZonePattern(), buildTile(), Cell, CELLS, innerSvg(), renderCell()

### Community 4 - "ui.ts"
Cohesion: 0.06
Nodes (63): formatMAME(), formatNumber(), trimDecimals(), UNITS, buyBuilding(), isDevEnabled(), isLoaderDisabled(), setDevEnabled() (+55 more)

### Community 5 - "game.ts"
Cohesion: 0.14
Nodes (20): AchievementDef, ACHIEVEMENTS, isAchievementId(), CLICK_UPGRADE_ICONS, IconDef, ICONS, isFiniteNumber(), isRecord() (+12 more)

### Community 6 - "with"
Cohesion: 0.09
Nodes (26): name, runs-on, steps, jobs, android, web, name, on (+18 more)

### Community 9 - "render"
Cohesion: 0.12
Nodes (29): BONUS_PER_STAGE, bonusMultiplier(), FATNESS_STAGES, FatnessStage, getStage(), LAST_STAGE, LAST_STAGE_END_KG, scaleFactor() (+21 more)

### Community 10 - "audio.ts"
Cohesion: 0.08
Nodes (44): activateMusic(), clamp01(), clickVolume, currentTrack(), ensureClickBuffer(), ensureClickBytes(), ensureContext(), ensureMusic() (+36 more)

## Knowledge Gaps
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@tabler/icons` connect `package.json` to `audio.ts`, `pattern.ts`, `game.ts`?**
  _High betweenness centrality (0.137) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `setupPlayerControls()` (e.g. with `nextTrack()` and `previousTrack()`) actually correct?**
  _`setupPlayerControls()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Should `main.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10114942528735632 - nodes in this community are weakly interconnected._
- **Why does `setupPlayerControls()` connect `audio.ts` to `main.ts`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07459677419354839 - nodes in this community are weakly interconnected._
- **Should `ui.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05608322026232474 - nodes in this community are weakly interconnected._