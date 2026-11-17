# Graph Report - ai-slop-game  (2026-11-17)

## Corpus Check
- 28 files · ~20,908 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 20 file(s) not represented in the graph (top: .xml 10, (none) 4, .properties 2)
- WARNING: 20 of 92 files seen (22%) have no supported extractor and are missing from this graph entirely. It may look complete while representing only part of the codebase.

## Summary
- 287 nodes · 536 edges · 19 communities (9 shown, 10 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d5bd629c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- main.ts
- compilerOptions
- package.json
- renderHud
- ui.ts
- game.ts
- with
- ExampleInstrumentedTest.java
- render
- audio.ts
- MainActivity.java

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 18 edges
2. `render()` - 13 edges
3. `init()` - 10 edges
4. `with` - 9 edges
5. `renderHud()` - 8 edges
6. `renderMoms()` - 8 edges
7. `setupDevMenu()` - 7 edges
8. `BuildingId` - 7 edges
9. `frame()` - 7 edges
10. `buyMaxBuilding()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `init()` --calls--> `applyClickZonePattern()`  [EXTRACTED]
  src/ui.ts → src/pattern.ts
- `renderHud()` --calls--> `bonusMultiplier()`  [EXTRACTED]
  src/ui.ts → src/fatness.ts
- `renderHud()` --calls--> `getStage()`  [EXTRACTED]
  src/ui.ts → src/fatness.ts
- `renderMoms()` --calls--> `scaleFactor()`  [EXTRACTED]
  src/ui.ts → src/fatness.ts
- `buildingRateText()` --calls--> `kgFromMAME()`  [EXTRACTED]
  src/ui.ts → src/game.ts

## Import Cycles
- None detected.

## Communities (19 total, 10 thin omitted)

### Community 0 - "main.ts"
Cohesion: 0.10
Nodes (27): checkAchievements(), getAchievement(), isLastStageComplete(), createInitialState(), prestige(), resetState(), tick(), checkAndShowAchievements() (+19 more)

### Community 1 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution, noEmit (+11 more)

### Community 2 - "package.json"
Cohesion: 0.07
Nodes (30): config, dependencies, @capacitor/android@^8.6.2, @capacitor/core@^8.6.2, @tabler/icons@^3.52.0, devDependencies, @capacitor/cli@^8.6.2, typescript@~5.6.3 (+22 more)

### Community 3 - "renderHud"
Cohesion: 0.29
Nodes (9): formatMAME(), formatNumber(), trimDecimals(), UNITS, buildingRateText(), formatKg(), isExploding(), renderBuildings() (+1 more)

### Community 4 - "ui.ts"
Cohesion: 0.07
Nodes (49): isDevEnabled(), isLoaderDisabled(), setDevEnabled(), setLoaderDisabled(), AchievementView, achievementViews, buildAchievementList(), buildDevFields() (+41 more)

### Community 5 - "game.ts"
Cohesion: 0.14
Nodes (20): AchievementDef, ACHIEVEMENTS, isAchievementId(), CLICK_UPGRADE_ICONS, IconDef, ICONS, isFiniteNumber(), isRecord() (+12 more)

### Community 6 - "with"
Cohesion: 0.09
Nodes (26): name, runs-on, steps, jobs, android, web, name, on (+18 more)

### Community 9 - "render"
Cohesion: 0.12
Nodes (31): BONUS_PER_STAGE, bonusMultiplier(), FATNESS_STAGES, FatnessStage, getStage(), LAST_STAGE, LAST_STAGE_END_KG, scaleFactor() (+23 more)

### Community 10 - "audio.ts"
Cohesion: 0.14
Nodes (22): clamp01(), clickVolume, ensureClickBuffer(), ensureClickBytes(), ensureContext(), ensureMusic(), initAudio(), loadVolume() (+14 more)

## Knowledge Gaps
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@tabler/icons` connect `package.json` to `game.ts`?**
  _High betweenness centrality (0.120) - this node is a cross-community bridge._
- **Should `main.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0989247311827957 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.0748663101604278 - nodes in this community are weakly interconnected._
- **Should `ui.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07020408163265306 - nodes in this community are weakly interconnected._
- **Should `game.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Should `with` be split into smaller, more focused modules?**
  _Cohesion score 0.08547008547008547 - nodes in this community are weakly interconnected._