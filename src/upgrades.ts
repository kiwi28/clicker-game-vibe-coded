/**
 * Building definitions (passive Mame/sec generators).
 *
 * kg/sec is not stored per building — it is derived from `mamePerSec` via
 * `kgFromMame` in game.ts, the single source of truth for the Mame→kg rate.
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
		mamePerSec: 1,
		costMultiplier: COST_MULTIPLIER,
	},
	{
		id: "bingo",
		name: "Maică-ta la bingo",
		joke: "full house",
		icon: ICONS.bingo.svg,
		color: ICONS.bingo.color,
		baseCost: 100,
		mamePerSec: 4,
		costMultiplier: COST_MULTIPLIER,
	},
	{
		id: "market",
		name: "Maică-ta la piață",
		joke: "haggling master",
		icon: ICONS.market.svg,
		color: ICONS.market.color,
		baseCost: 1_100,
		mamePerSec: 12,
		costMultiplier: COST_MULTIPLIER,
	},
	{
		id: "tv",
		name: "Maică-ta la TV",
		joke: "reality show",
		icon: ICONS.tv.svg,
		color: ICONS.tv.color,
		baseCost: 12_000,
		mamePerSec: 40,
		costMultiplier: COST_MULTIPLIER,
	},
	{
		id: "lift",
		name: "Maică-ta în lift",
		joke: "the lift goes down",
		icon: ICONS.lift.svg,
		color: ICONS.lift.color,
		baseCost: 130_000,
		mamePerSec: 150,
		costMultiplier: COST_MULTIPLIER,
	},
	{
		id: "olx",
		name: "Maică-ta pe OLX",
		joke: "re-sold at a profit",
		icon: ICONS.olx.svg,
		color: ICONS.olx.color,
		baseCost: 1_400_000,
		mamePerSec: 600,
		costMultiplier: COST_MULTIPLIER,
	},
	{
		id: "antenna",
		name: "Maică-ta cu antena",
		joke: "full broadcast",
		icon: ICONS.antenna.svg,
		color: ICONS.antenna.color,
		baseCost: 20_000_000,
		mamePerSec: 3_000,
		costMultiplier: COST_MULTIPLIER,
	},
	{
		id: "bus",
		name: "Maică-ta în autobuz",
		joke: "takes two seats",
		icon: ICONS.bus.svg,
		color: ICONS.bus.color,
		baseCost: 330_000_000,
		mamePerSec: 12_000,
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
 * Click upgrades (one-time purchases that raise click power). Base costs follow
 * the §6.1 progression and are trivial to retune here.
 */
export const CLICK_UPGRADES: readonly ClickUpgrade[] = [
	{
		id: "slap",
		name: "Slap",
		icon: CLICK_UPGRADE_ICONS.slap.svg,
		color: CLICK_UPGRADE_ICONS.slap.color,
		effect: 1,
		baseCost: 15,
	},
	{
		id: "palmadubla",
		name: "Palmă dublă",
		icon: CLICK_UPGRADE_ICONS.palmadubla.svg,
		color: CLICK_UPGRADE_ICONS.palmadubla.color,
		effect: 2,
		baseCost: 100,
	},
	{
		id: "papuc",
		name: "Papuc",
		icon: CLICK_UPGRADE_ICONS.papuc.svg,
		color: CLICK_UPGRADE_ICONS.papuc.color,
		effect: 8,
		baseCost: 1_100,
	},
	{
		id: "roastlegend",
		name: "Roast Legend",
		icon: CLICK_UPGRADE_ICONS.roastlegend.svg,
		color: CLICK_UPGRADE_ICONS.roastlegend.color,
		effect: 25,
		baseCost: 12_000,
	},
	{
		id: "apelvideo",
		name: "Apel video cu maică-ta",
		icon: CLICK_UPGRADE_ICONS.apelvideo.svg,
		color: CLICK_UPGRADE_ICONS.apelvideo.color,
		effect: 100,
		baseCost: 130_000,
	},
];

/** Returns the click upgrade with `id`, throwing if it does not exist. */
export function getClickUpgrade(id: ClickUpgradeId): ClickUpgrade {
	const upgrade = CLICK_UPGRADES.find((candidate) => candidate.id === id);
	if (upgrade === undefined) throw new Error(`Unknown click upgrade: ${id}`);
	return upgrade;
}
