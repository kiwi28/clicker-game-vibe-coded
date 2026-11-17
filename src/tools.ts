/**
 * Tools panel definitions and the min/max math behind them. Tools are
 * one-time quality-of-life purchases that live in the Tools tab. The
 * "Min/Max helper" highlights the click upgrade that gives the most power
 * per MAME; "Auto buy" buys that same upgrade automatically on the same
 * once-per-second cadence. Both only reason about active (click) income.
 */

import { CLICK_UPGRADES, clickUpgradeCost, getClickUpgrade } from "./upgrades";
import type { ClickUpgradeId, GameState, ToolId } from "./types";

export interface Tool {
	id: ToolId;
	name: string;
	description: string;
	icon: readonly string[];
	cost: number;
	/**
	 * Fatness stage the player must reach before this tool can be bought.
	 * 1-indexed, matching the "Fatness Stage N/12" HUD label.
	 */
	stageLock: number;
	/** Tool that must already be owned before this one unlocks (null = none). */
	requires: ToolId | null;
}

export const TOOLS: readonly Tool[] = [
	{
		id: "minmax",
		name: "Min/Max helper",
		description:
			"Highlights the click upgrade with the best value (most power per MAME).",
		icon: ["🧮"],
		cost: 25_000_000,
		stageLock: 10,
		requires: null,
	},
	{
		id: "autobuy",
		name: "Auto buy",
		description: "Auto-buys the best-value click upgrade every second.",
		icon: ["🛒", "🤖"],
		cost: 100_000_000,
		stageLock: 10,
		requires: "minmax",
	},
];

/** Returns the tool with `id`, throwing if it does not exist. */
export function getTool(id: ToolId): Tool {
	const tool = TOOLS.find((candidate) => candidate.id === id);
	if (tool === undefined) throw new Error(`Unknown tool: ${id}`);
	return tool;
}

/**
 * The click upgrade with the best value (most click power gained per MAME
 * spent) among those affordable right now. Returns null when nothing is
 * affordable. Drives the "Buy now" highlight and Auto buy.
 */
export function bestAffordableClickUpgrade(
	state: GameState,
): ClickUpgradeId | null {
	return pickBestClickUpgrade(state, true);
}

/**
 * The click upgrade with the best value (`effect / cost`) across *all*
 * upgrades, ignoring whether it is currently affordable. Pure bang-for-buck;
 * drives the "Save for" indicator.
 */
export function bestValueClickUpgrade(state: GameState): ClickUpgradeId | null {
	return pickBestClickUpgrade(state, false);
}

/**
 * The upgrade worth saving for: the best-value upgrade when it is out of
 * reach right now, otherwise null (the best item is already affordable, so
 * it is simply the "Buy now" pick).
 */
export function saveForClickUpgrade(state: GameState): ClickUpgradeId | null {
	const best = bestValueClickUpgrade(state);
	if (best === null) return null;
	const upgrade = getClickUpgrade(best);
	const cost = clickUpgradeCost(upgrade, state.upgrades[best] ?? 0);
	return state.MAME < cost ? best : null;
}

/** Shared scan: highest `effect / nextCost`, optionally limited to affordable. */
function pickBestClickUpgrade(
	state: GameState,
	affordableOnly: boolean,
): ClickUpgradeId | null {
	let best: ClickUpgradeId | null = null;
	let bestValue = 0;
	for (const upgrade of CLICK_UPGRADES) {
		const cost = clickUpgradeCost(upgrade, state.upgrades[upgrade.id] ?? 0);
		if (affordableOnly && state.MAME < cost) continue;
		const value = upgrade.effect / cost;
		if (value > bestValue) {
			bestValue = value;
			best = upgrade.id;
		}
	}
	return best;
}

/** Why `tool` cannot be bought yet, or null when it is unlocked. */
export function toolLockReason(
	tool: Tool,
	state: GameState,
	stage: number,
): string | null {
	if (state.tools[tool.id]) return null;
	if (tool.requires !== null && !state.tools[tool.requires]) {
		return `Requires ${getTool(tool.requires).name}`;
	}
	if (stage + 1 < tool.stageLock) return `Unlocks at stage ${tool.stageLock}`;
	return null;
}

/** True when `tool` can currently be bought with the given state and stage. */
export function canBuyTool(tool: Tool, state: GameState, stage: number): boolean {
	return (
		!state.tools[tool.id] &&
		toolLockReason(tool, state, stage) === null &&
		state.MAME >= tool.cost
	);
}

/** Buys `tool` if unlocked and affordable. Returns true when purchased. */
export function buyTool(id: ToolId, state: GameState, stage: number): boolean {
	const tool = getTool(id);
	if (!canBuyTool(tool, state, stage)) return false;
	state.MAME -= tool.cost;
	state.tools[id] = true;
	if (id === "autobuy") state.autobuyEnabled = true;
	return true;
}
