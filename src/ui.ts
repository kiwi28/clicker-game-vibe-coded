/** DOM rendering and updates: HUD, building list, floating text, tabs. */

import { bonusMultiplier, getStage, scaleFactor } from "./fatness";
import { formatNumber } from "./format";
import { buyBuilding, buyMaxBuilding, nextCost } from "./game";
import { BUILDINGS } from "./upgrades";
import type { BuildingId, GameState } from "./types";

const ROASTS: readonly string[] = [
	"maică-ta",
	"da' ce zici mă",
	"câte kg?",
	"stai că sunt pe maică-ta",
	"ma sugi de PL",
	"CINE ?!",
];

const SPAWN_PADDING = 100;
const SPAWN_PADDING_BOTTOM = 200;
const MIN_GAP = 160;

export interface Elements {
	mame: HTMLElement;
	mps: HTMLElement;
	kg: HTMLElement;
	mom: HTMLButtonElement;
	momEmoji: HTMLElement;
	momStack: HTMLElement;
	stageLabel: HTMLElement;
	stageBonus: HTMLElement;
	clickZone: HTMLElement;
	buildingList: HTMLElement;
	buildingsTotal: HTMLElement;
}

interface BuildingView {
	buy: HTMLButtonElement;
	buyMax: HTMLButtonElement;
	owned: HTMLElement;
	cost: HTMLElement;
}

export interface FloatPoint {
	left: number;
	top: number;
}

const buildingViews = new Map<BuildingId, BuildingView>();

function byId(id: string): HTMLElement {
	const element = document.getElementById(id);
	if (element === null) throw new Error(`Missing element #${id}`);
	return element;
}

function queryElements(): Elements {
	return {
		mame: byId("mame-value"),
		mps: byId("mps-value"),
		kg: byId("kg-value"),
		mom: byId("mom") as HTMLButtonElement,
		momEmoji: byId("mom-emoji"),
		momStack: byId("mom-stack"),
		stageLabel: byId("stage-label"),
		stageBonus: byId("stage-bonus"),
		clickZone: byId("click-zone"),
		buildingList: byId("building-list"),
		buildingsTotal: byId("buildings-total"),
	};
}

/** Builds static DOM (building rows, tabs) and returns the element refs. */
export function init(state: GameState): Elements {
	const els = queryElements();
	buildBuildingList(els, state);
	setupTabs();
	setupPanel();
	return els;
}

export function render(els: Elements, state: GameState): void {
	renderHud(els, state);
	renderMoms(els, state);
	renderBuildings(state);
	renderBuildingsTotal(els, state);
}

function renderHud(els: Elements, state: GameState): void {
	const stage = getStage(state.kg);
	const bonus = bonusMultiplier(stage.stage);

	els.mame.textContent = formatNumber(state.mame);
	els.mps.textContent = formatNumber(state.mamePerSec);
	els.kg.textContent = state.kg.toString();

	els.momEmoji.textContent = stage.emoji;
	els.momStack.style.setProperty(
		"--mom-scale",
		scaleFactor(state.kg).toString(),
	);
	els.stageLabel.textContent = stage.title;
	els.stageBonus.textContent = `+${Math.round((bonus - 1) * 100)}% MAME / click`;
}

/**
 * Renders one mom icon per prestige. The primary icon (index 0) is the
 * clickable button; each additional icon overlaps it, offset +50% in x and y
 * for every step, forming a diagonal stack that scales to any `state.moms`.
 */
function renderMoms(els: Elements, state: GameState): void {
	const extras = Array.from(
		els.momStack.querySelectorAll<HTMLElement>(".mom__emoji--extra"),
	);

	// Drop extras beyond the current mom count.
	while (extras.length > state.moms - 1) {
		const extra = extras.pop();
		if (extra !== undefined) extra.remove();
	}

	// Add any missing extras, keeping `--mom-index` 1-based.
	while (extras.length < state.moms - 1) {
		const index = extras.length + 1;
		const extra = document.createElement("span");
		extra.className = "mom__emoji mom__emoji--extra";
		extra.style.setProperty("--mom-index", index.toString());
		els.momStack.appendChild(extra);
		extras.push(extra);
	}

	// Mirror the current stage's emoji on every extra icon.
	for (const extra of extras) {
		extra.textContent = els.momEmoji.textContent;
	}
}

