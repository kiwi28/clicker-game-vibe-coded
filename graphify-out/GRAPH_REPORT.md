# Graph Report - ai-slop-game  (2026-11-16)

## Corpus Check
- 12 files · ~6,318 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .css 1)

## Summary
- 103 nodes · 188 edges · 9 communities (8 shown, 1 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `17eaaa5d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- main.ts
- compilerOptions
- package.json
- fatness.ts
- ui.ts
- game.ts
- game.ts
- formatNumber

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 18 edges
2. `render()` - 8 edges
3. `nextCost()` - 6 edges
4. `buyMaxBuilding()` - 6 edges
5. `renderHud()` - 6 edges
6. `buildBuildingList()` - 6 edges
7. `BuildingId` - 6 edges
8. `getStage()` - 6 edges
9. `buyBuilding()` - 5 edges
10. `bonusMultiplier()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `resetGame()` --calls--> `resetState()`  [EXTRACTED]
  src/main.ts → src/game.ts
- `renderBuildings()` --calls--> `nextCost()`  [EXTRACTED]
  src/ui.ts → src/game.ts
- `buildBuildingList()` --calls--> `buyBuilding()`  [EXTRACTED]
  src/ui.ts → src/game.ts
- `buildBuildingList()` --calls--> `buyMaxBuilding()`  [EXTRACTED]
  src/ui.ts → src/game.ts
- `resetGame()` --calls--> `render()`  [EXTRACTED]
  src/main.ts → src/ui.ts

## Import Cycles
- None detected.

## Communities (9 total, 1 thin omitted)

### Community 0 - "main.ts"
Cohesion: 0.19
Nodes (12): tick(), els, frame(), last, resetGame(), clearSave(), saveGameState(), formatGain() (+4 more)

### Community 1 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution, noEmit (+11 more)

### Community 2 - "package.json"
Cohesion: 0.13
Nodes (17): dependencies, @tabler/icons@^3.52.0, devDependencies, typescript@~5.6.3, vite@^5.4.10, name, private, scripts (+9 more)

### Community 3 - "fatness.ts"
Cohesion: 0.33
Nodes (8): BONUS_PER_STAGE, bonusMultiplier(), FATNESS_STAGES, FatnessStage, getStage(), scaleFactor(), clickMom(), renderHud()

### Community 4 - "ui.ts"
Cohesion: 0.24
Nodes (11): buildBuildingList(), BuildingView, buildingViews, byId(), Elements, FloatPoint, init(), queryElements() (+3 more)

### Community 5 - "game.ts"
Cohesion: 0.29
Nodes (9): IconDef, ICONS, isFiniteNumber(), isRecord(), loadGameState(), parseGameState(), Building, BuildingId (+1 more)

### Community 6 - "game.ts"
Cohesion: 0.38
Nodes (9): buyBuilding(), buyMaxBuilding(), createInitialState(), nextCost(), passivePerSecond(), resetState(), GameState, buildingCost() (+1 more)

### Community 8 - "formatNumber"
Cohesion: 0.33
Nodes (5): formatNumber(), UNITS, render(), renderBuildings(), renderBuildingsTotal()

## Knowledge Gaps
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@tabler/icons` connect `package.json` to `game.ts`?**
  _High betweenness centrality (0.213) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Why does `BuildingId` connect `game.ts` to `ui.ts`, `game.ts`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.13071895424836602 - nodes in this community are weakly interconnected._