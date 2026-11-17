/** Shared types for the game (no `any` anywhere). */

export type BuildingId =
	| "gym"
	| "bingo"
	| "market"
	| "tv"
	| "lift"
	| "olx"
	| "antenna"
	| "bus";

export type ClickUpgradeId =
	| "slap"
	| "palmadubla"
	| "papuc"
	| "roastlegend"
	| "apelvideo"
	| "curea"
	| "barfa"
	| "scandal"
	| "tiktok"
	| "apel3";

export type ToolId = "minmax" | "autobuy";

export type AchievementId =
	| "firstClick"
	| "first100"
	| "firstBuilding"
	| "kg100"
	| "bingo10"
	| "olx"
	| "antenna"
	| "million"
	| "tv25"
	| "legend"
	| "clicks100"
	| "clicks1000"
	| "clicks10000"
	| "billion"
	| "trillion"
	| "kg10"
	| "kg600"
	| "kg2000"
	| "kg100000"
	| "kg10000000"
	| "gym10"
	| "bus1"
	| "buildings100"
	| "slap10"
	| "tiktok1"
	| "upgrades50"
	| "moms2"
	| "moms5"
	| "moms10"
	| "mps100"
	| "mps10000";

export interface Building {
	id: BuildingId;
	name: string;
	joke: string;
	icon: string;
	color: string;
	baseCost: number;
	MAMEPerSec: number;
	costMultiplier: number;
}

export interface ClickUpgrade {
	id: ClickUpgradeId;
	name: string;
	icon: string;
	color: string;
	/** Click power added per unit owned. */
	effect: number;
	baseCost: number;
	costMultiplier: number;
}

export interface Achievement {
	id: AchievementId;
	name: string;
	description: string;
	icon: string;
}

export interface GameState {
	MAME: number;
	MAMEPerSec: number;
	kg: number;
	/** Number of mom icons (starts at 1; +1 each time the final stage ends). */
	moms: number;
	/** Lifetime MAME earned (clicks + passive), used by milestones. */
	totalEarned: number;
	/** Lifetime clicks on the mom. */
	totalClicks: number;
	buildings: Record<BuildingId, number>;
	upgrades: Record<ClickUpgradeId, number>;
	/** One-time quality-of-life tools (bought, not repeatable). */
	tools: Record<ToolId, boolean>;
	/** Auto-buy toggle: ON (true) by default once the Auto buy tool is owned. */
	autobuyEnabled: boolean;
	achievements: AchievementId[];
}
