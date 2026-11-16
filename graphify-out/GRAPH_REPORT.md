# Graph Report - ai-slop-game  (2026-11-17)

## Corpus Check
- 15 files · ~12,373 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .zip 1, .css 1)

## Summary
- 192 nodes · 397 edges · 10 communities (9 shown, 1 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9c5e20df`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- main.ts
- compilerOptions
- package.json
- fatness.ts
- ui.ts
- game.ts
- pattern.ts
- render
- spawnBuildingSlices

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 18 edges
2. `render()` - 13 edges
3. `init()` - 9 edges
4. `renderHud()` - 8 edges
5. `renderMoms()` - 8 edges
6. `frame()` - 7 edges
7. `setupDevMenu()` - 7 edges
8. `BuildingId` - 7 edges
9. `buyMaxBuilding()` - 7 edges
10. `buildingRateText()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `checkAndShowAchievements()` --calls--> `showAchievement()`  [EXTRACTED]
  src/main.ts → src/ui.ts
- `openDevModal` --calls--> `passivePerSecond()`  [EXTRACTED]
  src/main.ts → src/game.ts
- `frame()` --calls--> `spawnBuildingSlices()`  [EXTRACTED]
  src/main.ts → src/ui.ts
- `init()` --calls--> `applyClickZonePattern()`  [EXTRACTED]
  src/ui.ts → src/pattern.ts
- `renderHud()` --calls--> `formatNumber()`  [EXTRACTED]
  src/ui.ts → src/format.ts

## Import Cycles
- None detected.

## Communities (10 total, 1 thin omitted)

### Community 0 - "main.ts"
Cohesion: 0.10
Nodes (28): checkAchievements(), getAchievement(), isLastStageComplete(), createInitialState(), prestige(), resetState(), tick(), checkAndShowAchievements() (+20 more)

### Community 1 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution, noEmit (+11 more)

### Community 2 - "package.json"
Cohesion: 0.12
Nodes (17): dependencies, @tabler/icons@^3.52.0, devDependencies, typescript@~5.6.3, vite@^5.4.10, name, private, scripts (+9 more)

### Community 3 - "fatness.ts"
Cohesion: 0.13
Nodes (17): BONUS_PER_STAGE, bonusMultiplier(), FATNESS_STAGES, FatnessStage, getStage(), LAST_STAGE, LAST_STAGE_END_KG, scaleFactor() (+9 more)

### Community 4 - "ui.ts"
Cohesion: 0.08
Nodes (42): isLoaderDisabled(), setLoaderDisabled(), BuildingId, AchievementView, achievementViews, buildAchievementList(), buildDevFields(), BuildingView (+34 more)

### Community 5 - "game.ts"
Cohesion: 0.17
Nodes (15): AchievementDef, ACHIEVEMENTS, isAchievementId(), isDevEnabled(), isFiniteNumber(), isRecord(), loadGameState(), parseGameState() (+7 more)

### Community 6 - "pattern.ts"
Cohesion: 0.43
Nodes (6): applyClickZonePattern(), buildTile(), Cell, CELLS, innerSvg(), renderCell()

### Community 9 - "render"
Cohesion: 0.16
Nodes (23): formatNumber(), buyBuilding(), buyClickUpgrade(), buyMaxBuilding(), KG_PER_MAME, kgFromMame(), maxAffordable(), nextCost() (+15 more)

### Community 12 - "spawnBuildingSlices"
Cohesion: 0.53
Nodes (6): clusterCenter(), pickEdge(), pizzaSizePx(), spawnBuildingSlices(), spawnPizza(), spawnPizzaToMom()

## Knowledge Gaps
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@tabler/icons` connect `package.json` to `render`, `pattern.ts`?**
  _High betweenness centrality (0.152) - this node is a cross-community bridge._
- **Should `main.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0989247311827957 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.12280701754385964 - nodes in this community are weakly interconnected._
- **Should `fatness.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13450292397660818 - nodes in this community are weakly interconnected._
- **Should `ui.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0753045404208195 - nodes in this community are weakly interconnected._