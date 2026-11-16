/** Persists the game state to localStorage so it survives refreshes. */

import { BUILDINGS } from "./upgrades";
import type { BuildingId, GameState } from "./types";

const SAVE_KEY = "maica-ta-clicker:save:v1";

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

function isFiniteNumber(value: unknown): value is number {
	return typeof value === "number" && Number.isFinite(value);
}

/**
 * Validates an unknown parsed value into a clean, playable state. Missing
 * building ids fall back to 0; a present-but-corrupt value rejects the save.
 */
function parseGameState(value: unknown): GameState | null {
	if (!isRecord(value)) return null;

	const mame = value.mame;
	const mamePerSec = value.mamePerSec;
	const kg = value.kg;
	const buildingsRaw = value.buildings;
	if (!isFiniteNumber(mame)) return null;
	if (!isFiniteNumber(mamePerSec)) return null;
	if (!isFiniteNumber(kg)) return null;
	if (!isRecord(buildingsRaw)) return null;

	const buildings: Record<BuildingId, number> = {
		gym: 0,
		bingo: 0,
		market: 0,
		tv: 0,
		lift: 0,
		olx: 0,
		antenna: 0,
		bus: 0,
	};
	for (const building of BUILDINGS) {
		const owned = buildingsRaw[building.id];
		if (isFiniteNumber(owned)) {
			buildings[building.id] = owned;
		} else if (owned !== undefined) {
			return null;
		}
	}

	return { mame, mamePerSec, kg, buildings };
}

export function loadGameState(): GameState | null {
	let raw: string | null;
	try {
		raw = localStorage.getItem(SAVE_KEY);
	} catch {
		return null;
	}
	if (raw === null) return null;

	try {
		const parsed: unknown = JSON.parse(raw);
		return parseGameState(parsed);
	} catch {
		return null;
	}
}

export function saveGameState(state: GameState): void {
	try {
		localStorage.setItem(SAVE_KEY, JSON.stringify(state));
	} catch {
		// Storage unavailable (private mode, quota) — fail silently.
	}
}

export function clearSave(): void {
	try {
		localStorage.removeItem(SAVE_KEY);
	} catch {
		// Storage unavailable — nothing to clear.
	}
}
