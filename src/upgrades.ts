/**
 * Building definitions (passive MAME/sec generators).
 *
 * kg/sec is not stored per building — it is derived from `MAMEPerSec` via
 * `kgFromMAME` in game.ts, the single source of truth for the MAME→kg rate.
 *
 * Click upgrades (M3) will be added alongside these later. Building base costs
 * are not specified in GAME_DESIGN.md, so they follow the click-upgrade
 * progression (§6.1) and are trivial to retune here.
 */

import { CLICK_UPGRADE_ICONS, ICONS } from "./icons";
import type {
	Building,
	BuildingId,
	ClickUpgrade,
	ClickUpgradeId,
} from "./types";

const COST_MULTIPLIER = 1.15;

export const BUILDINGS: readonly Building[] = [
	{
		id: "gym",
		name: "Maică-ta la sală",
		joke: "she's working out",
		icon: ICONS.gym.svg,
		color: ICONS.gym.color,
		baseCost: 15,
		MAMEPerSec: 1,
		costMultiplier: COST_MULTIPLIER,
	},
	{
		id: "bingo",
		name: "Maică-ta la bingo",
		joke: "full house",
		icon: ICONS.bingo.svg,
		color: ICONS.bingo.color,
		baseCost: 100,
		MAMEPerSec: 4,
		costMultiplier: COST_MULTIPLIER,
	},
	{
		id: "market",
		name: "Maică-ta la piață",
		joke: "haggling master",
		icon: ICONS.market.svg,
		color: ICONS.market.color,
		baseCost: 1_100,
		MAMEPerSec: 12,
		costMultiplier: COST_MULTIPLIER,
	},
	{
		id: "tv",
		name: "Maică-ta la TV",
		joke: "reality show",
		icon: ICONS.tv.svg,
		color: ICONS.tv.color,
		baseCost: 12_000,
		MAMEPerSec: 40,
		costMultiplier: COST_MULTIPLIER,
	},
	{
		id: "lift",
		name: "Maică-ta în lift",
		joke: "the lift goes down",
		icon: ICONS.lift.svg,
		color: ICONS.lift.color,
		baseCost: 130_000,
		MAMEPerSec: 150,
		costMultiplier: COST_MULTIPLIER,
	},
	{
		id: "olx",
		name: "Maică-ta pe OLX",
		joke: "re-sold at a profit",
		icon: ICONS.olx.svg,
		color: ICONS.olx.color,
		baseCost: 1_400_000,
		MAMEPerSec: 600,
		costMultiplier: COST_MULTIPLIER,
	},
	{
		id: "antenna",
		name: "Maică-ta cu antena",
		joke: "full broadcast",
		icon: ICONS.antenna.svg,
		color: ICONS.antenna.color,
		baseCost: 20_000_000,
		MAMEPerSec: 3_000,
		costMultiplier: COST_MULTIPLIER,
	},
	{
		id: "bus",
		name: "Maică-ta în autobuz",
		joke: "takes two seats",
		icon: ICONS.bus.svg,
		color: ICONS.bus.color,
		baseCost: 330_000_000,
		MAMEPerSec: 12_000,
		costMultiplier: COST_MULTIPLIER,
	},
];

/** Returns the building with `id`, throwing if it does not exist. */
export function getBuilding(id: BuildingId): Building {
	const building = BUILDINGS.find((candidate) => candidate.id === id);
	if (building === undefined) throw new Error(`Unknown building: ${id}`);
	return building;
}

/** Cost of the next purchase: `baseCost × costMultiplier^owned`. */
export function buildingCost(building: Building, owned: number): number {
	return Math.floor(building.baseCost * building.costMultiplier ** owned);
}

/**
 * Click upgrades (repeatable purchases that raise click power per unit owned).
 * They work exactly like buildings — cost scales ×1.15 per purchase — but their
 * `effect` is added to click power instead of passive MAME/sec. Base costs
 * follow the §6.1 progression and are trivial to retune here.
 */