function renderBuildings(state: GameState): void {
	for (const building of BUILDINGS) {
		const view = buildingViews.get(building.id);
		if (view === undefined) continue;
		const owned = state.buildings[building.id] ?? 0;
		const cost = nextCost(building.id, state);
		view.owned.textContent = `×${owned}`;
		view.cost.textContent = `${formatNumber(cost)} Mame`;
		view.buy.disabled = state.mame < cost;
		view.buyMax.disabled = state.mame < cost;
	}
}

function renderBuildingsTotal(els: Elements, state: GameState): void {
	const items: HTMLElement[] = [];
	for (const building of BUILDINGS) {
		const owned = state.buildings[building.id] ?? 0;
		if (owned <= 0) continue;

		const item = document.createElement("span");
		item.className = "buildings-total__item";

		const icon = document.createElement("span");
		icon.className = "buildings-total__icon";
		icon.innerHTML = building.icon;
		icon.style.color = building.color;

		const count = document.createElement("span");
		count.className = "buildings-total__count";
		count.textContent = `×${owned}`;

		item.append(icon, count);
		items.push(item);
	}
	els.buildingsTotal.replaceChildren(...items);
	els.buildingsTotal.hidden = items.length === 0;
}

function buildBuildingList(els: Elements, state: GameState): void {
	for (const building of BUILDINGS) {
		const row = document.createElement("div");
		row.className = "building";

		const top = document.createElement("span");
		top.className = "building__row";

		const title = document.createElement("span");
		title.className = "building__title";

		const icon = document.createElement("span");
		icon.className = "building__icon";
		icon.innerHTML = building.icon;
		icon.style.color = building.color;

		const name = document.createElement("span");
		name.className = "building__name";
		name.textContent = building.name;

		title.append(icon, name);

		const owned = document.createElement("span");
		owned.className = "building__owned";

		top.append(title, owned);

		const joke = document.createElement("span");
		joke.className = "building__joke";
		joke.textContent = building.joke;

		const bottom = document.createElement("span");
		bottom.className = "building__row";

		const rate = document.createElement("span");
		rate.className = "building__rate";
		rate.textContent = `+${formatNumber(building.mamePerSec)}/sec`;

		const cost = document.createElement("span");
		cost.className = "building__cost";

		bottom.append(rate, cost);

		const actions = document.createElement("span");
		actions.className = "building__actions";

		const buy = document.createElement("button");
		buy.type = "button";
		buy.className = "building__buy";
		buy.textContent = "Buy";
		buy.disabled = true;
		buy.addEventListener("click", () => {
			buyBuilding(building.id, state);
			render(els, state);
		});

		const buyMax = document.createElement("button");
		buyMax.type = "button";
		buyMax.className = "building__buymax";
		buyMax.textContent = "Buy Max";
		buyMax.disabled = true;
		buyMax.addEventListener("click", () => {
			buyMaxBuilding(building.id, state);
			render(els, state);
		});

		actions.append(buy, buyMax);
		row.append(top, joke, bottom, actions);

		els.buildingList.appendChild(row);
		buildingViews.set(building.id, { buy, buyMax, owned, cost });
	}
}

function setupTabs(): void {
	const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>(".tab"));
	const panels = Array.from(
		document.querySelectorAll<HTMLElement>(".tab-panel"),
	);
	for (const tab of tabs) {
		tab.addEventListener("click", () => {
			const target = tab.dataset.tab;
			if (target === undefined) return;
			for (const candidate of tabs)
				candidate.classList.toggle("is-active", candidate === tab);
			for (const panel of panels)
				panel.classList.toggle("is-active", panel.dataset.panel === target);
		});
	}
}

