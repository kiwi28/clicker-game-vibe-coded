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
	buildings: Record<BuildingId, number>;
}
