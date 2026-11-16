/** DOM rendering and updates: HUD, building list, floating text, tabs. */

import { ACHIEVEMENTS } from "./achievements";
import { bonusMultiplier, getStage, scaleFactor } from "./fatness";
import { formatMame, formatNumber } from "./format";
import {
	buyBuilding,
	buyClickUpgrade,
	buyMaxBuilding,
	kgFromMame,
	maxAffordable,
	nextCost,
} from "./game";
import { applyClickZonePattern } from "./pattern";
import {
	isDevEnabled,
	isLoaderDisabled,
	setDevEnabled,
	setLoaderDisabled,
} from "./storage";
import { BUILDINGS, CLICK_UPGRADES } from "./upgrades";
import type {
	Achievement,
	AchievementId,
	BuildingId,
	ClickUpgradeId,
	GameState,
} from "./types";

const ROASTS: readonly string[] = [
	"maică-ta",
	"da' ce zici mă",
	"câte kg?",
	"stai că sunt pe maică-ta",
	"ma sugi de PL",
	"CINE ?!",
	"HEALTH, only balls!",
	"lasă-l mă să își facă hambâțul",
	"mi-l sugi ?",
];

const SPAWN_PADDING = 100;
const SPAWN_PADDING_BOTTOM = 200;
const MIN_GAP = 160;

/** Pizza-slice particle that flies into the mom's mouth. */
const PIZZA = "🍕";
/** Base font-size (px) of a slice before any building-size scaling. */
const PIZZA_BASE_PX = 28;
/** Extra slice px per 10 owned units of a building (the "1-2px per 10" rule). */
const PIZZA_PX_PER_10_UNITS = 1.5;
/** A slice never grows past this multiple of its base size. */
const PIZZA_MAX_SCALE = 3;
/** Matches `--pizza-duration` set in `spawnPizza`; cleans up reduced-motion slices. */
const PIZZA_DURATION_MS = 800;
/** Inset (px) from the click-zone edge so a slice isn't half-clipped at spawn. */
const EDGE_INSET = 24;

/** Emoji shown briefly when the fatness stage changes. */
const EXPLOSION_EMOJI = "💥";
/** How long the explosion emoji replaces the mom during a stage transition. */
const EXPLOSION_DURATION_MS = 1000;
/** `scaleFactor` caps at 2× — the mom's size at the very end of a stage. */
const EXPLOSION_SCALE = 2;

/** Stage number last rendered; used to detect stage transitions. */
let currentStage: number | null = null;
/** Timestamp (ms) until which the explosion emoji replaces the mom. */
let explosionUntil = 0;

/** True while the stage-transition explosion is still showing. */
function isExploding(): boolean {
	return performance.now() < explosionUntil;
}

export interface Elements {
	mame: HTMLElement;
	mps: HTMLElement;
	kg: HTMLElement;
	mom: HTMLButtonElement;
	momEmoji: HTMLElement;
	momStack: HTMLElement;
	momCluster: HTMLElement;
	stageLabel: HTMLElement;
	stageBonus: HTMLElement;
	clickZone: HTMLElement;
	buildingList: HTMLElement;
	buildingsTotal: HTMLElement;
	upgradeList: HTMLElement;
	achievementList: HTMLElement;
}

interface BuildingView {
	buy: HTMLButtonElement;
	buyMax: HTMLButtonElement;
	owned: HTMLElement;
	cost: HTMLElement;
	rate: HTMLElement;
}

interface UpgradeView {
	row: HTMLElement;
	buy: HTMLButtonElement;
	cost: HTMLElement;
}

interface AchievementView {
	row: HTMLElement;
	icon: HTMLElement;
}

export interface FloatPoint {
	left: number;
	top: number;
}

