# Graph Report - ai-slop-game  (2026-11-17)

## Corpus Check
- 28 files · ~19,395 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 20 file(s) not represented in the graph (top: .xml 10, (none) 4, .properties 2)
- WARNING: 20 of 91 files seen (22%) have no supported extractor and are missing from this graph entirely. It may look complete while representing only part of the codebase.

## Summary
- 284 nodes · 538 edges · 21 communities (11 shown, 10 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `56c5fa1e`
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
- ExampleInstrumentedTest.java
- render
- audio.ts
- pattern.ts
- format.ts
- MainActivity.java

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 18 edges
2. `render()` - 13 edges
3. `with` - 9 edges
4. `init()` - 9 edges
5. `renderHud()` - 8 edges
6. `renderMoms()` - 8 edges
7. `BuildingId` - 7 edges
8. `frame()` - 7 edges
9. `setupAudioSettings()` - 7 edges
10. `setupDevMenu()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `DevState` --references--> `BuildingId`  [EXTRACTED]
  src/ui.ts → src/types.ts
- `checkAndShowAchievements()` --calls--> `showAchievement()`  [EXTRACTED]
  src/main.ts → src/ui.ts
- `frame()` --calls--> `render()`  [EXTRACTED]
  src/main.ts → src/ui.ts
- `frame()` --calls--> `spawnBuildingSlices()`  [EXTRACTED]
  src/main.ts → src/ui.ts
- `resetGame()` --calls--> `render()`  [EXTRACTED]
  src/main.ts → src/ui.ts

## Import Cycles
- None detected.

## Communities (21 total, 10 thin omitted)

### Community 0 - "main.ts"
Cohesion: 0.11
Nodes (25): checkAchievements(), getAchievement(), isLastStageComplete(), createInitialState(), passivePerSecond(), prestige(), resetState(), tick() (+17 more)

### Community 1 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution, noEmit (+11 more)

### Community 2 - "package.json"
Cohesion: 0.09
Nodes (24): config, dependencies, @capacitor/android@^8.6.2, @capacitor/core@^8.6.2, @tabler/icons@^3.52.0, devDependencies, @capacitor/cli@^8.6.2, typescript@~5.6.3 (+16 more)

### Community 3 - "fatness.ts"
Cohesion: 0.28
Nodes (8): BONUS_PER_STAGE, FATNESS_STAGES, FatnessStage, getStage(), LAST_STAGE, LAST_STAGE_END_KG, scaleFactor(), stageEndKg()

### Community 4 - "ui.ts"
Cohesion: 0.07
Nodes (49): isDevEnabled(), isLoaderDisabled(), setDevEnabled(), setLoaderDisabled(), AchievementView, achievementViews, buildAchievementList(), buildDevFields() (+41 more)

### Community 5 - "game.ts"
Cohesion: 0.16
Nodes (20): AchievementDef, ACHIEVEMENTS, isAchievementId(), CLICK_UPGRADE_ICONS, IconDef, ICONS, isFiniteNumber(), isRecord() (+12 more)

### Community 6 - "with"
Cohesion: 0.09
Nodes (26): name, runs-on, steps, jobs, android, web, name, on (+18 more)

### Community 9 - "render"
Cohesion: 0.14
Nodes (30): bonusMultiplier(), formatNumber(), buyBuilding(), buyClickUpgrade(), buyMaxBuilding(), buyMaxClickUpgrade(), clickMom(), clickPower() (+22 more)

### Community 10 - "audio.ts"
Cohesion: 0.15
Nodes (26): clamp01(), clickVolume, ensureClickBuffer(), ensureClickBytes(), ensureContext(), ensureMusic(), getClickVolume(), getMusicVolume() (+18 more)

### Community 11 - "pattern.ts"
Cohesion: 0.43
Nodes (6): applyClickZonePattern(), buildTile(), Cell, CELLS, innerSvg(), renderCell()

### Community 13 - "format.ts"
Cohesion: 0.67
Nodes (3): formatMame(), trimDecimals(), UNITS

## Knowledge Gaps
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@tabler/icons` connect `package.json` to `pattern.ts`, `game.ts`?**
  _High betweenness centrality (0.121) - this node is a cross-community bridge._
- **Should `main.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10846560846560846 - nodes in this community are weakly interconnected._
- **Why does `setupAudioSettings()` connect `audio.ts` to `main.ts`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09116809116809117 - nodes in this community are weakly interconnected._
- **Should `ui.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06938775510204082 - nodes in this community are weakly interconnected._
- **Should `with` be split into smaller, more focused modules?**
  _Cohesion score 0.08547008547008547 - nodes in this community are weakly interconnected._