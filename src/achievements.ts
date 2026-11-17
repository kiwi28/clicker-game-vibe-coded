/**
 * Achievement definitions and unlock logic. Each achievement is a one-time
 * milestone; once met it is added to `GameState.achievements`, shown in the
 * Achievements modal, and announced with a pop-up toast.
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
	return CLICK_UPGRADES.every(
		(upgrade) => (state.upgrades[upgrade.id] ?? 0) > 0,
	);
}

/** Total buildings owned across every building type. */
function totalBuildings(state: GameState): number {
	return BUILDINGS.reduce(
		(sum, building) => sum + (state.buildings[building.id] ?? 0),
		0,
	);
}

/** Total click upgrades owned across every upgrade type. */
function totalClickUpgrades(state: GameState): number {
	return CLICK_UPGRADES.reduce(
		(sum, upgrade) => sum + (state.upgrades[upgrade.id] ?? 0),
		0,
	);
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
		name: "100 MAME",
		description: "Earn 100 MAME in total",
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
		name: "One Million MAME",
		description: "Earn 1,000,000 MAME in total",
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
		description: "Own at least one of every click upgrade",
		icon: "👑",
		isUnlocked: ownsAllClickUpgrades,
	},
	// Click milestones.
	{
		id: "clicks100",
		name: "Click Machine",
		description: "Click your mom 100 times",
		icon: "🖱️",
		isUnlocked: (state) => state.totalClicks >= 100,
	},
	{
		id: "clicks1000",
		name: "Carpal Tunnel",
		description: "Click your mom 1,000 times",
		icon: "🦴",
		isUnlocked: (state) => state.totalClicks >= 1_000,
	},
	{
		id: "clicks10000",
		name: "Click Fiend",
		description: "Click your mom 10,000 times",
		icon: "🔥",
		isUnlocked: (state) => state.totalClicks >= 10_000,
	},
	// Lifetime MAME milestones.
	{
		id: "billion",
		name: "Billionaire",
		description: "Earn 1,000,000,000 MAME in total",
		icon: "🤑",
		isUnlocked: (state) => state.totalEarned >= 1_000_000_000,
	},
	{
		id: "trillion",
		name: "Trillionaire",
		description: "Earn 1,000,000,000,000 MAME in total",
		icon: "💎",
		isUnlocked: (state) => state.totalEarned >= 1_000_000_000_000,
	},
	// Weight / fatness-stage milestones.
	{
		id: "kg10",
		name: "Well-fed",
		description: "Reach 10 kg",
		icon: "👵",
		isUnlocked: (state) => state.kg >= 10,
	},
	{
		id: "kg600",
		name: "Absolute Unit",
		description: "Reach 600 kg",
		icon: "🦛",
		isUnlocked: (state) => state.kg >= 600,
	},
	{
		id: "kg2000",
		name: "Local Legend",
		description: "Reach 2,000 kg",
		icon: "🐘",
		isUnlocked: (state) => state.kg >= 2_000,
	},
	{
		id: "kg100000",
		name: "Gravitational Pull",
		description: "Reach 100,000 kg",
		icon: "🌍",
		isUnlocked: (state) => state.kg >= 100_000,
	},
	{
		id: "kg10000000",
		name: "Maica-ta",
		description: "Reach 10,000,000 kg",
		icon: "🍔",
		isUnlocked: (state) => state.kg >= 10_000_000,
	},
	// Building milestones.
	{
		id: "gym10",
		name: "Gym Rat",
		description: "Own 10 Gym buildings",
		icon: "🏋️",
		isUnlocked: (state) => state.buildings.gym >= 10,
	},
	{
		id: "bus1",
		name: "Full Bus",
		description: "Own a bus building",
		icon: "🚌",
		isUnlocked: (state) => state.buildings.bus >= 1,
	},
	{
		id: "buildings100",
		name: "Real Estate Mogul",
		description: "Own 100 buildings in total",
		icon: "🏗️",
		isUnlocked: (state) => totalBuildings(state) >= 100,
	},
	// Click-upgrade milestones.
	{
		id: "slap10",
		name: "Slap Happy",
		description: "Own 10 Slap upgrades",
		icon: "👋",
		isUnlocked: (state) => state.upgrades.slap >= 10,
	},
	{
		id: "tiktok1",
		name: "Gone Viral",
		description: "Own a Maică-ta pe TikTok upgrade",
		icon: "🎵",
		isUnlocked: (state) => state.upgrades.tiktok >= 1,
	},
	{
		id: "upgrades50",
		name: "Upgrade Addict",
		description: "Own 50 click upgrades in total",
		icon: "🧪",
		isUnlocked: (state) => totalClickUpgrades(state) >= 50,
	},
	// Prestige milestones.
	{
		id: "moms2",
		name: "Double Trouble",
		description: "Reach 2 moms",
		icon: "👯",
		isUnlocked: (state) => state.moms >= 2,
	},
	{
		id: "moms5",
		name: "Mom Squad",
		description: "Reach 5 moms",
		icon: "🧑‍🤝‍🧑",
		isUnlocked: (state) => state.moms >= 5,
	},
	{
		id: "moms10",
		name: "Mom Army",
		description: "Reach 10 moms",
		icon: "🪖",
		isUnlocked: (state) => state.moms >= 10,
	},
	// Passive-income milestones.
	{
		id: "mps100",
		name: "Idle Hands",
		description: "Reach 100 MAME per second",
		icon: "⏰",
		isUnlocked: (state) => state.MAMEPerSec >= 100,
	},
	{
		id: "mps10000",
		name: "AFK Empire",
		description: "Reach 10,000 MAME per second",
		icon: "🏰",
		isUnlocked: (state) => state.MAMEPerSec >= 10_000,
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