const buildingViews = new Map<BuildingId, BuildingView>();
const upgradeViews = new Map<ClickUpgradeId, UpgradeView>();
const achievementViews = new Map<AchievementId, AchievementView>();

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
		momCluster: byId("mom-cluster"),
		stageLabel: byId("stage-label"),
		stageBonus: byId("stage-bonus"),
		clickZone: byId("click-zone"),
		buildingList: byId("building-list"),
		buildingsTotal: byId("buildings-total"),
		upgradeList: byId("upgrade-list"),
		achievementList: byId("achievement-list"),
	};
}

/** Builds static DOM (building rows, tabs) and returns the element refs. */
export function init(state: GameState): Elements {
	const els = queryElements();
	applyClickZonePattern(els.clickZone);
	buildBuildingList(els, state);
	buildUpgradeList(els, state);
	buildAchievementList(els);
	setupTabs();
	setupPanel();
	setupMomResize(els);
	return els;
}

export function render(els: Elements, state: GameState): void {
	renderHud(els, state);
	renderMoms(els, state);
	renderBuildings(state);
	renderBuildingsTotal(els, state);
	renderUpgrades(state);
	renderAchievements(state);
}

function renderHud(els: Elements, state: GameState): void {
	const stage = getStage(state.kg);
	const bonus = bonusMultiplier(stage.stage);

	// On a stage change, show an explosion emoji for a beat before revealing
	// the new stage's emoji.
	if (currentStage !== null && stage.stage !== currentStage) {
		explosionUntil = performance.now() + EXPLOSION_DURATION_MS;
	}
	currentStage = stage.stage;

	els.mame.textContent = formatMame(state.mame);
	els.mps.textContent = formatNumber(state.mamePerSec);
	els.kg.textContent = formatKg(state.kg);

	els.momEmoji.textContent = isExploding() ? EXPLOSION_EMOJI : stage.emoji;
	els.stageLabel.textContent =
		state.moms > 1 ? `${stage.title} x${state.moms}` : stage.title;
	els.stageBonus.textContent = `+${Math.round((bonus - 1) * 100)}% MAME / click`;
}

/** Formats kg with at most 2 decimal places (e.g. 5, 0.5, 0.25, 1.13). */
function formatKg(value: number): string {
	return (Math.round(value * 100) / 100).toString();
}

/** A cluster shows at most this many moms; extra moms only bump the title counter. */
const MAX_MOM_EMOJIS = 9;

/**
 * Spacing between adjacent moms, as a fraction of one emoji. Negative values
 * overlap the (transparent) emoji boxes for a tighter cluster. The grid cell
 * size is `MOM_CELL` emoji widths, applied as pixel offsets in `refitMoms`.
 */
const MOM_GAP = -0.1;
const MOM_CELL = 1 + MOM_GAP;

/** Symmetric, centered row shapes for 1–9 moms (top row → bottom row). */
const MOM_ROWS: Readonly<Record<number, readonly number[]>> = {
	1: [1],
	2: [2],
	3: [1, 2],
	4: [2, 2],
	5: [2, 1, 2],
	6: [3, 3],
	7: [2, 3, 2],
	8: [3, 2, 3],
	9: [3, 3, 3],
};

/**
 * Centered `[x, y]` positions (in cell units, y grows downward) for `count`
 * moms. Rows are centered and stacked so the cluster reads as a symmetric
 * blob; the exact-center cell (when one exists) is moved to index 0 so the
 * clickable primary mom sits in the middle.
 */
function momLayout(count: number): Array<[number, number]> {
	const rows = MOM_ROWS[count] ?? [1];
	const positions: Array<[number, number]> = [];
	const rowCount = rows.length;
	for (let row = 0; row < rowCount; row += 1) {
		const width = rows[row] ?? 1;
		const y = row - (rowCount - 1) / 2;
		for (let col = 0; col < width; col += 1) {
			const x = col - (width - 1) / 2;
			positions.push([x, y]);
		}
	}
	const center = positions.findIndex(([x, y]) => x === 0 && y === 0);
	if (center > 0) {
		const primary = positions.splice(center, 1)[0];
		if (primary !== undefined) positions.unshift(primary);
	}
	return positions;
}

