# Graph Report - ai-slop-game  (2026-11-16)

## Corpus Check
- 14 files · ~12,177 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .css 1)

## Summary
- 190 nodes · 392 edges · 11 communities (10 shown, 1 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a411dc87`
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
- render
- spawnBuildingSlices

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 18 edges
2. `render()` - 13 edges
3. `init()` - 9 edges
4. `renderHud()` - 7 edges
5. `renderMoms()` - 7 edges
6. `setupDevMenu()` - 7 edges
7. `BuildingId` - 7 edges
8. `frame()` - 7 edges
9. `buyMaxBuilding()` - 7 edges
10. `formatNumber()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `init()` --calls--> `applyClickZonePattern()`  [EXTRACTED]
  src/ui.ts → src/pattern.ts
- `frame()` --calls--> `render()`  [EXTRACTED]
  src/main.ts → src/ui.ts
- `openDevModal` --calls--> `render()`  [EXTRACTED]
  src/main.ts → src/ui.ts
- `resetGame()` --calls--> `render()`  [EXTRACTED]
  src/main.ts → src/ui.ts
- `renderHud()` --calls--> `bonusMultiplier()`  [EXTRACTED]
  src/ui.ts → src/fatness.ts

## Import Cycles
- None detected.

## Communities (11 total, 1 thin omitted)

### Community 0 - "main.ts"
Cohesion: 0.11
Nodes (24): checkAchievements(), getAchievement(), isLastStageComplete(), createInitialState(), prestige(), resetState(), tick(), checkAndShowAchievements() (+16 more)

### Community 1 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution, noEmit (+11 more)

### Community 2 - "package.json"
Cohesion: 0.13
Nodes (17): dependencies, @tabler/icons@^3.52.0, devDependencies, typescript@~5.6.3, vite@^5.4.10, name, private, scripts (+9 more)

### Community 3 - "fatness.ts"
Cohesion: 0.28
Nodes (8): BONUS_PER_STAGE, FATNESS_STAGES, FatnessStage, getStage(), LAST_STAGE, LAST_STAGE_END_KG, scaleFactor(), stageEndKg()

### Community 4 - "ui.ts"
Cohesion: 0.08
Nodes (42): isDevEnabled(), isLoaderDisabled(), setDevEnabled(), setLoaderDisabled(), AchievementView, achievementViews, buildAchievementList(), buildDevFields() (+34 more)

### Community 5 - "game.ts"
Cohesion: 0.16
Nodes (20): AchievementDef, ACHIEVEMENTS, isAchievementId(), CLICK_UPGRADE_ICONS, IconDef, ICONS, isFiniteNumber(), isRecord() (+12 more)

### Community 6 - "pattern.ts"
Cohesion: 0.43
Nodes (6): applyClickZonePattern(), buildTile(), Cell, CELLS, innerSvg(), renderCell()

### Community 8 - "render"
Cohesion: 0.23
Nodes (12): formatMame(), formatNumber(), trimDecimals(), UNITS, buildingRateText(), formatKg(), render(), renderAchievements() (+4 more)

### Community 9 - "render"
Cohesion: 0.20
Nodes (18): bonusMultiplier(), buyBuilding(), buyClickUpgrade(), buyMaxBuilding(), clickMom(), clickPower(), KG_PER_MAME, kgFromMame() (+10 more)

### Community 12 - "spawnBuildingSlices"
Cohesion: 0.53
Nodes (6): clusterCenter(), pickEdge(), pizzaSizePx(), spawnBuildingSlices(), spawnPizza(), spawnPizzaToMom()

## Knowledge Gaps
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@tabler/icons` connect `package.json` to `game.ts`, `pattern.ts`?**
  _High betweenness centrality (0.146) - this node is a cross-community bridge._
- **Should `main.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Why does `render()` connect `render` to `main.ts`, `render`, `ui.ts`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.13071895424836602 - nodes in this community are weakly interconnected._
- **Should `ui.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07641196013289037 - nodes in this community are weakly interconnected._