export const CLICK_UPGRADES: readonly ClickUpgrade[] = [
	{
		id: "slap",
		name: "Slap",
		icon: CLICK_UPGRADE_ICONS.slap.svg,
		color: CLICK_UPGRADE_ICONS.slap.color,
		effect: 1,
		baseCost: 15,
		costMultiplier: COST_MULTIPLIER,
	},
	{
		id: "palmadubla",
		name: "Palmă dublă",
		icon: CLICK_UPGRADE_ICONS.palmadubla.svg,
		color: CLICK_UPGRADE_ICONS.palmadubla.color,
		effect: 2,
		baseCost: 100,
		costMultiplier: COST_MULTIPLIER,
	},
	{
		id: "papuc",
		name: "Papuc",
		icon: CLICK_UPGRADE_ICONS.papuc.svg,
		color: CLICK_UPGRADE_ICONS.papuc.color,
		effect: 8,
		baseCost: 1_100,
		costMultiplier: COST_MULTIPLIER,
	},
	{
		id: "roastlegend",
		name: "Roast Legend",
		icon: CLICK_UPGRADE_ICONS.roastlegend.svg,
		color: CLICK_UPGRADE_ICONS.roastlegend.color,
		effect: 25,
		baseCost: 12_000,
		costMultiplier: COST_MULTIPLIER,
	},
	{
		id: "apelvideo",
		name: "Apel video cu maică-ta",
		icon: CLICK_UPGRADE_ICONS.apelvideo.svg,
		color: CLICK_UPGRADE_ICONS.apelvideo.color,
		effect: 100,
		baseCost: 130_000,
		costMultiplier: COST_MULTIPLIER,
	},
	{
		id: "curea",
		name: "Cureaua",
		icon: CLICK_UPGRADE_ICONS.curea.svg,
		color: CLICK_UPGRADE_ICONS.curea.color,
		effect: 400,
		baseCost: 1_400_000,
		costMultiplier: COST_MULTIPLIER,
	},
	{
		id: "barfa",
		name: "Bârfă la poartă",
		icon: CLICK_UPGRADE_ICONS.barfa.svg,
		color: CLICK_UPGRADE_ICONS.barfa.color,
		effect: 1_600,
		baseCost: 20_000_000,
		costMultiplier: COST_MULTIPLIER,
	},
	{
		id: "scandal",
		name: "Scandal la scară",
		icon: CLICK_UPGRADE_ICONS.scandal.svg,
		color: CLICK_UPGRADE_ICONS.scandal.color,
		effect: 6_500,
		baseCost: 330_000_000,
		costMultiplier: COST_MULTIPLIER,
	},
	{
		id: "tiktok",
		name: "Maică-ta pe TikTok",
		icon: CLICK_UPGRADE_ICONS.tiktok.svg,
		color: CLICK_UPGRADE_ICONS.tiktok.color,
		effect: 26_000,
		baseCost: 5_000_000_000,
		costMultiplier: COST_MULTIPLIER,
	},
	{
		id: "apel3",
		name: "Apel de la 3 noaptea",
		icon: CLICK_UPGRADE_ICONS.apel3.svg,
		color: CLICK_UPGRADE_ICONS.apel3.color,
		effect: 100_000,
		baseCost: 90_000_000_000,
		costMultiplier: COST_MULTIPLIER,
	},
];

/** Returns the click upgrade with `id`, throwing if it does not exist. */
export function getClickUpgrade(id: ClickUpgradeId): ClickUpgrade {
	const upgrade = CLICK_UPGRADES.find((candidate) => candidate.id === id);
	if (upgrade === undefined) throw new Error(`Unknown click upgrade: ${id}`);
	return upgrade;
}

/** Cost of the next purchase: `baseCost × costMultiplier^owned`. */
export function clickUpgradeCost(upgrade: ClickUpgrade, owned: number): number {
	return Math.floor(upgrade.baseCost * upgrade.costMultiplier ** owned);
}
