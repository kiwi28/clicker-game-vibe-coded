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

export interface GameState {
	mame: number;
	mamePerSec: number;
	kg: number;
	/** Number of mom icons (starts at 1; +1 each time the final stage ends). */
	moms: number;
	buildings: Record<BuildingId, number>;
}
