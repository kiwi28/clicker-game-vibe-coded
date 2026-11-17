# TypeScript Rules — Zero `any`

> Enforced for **Maică-ta Clicker**. The `any` type is banned. This document is
> the source of truth; config below makes it mechanically impossible to merge.

## 1. The rule

`any` is **forbidden** everywhere:

- function parameters and return types
- variable and property declarations
- generics (`Array<any>`, `Record<string, any>`, …)
- type assertions (`as any`, `as unknown as T` double-casts)

Use `unknown` + type guards, discriminated unions, or generics instead.

## 2. Compiler config (`tsconfig.json`)

```json
{
	"compilerOptions": {
		"target": "ES2022",
		"module": "ESNext",
		"moduleResolution": "bundler",
		"lib": ["ES2022", "DOM", "DOM.Iterable"],
		"strict": true,
		"noImplicitAny": true,
		"strictNullChecks": true,
		"noUncheckedIndexedAccess": true,
		"noImplicitReturns": true,
		"noFallthroughCasesInSwitch": true,
		"exactOptionalPropertyTypes": true,
		"noUnusedLocals": true,
		"noUnusedParameters": true,
		"forceConsistentCasingInFileNames": true,
		"isolatedModules": true,
		"skipLibCheck": true,
		"noEmit": true
	},
	"include": ["src"]
}
```

## 3. Lint config (`eslint.config.js`)

Type-aware linting — the `no-unsafe-*` rules need TypeScript type information.

```js
import path from "node:path";
import { fileURLToPath } from "node:url";
import tseslint from "typescript-eslint";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default tseslint.config(
	{ ignores: ["dist", "node_modules", "vite.config.ts", "eslint.config.js"] },
	...tseslint.configs.strictTypeChecked,
	{
		languageOptions: {
			parserOptions: {
				project: "./tsconfig.json",
				tsconfigRootDir: dirname,
			},
		},
		rules: {
			"@typescript-eslint/no-explicit-any": "error",
		},
	},
);
```

`strictTypeChecked` bundles `no-explicit-any` (error), all `no-unsafe-*` rules,
and `ban-ts-comment`; `project` points at `tsconfig.json` so those type-aware
rules can run.

## 4. Allowed / forbidden

| Construct                               | Status                                            |
| --------------------------------------- | ------------------------------------------------- |
| `any` (params, returns, vars, generics) | ❌ Banned                                         |
| `as any`                                | ❌ Banned                                         |
| `as unknown as T` (double cast)         | ❌ Banned                                         |
| `@ts-ignore`                            | ❌ Banned                                         |
| `@ts-expect-error`                      | ⚠️ Allowed **only** with a comment explaining why |
| `unknown` + type guard                  | ✅ Preferred for dynamic data                     |
| Discriminated unions                    | ✅ Preferred for variants                         |
| Generics                                | ✅ Preferred over `any`                           |
| `never`                                 | ✅ Use for impossible states                      |

## 5. Handling dynamic data (JSON, storage)

Never cast parsed data. Parse to `unknown`, validate with a type guard.

```ts
// types.ts
export interface SaveData {
	version: number;
	MAME: number;
	clickPower: number;
	buildings: Record<BuildingId, number>;
	achievements: string[];
	totalEarned: number;
	kg: number;
	lastSeen: number;
}

// storage.ts
export function isSaveData(value: unknown): value is SaveData {
	if (typeof value !== "object" || value === null) return false;
	const v = value as Record<string, unknown>;
	return (
		typeof v.version === "number" &&
		typeof v.MAME === "number" &&
		typeof v.clickPower === "number" &&
		typeof v.buildings === "object" &&
		v.buildings !== null &&
		Array.isArray(v.achievements) &&
		typeof v.totalEarned === "number" &&
		typeof v.kg === "number" &&
		typeof v.lastSeen === "number"
	);
}

export function loadSave(): SaveData | null {
	const raw = localStorage.getItem("save");
	if (!raw) return null;
	const parsed: unknown = JSON.parse(raw); // unknown, not any
	return isSaveData(parsed) ? parsed : null;
}
```

## 6. Variants → discriminated unions

```ts
export type UpgradeKind = "click" | "building";

export interface ClickUpgrade {
	kind: "click";
	id: ClickUpgradeId;
	name: string;
	baseCost: number;
	clickPowerGain: number;
}

export interface Building {
	kind: "building";
	id: BuildingId;
	name: string;
	joke: string;
	baseCost: number;
	MAMEPerSec: number;
	costMultiplier: number;
}

export type Upgrade = ClickUpgrade | Building;

function describe(upgrade: Upgrade): string {
	switch (upgrade.kind) {
		case "click":
			return `${upgrade.name} → +${upgrade.clickPowerGain}/click`;
		case "building":
			return `${upgrade.name} (${upgrade.joke}) → +${upgrade.MAMEPerSec}/sec`;
	}
}
```

## 7. Bad vs good

```ts
// ❌ BAD
function buy(item: any): any {
	return item.cost;
}
const data = JSON.parse(localStorage.getItem("save") ?? "{}") as any;

// ✅ GOOD
function getCost(upgrade: Upgrade): number {
	return upgrade.baseCost * upgrade.costMultiplier; // (Building) or baseCost (Click)
}
const data: unknown = JSON.parse(localStorage.getItem("save") ?? "{}");
if (isSaveData(data)) {
	/* data is SaveData */
}
```

## 8. Exceptions (rare, reviewed)

If a third-party library genuinely has no types, wrap the `any` in **one**
isolated adapter function that returns a typed value, with a comment explaining
why. This is the _only_ permitted place, and it must be approved in review.

In v1 we have **zero runtime dependencies**, so we expect **zero occurrences** of
`any` in the entire codebase.

## 9. Enforcement

- `npm run typecheck` → `tsc --noEmit` fails on any type error.
- `npm run lint` → ESLint fails on any `no-explicit-any` / `no-unsafe-*`.
- `npm run build` runs the type gate before bundling.
- Pre-commit hook (or CI) runs `lint` + `typecheck`; merge is blocked on failure.

**Definition of done:** `grep -r ": any" src/` returns nothing.
