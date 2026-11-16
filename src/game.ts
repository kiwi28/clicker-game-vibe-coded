/** Game state, click/buy logic, and passive income. Mutates a single state. */

import { bonusMultiplier, getStage } from "./fatness";
import { BUILDINGS, buildingCost, getBuilding } from "./upgrades";
import type { BuildingId, GameState } from "./types";

const BASE_CLICK_POWER = 1;

export function createInitialState(): GameState {
	return {
		mame: 0,
		mamePerSec: 0,
		kg: 0,
		buildings: {
			gym: 0,
			bingo: 0,
			market: 0,
			tv: 0,
			lift: 0,
			olx: 0,
			antenna: 0,
			bus: 0,
		},
	};
}

/** Resets `state` in place back to a fresh game (keeps the same reference). */
export function resetState(state: GameState): void {
	const fresh = createInitialState();
	state.mame = fresh.mame;
	state.mamePerSec = fresh.mamePerSec;
	state.kg = fresh.kg;
	state.buildings = fresh.buildings;
}

/** Applies one click: grows kg, applies the fatness stage bonus, adds Mame. */
export function clickMom(state: GameState): number {
	state.kg += 1;
	const gain = BASE_CLICK_POWER * bonusMultiplier(getStage(state.kg).stage);
	state.mame += gain;
	return gain;
}

/** Cost of the next purchase of `id` given its current owned count. */
export function nextCost(id: BuildingId, state: GameState): number {
	const building = getBuilding(id);
	return buildingCost(building, state.buildings[id] ?? 0);
}

/** Buys one of `id` if affordable and recomputes passive income. */
export function buyBuilding(id: BuildingId, state: GameState): void {
	const cost = nextCost(id, state);
	if (state.mame < cost) return;
	const owned = state.buildings[id] ?? 0;
	state.mame -= cost;
	state.buildings[id] = owned + 1;
	state.mamePerSec = passivePerSecond(state);
}

/**
 * Buys as many of `id` as affordable with the current currency, then
 * recomputes passive income.
 */
export function buyMaxBuilding(id: BuildingId, state: GameState): void {
	const building = getBuilding(id);
	let owned = state.buildings[id] ?? 0;
	let bought = 0;
	while (state.mame >= buildingCost(building, owned)) {
		state.mame -= buildingCost(building, owned);
		owned += 1;
		bought += 1;
	}
	if (bought > 0) {
		state.buildings[id] = owned;
		state.mamePerSec = passivePerSecond(state);
	}
}

/** Sum of all buildings' income. */
export function passivePerSecond(state: GameState): number {
	let total = 0;
	for (const building of BUILDINGS) {
		total += building.mamePerSec * (state.buildings[building.id] ?? 0);
	}
	return total;
}

/** Adds `seconds` worth of passive income. */
export function tick(state: GameState, seconds: number): void {
	state.mame += state.mamePerSec * seconds;
}
