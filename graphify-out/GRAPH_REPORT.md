# Graph Report - ai-slop-game  (2026-11-17)

## Corpus Check
- 16 files · ~14,136 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .zip 1, .css 1)

## Summary
- 224 nodes · 461 edges · 9 communities (8 shown, 1 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `237dd161`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- main.ts
- compilerOptions
- package.json
- fatness.ts
- ui.ts
- game.ts
- render
- audio.ts

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 18 edges
2. `init()` - 9 edges
3. `render()` - 9 edges
4. `renderMoms()` - 8 edges
5. `renderHud()` - 8 edges
6. `buyMaxBuilding()` - 7 edges
7. `BuildingId` - 7 edges
8. `setupAudioSettings()` - 7 edges
9. `setupDevMenu()` - 7 edges
10. `kgFromMame()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `clickMom()` --calls--> `getStage()`  [EXTRACTED]
  src/game.ts → src/fatness.ts
- `openDevModal` --calls--> `passivePerSecond()`  [EXTRACTED]
  src/main.ts → src/game.ts
- `DevState` --references--> `BuildingId`  [EXTRACTED]
  src/ui.ts → src/types.ts
- `setupAudioSettings()` --calls--> `getClickVolume()`  [EXTRACTED]
  src/main.ts → src/audio.ts
- `setupAudioSettings()` --calls--> `getMusicVolume()`  [EXTRACTED]
  src/main.ts → src/audio.ts

## Import Cycles
- None detected.

## Communities (9 total, 1 thin omitted)

### Community 0 - "main.ts"
Cohesion: 0.12
Nodes (22): checkAchievements(), getAchievement(), isLastStageComplete(), createInitialState(), prestige(), resetState(), tick(), checkAndShowAchievements() (+14 more)

### Community 1 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution, noEmit (+11 more)

### Community 2 - "package.json"
Cohesion: 0.10
Nodes (23): dependencies, @tabler/icons@^3.52.0, devDependencies, typescript@~5.6.3, vite@^5.4.10, name, private, scripts (+15 more)

### Community 3 - "fatness.ts"
Cohesion: 0.28
Nodes (8): BONUS_PER_STAGE, FATNESS_STAGES, FatnessStage, getStage(), LAST_STAGE, LAST_STAGE_END_KG, scaleFactor(), stageEndKg()

### Community 4 - "ui.ts"
Cohesion: 0.07
Nodes (48): isDevEnabled(), isLoaderDisabled(), setDevEnabled(), setLoaderDisabled(), AchievementView, achievementViews, buildAchievementList(), buildDevFields() (+40 more)

### Community 5 - "game.ts"
Cohesion: 0.16
Nodes (20): AchievementDef, ACHIEVEMENTS, isAchievementId(), CLICK_UPGRADE_ICONS, IconDef, ICONS, isFiniteNumber(), isRecord() (+12 more)

### Community 9 - "render"
Cohesion: 0.11
Nodes (35): bonusMultiplier(), formatMame(), formatNumber(), trimDecimals(), UNITS, buyBuilding(), buyClickUpgrade(), buyMaxBuilding() (+27 more)

### Community 10 - "audio.ts"
Cohesion: 0.15
Nodes (26): clamp01(), clickVolume, ensureClickBuffer(), ensureClickBytes(), ensureContext(), ensureMusic(), getClickVolume(), getMusicVolume() (+18 more)

## Knowledge Gaps
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@tabler/icons` connect `package.json` to `game.ts`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **Should `main.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12333333333333334 - nodes in this community are weakly interconnected._
- **Why does `setupAudioSettings()` connect `audio.ts` to `main.ts`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09538461538461539 - nodes in this community are weakly interconnected._
- **Should `ui.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Should `render` be split into smaller, more focused modules?**
  _Cohesion score 0.11261261261261261 - nodes in this community are weakly interconnected._