/** Inset (px) kept between the mom cluster and the edge of its area. */
const MOM_CLUSTER_INSET = 12;

/**
 * Scale that makes the whole cluster fit the moms area without clipping,
 * derived from the grid extent (in cells) and the resolved emoji size.
 */
function clusterScale(
	positions: readonly (readonly [number, number])[],
	emojiPx: number,
	width: number,
	height: number,
): number {
	if (positions.length === 0) return 1;
	let minX = Number.POSITIVE_INFINITY;
	let maxX = Number.NEGATIVE_INFINITY;
	let minY = Number.POSITIVE_INFINITY;
	let maxY = Number.NEGATIVE_INFINITY;
	for (const [x, y] of positions) {
		if (x < minX) minX = x;
		if (x > maxX) maxX = x;
		if (y < minY) minY = y;
		if (y > maxY) maxY = y;
	}
	const clusterWidthPx = ((maxX - minX) * MOM_CELL + 1) * emojiPx;
	const clusterHeightPx = ((maxY - minY) * MOM_CELL + 1) * emojiPx;
	const availableWidth = Math.max(width - MOM_CLUSTER_INSET * 2, 1);
	const availableHeight = Math.max(height - MOM_CLUSTER_INSET * 2, 1);
	return Math.min(
		1,
		availableWidth / clusterWidthPx,
		availableHeight / clusterHeightPx,
	);
}

/** How much each additional mom shrinks the cluster (linear). */
const MOM_COUNT_STEP = 0.05;
/** The cluster never shrinks below this fraction no matter how many moms. */
const MOM_COUNT_MIN = 0.5;

/** Monotonic shrink as more moms appear, so the click area never fills up. */
function momCountScale(moms: number): number {
	return Math.max(MOM_COUNT_MIN, 1 - (moms - 1) * MOM_COUNT_STEP);
}

// Cached layout so the (measurement-free) per-frame render stays cheap.
let renderedMomCount = -1;
let momPositions: Array<[number, number]> = [];
let momCellPx = 220;
let momFitScale = 1;
/** Current total cluster scale, so slices stay proportional to the moms. */
let momClusterScale = 1;

/** Measures the moms area and re-fits the cluster scale to it. */
function refitMoms(els: Elements): void {
	const rect = els.momStack.getBoundingClientRect();
	const emojiPx =
		Number.parseFloat(window.getComputedStyle(els.momEmoji).fontSize) || 220;
	momCellPx = emojiPx * MOM_CELL;
	momFitScale = clusterScale(momPositions, emojiPx, rect.width, rect.height);
}

let momResizeObserver: ResizeObserver | undefined;

/** Re-fits the cluster whenever the moms area changes size (resize/orientation). */
function setupMomResize(els: Elements): void {
	if (typeof ResizeObserver === "undefined") return;
	momResizeObserver = new ResizeObserver(() => {
		if (renderedMomCount <= 0) return;
		refitMoms(els);
	});
	momResizeObserver.observe(els.momStack);
}

/** Rebuilds the extra mom icons to match `visible` and re-positions all moms. */
function reconcileMoms(els: Elements, visible: number): void {
	const extras = Array.from(
		els.momCluster.querySelectorAll<HTMLElement>(".mom__emoji--extra"),
	);

	// Drop extras beyond the current visible count.
	while (extras.length > visible - 1) {
		const extra = extras.pop();
		if (extra !== undefined) extra.remove();
	}

	// Add any missing extras.
	while (extras.length < visible - 1) {
		const extra = document.createElement("span");
		extra.className = "mom__emoji mom__emoji--extra";
		els.momCluster.appendChild(extra);
		extras.push(extra);
	}

	// Place the primary mom and every extra at its layout cell. Concrete pixel
	// `left`/`top` (not a custom property inside calc) so positions always
	// re-resolve immediately.
	const primary = momPositions[0] ?? [0, 0];
	els.mom.style.left = `${(primary[0] * momCellPx).toString()}px`;
	els.mom.style.top = `${(primary[1] * momCellPx).toString()}px`;
	const emoji = els.momEmoji.textContent;
	for (let i = 1; i < visible; i += 1) {
		const extra = extras[i - 1];
		const [x, y] = momPositions[i] ?? [0, 0];
		if (extra === undefined) continue;
		extra.style.left = `${(x * momCellPx).toString()}px`;
		extra.style.top = `${(y * momCellPx).toString()}px`;
		extra.textContent = emoji;
	}
}

