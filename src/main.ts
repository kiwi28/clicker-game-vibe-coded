import "./style.css";
import { checkAchievements, getAchievement } from "./achievements";
import { isLastStageComplete } from "./fatness";
import { clickMom, createInitialState, passivePerSecond, prestige, resetState, tick } from "./game";
import {
	clearSave,
	isLoaderDisabled,
	loadGameState,
	saveGameState,
} from "./storage";
import * as ui from "./ui";

const TICK_MS = 100;
const MAX_FRAME_DELTA_MS = 1000;
const SAVE_INTERVAL_MS = 1000;
/** How often passive income feeds a pizza slice per owned building type. */
const BUILDING_SLICE_MS = 500;

// --- Loading screen ------------------------------------------------------
// A themed boot screen covers the page while the game "compiles shaders".
// It stays up for a random 4–7s (minimum 2s), animating a progress bar, and
// hides the raw-HTML flash on refresh.
const loaderEl = document.getElementById("loader");
const loaderBar = document.getElementById("loader-bar");
const loaderFill = document.getElementById("loader-fill");
const loaderPercent = document.getElementById("loader-percent");

const LOAD_MIN_MS = 2000;
const LOAD_RANDOM_MIN_MS = 4000;
const LOAD_RANDOM_MAX_MS = 7000;
const loadDurationMs = Math.max(
	LOAD_MIN_MS,
	LOAD_RANDOM_MIN_MS + Math.random() * (LOAD_RANDOM_MAX_MS - LOAD_RANDOM_MIN_MS),
);

function runLoader(): void {
	if (!loaderEl || !loaderFill || !loaderPercent) return;

	const el = loaderEl;
	const fill = loaderFill;
	const percentEl = loaderPercent;
	const start = performance.now();

	function step(now: number): void {
		const progress = Math.min(1, (now - start) / loadDurationMs);
		const percent = Math.round(progress * 100);

		fill.style.width = `${percent}%`;
		percentEl.textContent = `${percent}%`;
		if (loaderBar) {
			loaderBar.setAttribute("aria-valuenow", String(percent));
			loaderBar.setAttribute("aria-valuetext", `${percent}%`);
		}

		if (progress < 1) {
			requestAnimationFrame(step);
			return;
		}

		el.classList.add("is-done");
		window.setTimeout(() => el.remove(), 450);
	}

	requestAnimationFrame(step);
}

// Load any saved game before the boot screen runs, so the first painted frame
// behind the loader already shows the saved state (no default-value flash).
const state = loadGameState() ?? createInitialState();
// Recompute passive income from owned buildings so a loaded save matches the
// building definitions (defends against stale or hand-edited saves).
state.mamePerSec = passivePerSecond(state);
const els = ui.init(state);
ui.render(els, state);

if (isLoaderDisabled()) {
	loaderEl?.remove();
} else {
	runLoader();
}

function resetGame(): void {
	clearSave();
	resetState(state);
	ui.render(els, state);
}

/**
 * Watches the game and, when `kg` reaches the end of the final stage, performs
 * a prestige: an extra mom spawns and all progress resets (slower each cycle).
 */
function monitorPrestige(): void {
	if (isLastStageComplete(state.kg)) {
		prestige(state);
	}
}

/** Unlocks any newly-met achievements and pops a toast for each. */
function checkAndShowAchievements(): void {
	const newly = checkAchievements(state);
	for (const id of newly) {
		ui.showAchievement(getAchievement(id));
	}
}

const openDevModal = ui.setupDevMenu({
	read: () => ({
		mame: state.mame,
		kg: state.kg,
		moms: state.moms,
		buildings: state.buildings,
	}),
	apply: (next) => {
		state.mame = next.mame;
		state.kg = next.kg;
		state.moms = next.moms;
		state.buildings = next.buildings;
		state.mamePerSec = passivePerSecond(state);
		saveGameState(state);
		ui.render(els, state);
	},
});

ui.setupMenu(resetGame, openDevModal);

let clickCount = 0;

els.momCluster.addEventListener("click", () => {
	clickCount += 1;
	const gain = clickMom(state);
	monitorPrestige();

	ui.spawnPizzaToMom(els, 0);
	ui.jiggleMoms(els);

	const gainPosition = ui.pickPosition(els.clickZone, null);
	if (clickCount % 3 === 0) {
		ui.spawnRoast(els.clickZone, ui.pickPosition(els.clickZone, gainPosition));
	}
	ui.spawnGain(els.clickZone, gain, gainPosition);
	ui.render(els, state);
});

let last = performance.now();
let accumulator = 0;
let lastSave = last;
let buildingSliceAccumulator = 0;

function frame(now: number): void {
	const delta = Math.max(0, Math.min(now - last, MAX_FRAME_DELTA_MS));
	last = now;
	accumulator += delta;

	let ticks = 0;
	while (accumulator >= TICK_MS) {
		accumulator -= TICK_MS;
		ticks += 1;
	}
	if (ticks > 0) {
		tick(state, ticks * (TICK_MS / 1000));
	}

	buildingSliceAccumulator += delta;
	if (buildingSliceAccumulator >= BUILDING_SLICE_MS) {
		buildingSliceAccumulator -= BUILDING_SLICE_MS;
		ui.spawnBuildingSlices(els, state);
	}

	monitorPrestige();

	checkAndShowAchievements();

	ui.render(els, state);

	if (now - lastSave >= SAVE_INTERVAL_MS) {
		lastSave = now;
		saveGameState(state);
	}

	requestAnimationFrame(frame);
}

requestAnimationFrame(frame);

// Save immediately on tab close/refresh/background so the last second of
// progress is not lost.
window.addEventListener("pagehide", () => saveGameState(state));
document.addEventListener("visibilitychange", () => {
	if (document.visibilityState === "hidden") saveGameState(state);
});
