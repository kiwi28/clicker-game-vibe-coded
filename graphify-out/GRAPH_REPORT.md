# Graph Report - ai-slop-game  (2026-11-17)

## Corpus Check
- 30 files · ~24,223 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 20 file(s) not represented in the graph (top: .xml 10, (none) 4, .properties 2)
- WARNING: 20 of 100 files seen (20%) have no supported extractor and are missing from this graph entirely. It may look complete while representing only part of the codebase.

## Summary
- 351 nodes · 686 edges · 20 communities (10 shown, 10 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `48c0cb45`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- main.ts
- compilerOptions
- package.json
- tools.ts
- ui.ts
- game.ts
- with
- vite-env.d.ts
- ExampleInstrumentedTest.java
- render
- audio.ts
- pattern.ts
- MainActivity.java

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 18 edges
2. `wirePlayer()` - 16 edges
3. `init()` - 11 edges
4. `render()` - 11 edges
5. `recalcBest()` - 9 edges
6. `with` - 9 edges
7. `activateMusic()` - 8 edges
8. `getStage()` - 8 edges
9. `renderHud()` - 8 edges
10. `renderMoms()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `doMomClick()` --calls--> `clickMom()`  [EXTRACTED]
  src/main.ts → src/game.ts
- `frame()` --calls--> `tick()`  [EXTRACTED]
  src/main.ts → src/game.ts
- `wirePlayer()` --indirect_call--> `nextTrack()`  [INFERRED]
  src/player.ts → src/audio.ts
- `wirePlayer()` --indirect_call--> `previousTrack()`  [INFERRED]
  src/player.ts → src/audio.ts
- `wirePlayer()` --indirect_call--> `togglePlayPause()`  [INFERRED]
  src/player.ts → src/audio.ts

## Import Cycles
- None detected.

## Communities (20 total, 10 thin omitted)

### Community 0 - "main.ts"
Cohesion: 0.10
Nodes (25): checkAchievements(), getAchievement(), isLastStageComplete(), createInitialState(), passivePerSecond(), prestige(), resetState(), checkAndShowAchievements() (+17 more)

### Community 1 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution, noEmit (+11 more)

### Community 2 - "package.json"
Cohesion: 0.07
Nodes (25): config, dependencies, @capacitor/android@^8.6.2, @capacitor/core@^8.6.2, @tabler/icons@^3.52.0, devDependencies, @capacitor/cli@^8.6.2, typescript@~5.6.3 (+17 more)

### Community 3 - "tools.ts"
Cohesion: 0.23
Nodes (16): buyMaxClickUpgrade(), maxAffordableClickUpgrade(), nextClickUpgradeCost(), bestValueClickUpgrade(), buyTool(), canBuyTool(), getTool(), pickBestClickUpgrade() (+8 more)

### Community 4 - "ui.ts"
Cohesion: 0.05
Nodes (66): buyClickUpgrade(), isDevEnabled(), isLoaderDisabled(), setDevEnabled(), setLoaderDisabled(), bestAffordableClickUpgrade(), AchievementView, achievementViews (+58 more)

### Community 5 - "game.ts"
Cohesion: 0.14
Nodes (20): AchievementDef, ACHIEVEMENTS, isAchievementId(), CLICK_UPGRADE_ICONS, IconDef, ICONS, isFiniteNumber(), isRecord() (+12 more)

### Community 6 - "with"
Cohesion: 0.09
Nodes (26): name, runs-on, steps, jobs, android, web, name, on (+18 more)

### Community 9 - "render"
Cohesion: 0.10
Nodes (33): BONUS_PER_STAGE, bonusMultiplier(), FATNESS_STAGES, FatnessStage, getStage(), LAST_STAGE, LAST_STAGE_END_KG, scaleFactor() (+25 more)

### Community 10 - "audio.ts"
Cohesion: 0.08
Nodes (48): activateMusic(), clamp01(), clickVolume, currentTrack(), ensureClickBuffer(), ensureClickBytes(), ensureContext(), ensureMusic() (+40 more)

### Community 11 - "pattern.ts"
Cohesion: 0.43
Nodes (6): applyClickZonePattern(), buildTile(), Cell, CELLS, innerSvg(), renderCell()

## Knowledge Gaps
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@tabler/icons` connect `package.json` to `audio.ts`, `pattern.ts`, `game.ts`?**
  _High betweenness centrality (0.132) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `wirePlayer()` (e.g. with `nextTrack()` and `previousTrack()`) actually correct?**
  _`wirePlayer()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Should `main.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0989247311827957 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07459677419354839 - nodes in this community are weakly interconnected._
- **Should `ui.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05370843989769821 - nodes in this community are weakly interconnected._
- **Should `game.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._