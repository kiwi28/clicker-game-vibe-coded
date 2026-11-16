/**
 * Achievement definitions and unlock logic. Each achievement is a one-time
 * milestone; once met it is added to `GameState.achievements`, shown in the
 * Achievements tab, and announced with a pop-up toast.
 */

import { BUILDINGS, CLICK_UPGRADES } from "./upgrades";
import type { Achievement, AchievementId, GameState } from "./types";

interface AchievementDef extends Achievement {
	isUnlocked: (state: GameState) => boolean;
}

function ownsAnyBuilding(state: GameState): boolean {
	return BUILDINGS.some((building) => (state.buildings[building.id] ?? 0) > 0);
}

function ownsAllClickUpgrades(state: GameState): boolean {
	return CLICK_UPGRADES.every((upgrade) => state.upgrades[upgrade.id] ?? false);
}

export const ACHIEVEMENTS: readonly AchievementDef[] = [
	{
		id: "firstClick",
		name: "First Click",
		description: "Click your mom for the first time",
		icon: "👆",
		isUnlocked: (state) => state.totalClicks >= 1,
	},
	{
		id: "first100",
		name: "100 Mame",
		description: "Earn 100 Mame in total",
		icon: "💯",
		isUnlocked: (state) => state.totalEarned >= 100,
	},
	{
		id: "firstBuilding",
		name: "First Building",
		description: "Buy your first building",
		icon: "🏋️",
		isUnlocked: ownsAnyBuilding,
	},
	{
		id: "kg100",
		name: "Over 100 kg",
		description: "Reach 100 kg",
		icon: "⚖️",
		isUnlocked: (state) => state.kg >= 100,
	},
	{
		id: "bingo10",
		name: "Bingo!",
		description: "Own 10 Bingo buildings",
		icon: "🎱",
		isUnlocked: (state) => state.buildings.bingo >= 10,
	},
	{
		id: "olx",
		name: "Listed on OLX",
		description: "List your mom on OLX",
		icon: "🏷️",
		isUnlocked: (state) => state.buildings.olx >= 1,
	},
	{
		id: "antenna",
		name: "Antenna Installed",
		description: "Give your mom an antenna",
		icon: "📡",
		isUnlocked: (state) => state.buildings.antenna >= 1,
	},
	{
		id: "million",
		name: "One Million Mame",
		description: "Earn 1,000,000 Mame in total",
		icon: "💰",
		isUnlocked: (state) => state.totalEarned >= 1_000_000,
	},
	{
		id: "tv25",
		name: "Your Mom on TV",
		description: "Own 25 TV buildings",
		icon: "📺",
		isUnlocked: (state) => state.buildings.tv >= 25,
	},
	{
		id: "legend",
		name: "Legend",
		description: "Buy every click upgrade",
		icon: "👑",
		isUnlocked: ownsAllClickUpgrades,
	},
];

/** Unlocks any achievements whose condition is now met; returns the new ids. */
export function checkAchievements(state: GameState): AchievementId[] {
	const newly: AchievementId[] = [];
	for (const achievement of ACHIEVEMENTS) {
		if (state.achievements.includes(achievement.id)) continue;
		if (achievement.isUnlocked(state)) {
			state.achievements.push(achievement.id);
			newly.push(achievement.id);
		}
	}
	return newly;
}

export function getAchievement(id: AchievementId): Achievement {
	const achievement = ACHIEVEMENTS.find((candidate) => candidate.id === id);
	if (achievement === undefined) throw new Error(`Unknown achievement: ${id}`);
	return achievement;
}

export function isAchievementId(value: unknown): value is AchievementId {
	if (typeof value !== "string") return false;
	return ACHIEVEMENTS.some((achievement) => achievement.id === value);
}
