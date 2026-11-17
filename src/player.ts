/**
 * Music-player controls. Desktop shows an expandable player in the header
 * (skip/previous/pause that expand on hover/focus); mobile shows an
 * always-expanded player at the bottom of the settings menu. Both share a
 * scrolling track name and elapsed/total time.
 */

import playIcon from "@tabler/icons/filled/player-play.svg?raw";
import pauseIcon from "@tabler/icons/filled/player-pause.svg?raw";
import nextIcon from "@tabler/icons/filled/player-skip-forward.svg?raw";
import prevIcon from "@tabler/icons/filled/player-skip-back.svg?raw";
import {
	getTrackName,
	getTrackProgress,
	isPlaying,
	nextTrack,
	previousTrack,
	togglePlayPause,
} from "./audio";

/** Marquee speed in pixels per second. */
const MARQUEE_PX_PER_SEC = 40;
/** How long the desktop player stays expanded after hover/focus or a new song. */
const COLLAPSE_DELAY_MS = 5000;

function byId(id: string): HTMLElement {
	const element = document.getElementById(id);
	if (element === null) throw new Error(`Missing element #${id}`);
	return element;
}

/** Formats a duration (seconds) as `m:ss`. */
function formatTime(totalSeconds: number): string {
	const seconds = Math.max(0, Math.floor(totalSeconds));
	const minutes = Math.floor(seconds / 60);
	const remainder = seconds % 60;
	return `${minutes.toString()}:${remainder.toString().padStart(2, "0")}`;
}

interface PlayerNodes {
	root: HTMLElement;
	play: HTMLButtonElement;
	prev: HTMLButtonElement;
	next: HTMLButtonElement;
	marquee: HTMLElement;
	marqueeTrack: HTMLElement;
	time: HTMLElement;
}

/** Reads the DOM nodes for one player, keyed by `idPrefix` (e.g. "player"). */
function collectNodes(idPrefix: string): PlayerNodes {
	return {
		root: byId(idPrefix),
		play: byId(`${idPrefix}-play`) as HTMLButtonElement,
		prev: byId(`${idPrefix}-prev`) as HTMLButtonElement,
		next: byId(`${idPrefix}-next`) as HTMLButtonElement,
		marquee: byId(`${idPrefix}-marquee`),
		marqueeTrack: byId(`${idPrefix}-marquee-track`),
		time: byId(`${idPrefix}-time`),
	};
}

/**
 * Wires one player and returns a per-frame update function. When `expandable`
 * is true (desktop header) the player expands on hover/focus and flashes open
 * on a new song; when false (mobile menu) it is always expanded.
 */
function wirePlayer(nodes: PlayerNodes, expandable: boolean): () => void {
	const { root, play, prev, next, marquee, marqueeTrack, time } = nodes;

	play.innerHTML = playIcon;
	prev.innerHTML = prevIcon;
	next.innerHTML = nextIcon;

	play.addEventListener("click", togglePlayPause);
	prev.addEventListener("click", previousTrack);
	next.addEventListener("click", nextTrack);

	// Two identical copies make the right-to-left scroll loop seamlessly.
	const first = document.createElement("span");
	first.className = "player__marquee-text";
	const second = document.createElement("span");
	second.className = "player__marquee-text";
	second.setAttribute("aria-hidden", "true");
	marqueeTrack.replaceChildren(first, second);

	// --- Expand/collapse state (desktop header only) -------------------------
	let closeTimer: number | null = null;
	let hovered = false;
	let focused = false;

	function cancelClose(): void {
		if (closeTimer !== null) {
			window.clearTimeout(closeTimer);
			closeTimer = null;
		}
	}

	function expand(): void {
		cancelClose();
		root.classList.add("is-open");
	}

	function collapse(): void {
		root.classList.remove("is-open");
	}

	function scheduleCollapse(): void {
		cancelClose();
		closeTimer = window.setTimeout(() => {
			closeTimer = null;
			collapse();
		}, COLLAPSE_DELAY_MS);
	}

	function refresh(): void {
		if (hovered || focused) {
			expand();
		} else {
			scheduleCollapse();
		}
	}

	if (expandable) {
		root.addEventListener("mouseenter", () => {
			hovered = true;
			refresh();
		});
		root.addEventListener("mouseleave", () => {
			hovered = false;
			refresh();
		});
		root.addEventListener("focusin", () => {
			focused = true;
			refresh();
		});
		root.addEventListener("focusout", (event) => {
			const target = event.relatedTarget;
			if (target instanceof Node && root.contains(target)) return;
			focused = false;
			refresh();
		});
	}

	let lastTrackName = "";
	let lastPlaying: boolean | null = null;
	let lastTimeText = "";
	let lastMarqueeVisible = false;

	function updateMarquee(): void {
		// One copy's width (text + trailing gap) decides whether it overflows.
		const copyWidth = first.offsetWidth;
		const windowWidth = marquee.clientWidth;
		const scrolling = copyWidth > windowWidth;

		marqueeTrack.classList.toggle("is-scrolling", scrolling);
		if (scrolling) {
			const duration = Math.max(4, copyWidth / MARQUEE_PX_PER_SEC);
			marqueeTrack.style.animationDuration = `${duration.toFixed(2)}s`;
		}
	}

	const update = (): void => {
		const name = getTrackName();
		if (name !== lastTrackName) {
			lastTrackName = name;
			first.textContent = name;
			second.textContent = name;
			updateMarquee();
			if (expandable) {
				// Flash the desktop player open on a new song (then auto-close).
				expand();
				refresh();
			}
		}

		if (!expandable) {
			// The mobile player lives inside the settings menu, which is hidden
			// until opened. Re-measure the marquee once it becomes visible so
			// long names scroll even when they changed while the menu was closed.
			const visible = marquee.offsetParent !== null;
			if (visible && !lastMarqueeVisible) {
				updateMarquee();
			}
			lastMarqueeVisible = visible;
		}

		const playing = isPlaying();
		if (playing !== lastPlaying) {
			lastPlaying = playing;
			play.innerHTML = playing ? pauseIcon : playIcon;
			play.setAttribute("aria-label", playing ? "Pause" : "Play");
		}

		const progress = getTrackProgress();
		const timeText = `${formatTime(progress.elapsed)} / ${formatTime(progress.duration)}`;
		if (timeText !== lastTimeText) {
			lastTimeText = timeText;
			time.textContent = timeText;
		}
	};

	return update;
}

/** Desktop header player (expands on hover/focus). */
export function setupPlayerControls(): () => void {
	return wirePlayer(collectNodes("player"), true);
}

/** Mobile settings-menu player (always expanded). */
export function setupMobilePlayerControls(): () => void {
	return wirePlayer(collectNodes("mobile-player"), false);
}