/**
 * Renders one mom icon per prestige, arranged in a centered, symmetric cluster
 * that shrinks to fit the available space. The cluster is capped at
 * `MAX_MOM_EMOJIS` icons; beyond that it stays at the cap and the title's `x N`
 * counter communicates the real count.
 */
function renderMoms(els: Elements, state: GameState): void {
	const visible = Math.min(state.moms, MAX_MOM_EMOJIS);

	if (visible !== renderedMomCount) {
		renderedMomCount = visible;
		momPositions = momLayout(visible);
		refitMoms(els);
		reconcileMoms(els, visible);
	}

	// Combined cluster scale: shrink by mom count, cap to the grid's fit, then
	// apply the per-mom fatness growth. During a stage transition the explosion
	// emoji shows at the biggest size the stage reaches (2×).
	const growth = isExploding() ? EXPLOSION_SCALE : scaleFactor(state.kg);
	momClusterScale =
		Math.min(momFitScale, momCountScale(visible)) * growth;
	els.momCluster.style.transform = `scale(${momClusterScale.toString()})`;

	// Mirror the current stage's emoji on every extra icon.
	const emoji = els.momEmoji.textContent;
	for (const extra of els.momCluster.querySelectorAll<HTMLElement>(
		".mom__emoji--extra",
	)) {
		if (extra.textContent !== emoji) extra.textContent = emoji;
	}
}

/** Triggers a quick jiggle on every mom (primary + extras). */
export function jiggleMoms(els: Elements): void {
	// Remove + force reflow + re-add so rapid clicks restart the animation.
	els.momCluster.classList.remove("is-jiggling");
	void els.momCluster.offsetWidth;
	els.momCluster.classList.add("is-jiggling");
}

/** Per-building income line: Mame/s plus the derived kg/s (mom-scaled). */
function buildingRateText(mamePerSec: number, moms: number): string {
	return `+${formatNumber(mamePerSec)} Mame/s · +${formatKg(kgFromMame(mamePerSec, moms))} kg/s`;
}

function renderBuildings(state: GameState): void {
	for (const building of BUILDINGS) {
		const view = buildingViews.get(building.id);
		if (view === undefined) continue;
		const owned = state.buildings[building.id] ?? 0;
		const cost = nextCost(building.id, state);
		view.owned.textContent = `×${owned}`;
		view.cost.textContent = `${formatNumber(cost)} Mame`;
		view.rate.textContent = buildingRateText(building.mamePerSec, state.moms);
		view.buy.disabled = state.mame < cost;
		view.buyMax.disabled = state.mame < cost;
		const affordable = maxAffordable(building.id, state);
		view.buyMax.textContent =
			affordable > 0 ? `Buy Max (${affordable})` : "Buy Max";
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
		rate.textContent = buildingRateText(building.mamePerSec, state.moms);

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
		buildingViews.set(building.id, { buy, buyMax, owned, cost, rate });
	}
}

