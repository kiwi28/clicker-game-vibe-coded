# Graph Report - ai-slop-game  (2026-11-17)

## Corpus Check
- 16 files · ~14,136 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .css 1)

## Summary
- 224 nodes · 473 edges · 9 communities (8 shown, 1 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7aae37cc`
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
2. `render()` - 13 edges
3. `init()` - 9 edges
4. `renderHud()` - 8 edges
5. `renderMoms()` - 8 edges
6. `buyMaxBuilding()` - 7 edges
7. `setupAudioSettings()` - 7 edges
8. `frame()` - 7 edges
9. `BuildingId` - 7 edges
10. `setupDevMenu()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `parseGameState()` --indirect_call--> `isAchievementId()`  [INFERRED]
  src/storage.ts → src/achievements.ts
- `setupAudioSettings()` --calls--> `getMusicVolume()`  [EXTRACTED]
  src/main.ts → src/audio.ts
- `setupAudioSettings()` --calls--> `getClickVolume()`  [EXTRACTED]
  src/main.ts → src/audio.ts
- `setupAudioSettings()` --calls--> `isMuted()`  [EXTRACTED]
  src/main.ts → src/audio.ts
- `clickMom()` --calls--> `getStage()`  [EXTRACTED]
  src/game.ts → src/fatness.ts

## Import Cycles
- None detected.

## Communities (9 total, 1 thin omitted)

### Community 0 - "main.ts"
Cohesion: 0.10
Nodes (27): checkAchievements(), getAchievement(), isLastStageComplete(), createInitialState(), prestige(), resetState(), tick(), checkAndShowAchievements() (+19 more)

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
Cohesion: 0.06
Nodes (54): formatMame(), trimDecimals(), UNITS, isDevEnabled(), isLoaderDisabled(), setDevEnabled(), setLoaderDisabled(), AchievementView (+46 more)

### Community 5 - "game.ts"
Cohesion: 0.16
Nodes (20): AchievementDef, ACHIEVEMENTS, isAchievementId(), CLICK_UPGRADE_ICONS, IconDef, ICONS, isFiniteNumber(), isRecord() (+12 more)

### Community 9 - "render"
Cohesion: 0.16
Nodes (26): bonusMultiplier(), formatNumber(), buyBuilding(), buyClickUpgrade(), buyMaxBuilding(), buyMaxClickUpgrade(), clickMom(), clickPower() (+18 more)

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
  _Cohesion score 0.10344827586206896 - nodes in this community are weakly interconnected._
- **Why does `setupAudioSettings()` connect `audio.ts` to `main.ts`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09538461538461539 - nodes in this community are weakly interconnected._
- **Should `ui.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06233766233766234 - nodes in this community are weakly interconnected._
- **Should `audio.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1455026455026455 - nodes in this community are weakly interconnected._