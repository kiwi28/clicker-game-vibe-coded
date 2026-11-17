# Graph Report - ai-slop-game  (2026-11-17)

## Corpus Check
- 30 files · ~24,030 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 20 file(s) not represented in the graph (top: .xml 10, (none) 4, .properties 2)
- WARNING: 20 of 100 files seen (20%) have no supported extractor and are missing from this graph entirely. It may look complete while representing only part of the codebase.

## Summary
- 346 nodes · 688 edges · 21 communities (11 shown, 10 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `60e74a4d`
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
- fatness.ts
- MainActivity.java
- buildUpgradeList

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 18 edges
2. `setupPlayerControls()` - 16 edges
3. `render()` - 15 edges
4. `init()` - 11 edges
5. `doMomClick()` - 10 edges
6. `recalcBest()` - 9 edges
7. `frame()` - 9 edges
8. `with` - 9 edges
9. `renderHud()` - 8 edges
10. `renderMoms()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `clickMom()` --calls--> `getStage()`  [EXTRACTED]
  src/game.ts → src/fatness.ts
- `doMomClick()` --calls--> `clickMom()`  [EXTRACTED]
  src/main.ts → src/game.ts
- `doToolTick()` --calls--> `buyClickUpgrade()`  [EXTRACTED]
  src/ui.ts → src/game.ts
- `frame()` --calls--> `tick()`  [EXTRACTED]
  src/main.ts → src/game.ts
- `parseGameState()` --indirect_call--> `isAchievementId()`  [INFERRED]
  src/storage.ts → src/achievements.ts

## Import Cycles
- None detected.

## Communities (21 total, 10 thin omitted)

### Community 0 - "main.ts"
Cohesion: 0.10
Nodes (23): checkAchievements(), getAchievement(), isLastStageComplete(), createInitialState(), passivePerSecond(), prestige(), resetState(), checkAndShowAchievements() (+15 more)

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
Nodes (66): getStage(), formatMAME(), formatNumber(), trimDecimals(), UNITS, doMomClick(), isDevEnabled(), isLoaderDisabled() (+58 more)

### Community 5 - "game.ts"
Cohesion: 0.12
Nodes (27): AchievementDef, ACHIEVEMENTS, isAchievementId(), CLICK_UPGRADE_ICONS, IconDef, ICONS, isFiniteNumber(), isRecord() (+19 more)

### Community 6 - "with"
Cohesion: 0.09
Nodes (26): name, runs-on, steps, jobs, android, web, name, on (+18 more)

### Community 9 - "render"
Cohesion: 0.15
Nodes (27): bonusMultiplier(), buyBuilding(), buyClickUpgrade(), buyMaxBuilding(), buyMaxClickUpgrade(), clickMom(), clickPower(), KG_PER_MAME (+19 more)

### Community 10 - "audio.ts"
Cohesion: 0.08
Nodes (44): activateMusic(), clamp01(), clickVolume, currentTrack(), ensureClickBuffer(), ensureClickBytes(), ensureContext(), ensureMusic() (+36 more)

### Community 11 - "fatness.ts"
Cohesion: 0.29
Nodes (7): BONUS_PER_STAGE, FATNESS_STAGES, FatnessStage, LAST_STAGE, LAST_STAGE_END_KG, scaleFactor(), stageEndKg()

### Community 22 - "buildUpgradeList"
Cohesion: 0.24
Nodes (11): bestAffordableClickUpgrade(), bestValueClickUpgrade(), pickBestClickUpgrade(), clearHighlight(), clearSaveFor(), doToolTick(), onUpgradePurchased(), recalcBest() (+3 more)

## Knowledge Gaps
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@tabler/icons` connect `package.json` to `audio.ts`, `pattern.ts`, `game.ts`?**
  _High betweenness centrality (0.131) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `setupPlayerControls()` (e.g. with `nextTrack()` and `previousTrack()`) actually correct?**
  _`setupPlayerControls()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Should `main.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10344827586206896 - nodes in this community are weakly interconnected._
- **Why does `setupPlayerControls()` connect `audio.ts` to `main.ts`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07459677419354839 - nodes in this community are weakly interconnected._
- **Should `ui.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.056189640035118525 - nodes in this community are weakly interconnected._