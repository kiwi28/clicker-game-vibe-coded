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
	| "apelvideo";

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
	| "legend";

export interface Building {
	id: BuildingId;
	name: string;
	joke: string;
	icon: string;
	color: string;
	baseCost: number;
	mamePerSec: number;
	costMultiplier: number;
}

export interface ClickUpgrade {
	id: ClickUpgradeId;
	name: string;
	icon: string;
	color: string;
	/** Added to click power once owned. */
	effect: number;
	baseCost: number;
}

export interface Achievement {
	id: AchievementId;
	name: string;
	description: string;
	icon: string;
}

export interface GameState {
	mame: number;
	mamePerSec: number;
	kg: number;
	/** Number of mom icons (starts at 1; +1 each time the final stage ends). */
	moms: number;
	/** Lifetime Mame earned (clicks + passive), used by milestones. */
	totalEarned: number;
	/** Lifetime clicks on the mom. */
	totalClicks: number;
	buildings: Record<BuildingId, number>;
	upgrades: Record<ClickUpgradeId, boolean>;
	achievements: AchievementId[];
}
