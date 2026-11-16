/** Game state, click/buy logic, and passive income. Mutates a single state. */

import { bonusMultiplier, getStage } from "./fatness";
import {
	BUILDINGS,
	buildingCost,
	CLICK_UPGRADES,
	getBuilding,
	getClickUpgrade,
} from "./upgrades";
import type { BuildingId, ClickUpgradeId, GameState } from "./types";

const BASE_CLICK_POWER = 1;

/** kg gained per 1 Mame — the single source of truth tying weight to income. */
export const KG_PER_MAME = 1;

export function createInitialState(): GameState {
	return {
		mame: 0,
		mamePerSec: 0,
		kg: 0,
		moms: 1,
		totalEarned: 0,
		totalClicks: 0,
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
		upgrades: {
			slap: false,
			palmadubla: false,
			papuc: false,
			roastlegend: false,
			apelvideo: false,
		},
		achievements: [],
	};
}

/** Resets `state` in place back to a fresh game (keeps the same reference). */
export function resetState(state: GameState): void {
	const fresh = createInitialState();
	state.mame = fresh.mame;
	state.mamePerSec = fresh.mamePerSec;
	state.kg = fresh.kg;
	state.moms = fresh.moms;
	state.totalEarned = fresh.totalEarned;
	state.totalClicks = fresh.totalClicks;
	state.buildings = fresh.buildings;
	state.upgrades = fresh.upgrades;
	state.achievements = fresh.achievements;
}

/**
 * Progress rate for fatness. Each extra mom halves how fast `kg` grows
 * (`2^(1 − moms)`), so every prestige makes the whole climb twice as slow.
 */
export function progressRate(moms: number): number {
	return 2 ** (1 - moms);
}

/**
 * Converts a Mame amount into kg — the single source of truth for how income
 * becomes weight. `kg = Mame × KG_PER_MAME × progressRate(moms)`, so kg scales
 * down with each extra mom exactly like a click does.
 */
export function kgFromMame(mame: number, moms: number): number {
	return mame * KG_PER_MAME * progressRate(moms);
}

/**
 * Reaches the end of the final stage: adds a mom and resets all progress
 * (kg, Mame, passive income, buildings) while keeping the growing mom count,
 * so the game is endless.
 */
export function prestige(state: GameState): void {
	state.moms += 1;
	state.kg = 0;
	state.mame = 0;
	state.mamePerSec = 0;
	state.buildings = createInitialState().buildings;
	state.upgrades = createInitialState().upgrades;
}

/** Total click power: 1 base plus the effect of every owned click upgrade. */
export function clickPower(state: GameState): number {
	let power = BASE_CLICK_POWER;
	for (const upgrade of CLICK_UPGRADES) {
		if (state.upgrades[upgrade.id] ?? false) power += upgrade.effect;
	}
	return power;
}

/** Applies one click: grows kg, applies the fatness stage bonus, adds Mame. */
export function clickMom(state: GameState): number {
	state.kg += kgFromMame(BASE_CLICK_POWER, state.moms);
	state.totalClicks += 1;
	const gain = clickPower(state) * bonusMultiplier(getStage(state.kg).stage);
	state.mame += gain;
	state.totalEarned += gain;
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
 * How many of `id` can currently be bought with the Mame on hand. Matches the
 * buying loop in `buyMaxBuilding` exactly so the displayed count is truthful.
 */
export function maxAffordable(id: BuildingId, state: GameState): number {
	const building = getBuilding(id);
	let owned = state.buildings[id] ?? 0;
	let remaining = state.mame;
	let count = 0;
	while (remaining >= buildingCost(building, owned)) {
		remaining -= buildingCost(building, owned);
		owned += 1;
		count += 1;
	}
	return count;
}

/**
 * Buys as many of `id` as affordable with the current currency, then
 * recomputes passive income.
 */
export function buyMaxBuilding(id: BuildingId, state: GameState): void {
	const building = getBuilding(id);
	const bought = maxAffordable(id, state);
	if (bought === 0) return;
	let owned = state.buildings[id] ?? 0;
	for (let i = 0; i < bought; i += 1) {
		state.mame -= buildingCost(building, owned);
		owned += 1;
	}
	state.buildings[id] = owned;
	state.mamePerSec = passivePerSecond(state);
}

/** Buys a one-time click upgrade if not yet owned and affordable. */
export function buyClickUpgrade(id: ClickUpgradeId, state: GameState): void {
	const upgrade = getClickUpgrade(id);
	if (state.upgrades[id] ?? false) return;
	if (state.mame < upgrade.baseCost) return;
	state.mame -= upgrade.baseCost;
	state.upgrades[id] = true;
}

/** Sum of all buildings' Mame income. */
export function passivePerSecond(state: GameState): number {
	let total = 0;
	for (const building of BUILDINGS) {
		total += building.mamePerSec * (state.buildings[building.id] ?? 0);
	}
	return total;
}

/** Passive kg/sec, derived from the Mame rate through the single Mame→kg rule. */
export function passiveKgPerSecond(state: GameState): number {
	return kgFromMame(state.mamePerSec, state.moms);
}

/** Adds `seconds` worth of passive income (Mame and kg). */
export function tick(state: GameState, seconds: number): void {
	const amount = state.mamePerSec * seconds;
	state.mame += amount;
	state.totalEarned += amount;
	state.kg += passiveKgPerSecond(state) * seconds;
}