/** Collapses/expands the buildings & upgrades panel (mobile accordion). */
function setupPanel(): void {
	const panel = byId("panel");
	const toggle = byId("panel-toggle") as HTMLButtonElement;
	toggle.addEventListener("click", () => {
		const collapsed = panel.classList.toggle("is-collapsed");
		toggle.setAttribute("aria-expanded", String(!collapsed));
	});
}

export function pickPosition(
	parent: HTMLElement,
	avoid: FloatPoint | null,
): FloatPoint {
	const width = parent.clientWidth;
	const height = parent.clientHeight;
	const minX = SPAWN_PADDING;
	const maxX = Math.max(width - SPAWN_PADDING, minX);
	const minY = SPAWN_PADDING;
	const maxY = Math.max(height - SPAWN_PADDING_BOTTOM, minY);

	let point: FloatPoint = { left: minX, top: minY };
	for (let attempt = 0; attempt < 12; attempt += 1) {
		point = {
			left: minX + Math.random() * (maxX - minX),
			top: minY + Math.random() * (maxY - minY),
		};
		if (
			avoid === null ||
			Math.hypot(point.left - avoid.left, point.top - avoid.top) >= MIN_GAP
		) {
			break;
		}
	}
	return point;
}

function spawnFloat(
	parent: HTMLElement,
	text: string,
	kind: "roast" | "gain",
	at: FloatPoint,
): void {
	const element = document.createElement("span");
	element.className =
		kind === "roast" ? "float float--roast" : "float float--gain";
	element.textContent = text;
	element.style.left = `${at.left.toString()}px`;
	element.style.top = `${at.top.toString()}px`;
	parent.appendChild(element);
	element.addEventListener("animationend", () => element.remove());
}

export function spawnRoast(parent: HTMLElement, at: FloatPoint): void {
	const text = ROASTS[Math.floor(Math.random() * ROASTS.length)] ?? "maică-ta";
	spawnFloat(parent, text, "roast", at);
}

export function spawnGain(
	parent: HTMLElement,
	gain: number,
	at: FloatPoint,
): void {
	spawnFloat(parent, `+${formatGain(gain)} Mame`, "gain", at);
}

function formatGain(value: number): string {
	const rounded = Math.round(value * 10) / 10;
	return Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(1);
}

/** Wires the header menu (open/close) and the reset confirmation modal. */
export function setupMenu(onReset: () => void): void {
	const button = byId("menu-button");
	const menu = byId("menu");
	const resetItem = byId("reset-game");
	const modal = byId("reset-modal");
	const confirmYes = byId("reset-yes");
	const confirmNo = byId("reset-no");

	const closeMenu = (): void => {
		menu.hidden = true;
		button.setAttribute("aria-expanded", "false");
		button.classList.remove("is-open");
	};

	const openMenu = (): void => {
		menu.hidden = false;
		button.setAttribute("aria-expanded", "true");
		button.classList.add("is-open");
	};

	const closeModal = (): void => {
		modal.hidden = true;
	};

	const openModal = (): void => {
		modal.hidden = false;
		confirmNo.focus();
	};

	button.addEventListener("click", () => {
		if (menu.hidden) openMenu();
		else closeMenu();
	});

	resetItem.addEventListener("click", () => {
		closeMenu();
		openModal();
	});

	confirmYes.addEventListener("click", () => {
		onReset();
		closeModal();
	});

	confirmNo.addEventListener("click", () => {
		closeModal();
	});

	modal.addEventListener("click", (event) => {
		if (event.target === modal) closeModal();
	});

	document.addEventListener("click", (event) => {
		const target = event.target;
		if (
			target instanceof Node &&
			!button.contains(target) &&
			!menu.contains(target)
		) {
			closeMenu();
		}
	});

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape") {
			if (!modal.hidden) closeModal();
			else closeMenu();
		}
	});
}
