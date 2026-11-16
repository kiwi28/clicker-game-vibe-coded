# Graph Report - ai-slop-game  (2026-11-16)

## Corpus Check
- 12 files · ~7,460 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .css 1)

## Summary
- 121 nodes · 227 edges · 7 communities (6 shown, 1 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1f096265`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- main.ts
- compilerOptions
- package.json
- fatness.ts
- ui.ts
- game.ts

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 18 edges
2. `render()` - 10 edges
3. `BuildingId` - 7 edges
4. `renderHud()` - 6 edges
5. `buildBuildingList()` - 6 edges
6. `getStage()` - 6 edges
7. `buyMaxBuilding()` - 6 edges
8. `nextCost()` - 6 edges
9. `frame()` - 5 edges
10. `byId()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `renderHud()` --calls--> `formatNumber()`  [EXTRACTED]
  src/ui.ts → src/format.ts
- `renderBuildings()` --calls--> `nextCost()`  [EXTRACTED]
  src/ui.ts → src/game.ts
- `buildBuildingList()` --calls--> `buyMaxBuilding()`  [EXTRACTED]
  src/ui.ts → src/game.ts
- `DevState` --references--> `BuildingId`  [EXTRACTED]
  src/ui.ts → src/types.ts
- `resetGame()` --calls--> `resetState()`  [EXTRACTED]
  src/main.ts → src/game.ts

## Import Cycles
- None detected.

## Communities (7 total, 1 thin omitted)

### Community 0 - "main.ts"
Cohesion: 0.17
Nodes (18): isLastStageComplete(), createInitialState(), passivePerSecond(), prestige(), resetState(), tick(), els, frame() (+10 more)

### Community 1 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution, noEmit (+11 more)

### Community 2 - "package.json"
Cohesion: 0.13
Nodes (17): dependencies, @tabler/icons@^3.52.0, devDependencies, typescript@~5.6.3, vite@^5.4.10, name, private, scripts (+9 more)

### Community 3 - "fatness.ts"
Cohesion: 0.20
Nodes (16): BONUS_PER_STAGE, bonusMultiplier(), FATNESS_STAGES, FatnessStage, getStage(), LAST_STAGE, LAST_STAGE_END_KG, scaleFactor() (+8 more)

### Community 4 - "ui.ts"
Cohesion: 0.12
Nodes (27): formatNumber(), UNITS, buyBuilding(), buildBuildingList(), buildDevFields(), BuildingView, buildingViews, byId() (+19 more)

### Community 5 - "game.ts"
Cohesion: 0.25
Nodes (11): IconDef, ICONS, isFiniteNumber(), isRecord(), loadGameState(), parseGameState(), Building, BuildingId (+3 more)

## Knowledge Gaps
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@tabler/icons` connect `package.json` to `game.ts`?**
  _High betweenness centrality (0.196) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Why does `BuildingId` connect `game.ts` to `fatness.ts`, `ui.ts`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.13071895424836602 - nodes in this community are weakly interconnected._
- **Should `ui.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11576354679802955 - nodes in this community are weakly interconnected._