function buildUpgradeList(els: Elements, state: GameState): void {
	for (const upgrade of CLICK_UPGRADES) {
		const row = document.createElement("div");
		row.className = "upgrade";

		const title = document.createElement("span");
		title.className = "upgrade__title";

		const icon = document.createElement("span");
		icon.className = "upgrade__icon";
		icon.innerHTML = upgrade.icon;
		icon.style.color = upgrade.color;

		const name = document.createElement("span");
		name.className = "upgrade__name";
		name.textContent = upgrade.name;

		title.append(icon, name);

		const effect = document.createElement("span");
		effect.className = "upgrade__effect";
		effect.textContent = `+${upgrade.effect} per click`;

		const bottom = document.createElement("span");
		bottom.className = "upgrade__row";

		const cost = document.createElement("span");
		cost.className = "upgrade__cost";

		const buy = document.createElement("button");
		buy.type = "button";
		buy.className = "upgrade__buy";
		buy.textContent = "Buy";
		buy.disabled = true;
		buy.addEventListener("click", () => {
			buyClickUpgrade(upgrade.id, state);
			render(els, state);
		});

		bottom.append(cost, buy);
		row.append(title, effect, bottom);
		els.upgradeList.appendChild(row);
		upgradeViews.set(upgrade.id, { row, buy, cost });
	}
}

function renderUpgrades(state: GameState): void {
	for (const upgrade of CLICK_UPGRADES) {
		const view = upgradeViews.get(upgrade.id);
		if (view === undefined) continue;
		const owned = state.upgrades[upgrade.id] ?? false;
		view.row.classList.toggle("is-owned", owned);
		if (owned) {
			view.cost.textContent = "Owned";
			view.buy.textContent = "✓";
			view.buy.disabled = true;
		} else {
			view.cost.textContent = `${formatNumber(upgrade.baseCost)} Mame`;
			view.buy.textContent = "Buy";
			view.buy.disabled = state.mame < upgrade.baseCost;
		}
	}
}

function buildAchievementList(els: Elements): void {
	for (const achievement of ACHIEVEMENTS) {
		const row = document.createElement("div");
		row.className = "achievement";

		const icon = document.createElement("span");
		icon.className = "achievement__icon";

		const text = document.createElement("div");
		text.className = "achievement__text";

		const name = document.createElement("span");
		name.className = "achievement__name";
		name.textContent = achievement.name;

		const description = document.createElement("span");
		description.className = "achievement__desc";
		description.textContent = achievement.description;

		text.append(name, description);
		row.append(icon, text);
		els.achievementList.appendChild(row);
		achievementViews.set(achievement.id, { row, icon });
	}
}

