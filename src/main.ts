import "./style.css";
import { isLastStageComplete } from "./fatness";
import { clickMom, createInitialState, passivePerSecond, prestige, resetState, tick } from "./game";
import { clearSave, loadGameState, saveGameState } from "./storage";
import * as ui from "./ui";

const TICK_MS = 100;
const MAX_FRAME_DELTA_MS = 1000;
const SAVE_INTERVAL_MS = 1000;

const state = loadGameState() ?? createInitialState();
// Recompute passive income from owned buildings so a loaded save matches the
// building definitions (defends against stale or hand-edited saves).
state.mamePerSec = passivePerSecond(state);
const els = ui.init(state);

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

ui.setupMenu(resetGame);

let clickCount = 0;

els.mom.addEventListener("click", () => {
	clickCount += 1;
	const gain = clickMom(state);
	monitorPrestige();

	const gainPosition = ui.pickPosition(els.clickZone, null);
	if (clickCount % 3 === 0) {
		ui.spawnRoast(els.clickZone, ui.pickPosition(els.clickZone, gainPosition));
	}
	ui.spawnGain(els.clickZone, gain, gainPosition);
	ui.render(els, state);
});

ui.render(els, state);

let last = performance.now();
let accumulator = 0;
let lastSave = last;

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

	monitorPrestige();

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
