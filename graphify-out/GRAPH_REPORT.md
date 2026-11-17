# Graph Report - ai-slop-game  (2026-11-17)

## Corpus Check
- 29 files · ~22,273 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 20 file(s) not represented in the graph (top: .xml 10, (none) 4, .properties 2)
- WARNING: 20 of 95 files seen (21%) have no supported extractor and are missing from this graph entirely. It may look complete while representing only part of the codebase.

## Summary
- 319 nodes · 602 edges · 19 communities (9 shown, 10 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6da03116`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- main.ts
- compilerOptions
- package.json
- fatness.ts
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
- `setupPlayerControls()` --indirect_call--> `nextTrack()`  [INFERRED]
  src/player.ts → src/audio.ts
- `setupPlayerControls()` --indirect_call--> `previousTrack()`  [INFERRED]
  src/player.ts → src/audio.ts
- `setupPlayerControls()` --indirect_call--> `togglePlayPause()`  [INFERRED]
  src/player.ts → src/audio.ts
- `DevState` --references--> `BuildingId`  [EXTRACTED]
  src/ui.ts → src/types.ts
- `openDevModal` --calls--> `passivePerSecond()`  [EXTRACTED]
  src/main.ts → src/game.ts

## Import Cycles
- None detected.

## Communities (19 total, 10 thin omitted)

### Community 0 - "main.ts"
Cohesion: 0.12
Nodes (22): checkAchievements(), getAchievement(), isLastStageComplete(), createInitialState(), prestige(), resetState(), checkAndShowAchievements(), els (+14 more)

### Community 1 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution, noEmit (+11 more)

### Community 2 - "package.json"
Cohesion: 0.06
Nodes (31): config, dependencies, @capacitor/android@^8.6.2, @capacitor/core@^8.6.2, @tabler/icons@^3.52.0, devDependencies, @capacitor/cli@^8.6.2, typescript@~5.6.3 (+23 more)

### Community 3 - "fatness.ts"
Cohesion: 0.28
Nodes (8): BONUS_PER_STAGE, FATNESS_STAGES, FatnessStage, getStage(), LAST_STAGE, LAST_STAGE_END_KG, scaleFactor(), stageEndKg()

### Community 4 - "ui.ts"
Cohesion: 0.07
Nodes (50): isDevEnabled(), isLoaderDisabled(), setDevEnabled(), setLoaderDisabled(), AchievementView, achievementViews, buildAchievementList(), buildDevFields() (+42 more)

### Community 5 - "game.ts"
Cohesion: 0.14
Nodes (20): AchievementDef, ACHIEVEMENTS, isAchievementId(), CLICK_UPGRADE_ICONS, IconDef, ICONS, isFiniteNumber(), isRecord() (+12 more)

### Community 6 - "with"
Cohesion: 0.09
Nodes (26): name, runs-on, steps, jobs, android, web, name, on (+18 more)

### Community 9 - "render"
Cohesion: 0.11
Nodes (35): bonusMultiplier(), formatMAME(), formatNumber(), trimDecimals(), UNITS, buyBuilding(), buyClickUpgrade(), buyMaxBuilding() (+27 more)

### Community 10 - "audio.ts"
Cohesion: 0.08
Nodes (48): activateMusic(), clamp01(), clickVolume, currentTrack(), ensureClickBuffer(), ensureClickBytes(), ensureContext(), ensureMusic() (+40 more)

## Knowledge Gaps
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@tabler/icons` connect `package.json` to `audio.ts`, `game.ts`?**
  _High betweenness centrality (0.138) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `setupPlayerControls()` (e.g. with `nextTrack()` and `previousTrack()`) actually correct?**
  _`setupPlayerControls()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Should `main.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12333333333333334 - nodes in this community are weakly interconnected._
- **Why does `setupPlayerControls()` connect `audio.ts` to `main.ts`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06342780026990553 - nodes in this community are weakly interconnected._
- **Should `ui.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06531204644412192 - nodes in this community are weakly interconnected._