function renderAchievements(state: GameState): void {
	for (const achievement of ACHIEVEMENTS) {
		const view = achievementViews.get(achievement.id);
		if (view === undefined) continue;
		const unlocked = state.achievements.includes(achievement.id);
		view.row.classList.toggle("is-unlocked", unlocked);
		view.icon.textContent = unlocked ? achievement.icon : "🔒";
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

function randomShinyColor(): string {
	const hue = Math.floor(Math.random() * 360);
	return `hsl(${hue}, 100%, 70%)`;
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
	if (kind === "roast") {
		const color = randomShinyColor();
		element.style.color = color;
		element.style.textShadow = `0 0 8px ${color}`;
	}
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

/** Center of the mom cluster in click-zone coordinates. */
function clusterCenter(els: Elements): FloatPoint {
	const zone = els.clickZone.getBoundingClientRect();
	const rect = els.momCluster.getBoundingClientRect();
	return {
		left: rect.left - zone.left + rect.width / 2,
		top: rect.top - zone.top + rect.height / 2,
	};
}

/** A random point on the inner edge (perimeter) of `parent`. */
function pickEdge(parent: HTMLElement): FloatPoint {
	const width = parent.clientWidth;
	const height = parent.clientHeight;
	const spanX = Math.max(width - EDGE_INSET * 2, 0);
	const spanY = Math.max(height - EDGE_INSET * 2, 0);
	const t = Math.random();
	switch (Math.floor(Math.random() * 4)) {
		case 0:
			return { left: EDGE_INSET + t * spanX, top: EDGE_INSET };
		case 1:
			return { left: width - EDGE_INSET, top: EDGE_INSET + t * spanY };
		case 2:
			return { left: EDGE_INSET + t * spanX, top: height - EDGE_INSET };
		default:
			return { left: EDGE_INSET, top: EDGE_INSET + t * spanY };
	}
}

/** Slice size (px) that grows with owned units, capped at 3x the base size. */
function pizzaSizePx(units: number): number {
	const growth = Math.floor(units / 10) * PIZZA_PX_PER_10_UNITS;
	return Math.min(PIZZA_BASE_PX * PIZZA_MAX_SCALE, PIZZA_BASE_PX + growth);
}

/** Spawns a pizza slice that flies from `from` to `to` and removes itself. */
function spawnPizza(
	parent: HTMLElement,
	from: FloatPoint,
	to: FloatPoint,
	sizePx: number,
): void {
	const element = document.createElement("span");
	element.className = "pizza-slice";
	element.textContent = PIZZA;
	element.style.setProperty("--from-x", `${from.left.toString()}px`);
	element.style.setProperty("--from-y", `${from.top.toString()}px`);
	element.style.setProperty("--to-x", `${to.left.toString()}px`);
	element.style.setProperty("--to-y", `${to.top.toString()}px`);
	element.style.setProperty("--pizza-size", `${sizePx.toString()}px`);
	element.style.setProperty(
		"--pizza-duration",
		`${PIZZA_DURATION_MS.toString()}ms`,
	);
	parent.appendChild(element);
	element.addEventListener("animationend", () => element.remove());
	// Fallback for prefers-reduced-motion, where the animation never runs.
	window.setTimeout(() => element.remove(), PIZZA_DURATION_MS + 100);
}

/** One click-worth slice flying from the screen edge into the mom cluster. */
export function spawnPizzaToMom(els: Elements, units: number): void {
	spawnPizza(
		els.clickZone,
		pickEdge(els.clickZone),
		clusterCenter(els),
		pizzaSizePx(units) * momClusterScale,
	);
}

/**
 * One slice per owned building type, sized by how many of that building are
 * owned. Used for passive income so every MAME source feeds the mom a slice.
 */
export function spawnBuildingSlices(els: Elements, state: GameState): void {
	const mouth = clusterCenter(els);
	for (const building of BUILDINGS) {
		const owned = state.buildings[building.id] ?? 0;
		if (owned <= 0) continue;
		spawnPizza(
			els.clickZone,
			pickEdge(els.clickZone),
			mouth,
			pizzaSizePx(owned) * momClusterScale,
		);
	}
}

/** The subset of `GameState` the dev panel edits (mame/sec is recomputed). */
export interface DevState {
	mame: number;
	kg: number;
	moms: number;
	buildings: Record<BuildingId, number>;
}

type DevFieldKey = "mame" | "kg" | "moms" | BuildingId;

interface DevField {
	key: DevFieldKey;
	input: HTMLInputElement;
}

function buildDevFields(container: HTMLElement): DevField[] {
	const fields: DevField[] = [];

	const add = (key: DevFieldKey, label: string): void => {
		const row = document.createElement("label");
		row.className = "dev-field";

		const text = document.createElement("span");
		text.className = "dev-field__label";
		text.textContent = label;

		const input = document.createElement("input");
		input.className = "dev-field__input";
		input.type = "number";
		input.inputMode = "decimal";

		row.append(text, input);
		container.appendChild(row);
		fields.push({ key, input });
	};

	add("mame", "Mame");
	add("kg", "kg");
	add("moms", "Moms");
	for (const building of BUILDINGS) {
		add(building.id, building.name);
	}
	return fields;
}

function fillDevFields(fields: readonly DevField[], state: DevState): void {
	for (const field of fields) {
		if (field.key === "mame") field.input.value = state.mame.toString();
		else if (field.key === "kg") field.input.value = state.kg.toString();
		else if (field.key === "moms") field.input.value = state.moms.toString();
		else field.input.value = (state.buildings[field.key] ?? 0).toString();
	}
}

function readDevFields(fields: readonly DevField[]): DevState {
	let mame = 0;
	let kg = 0;
	let moms = 1;
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

	for (const field of fields) {
		const raw = Number(field.input.value);
		const value = Number.isFinite(raw) ? raw : 0;
		if (field.key === "mame") mame = value;
		else if (field.key === "kg") kg = value;
		else if (field.key === "moms") moms = Math.max(1, Math.floor(value));
		else buildings[field.key] = Math.max(0, Math.floor(value));
	}

	return { mame, kg, moms, buildings };
}

/**
 * Builds the dev panel and returns a function that opens it (populating the
 * fields from the current state).
 */
export function setupDevMenu(handlers: {
	read: () => DevState;
	apply: (next: DevState) => void;
}): () => void {
	const modal = byId("dev-modal");
	const fieldsContainer = byId("dev-fields");
	const applyButton = byId("dev-apply") as HTMLButtonElement;
	const closeButton = byId("dev-close");
	const disableLoaderCheckbox = byId("dev-disable-loader") as HTMLInputElement;

	const fields = buildDevFields(fieldsContainer);

	const closeModal = (): void => {
		modal.hidden = true;
	};

	const openModal = (): void => {
		fillDevFields(fields, handlers.read());
		disableLoaderCheckbox.checked = isLoaderDisabled();
		modal.hidden = false;
		fields[0]?.input.focus();
	};

	applyButton.addEventListener("click", () => {
		handlers.apply(readDevFields(fields));
		setLoaderDisabled(disableLoaderCheckbox.checked);
		closeModal();
	});

	closeButton.addEventListener("click", closeModal);

	modal.addEventListener("click", (event) => {
		if (event.target === modal) closeModal();
	});

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape" && !modal.hidden) closeModal();
	});

	return openModal;
}

/** Wires the header menu (open/close) and the reset confirmation modal. */
export function setupMenu(onReset: () => void, onOpenDev: () => void): void {
	const button = byId("menu-button");
	const menu = byId("menu");
	const resetItem = byId("reset-game");
	const devItem = byId("dev-menu");
	const devToggle = byId("dev-menu-toggle") as HTMLInputElement;
	const modal = byId("reset-modal");
	const confirmYes = byId("reset-yes");
	const confirmNo = byId("reset-no");

	const syncDevMenu = (): void => {
		const enabled = isDevEnabled();
		devToggle.checked = enabled;
		devItem.hidden = !enabled;
	};

	const closeMenu = (): void => {
		menu.hidden = true;
		button.setAttribute("aria-expanded", "false");
		button.classList.remove("is-open");
	};

	const openMenu = (): void => {
		menu.hidden = false;
		syncDevMenu();
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

	devItem.addEventListener("click", () => {
		closeMenu();
		onOpenDev();
	});

	devToggle.addEventListener("change", () => {
		setDevEnabled(devToggle.checked);
		devItem.hidden = !devToggle.checked;
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

export function showAchievement(achievement: Achievement): void {
	const container = getToastContainer();
	const toast = document.createElement("div");
	toast.className = "achievement-toast";

	const icon = document.createElement("span");
	icon.className = "achievement-toast__icon";
	icon.textContent = achievement.icon;

	const label = document.createElement("div");
	label.className = "achievement-toast__label";

	const title = document.createElement("span");
	title.className = "achievement-toast__title";
	title.textContent = "Achievement unlocked";

	const name = document.createElement("span");
	name.className = "achievement-toast__name";
	name.textContent = achievement.name;

	label.append(title, name);
	toast.append(icon, label);
	container.appendChild(toast);
	window.setTimeout(() => toast.remove(), 3500);
}

function getToastContainer(): HTMLElement {
	const existing = document.getElementById("achievement-toasts");
	if (existing !== null) return existing;
	const container = document.createElement("div");
	container.id = "achievement-toasts";
	container.className = "achievement-toasts";
	document.body.appendChild(container);
	return container;
}
