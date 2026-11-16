# Graph Report - ai-slop-game  (2026-11-16)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 65 nodes · 70 edges · 8 communities (5 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 18 edges
2. `scripts` - 5 edges
3. `render()` - 4 edges
4. `bonusMultiplier()` - 3 edges
5. `getStage()` - 3 edges
6. `scaleFactor()` - 3 edges
7. `spawnFloat()` - 2 edges
8. `spawnRoast()` - 2 edges
9. `typescript@~5.6.3` - 2 edges
10. `vite@^5.4.10` - 2 edges

## Surprising Connections (you probably didn't know these)
- `render()` --calls--> `bonusMultiplier()`  [EXTRACTED]
  src/main.ts → src/fatness.ts
- `render()` --calls--> `getStage()`  [EXTRACTED]
  src/main.ts → src/fatness.ts
- `render()` --calls--> `scaleFactor()`  [EXTRACTED]
  src/main.ts → src/fatness.ts

## Import Cycles
- None detected.

## Communities (8 total, 3 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.11
Nodes (12): clickZone, FloatPoint, GameState, kgValue, mameValue, mom, momEmoji, mpsValue (+4 more)

### Community 1 - "Community 1"
Cohesion: 0.11
Nodes (18): compilerOptions, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution, noEmit (+10 more)

### Community 2 - "Community 2"
Cohesion: 0.24
Nodes (9): devDependencies, typescript@~5.6.3, vite@^5.4.10, name, private, type, version, typescript (+1 more)

### Community 3 - "Community 3"
Cohesion: 0.28
Nodes (8): BONUS_PER_STAGE, bonusMultiplier(), FATNESS_STAGES, FatnessStage, getStage(), SCALE_PER_STAGE, scaleFactor(), render()

### Community 4 - "Community 4"
Cohesion: 0.40
Nodes (5): scripts, build, dev, preview, typecheck

## Knowledge Gaps
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `compilerOptions` connect `Community 1` to `Community 6`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Why does `scripts` connect `Community 4` to `Community 2`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._