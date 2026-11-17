/** Persists the game state to localStorage so it survives refreshes. */

import { isAchievementId } from "./achievements";
import { BUILDINGS, CLICK_UPGRADES } from "./upgrades";
import type {
	AchievementId,
	BuildingId,
	ClickUpgradeId,
	GameState,
} from "./types";

const SAVE_KEY = "maica-ta-clicker:save:v1";
const DISABLE_LOADER_KEY = "maica-ta-clicker:disableLoader";
const DEV_ENABLED_KEY = "isDev";

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

	const MAME = value.MAME;
	const MAMEPerSec = value.MAMEPerSec;
	const kg = value.kg;
	const buildingsRaw = value.buildings;
	if (!isFiniteNumber(MAME)) return null;
	if (!isFiniteNumber(MAMEPerSec)) return null;
	if (!isFiniteNumber(kg)) return null;
	if (!isRecord(buildingsRaw)) return null;

	const momsRaw = value.moms;
	let moms: number;
	if (momsRaw === undefined) {
		// Legacy saves predate the prestige mechanic; start with a single mom.
		moms = 1;
	} else if (
		isFiniteNumber(momsRaw) &&
		Number.isInteger(momsRaw) &&
		momsRaw >= 1
	) {
		moms = momsRaw;
	} else {
		return null;
	}

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

	const totalEarnedRaw = value.totalEarned;
	let totalEarned: number;
	if (totalEarnedRaw === undefined) {
		// Legacy saves predate lifetime tracking; fall back to current MAME.
		totalEarned = MAME;
	} else if (isFiniteNumber(totalEarnedRaw) && totalEarnedRaw >= 0) {
		totalEarned = totalEarnedRaw;
	} else {
		return null;
	}

	const totalClicksRaw = value.totalClicks;
	let totalClicks: number;
	if (totalClicksRaw === undefined) {
		totalClicks = 0;
	} else if (isFiniteNumber(totalClicksRaw) && totalClicksRaw >= 0) {
		totalClicks = totalClicksRaw;
	} else {
		return null;
	}

	const upgradesRaw = value.upgrades;
	const upgrades: Record<ClickUpgradeId, number> = {
		slap: 0,
		palmadubla: 0,
		papuc: 0,
		roastlegend: 0,
		apelvideo: 0,
		curea: 0,
		barfa: 0,
		scandal: 0,
		tiktok: 0,
		apel3: 0,
	};
	if (upgradesRaw !== undefined) {
		if (!isRecord(upgradesRaw)) return null;
		for (const upgrade of CLICK_UPGRADES) {
			const owned = upgradesRaw[upgrade.id];
			if (isFiniteNumber(owned)) {
				upgrades[upgrade.id] = owned;
			} else if (typeof owned === "boolean") {
				// Legacy one-time saves: owned → 1, not owned → 0.
				upgrades[upgrade.id] = owned ? 1 : 0;
			} else if (owned !== undefined) {
				return null;
			}
		}
	}

	const achievementsRaw = value.achievements;
	let achievements: AchievementId[];
	if (achievementsRaw === undefined) {
		achievements = [];
	} else if (
		Array.isArray(achievementsRaw) &&
		achievementsRaw.every(isAchievementId)
	) {
		achievements = achievementsRaw;
	} else {
		return null;
	}

	return {
		MAME,
		MAMEPerSec,
		kg,
		moms,
		totalEarned,
		totalClicks,
		buildings,
		upgrades,
		achievements,
	};
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

/** True when the boot loading screen has been disabled from the dev tools. */
export function isLoaderDisabled(): boolean {
	try {
		return localStorage.getItem(DISABLE_LOADER_KEY) === "true";
	} catch {
		return false;
	}
}

export function setLoaderDisabled(disabled: boolean): void {
	try {
		localStorage.setItem(DISABLE_LOADER_KEY, disabled ? "true" : "false");
	} catch {
		// Storage unavailable — fail silently.
	}
}

/** True when the dev menu has been enabled from the settings menu. */
export function isDevEnabled(): boolean {
	try {
		return localStorage.getItem(DEV_ENABLED_KEY) === "true";
	} catch {
		return false;
	}
}

export function setDevEnabled(enabled: boolean): void {
	try {
		if (enabled) localStorage.setItem(DEV_ENABLED_KEY, "true");
		else localStorage.removeItem(DEV_ENABLED_KEY);
	} catch {
		// Storage unavailable — fail silently.
	}
}
